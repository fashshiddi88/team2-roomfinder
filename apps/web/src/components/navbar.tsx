"use client";
import Link from 'next/link';
import { useState } from 'react';
import RegisterForm from '@/components/Register/RegisterForm';
import Image from 'next/image';

export default function Navbar() {
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const toggleRegister = () => {
    setShowRegisterForm((prev) => !prev);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="w-full px-4 md:px-8 py-4 flex justify-between items-center relative">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3">
          <Image
            src="/room_finderr.jpeg"
            alt="Logo"
            width={40}
            height={40}
            className="rounded-lg"
          />
          <span className="text-xl font-bold text-gray-900">Room Finder</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-10">
          {['Home', 'Features', 'Recomendations', 'About Us'].map((item) => (
            <Link
              key={item}
              href="#"
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          <Link
            href="/become-a-tenant"
            className="bg-black text-white px-5 py-2 rounded-lg hover:bg-yellow-600 transition-colors font-semibold"
          >
            Become a Tenant
          </Link>

          <Link
            href="/Login"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Login
          </Link>

          <Link
            href="/Register"
            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            Register
          </Link>


          <button className="md:hidden p-2 rounded-md" aria-label="Menu">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Pop-up Register Form */}
        {showRegisterForm && (
          <div className="absolute right-6 top-full mt-2 w-80 bg-white p-6 rounded-md shadow-lg z-50">
            <RegisterForm />
          </div>
        )}
      </div>
    </header>
  );
}
