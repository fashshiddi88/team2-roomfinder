'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getBookingById } from '@/lib/api/axios';
import Image from 'next/image';
import LoadingScreen from '@/components/LoadingScreen';

/**
 * ReservationSummary represents data forwarded from the Make Reservation flow.
 * In production these values should be fetched from the backend by reservationId
 * (passed via route params or search params). For now we grab them from the
 * URL query string so the page can work without a backend.
 */

export default function UploadPaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = Number(searchParams.get('bookingId'));
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ------ Dummy summary pulled from query params or placeholder ------

  // ------ Countdown timer (2 hours) ------
  const [remaining, setRemaining] = useState<number>(() => {
    // Persist the deadline in sessionStorage so a refresh doesn't reset it.
    const stored = sessionStorage.getItem('deadline-' + summary.reservationId);
    const deadline = stored
      ? new Date(stored)
      : new Date(Date.now() + 2 * 60 * 60 * 1000);
    if (!stored)
      sessionStorage.setItem(
        'deadline-' + summary.reservationId,
        deadline.toISOString(),
      );
    return deadline.getTime() - Date.now();
  });

  useEffect(() => {
    const id = setInterval(() => setRemaining((prev) => prev - 1000), 1000);
    return () => clearInterval(id);
  }, []);

  const hours = Math.max(0, Math.floor(remaining / 3_600_000));
  const minutes = Math.max(0, Math.floor((remaining % 3_600_000) / 60_000));
  const seconds = Math.max(0, Math.floor((remaining % 60_000) / 1000));

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await getBookingById(bookingId);
        setSummary(data);
        // Optional: hitung countdown dari expiredAt jika ada
      } catch (error) {
        console.error('Gagal fetch booking:', error);
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) fetchBooking();
  }, [bookingId]);

  function formatTanggalIndonesia(dateString: string): string {
    const date = new Date(dateString);

    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'short',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(date);
  }

  // ------ Payment proof upload ------
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    // Validation: jpg / png under 1 MB
    if (!/image\/(jpeg|png)/.test(f.type)) {
      setError('File must be .jpg or .png');
      return;
    }
    if (f.size > 1_048_576) {
      setError('File size must be under 1 MB');
      return;
    }
    setError(null);
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const handleSubmit = () => {
    if (!file) {
      setError('Please upload payment proof first');
      return;
    }
    // TODO: send to backend
    alert(
      'Payment proof uploaded! Your reservation is now awaiting confirmation.',
    );
    router.push('/reservation/' + summary.reservationId + '/status');
  };

  const handleCancel = () => {
    const ok = confirm(
      'Cancel this reservation? This action cannot be undone.',
    );
    if (ok) router.push('/properties/' + params.get('propertyId'));
  };

  if (loading) return <LoadingScreen message="Tunggu Sebentar" />;
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
            <h2 className="text-lg font-semibold mb-3">Stay details</h2>
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
                {formatTanggalIndonesia(summary.checkInDate || '')}
              </li>
              <li>
                <span className="font-medium">Check Out:</span>{' '}
                {formatTanggalIndonesia(summary.checkOutDate || '')}
              </li>
              <li>
                <span className="font-medium">Guests:</span> {summary.guests}
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-3">Payment deadline</h2>
            <p className="text-4xl font-bold tabular-nums">
              {hours.toString().padStart(2, '0')}:
              {minutes.toString().padStart(2, '0')}:
              {seconds.toString().padStart(2, '0')}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Please complete the payment within 2 hours to avoid automatic
              cancellation.
            </p>
          </div>
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
              onClick={handleSubmit}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Submit Proof
            </button>
            <button
              onClick={handleCancel}
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
