import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../utils/api';
import { UserDB, OrganisationPublic } from '../types';

type AuthUser = UserDB | OrganisationPublic | null;

interface AuthContextType {
  user: AuthUser;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginOrg: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

interface RegisterData {
  email: string;
  username: string;
  password: string;
  [key: string]: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) return;
    
    try {
      // Proveri da li je user ili org
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        if (userData.role === 'organisation') {
          const response = await api.get('/org/me');
          setUser(response.data);
          localStorage.setItem('user', JSON.stringify(response.data));
        } else {
          const response = await api.get('/user/me');
          setUser(response.data);
          localStorage.setItem('user', JSON.stringify(response.data));
        }
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  useEffect(() => {
    // Proveri da li postoji token u localStorage
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      // Refresh user data from API
      refreshUser();
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);

      const response = await api.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const { access_token } = response.data;
      setToken(access_token);
      localStorage.setItem('token', access_token);

      // Dohvati korisnika
      const userResponse = await api.get('/user/me');
      setUser(userResponse.data);
      localStorage.setItem('user', JSON.stringify(userResponse.data));
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Greška pri prijavljivanju');
    }
  };

  const loginOrg = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/org/login', {
        email,
        password,
      });

      const { access_token } = response.data;
      setToken(access_token);
      localStorage.setItem('token', access_token);

      // Dohvati organizaciju
      const orgResponse = await api.get('/org/me');
      setUser(orgResponse.data);
      localStorage.setItem('user', JSON.stringify(orgResponse.data));
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Greška pri prijavljivanju organizacije');
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const newUser = response.data;
      setUser(newUser);
      // Nakon registracije, možemo automatski ulogovati korisnika
      // ili ostaviti da se ručno uloguje
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Greška pri registraciji');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    loginOrg,
    register,
    logout,
    isAuthenticated: !!token,
    loading,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

