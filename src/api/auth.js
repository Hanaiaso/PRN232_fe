import client, { post, get } from './client';

export const login = async (email, password) => {
  return post('/api/auth/login', { email, password });
};

export const register = async (email, password, confirmPassword) => {
  return post('/api/auth/register', { email, password, confirmPassword });
};

export const refresh = async (refreshToken) => {
  return post('/api/auth/refresh', { refreshToken });
};

export const logout = async (refreshToken) => {
  return post('/api/auth/logout', { refreshToken });
};

export const me = async () => {
  return get('/api/auth/me');
};

export const confirmEmail = async (token) => {
  const url = `/api/auth/confirm-email?token=${encodeURIComponent(token)}`;
  return get(url);
};

export default {
  login,
  register,
  refresh,
  logout,
  me,
  confirmEmail
};