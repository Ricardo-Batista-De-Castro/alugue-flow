import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadUser = async () => {
    try {
      const response = await api.get('/api/auth/me');
      setUser(response.data);
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, senha) => {
    try {
      const response = await api.post('/api/auth/login', { email, senha });
      const { token, usuario } = response.data;
      
      localStorage.setItem('token', token);
      setToken(token);
      setUser(usuario);
      
      return { success: true, user: usuario };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao fazer login',
      };
    }
  };

  const loginLocatario = async (email, cpf) => {
    try {
      const response = await api.post('/api/auth/login/locatario', { email, cpf });
      const { token, usuario } = response.data;
      
      localStorage.setItem('token', token);
      setToken(token);
      setUser(usuario);
      
      return { success: true, user: usuario };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao fazer login',
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/api/auth/register', userData);
      const { token, usuario } = response.data;
      
      localStorage.setItem('token', token);
      setToken(token);
      setUser(usuario);
      
      return { success: true, user: usuario };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao registrar',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginLocatario, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
