'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function withAuthRoles(allowedRoles: string[]) {
  return function (Component: React.ComponentType) {
    return function ProtectedComponent(props: any) {
      const router = useRouter();
      const [checked, setChecked] = useState(false);

      useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');

        // Cek apakah token ada dan role termasuk yang diperbolehkan
        if (!token || !role || !allowedRoles.includes(role)) {
          router.replace('/login'); // Redirect ke login kalau gagal
        } else {
          setChecked(true);
        }
      }, []);
      if (!checked) return null;

      return <Component {...props} />;
    };
  };
}
