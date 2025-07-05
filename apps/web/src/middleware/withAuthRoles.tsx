'use client';

import { useEffect, useState, ComponentType } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

export function withAuthRoles<P = {}>(allowedRoles: string[]) {
  return function (Component: ComponentType<P>) {
    return function ProtectedComponent(props: P) {
      const router = useRouter();
      const [isAuthorized, setIsAuthorized] = useState(false);
      const [isClient, setIsClient] = useState(false);

      useEffect(() => {
        setIsClient(true);
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('token');
          const role = localStorage.getItem('role');

          if (!token || !role || !allowedRoles.includes(role)) {
            Swal.fire({
              icon: 'warning',
              title: 'Akses Ditolak',
              text: 'Anda tidak memiliki akses ke halaman ini',
              confirmButtonText: 'Kembali',
            }).then(() => {
              router.replace('/');
            });
          } else {
            setIsAuthorized(true);
          }
        }
      }, [router, allowedRoles]);

      if (!isClient || !isAuthorized) {
        return null; // Atau tampilkan loading spinner
      }

      return <Component {...props} />;
    };
  };
}
