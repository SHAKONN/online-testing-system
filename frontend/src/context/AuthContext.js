import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Проверяем токен при загрузке приложения
  useEffect(() => {
    if (token) {
      loadProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadProfile = async () => {
    try {
      const response = await authService.getProfile();
      setUser(response.data);
      setError(null);
    } catch (err) {
      console.error('Ошибка загрузки профиля:', err);
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, confirmPassword) => {
    try {
      const response = await authService.register(name, email, password, confirmPassword);
      const { token: newToken, user: newUser } = response.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(newUser);
      setError(null);
      return newUser;
    } catch (err) {
      const message = err.response?.data?.message || 'Ошибка регистрации';
      setError(message);
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      const { token: newToken, user: newUser } = response.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(newUser);
      setError(null);
      return newUser;
    } catch (err) {
      const message = err.response?.data?.message || 'Ошибка входа';
      setError(message);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        isAuthenticated: !!token,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
