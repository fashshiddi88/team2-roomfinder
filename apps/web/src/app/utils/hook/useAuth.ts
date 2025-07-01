'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false); // Penting

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    setIsAuthenticated(!!token);
    setRole(userRole);
    setIsAuthLoaded(true); // Jangan render komponen sebelum ini true
  }, []);

  const login = (token: string, role: string, userId: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('userId', userId);
    setIsAuthenticated(true);
    setRole(role);
    setIsAuthLoaded(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
    setRole(null);
    setIsAuthLoaded(true);
    router.push('/');
  };

  return { isAuthenticated, role, isAuthLoaded, login, logout };
}
