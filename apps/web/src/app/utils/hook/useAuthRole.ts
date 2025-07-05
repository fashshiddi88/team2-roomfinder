'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

export function useAuthRole(allowedRoles: string[]) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || !allowedRoles.includes(role ?? '')) {
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
  }, [allowedRoles]);

  return authorized;
}
