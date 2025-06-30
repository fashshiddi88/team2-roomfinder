'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { resetPassword } from '@/lib/api/axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'sonner';
import Button from '../atomics/Button';
import Text from '../atomics/Text';
import LoadingScreen from '../LoadingScreen';
import { verifyPasswordSchema } from '@/lib/validations/validations.schema';

export default function ResetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (success) {
      router.push('/Login');
    }
  }, [success]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = searchParams.get('token');
    if (!token) {
      toast.error('Token tidak ditemukan.');
      return;
    }

    const result = verifyPasswordSchema.safeParse({ token, password });
    if (!result.success) {
      const errorMap = result.error.flatten().fieldErrors;

      if (errorMap.password) {
        toast.error(errorMap.password[0]);
      } else if (errorMap.token) {
        toast.error(errorMap.token[0]);
      }

      return;
    }

    setLoading(true);

    try {
      await resetPassword(token, password);
      toast.success('Password berhasil direset! Silakan login.');
      setSuccess(true); // baru trigger redirect via useEffect
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal mereset password.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingScreen message="Sedang membuat akun..." />;
  if (success) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Kata Sandi Baru</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Kata Sandi</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <span
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEyeSlash className="h-5 w-5" />
                ) : (
                  <FaEye className="h-5 w-5" />
                )}
              </span>
            </div>
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
              {loading ? 'Memproses...' : 'Konfirmasi'}
            </Text>
          </Button>
        </form>
      </div>
    </div>
  );
}
