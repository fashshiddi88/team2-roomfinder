'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';

export default function RegisterTenantForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    companyName: '',
    email: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.companyName || !form.email) {
      alert('Please fill all fields');
      return;
    }
    alert(`Registering tenant:\nCompany: ${form.companyName}\nEmail: ${form.email}`);
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-2xl font-bold text-center text-gray-800">Register as Tenant</h2>

          {/* Company Name */}
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              placeholder="Enter company name"
              value={form.companyName}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors font-semibold"
          >
            Continue
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="px-2 text-sm text-gray-500">register with google</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>

        {/* Google Button */}
        <button
          className="w-full flex items-center justify-center border border-gray-300 rounded-md py-2 hover:bg-gray-50"
        >
          <FcGoogle className="mr-2 text-xl" />
          Google
        </button>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
