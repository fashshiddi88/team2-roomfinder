'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import Button from '../atomics/Button';
import Text from '../atomics/Text';
import LoadingScreen from '../LoadingScreen';
import { forgotPassword } from '@/lib/api/axios';
import { AxiosError } from 'axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleForgotPass = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await forgotPassword(email);
      toast.success(res.message || 'Cek email kamu untuk mereset password.');
      setSuccess(true);
    } catch (error: unknown) {
      const err = error as AxiosError<{ detail?: string }>;
      toast.error(err.response?.data?.detail || 'Gagal mengirim email.');
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <LoadingScreen message="Memproses..." />;

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-center">
          <h1 className="text-2xl font-bold text-blue-600 mb-2">
            Verifikasi Email Dikirim!
          </h1>
          <p className="text-gray-700">
            Kami telah mengirim link verifikasi ke <strong>{email}</strong>.
            Silakan cek email dan klik link untuk mereset password.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Masukkan email yang terdaftar
        </h2>
        <form onSubmit={handleForgotPass} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Masukan email Anda"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Button
            type="submit"
            variant="accent"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition justify-center cursor-pointer"
            disabled={loading}
          >
            {' '}
            <Text weight="bold" size="lg" color="white">
              {' '}
              {loading ? 'Memproses...' : 'Konfirmasi'}
            </Text>
          </Button>
        </form>
      </div>
    </div>
  );
}
