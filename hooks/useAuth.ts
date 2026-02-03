import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/lib/api';
import { isAuthenticated as checkAuth, clearUserStorage, setUserStorage, getUserFromStorage } from '@/lib/auth';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const logout = useCallback(() => {
    clearUserStorage();
    setUser(null);
    router.push('/login');
  }, [router]);

  useEffect(() => {
    const checkUser = async () => {
      if (checkAuth()) {
        try {
          // If we have a dedicated profile endpoint, we'd call it here.
          // For now, with the new backend, we use the stored user object.
          const storedUser = getUserFromStorage();
          if (storedUser) {
            setUser(storedUser);
          } else {
            // If no stored user but we have tokens, we're in a weird state
            logout();
          }
        } catch (err) {
          console.error('Failed to verify session:', err);
          logout();
        }
      }
      setLoading(false);
    };

    checkUser();
  }, [logout]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await loginUser({ email, password });

      const accessToken = response.accessToken || response.token;

      if (accessToken) {
        const userData = {
          ...response,
          email,
          token: accessToken,
          accessToken: accessToken,
          refreshToken: response.refreshToken
        };

        setUserStorage(userData);
        setUserStorage(userData);
        setUser(userData);

        return { success: true, user: userData };
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
  };
}