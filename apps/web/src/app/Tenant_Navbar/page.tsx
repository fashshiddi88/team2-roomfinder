'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  CalendarCheck,
  Star,
  Settings,
  LogOut,
  ChevronRight,
  User,
  Hotel,
  ChevronLeft
} from 'lucide-react';
import { useState } from 'react';

const tenantMenu = [
  { label: 'Dashboard', href: '/', icon: <Home size={20} /> },
  { label: 'Bookings', href: '/Tenant_Bookings', icon: <CalendarCheck size={20} /> },
  { label: 'Reviews', href: '/Tenant_Reviews', icon: <Star size={20} /> },
  { label: 'Settings', href: '/Tenant_Settings', icon: <Settings size={20} /> },
];

export default function TenantSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`h-screen bg-gradient-to-b from-blue-50 to-white border-r border-gray-200 transition-all duration-300 flex flex-col ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Hotel className="text-white" size={24} />
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-800">Tenant Panel</h1>
              {/* <p className="text-xs text-gray-500">Premium Edition</p> */}
            </div>
          </div>
        )}
        <button
          className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronLeft
            size={20}
            className={`transition-transform ${
              collapsed ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {/* User Profile */}
      <div className={`flex items-center p-4 ${collapsed ? 'justify-center' : 'border-b border-gray-200'}`}>
        <div className="bg-gray-200 border-2 border-dashed rounded-full w-10 h-10 flex items-center justify-center">
          <User size={18} className="text-gray-500" />
        </div>
        {!collapsed && (
          <div className="ml-3">
            <h3 className="font-medium text-gray-800">Alex Johnson</h3>
            <p className="text-xs text-gray-500">Property Manager</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2">
        {tenantMenu.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 mb-1 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-blue-100 hover:text-blue-700'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              <span className={isActive ? 'text-white' : 'text-blue-500'}>
                {item.icon}
              </span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer with Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          className={`flex items-center gap-3 text-gray-600 hover:text-red-600 w-full ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut size={20} className="text-gray-500" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}