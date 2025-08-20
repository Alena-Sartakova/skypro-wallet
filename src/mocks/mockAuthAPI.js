export const mockAuthAPI = {
 users: [ // Исправлено на массив
    {
      id: 1,
      name: 'admin',
      email: 'admin@test.ru',
      password: '12345678'
    }
  ],

  async login(credentials) {
    await this.delay();
    
    // Поиск по email
    const user = this.users.find(u => u.email === credentials.email);
    if (!user) {
      throw new Error('Пользователь не найден');
    }
    
    // Проверка пароля
    if (user.password !== credentials.password) {
      throw new Error('Неверный пароль');
    }

    return {
      user: { id: user.id, email: user.email },
      token: this.generateMockToken(user)
    };
  },


  async register(userData) {
    await this.delay();
    
    // Проверяем уникальность email
    const exists = this.users.some(u => u.email === userData.email);
    if (exists) {
      throw new Error('Пользователь с таким email уже существует');
    }
    
    // Проверяем минимальную длину пароля
    if (userData.password.length < 6) {
      throw new Error('Пароль должен быть не менее 6 символов');
    }
    
    const newUser = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      password: userData.password
    };
    
    this.users.push(newUser);
    
    return {
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
      token: this.generateMockToken(newUser)
    };
  },

  generateMockToken(user) {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      userId: user.id,
      exp: Date.now() + 3600 * 1000 // Через 1 час
    }));
    return `${header}.${payload}.mock_signature`;
  },

  delay() {
    return new Promise(resolve => setTimeout(resolve, 1000));
  }
};
