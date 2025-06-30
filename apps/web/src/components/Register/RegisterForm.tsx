'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Button from '../atomics/Button';
import Text from '../atomics/Text';
import LoadingScreen from '../LoadingScreen';
import { registerUser } from '@/lib/api/axios';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';

export default function RegisterForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await registerUser(email);
      toast.success(res.message || 'Cek email kamu untuk verifikasi.');
      setSuccess(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Register gagal.');
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
            Silakan cek email dan klik link verifikasi untuk melanjutkan proses
            pendaftaran.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Buat akun di Room Finder
        </h2>
        <form onSubmit={handleRegister} className="space-y-4">
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
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition justify-center"
            onClick={undefined}
            disabled={loading}
          >
            {' '}
            <Text weight="bold" size="lg" color="white">
              {' '}
              {loading ? 'Memproses...' : 'Lanjutkan'}
            </Text>
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="px-2 text-sm text-gray-500">
            Daftar dengan Google
          </span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>

        {/* Google Button */}
        <button
          className="flex items-center justify-center w-full border rounded py-2 hover:bg-gray-50"
          onClick={() => {
            window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`;
          }}
        >
          <FcGoogle className="mr-2 text-red-600 text-lg" />
          <span className="text-sm font-medium">Google</span>
        </button>

        {/* Footer Link */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Sudah punya akun?{' '}
          <Link href="/Login" className="text-blue-600 hover:underline">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}
