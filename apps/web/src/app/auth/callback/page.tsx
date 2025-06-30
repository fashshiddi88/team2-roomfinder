'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import LoadingScreen from '@/components/LoadingScreen';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const token = searchParams.get('token');
    const role = searchParams.get('role');
    const userId = searchParams.get('userId');

    if (token && role && userId) {
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('userId', userId);

      console.log({ token, role, userId });
      toast.success('Login berhasil!');

      setTimeout(() => {
        if (role === 'TENANT') {
          router.push('/Tenant_Property');
        } else {
          router.push('/');
        }
      }, 300);
    } else {
      toast.error('Login gagal');
      router.push('/login');
    }
  }, [searchParams]);

  return <LoadingScreen message="Logging in with Google..." />;
}
