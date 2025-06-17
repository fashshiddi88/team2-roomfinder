'use client';

import { useState } from 'react';
import { FaFacebook, FaGoogle } from 'react-icons/fa';

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement logic login
    console.log(formData);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/sakura.jpg')" }}
    >
      <div className="w-full max-w-md bg-white bg-opacity-90 p-8 rounded shadow-md backdrop-blur-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login to Your Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Kata Sandi</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
                className="mr-2"
              />
              Ingat saya
            </label>
            <a href="#" className="text-sm text-blue-600 hover:underline">
              Lupa kata sandi?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
          >
            Masuk
          </button>
        </form>

        <div className="flex items-center my-6">
          <hr className="flex-grow border-t" />
          <span className="mx-2 text-sm text-gray-500">Atau lanjutkan dengan</span>
          <hr className="flex-grow border-t" />
        </div>

        <div className="flex space-x-4">
          <button className="flex items-center justify-center w-1/2 border rounded py-2 hover:bg-gray-50">
            <FaFacebook className="mr-2 text-blue-600" />
            Facebook
          </button>
          <button className="flex items-center justify-center w-1/2 border rounded py-2 hover:bg-gray-50">
            <FaGoogle className="mr-2 text-red-600" />
            Google
          </button>
        </div>
      </div>
    </div>
  );
}
