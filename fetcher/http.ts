import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://10.0.2.2:8080', // Spring Boot local (Android emulator)
  timeout: 10000,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    return Promise.reject(err);
  }
);
