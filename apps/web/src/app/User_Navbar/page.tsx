'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  User,
  CalendarCheck,
  Star,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Bookings', href: '/User_Bookings', icon: CalendarCheck },
  { name: 'Reviews', href: '/_User_Reviews', icon: Star },
  { name: 'Settings', href: '/Settings_User', icon: Settings },
];

export default function SideNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-blue-600 text-white shadow-md md:hidden"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <ChevronRight
          className={`w-5 h-5 transition-transform ${
            mobileMenuOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Sidebar */}
      <aside
        className={`h-screen w-64 bg-gradient-to-b from-blue-50 to-white border-r border-gray-200 fixed top-0 left-0 px-6 py-8 shadow-xl transition-all duration-300 z-40
        ${
          mobileMenuOpen
            ? 'translate-x-0'
            : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Header with User Name */}
        <div className="flex items-center mb-10">
          <div className="bg-blue-600 rounded-lg p-2 mr-3">
            <User className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            <span className="text-blue-600">Alex Morgan</span>
          </h1>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 mb-12">
          {navItems.map(({ name, href, icon: Icon }) => {
            const isActive = pathname === href.toLowerCase();
            return (
              <Link
                key={name}
                href={href}
                className={`flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-200
                ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-blue-100 hover:text-blue-700'
                }`}
              >
                <Icon
                  className={`w-5 h-5 mr-3 ${
                    isActive ? 'text-white' : 'text-blue-500'
                  }`}
                />
                {name}
                {isActive && (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="border-t border-gray-200 mb-6"></div>

        {/* User Profile (optional) */}
        {/* <div className="flex items-center mb-8">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12" />
          <div className="ml-3">
            <h3 className="font-semibold text-gray-800">Alex Morgan</h3>
          </div>
        </div> */}

        {/* Logout Button */}
        <button className="w-full flex items-center px-4 py-3 rounded-xl text-base font-medium text-gray-600 hover:bg-gray-100 transition-colors">
          <LogOut className="w-5 h-5 mr-3 text-gray-500" />
          Sign Out
        </button>
      </aside>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
