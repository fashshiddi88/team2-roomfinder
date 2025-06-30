'use client';

import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { loginSchema } from '@/lib/validations/validations.schema';
import { loginUser } from '@/lib/api/axios';
import { toast } from 'sonner';
import Button from '../atomics/Button';
import Text from '../atomics/Text';
import Link from 'next/link';
import LoadingScreen from '../LoadingScreen';
import { useAuth } from '@/app/utils/hook/useAuth';
import { useRouter } from 'next/navigation';

export default function LoginTenantForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const router = useRouter();
  const { login, logout } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      const fieldErrors = result.error.format();
      setErrors({
        email: fieldErrors.email?._errors[0],
        password: fieldErrors.password?._errors[0],
      });
      return;
    }

    setErrors({});

    try {
      const data = await loginUser(email, password);
      const { access_token, user } = data;
      const { role, id } = user;

      if (role !== 'TENANT') {
        toast.error('Akun ini tidak memiliki akses.');
        logout();
        router.replace('/Login');
        setLoading(false);
        return;
      }

      login(access_token, role, id);
      toast.success('Login berhasil!');
      router.push('/');
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          'Email atau password salah, coba lagi.',
      );
      setLoading(false);
    }
  };
  if (loading) return <LoadingScreen message="Logging in with email..." />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white bg-opacity-90 p-8 rounded shadow-md backdrop-blur-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Masuk sebagai Tenant di Room Finder
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

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

          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center text-sm">
              <input type="checkbox" name="remember" className="mr-2" />
              Ingat saya
            </label>
            <Link href="/ForgotPassword" className="text-blue-600 text-sm">
              Lupa kata sandi?
            </Link>
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
              {loading ? 'Memproses...' : 'Masuk'}
            </Text>
          </Button>
        </form>

        <div className="flex items-center my-6">
          <hr className="flex-grow border-t" />
          <span className="mx-2 text-sm text-gray-500">
            Atau masuk dengan Google
          </span>
          <hr className="flex-grow border-t" />
        </div>

        <div className="flex">
          <button
            className="flex items-center justify-center w-full border rounded py-2 hover:bg-gray-50"
            onClick={() => {
              window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`;
            }}
          >
            <FcGoogle className="mr-2 text-red-600 text-lg" />
            <span className="text-sm font-medium">Google</span>
          </button>
        </div>
        {/* Footer Link */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Belum punya akun?{' '}
          <Link
            href="/Register_Tenant"
            className="text-blue-600 hover:underline"
          >
            Buat akun Tenant
          </Link>
        </p>
      </div>
    </div>
  );
}
