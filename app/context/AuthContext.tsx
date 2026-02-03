'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/lib/api';
import { isAuthenticated as checkAuth, clearUserStorage, setUserStorage, getUserFromStorage } from '@/lib/auth';

interface AuthContextType {
  user: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      if (checkAuth()) {
        try {
          const storedUser = getUserFromStorage();
          if (storedUser) {
            setUser(storedUser);
          } else {
            clearUserStorage();
          }
        } catch (err) {
          console.error('Failed to initialize auth:', err);
          clearUserStorage();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await loginUser({ email, password });

      const accessToken = response.accessToken;

      if (accessToken) {
        const userData = {
          id: response.id || response.currentUser, // Use id if available, fallback to currentUser/email
          email: email,
          name: response.currentUser?.split('@')[0] || 'User',
          role: response.role,
          accessToken: accessToken,
          refreshToken: response.refreshToken,
          token: accessToken // backup for old components
        };

        setUserStorage(userData);
        setUser(userData);
        return { success: true };
      } else {
        return { success: false, error: 'Invalid response from server' };
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    clearUserStorage();
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}