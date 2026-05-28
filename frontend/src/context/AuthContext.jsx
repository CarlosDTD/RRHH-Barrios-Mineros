import { createContext, useContext, useState, useEffect } from 'react';
import api from '../config/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/api/auth/me')
        .then(res => setUsuario(res.data))
        .catch(() => {
          localStorage.removeItem('token');
          setUsuario(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    const res = await api.post('/api/auth/login', { username, password });
    localStorage.setItem('token', res.data.token);
    setUsuario(res.data.usuario);
    return res.data.usuario;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUsuario(null);
  };

  const cambiarPassword = async (password_actual, password_nuevo) => {
    const token = localStorage.getItem('token');
    const res = await api.put('/api/auth/cambiar-password',
      { password_actual, password_nuevo }
    );
    setUsuario(prev => ({ ...prev, password_cambiado: true }));
    return res.data;
  };

  const token = () => localStorage.getItem('token');

  const authAxios = () => api;

  return (
    <AuthContext.Provider value={{ usuario, loading, login, logout, cambiarPassword, token: token(), authAxios }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
