import { useState } from 'react';

export function useRole() {
  const [role] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('role');
  });

  const hasRole = (requiredRole: string | string[]) => {
    if (!role) return false;
    return Array.isArray(requiredRole)
      ? requiredRole.includes(role)
      : role === requiredRole;
  };

  return {
    role,
    loading: false,
    hasRole,
    isAdmin: role === 'ADMIN',
    isUser: role === 'USER',
  };
}
