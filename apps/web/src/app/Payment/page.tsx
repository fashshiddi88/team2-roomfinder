'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function PaymentPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 jam dalam detik
  const [isExpired, setIsExpired] = useState(false);

  // Countdown logic
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format waktu
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      const fileType = selectedFile.type;
      const fileSize = selectedFile.size;

      if (!['image/jpeg', 'image/png'].includes(fileType)) {
        setError('File must be .jpg or .png');
        setFile(null);
        setPreview(null);
        return;
      }

      if (fileSize > 1024 * 1024) {
        setError('File size must be less than 1MB');
        setFile(null);
        setPreview(null);
        return;
      }

      setError('');
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = () => {
    if (!file || isExpired) return;
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('paymentProof', file);

    // TODO: Kirim ke API endpoint bukti pembayaran
    // fetch('/api/upload-proof', { method: 'POST', body: formData })

    setTimeout(() => {
      alert('Payment proof submitted!');
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Payment Confirmation</h1>

      <div className="border p-4 rounded-lg mb-6 bg-gray-50">
        <h2 className="text-lg font-semibold mb-2">Reservation Summary</h2>
        <ul className="text-sm space-y-1">
          <li><strong>Property:</strong> Villa Serenity</li>
          <li><strong>Check-in:</strong> 2025-06-22</li>
          <li><strong>Check-out:</strong> 2025-06-25</li>
          <li><strong>Guests:</strong> 2</li>
          <li><strong>Total Price:</strong> Rp 2.250.000</li>
          <li className="text-red-600 mt-2">
            Upload your payment proof within: <span className="font-mono">{formatTime(timeLeft)}</span>
          </li>
        </ul>
      </div>

      {isExpired ? (
        <div className="text-red-600 text-center font-semibold my-6">
          ⛔ Time expired. Your booking has been automatically cancelled.
        </div>
      ) : (
        <>
          <div className="mb-4">
            <label className="block font-medium mb-2">Upload Payment Proof (.jpg / .png, max 1MB)</label>
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="block w-full border rounded p-2"
              disabled={isExpired}
            />
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
            {preview && (
              <div className="mt-4">
                <p className="text-sm font-medium">Preview:</p>
                <Image src={preview} alt="Proof preview" width={300} height={200} className="rounded" />
              </div>
            )}
          </div>

          <button
            disabled={!file || !!error || isSubmitting || isExpired}
            onClick={handleSubmit}
            className={`px-4 py-2 rounded text-white ${
              !file || error || isSubmitting || isExpired ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Proof'}
          </button>
        </>
      )}
    </div>
  );
}
