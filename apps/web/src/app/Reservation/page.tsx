'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import {
  getProfileUser,
  getPropertyDetail,
  createBooking,
} from '@/lib/api/axios';
import { toast } from 'sonner';
import type { Property, BookingTypeEnum } from '@/types/property';
import Image from 'next/image';
import LoadingScreen from '@/components/LoadingScreen';

export default function BookingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [property, setProperty] = useState<Property | null>(null);
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null,
  );
  const [originalUser, setOriginalUser] = useState<{
    name: string;
    email: string;
  } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'MANUAL' | 'GATEWAY' | ''>(
    '',
  );
  const [inputName, setInputName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const propertyId = Number(searchParams.get('propertyId'));
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const roomName = decodeURIComponent(searchParams.get('room') || '');
  const price = searchParams.get('price');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getProfileUser();
        setUser(response.detail);
        setOriginalUser(response.detail);
        setInputName(response.detail.name || '');
      } catch (err) {
        console.error('Gagal ambil data user:', err);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!propertyId || !checkIn || !checkOut) return;

      try {
        const data = await getPropertyDetail(
          propertyId,
          new Date(checkIn),
          new Date(checkOut),
        );
        setProperty(data);
      } catch (err: unknown) {
        const axiosErr = err as AxiosError<{ message: string }>;
        toast.error(
          axiosErr.response?.data?.message || 'Gagal mengambil detail properti',
        );
      } finally {
        setIsLoading(false); // ⬅ Hanya selesai kalau fetch selesai
      }
    };

    fetchProperty();
  }, [propertyId, checkIn, checkOut]);

  function formatTanggalIndonesia(dateString: string): string {
    const date = new Date(dateString);

    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'short',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(date);
  }

  const selectedRoom = property?.rooms.find(
    (room) => room.name.toLowerCase() === roomName.toLowerCase(),
  );

  function toMiddayISOString(dateString: string) {
    const d = new Date(dateString);
    d.setHours(12, 0, 0, 0);
    return d.toISOString();
  }

  useEffect(() => {
    if (!isLoading && property && !selectedRoom) {
      toast.error('Kamar tidak ditemukan');
    }
  }, [isLoading, property, roomName]);

  const handleBooking = async () => {
    if (
      !checkIn ||
      !checkOut ||
      !selectedRoom ||
      !propertyId ||
      !paymentMethod
    ) {
      toast.error('Lengkapi semua data terlebih dahulu');
      return;
    }

    try {
      const res = await createBooking({
        propertyId: property!.id,
        roomId: selectedRoom.id,
        startDate: toMiddayISOString(checkIn),
        endDate: toMiddayISOString(checkOut),
        bookingType: paymentMethod as BookingTypeEnum,
        name: user?.name || inputName,
      });

      const { booking, paymentUrl } = res.data;

      if (!booking) {
        toast.error('Booking gagal: data tidak lengkap');
        return;
      }

      toast.success('Pemesanan berhasil dibuat');

      if (paymentMethod === 'GATEWAY' && paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        router.push(`/Reservation/Upload_Payment?bookingId=${booking.id}`);
      }
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message: string }>;
      console.error(axiosErr.response?.data || axiosErr.message || err);
      toast.error(axiosErr.response?.data?.message || 'Gagal membuat booking');
    }
  };
  if (isLoading) return <LoadingScreen message="Tunggu Sebentar" />;
  if (!selectedRoom)
    return <p className="text-red-500">Kamar tidak ditemukan</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md flex flex-col md:flex-row overflow-hidden">
        {/* Kiri - Form Pemesanan */}
        <div className="w-full md:w-2/3 p-6 md:p-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Pemesanan </h2>
          <p className="text-gray-600 text-sm mb-5">
            Pastikan kamu mengisi semua informasi di halaman ini benar sebelum
            melanjutkan ke pembayaran.
          </p>

          <div>
            <h3 className="text-lg font-semibold mb-2">
              Data Pemesan (untuk E-voucher)
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Isi semua kolom dengan benar untuk memastikan kamu dapat menerima
              voucher konfirmasi pemesanan di email yang dicantumkan.
            </p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={inputName}
                  disabled={!!originalUser?.name?.trim()}
                  onChange={(e) => setInputName(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  readOnly={!!originalUser?.email}
                  onChange={(e) =>
                    setUser((prev) => ({ ...prev!, email: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  E-voucher akan dikirim ke email ini.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Metode Pembayaran
                </label>
                <select
                  className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={paymentMethod}
                  onChange={(e) =>
                    setPaymentMethod(e.target.value as 'MANUAL' | 'GATEWAY')
                  }
                >
                  <option value="">Pilih Metode Pembayaran</option>
                  <option value="MANUAL">Manual Transfer</option>
                  <option value="GATEWAY">Virtual Account</option>
                </select>
              </div>

              {/* Tombol Lanjut Pembayaran */}
              <div className="pt-4">
                <button
                  onClick={handleBooking}
                  className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium transition"
                >
                  Lanjut Pembayaran
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Kanan - Detail Properti */}
        <div className="w-full md:w-1/3 bg-gray-50 border-t md:border-t-0 md:border-l border-gray-200 p-5">
          <div className="border rounded-lg overflow-hidden shadow-sm bg-white">
            <Image
              src={property?.image || '/default-room.jpg'}
              alt="The Gaia Hotel Bandung"
              width={400}
              height={200}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h4 className="font-semibold text-lg mb-1 text-gray-800">
                {property?.name}
              </h4>

              <div className="flex justify-between text-sm text-gray-600 mb-3">
                <div>
                  <p className="text-gray-500">Check-in</p>
                  <p className="font-medium">
                    {formatTanggalIndonesia(checkIn || '')}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Check-out</p>
                  <p className="font-medium">
                    {formatTanggalIndonesia(checkOut || '')}
                  </p>
                </div>
              </div>

              <div className="text-sm mb-2 text-gray-700">
                (1x) {roomName} -{' '}
                <span className="text-red-500 font-medium">Free Breakfast</span>
              </div>

              <ul className="text-sm text-gray-600 list-disc pl-5 mb-4">
                <li>2 Tamu</li>
                <li>1 ranjang twin</li>
                <li>Termasuk sarapan</li>
              </ul>

              <div className="border-t pt-3 text-sm font-semibold text-gray-700">
                Total Harga Kamar:{' '}
                <span className="text-blue-600">
                  Rp {Number(price).toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
