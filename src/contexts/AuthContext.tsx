import React, { createContext, useContext, useState, ReactNode } from 'react';
import api from '../services/api.ts';

interface User {
  id: number;
  nome: string;
  email: string;
}

interface AuthContextData {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('@BookTrack:user');
    const token = localStorage.getItem('@BookTrack:token');
    
    if (storedUser && token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return JSON.parse(storedUser);
    }
    
    return null;
  });

  const signIn = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        senha: password
      });

      const { token, user: userData } = response.data;

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(userData);
      localStorage.setItem('@BookTrack:user', JSON.stringify(userData));
      localStorage.setItem('@BookTrack:token', token);
    } catch (error) {
      throw new Error('Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('@BookTrack:user');
    localStorage.removeItem('@BookTrack:token');
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      signIn, 
      signOut,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 