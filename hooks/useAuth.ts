import { useAuthContext } from '@/app/context/AuthContext';

export function useAuth() {
  const { user, loading, login, logout, isAuthenticated } = useAuthContext();

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    error: null, // Error is handled locally in the login components now
  };
}