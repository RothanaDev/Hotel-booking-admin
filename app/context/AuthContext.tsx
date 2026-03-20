'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as api from '@/lib/api';
import { loginUser, logoutUser } from '@/lib/api';
import { clearUserStorage, setUserStorage } from '@/lib/auth';
import { AuthUser } from '@/types/auth';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Fetch fresh user data from backend
        const me = await api.getMe();
        if (me) {
          const userData: AuthUser = {
            id: me.id,
            email: me.email,
            role: me.role,
            name: me.name || me.email?.split('@')[0] || 'User'
          };
          setUserStorage(userData);
          setUser(userData);
        } else {
          clearUserStorage();
          setUser(null);
        }
      } catch (err) {
        console.error('Failed to initialize auth:', err);
        clearUserStorage();
        setUser(null);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // 1. Perform login (sets cookies)
      await loginUser({ email, password });

      // 2. Fetch profile data (now that cookies are set)
      const me = await api.getMe();

      if (me) {
        const userData: AuthUser = {
          id: me.id,
          email: me.email,
          role: me.role,
          name: me.name || me.email?.split('@')[0] || 'User',
        };

        setUserStorage(userData);
        setUser(userData);
        return { success: true };
      } else {
        return { success: false, error: 'Failed to retrieve user profile' };
      }
    } catch (error: unknown) {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Login failed. Please try again.';
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      clearUserStorage();
      setUser(null);
      router.push('/login');
    }
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