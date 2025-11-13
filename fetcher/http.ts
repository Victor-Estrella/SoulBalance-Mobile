import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://example.com/api',
  timeout: 10000
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    return Promise.reject(err);
  }
);
