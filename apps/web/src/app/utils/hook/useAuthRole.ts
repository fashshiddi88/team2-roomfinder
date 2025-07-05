'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './useAuth';
import Swal from 'sweetalert2';

export function useAuthRole(allowedRoles: string[]) {
  const router = useRouter();
  const { isAuthenticated, role, isAuthLoaded } = useAuth();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!isAuthLoaded) return;

    if (!isAuthenticated) {
      router.replace('/');
      return;
    }

    if (!allowedRoles.includes(role ?? '')) {
      Swal.fire({
        icon: 'warning',
        title: 'Akses Ditolak',
        text: 'Anda tidak memiliki akses ke halaman ini',
        confirmButtonText: 'Kembali',
      }).then(() => {
        router.replace('/');
      });
    } else {
      setAuthorized(true);
    }
  }, [isAuthenticated, isAuthLoaded, role, allowedRoles]);

  return authorized;
}
