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
    console.log(`--- Начало процесса ${action === 'login' ? 'входа' : 'регистрации'} ---`);
    
    // Логируем введенные данные (без пароля)
    console.log('Получены данные:', {
      ...credentials,
      password: '*'.repeat(credentials.password.length) // Маскируем пароль
    });

    this.state.value.isLoading = true;
    this.state.value.error = null;

    const validationErrors = validateCredentials(credentials, action === 'register');
    console.log('Результаты валидации:', validationErrors.length > 0 
      ? validationErrors 
      : 'OK');

    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join('\n'));
    }

    const response = await mockAuthAPI[action](credentials);
    console.log('Ответ от API:', {
      user: response?.user ? '***' + response.user.email.slice(3) : null,
      token: response?.token ? '***' + response.token.slice(-8) : null
    });

    if (!response?.user || !response?.token) {
      throw new Error('Ошибка аутентификации');
    }

    handleAuthSuccess(this.state, response);
    console.log('Обновленное состояние:', {
      user: response.user.email,
      token: `***${response.token.slice(-8)}`,
      isLoading: false
    });

    return { success: true, user: response.user };
  } catch (error) {
    console.error(`Ошибка ${action === 'login' ? 'входа' : 'регистрации'}:`, error.message);
    console.log('Текущее состояние:', JSON.parse(JSON.stringify(this.state.value)));
    
    this.state.value.error = {
      messages: error.message.split('\n') 
    };
    
    return { success: false };
  } finally {
    this.state.value.isLoading = false;
    console.log('Финальное состояние:', {
      user: this.state.value.user?.email,
      isLoading: this.state.value.isLoading,
      error: this.state.value.error?.messages
    });
    console.log(`--- Конец процесса ${action === 'login' ? 'входа' : 'регистрации'} ---\n`);
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
        console.log('--- Начало процесса выхода ---');
        
        // Логируем текущего пользователя перед выходом
        console.log('Текущий пользователь:', JSON.parse(JSON.stringify(this.state.value.user)));
        console.log('Данные в localStorage до выхода:', {
            user: safeLocalStorage.getItem('user'),
            token: safeLocalStorage.getItem('token')
        });

        // 1. Сброс состояния
        this.state.value.user = null;
        this.state.value.token = null;
        this.state.value.error = null;
        console.log('Состояние после сброса:', this.state.value);

        // 2. Очистка хранилища
        safeLocalStorage.removeItem('user');
        safeLocalStorage.removeItem('token');
        
        // Проверка очистки
        const checkStorage = () => {
            const storageState = {
                user: safeLocalStorage.getItem('user'),
                token: safeLocalStorage.getItem('token')
            };
            
            console.log('Данные в localStorage после выхода:', storageState);
            
            if (storageState.user || storageState.token) {
                console.error('Ошибка: данные не были полностью удалены!');
            }
        };
        
        checkStorage();

        // 3. Принудительный выход
        console.log('Перенаправление на страницу входа...');
        await router.push({
            path: '/signin',
            query: { logout: true },
            replace: true
        }).catch(() => {
            console.warn('Ошибка маршрутизации, выполняется hard redirect');
            window.location.href = '/signin';
        });

        // 4. Финальная проверка
        console.log('--- Процесс выхода завершен ---');
        console.log('Финальное состояние store:', JSON.parse(JSON.stringify(this.state.value)));
        console.log('Токен валиден?:', await this.isTokenValid());

    } catch (error) {
        console.error('Ошибка выхода:', error);
        console.error('Состояние при ошибке:', {
            storeState: this.state.value,
            localStorage: {
                user: safeLocalStorage.getItem('user'),
                token: safeLocalStorage.getItem('token')
            }
        });
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

    // Проверка формата токена
    const tokenParts = this.state.value.token.split('.');
    if (tokenParts.length !== 3) {
      console.error('Неверный формат токена');
      await this.logout();
      return false;
    }

    // Декодирование с обработкой ошибок
    const payload = JSON.parse(
      atob(tokenParts[1].replace(/-/g, '+').replace(/_/g, '/'))
    );
    
    // Проверка срока действия
    const now = Date.now();
    const expiresAt = payload.exp * 1000;
    
    console.log(`Токен действителен до: ${new Date(expiresAt).toLocaleString()}`);
    
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
  },

};
