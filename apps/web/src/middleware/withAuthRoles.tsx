'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

export function withAuthRoles<P>(allowedRoles: string[]) {
  return function (Component: React.ComponentType<P>) {
    const ProtectedComponent = (props: P) => {
      const router = useRouter();
      const [checked, setChecked] = useState(false);

      useEffect(() => {
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
          setChecked(true);
        }
      }, []);

      if (!checked) return null;

      return <Component {...props} />;
    };

    return ProtectedComponent;
  };
}
