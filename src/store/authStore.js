import { ref } from 'vue';
import { mockAuthAPI } from '@/mocks/mockAuthAPI';
import router from '@/routes';

const safeLocalStorage = {
  getItem(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.error('LocalStorage error:', e);
      return null;
    }
  },
  setItem(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.error('LocalStorage error:', e);
    }
  },
  removeItem(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('LocalStorage error:', e);
    }
  }
};

const handleAuthSuccess = (storeState, response) => {
  storeState.value.user = response.user;
  storeState.value.token = response.token;
  safeLocalStorage.setItem('user', JSON.stringify(response.user));
  safeLocalStorage.setItem('token', response.token);
};

const validateCredentials = (credentials, isRegistration = false) => {
  const errors = [];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!credentials.email?.trim()) {
    errors.push('Email обязателен');
  } else if (!emailRegex.test(credentials.email)) {
    errors.push('Некорректный формат email');
  }

  if (!credentials.password) {
    errors.push('Пароль обязателен');
  } else if (credentials.password.length < 6) {
    errors.push('Пароль должен быть не менее 6 символов');
  }

  if (isRegistration) {
    if (!credentials.name?.trim()) {
      errors.push('Имя обязательно');
    } else if (credentials.name.length < 2) {
      errors.push('Имя должно быть не короче 2 символов');
    }
  }

  return errors;
};

export const authStore = {
  state: ref({
    user: JSON.parse(safeLocalStorage.getItem('user')) || null,
    token: safeLocalStorage.getItem('token') || null,
    isLoading: false,
    error: null
  }),

  async authAction(action, credentials) {
    try {
      this.state.value.isLoading = true;
      this.state.value.error = null;

      const validationErrors = validateCredentials(credentials, action === 'register');
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join('\n'));
      }

      const response = await mockAuthAPI[action](credentials);

      if (!response?.user || !response?.token) {
        throw new Error('Ошибка аутентификации');
      }

      handleAuthSuccess(this.state, response);
      return { success: true, user: response.user };
    } catch (error) {
      this.state.value.error = {
        messages: error.message.split('\n')
      };
      return { success: false };
    } finally {
      this.state.value.isLoading = false;
    }
  },

  async register(userData) {
    return this.authAction('register', userData);
  },

  async login(credentials) {
    return this.authAction('login', credentials);
  },

  async logout() {
    try {
      this.state.value.user = null;
      this.state.value.token = null;
      this.state.value.error = null;

      safeLocalStorage.removeItem('user');
      safeLocalStorage.removeItem('token');

      await router.push({
        path: '/signin',
        query: { logout: true },
        replace: true
      }).catch(() => {
        window.location.href = '/signin';
      });
    } catch (error) {
      console.error('Ошибка выхода:', error);
      throw error;
    }
  },

  isAuthenticated() {
    return this.isTokenValid();
  },

  async isTokenValid() {
    try {
      if (!this.state.value.token) {
        console.log('Токен отсутствует');
        return false;
      }
  
      // 1. Проверка базовой структуры токена
      const tokenParts = this.state.value.token.split('.');
      if (tokenParts.length !== 3) {
        await this.logout();
        return false;
      }
  
      // 2. Декодирование payload с обработкой ошибок
      const base64Payload = tokenParts[1]
        .replace(/-/g, '+')
        .replace(/_/g, '/');
      
      let payload;
      try {
        payload = JSON.parse(atob(base64Payload));
      } catch (e) {
        console.error('Ошибка декодирования payload:', e);
        await this.logout();
        return false;
      }
  
      // 3. Проверка наличия обязательных полей
      if (!payload.exp) {
        console.error('Токен не содержит дату истечения (exp)');
        await this.logout();
        return false;
      }
  
      // 4. Проверка срока действия
      const now = Date.now();
      const expiresAt = payload.exp * 1000;
      
      if (expiresAt < now) {
        console.warn('Токен просрочен');
        await this.logout();
        return false;
      }
  
      return true;
    } catch (e) {
      console.error('Ошибка проверки токена:', e);
      await this.logout();
      return false;
    }
  },

  async init() {
    try {
      const token = safeLocalStorage.getItem('token');
      if (token) {
        if (await this.isTokenValid()) {
          this.state.value.user = JSON.parse(safeLocalStorage.getItem('user'));
          this.state.value.token = token;
        } else {
          this.logout();
        }
      }
    } catch (error) {
      console.error('Ошибка инициализации:', error);
      this.logout();
    }
  }
};
