'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getPropertyDetail } from '@/lib/api/axios';
import PropertyDetail from '@/components/PropertyDetail';
import LoadingScreen from '@/components/LoadingScreen';

export default function PropertyDetailPage() {
  const { id } = useParams();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;

      try {
        const data = await getPropertyDetail(Number(id));
        setProperty(data);
      } catch (err) {
        console.error('Gagal mengambil data properti:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) return <LoadingScreen />;
  if (!property) return <div className="text-center py-10">Property not found</div>;

  return <PropertyDetail property={property} />;
}
