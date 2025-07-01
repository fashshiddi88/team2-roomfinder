'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getCatalogProperties, getAllCities } from '@/lib/api/axios';
import { toast } from 'sonner';
import Image from 'next/image';
import Navbar from '@/components/navbar';
import SearchFormExplore from '@/components/SearchFormExplore';
import LoadingScreen from '@/components/LoadingScreen';
type Property = {
  id: number;
  name: string;
  image: string;
  address: string;
  categoryId: number;
  minPrice: number;
  category?: { name: string }; // optional jika di-include dari backend
};

export default function ExplorePage() {
  const searchParams = useSearchParams();
  const cityId = searchParams.get('cityId');
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const guests = Number(searchParams.get('guests') || '1');
  const router = useRouter();

  const [cityName, setCityName] = useState('');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCityNameAndData = async () => {
      if (!cityId || !checkIn || !checkOut) return;
      setLoading(true);
      try {
        const cities = await getAllCities();
        const found = cities.find((c) => String(c.id) === String(cityId));
        const cityName = found?.name || '';

        setCityName(cityName);

        const res = await getCatalogProperties({
          search: cityName,
          categoryId: undefined,
          sortBy: 'price',
          sortOrder: 'asc',
          page: 1,
          pageSize: 10,
          capacity: guests,
          startDate: new Date(checkIn),
          endDate: new Date(checkOut),
        });
        setProperties(res.data);
      } catch (err) {
        toast.error('Gagal memuat properti');
      } finally {
        setLoading(false);
      }
    };

    fetchCityNameAndData();
  }, [cityId, checkIn, checkOut, guests]);
  if (loading) return <LoadingScreen message="Memuat hasil..." />;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="px-4 md:px-16 py-8">
        <section className="container mx-auto px-4 py-8 -mt-10">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-4xl mx-auto">
            <SearchFormExplore />
          </div>
        </section>

        <h1 className="text-2xl font-bold mb-6">
          Menampilkan hasil di {cityName || '...'} untuk {guests} tamu
        </h1>

        {properties.length === 0 && !loading ? (
          <div className="text-center text-gray-500 mt-30">
            <p className="text-2xl">
              Tidak ada properti yang ditemukan untuk pencarian ini.
            </p>
            <p className="text-lg">
              Coba ubah tanggal, jumlah tamu, atau lokasi pencarian.
            </p>
          </div>
        ) : (
          properties.map((property) => (
            <div
              key={property.id}
              className="border rounded-lg shadow-md p-4 flex flex-col md:flex-row gap-4 bg-white mb-6"
            >
              <div className="w-full h-[200px] md:w-1/4 overflow-hidden rounded-lg">
                <Image
                  src={property.image || '/default-room.jpg'}
                  alt={property.name}
                  width={400}
                  height={250}
                  className="rounded-lg w-full object-cover"
                />
              </div>

              <div className="w-full md:w-3/4 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{property.name}</h2>
                  <p className="text-gray-600">{property.address}</p>
                  <p className="mt-1 text-sm text-amber-500 font-medium">
                    {property.category?.name || 'Tidak diketahui'}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div>
                    <p className="text-2xl font-bold text-orange-600">
                      Rp {property.minPrice.toLocaleString('id-ID')}
                    </p>
                    <p className="text-sm text-gray-500">
                      per malam (termurah)
                    </p>
                  </div>
                  <button
                    onClick={() => router.push(`/Explore/${property.id}`)}
                    className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600"
                  >
                    Pilih Kamar
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
