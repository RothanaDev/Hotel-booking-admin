import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

export function useProtectedRoute(redirectTo = '/login') {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkAuth = () => {
      if (!isAuthenticated()) {
        router.push(redirectTo);
      }
    };

    checkAuth();
  }, [router, redirectTo]);
}