'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  getBookingById,
  cancelBookingById,
  uploadPaymentProof,
} from '@/lib/api/axios';
import { BookingSummary } from '@/types/property';
import { toast } from 'sonner';
import Image from 'next/image';
import LoadingScreen from '@/components/LoadingScreen';
import Swal from 'sweetalert2';

export default function UploadPaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = Number(searchParams.get('bookingId'));
  const [summary, setSummary] = useState<BookingSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (!summary) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expired = new Date(summary.expiredAt).getTime();
      const distance = expired - now;

      if (distance <= 0) {
        clearInterval(interval);
        setHours(0);
        setMinutes(0);
        setSeconds(0);
        return;
      }

      setHours(Math.floor((distance / (1000 * 60 * 60)) % 24));
      setMinutes(Math.floor((distance / (1000 * 60)) % 60));
      setSeconds(Math.floor((distance / 1000) % 60));
    }, 1000);

    return () => clearInterval(interval);
  }, [summary]);

  function formatTanggalIndonesia(dateString: string): string {
    const utcDate = new Date(dateString);
    const localDate = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000);

    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(localDate);
  }

  useEffect(() => {
    if (!bookingId) return;

    const fetchBooking = async () => {
      try {
        const res = await getBookingById(bookingId);
        setSummary(res);
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Gagal ambil data booking');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);
  useEffect(() => {
    if (!summary?.expiredAt) return;

    const interval = setInterval(() => {
      const now = new Date();
      const expired = new Date(summary.expiredAt);

      if (now > expired) {
        setSummary((prev) => prev && { ...prev, status: 'EXPIRED' });
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [summary?.expiredAt]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      setError('Maksimum ukuran 1MB');
      return;
    }

    const url = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(url);
    setError(null);
  };

  const handleCancel = async (bookingId: number) => {
    const result = await Swal.fire({
      title: 'Batalkan?',
      text: 'Yakin batalkan reservasi?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Iya',
      cancelButtonText: 'Tidak',
      confirmButtonColor: '#d33',
    });

    if (result.isConfirmed) {
      try {
        const res = await cancelBookingById(bookingId);
        toast.success(res.message);
        router.push('/');
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to cancel booking');
      }
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile || !summary?.id) {
      toast.error('File atau booking tidak valid');
      return;
    }

    try {
      const res = await uploadPaymentProof(summary.id, selectedFile);
      console.log('Upload response:', res);

      await Swal.fire({
        icon: 'success',
        title: 'Terima kasih!',
        text: 'Reservasimu akan diproses oleh tenant dan akan ada email dalam 3 hari.',
        confirmButtonColor: '#3B82F6',
      });

      router.push('/');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(
        error.response?.data?.message || 'Gagal upload bukti pembayaran',
      );
    }
  };

  if (loading) return <LoadingScreen message="Tunggu Sebentar" />;
  if (!summary) return <p>Loading...</p>;

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 md:px-0 flex justify-center">
      <div className="w-full max-w-3xl space-y-8">
        {/* Header */}
        <section className="bg-white p-6 rounded-xl shadow">
          <h1 className="text-2xl font-bold mb-1">Complete your reservation</h1>
          <p className="text-sm text-gray-600">
            Reservation ID{' '}
            <span className="font-mono">{summary.reservationId}</span>
          </p>
        </section>

        {/* Summary */}
        <section className="bg-white p-6 rounded-xl shadow grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-3">Booking details</h2>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>
                <span className="font-medium">Property:</span>{' '}
                {summary.propertyName}
              </li>
              <li>
                <span className="font-medium">Location:</span>{' '}
                {summary.location}
              </li>
              <li>
                <span className="font-medium">Check In:</span>{' '}
                {formatTanggalIndonesia(summary.checkInDate)}
              </li>
              <li>
                <span className="font-medium">Check Out:</span>{' '}
                {formatTanggalIndonesia(summary.checkOutDate)}
              </li>
            </ul>
          </div>
          {
            <div>
              <h2 className="text-lg font-semibold mb-3">Payment deadline</h2>
              <p className="text-4xl font-bold tabular-nums">
                {hours.toString().padStart(2, '0')}:
                {minutes.toString().padStart(2, '0')}:
                {seconds.toString().padStart(2, '0')}
              </p>
              {summary.status === 'EXPIRED' ? (
                <div className="bg-red-100 rounded-md w-2/3">
                  <p className="text-sm font-medium  text-red-700 px-3 py-2 ">
                    This booking has expired.
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500 mt-1">
                  Please complete the payment within 1 hour to avoid automatic
                  cancellation.
                </p>
              )}
            </div>
          }
        </section>

        {/* Upload proof */}
        <section className="bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="text-lg font-semibold">Upload payment proof</h2>
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleFile}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {previewUrl && (
            <div className="relative h-64 w-full overflow-hidden rounded-lg">
              <Image
                src={previewUrl}
                alt="Preview"
                fill
                className="object-contain"
              />
            </div>
          )}
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="flex gap-4">
            <button
              onClick={() => handleSubmit()}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Submit Proof
            </button>
            <button
              onClick={() => handleCancel(summary.id)}
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel Reservation
            </button>
          </div>
        </section>

        {/* Price breakdown */}
        <section className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-3">Price breakdown</h2>
          <p className="text-xl font-bold">
            Rp {summary.totalPrice.toLocaleString('id-ID')}
          </p>
          <p className="text-xs text-gray-500">Includes taxes & service fees</p>
        </section>
      </div>
    </main>
  );
}
