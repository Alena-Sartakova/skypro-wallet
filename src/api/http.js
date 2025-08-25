import { authStore } from '@/store/authStore';
import axios from 'axios';


const http = axios.create({
  baseURL: 'https://wedev-api.sky.pro/api',
  timeout: 10000,
  headers: {
    'Content-Type': '',
  }
});

http.interceptors.request.use(config => {
  const token = authStore.state.value.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      authStore.logout();
      return Promise.reject(new Error('Неавторизованный доступ'));
    }
    return Promise.reject(error);
  }
);

export default http;