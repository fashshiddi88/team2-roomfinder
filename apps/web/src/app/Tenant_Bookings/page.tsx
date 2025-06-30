'use client';

import React, { useState } from 'react';
import { withAuthRoles } from '@/middleware/withAuthRoles';
import TenantSidebar from '../Tenant_Navbar/page';
import { User, Calendar, Check, X, Eye } from 'lucide-react';

type StatusType = 'Confirmed' | 'Pending' | 'Rejected';

const tabs = ['Semua', 'Menunggu Approval', 'Approved', 'Rejected'];

function TenantBookingsPage() {
  const [activeTab, setActiveTab] = useState('Semua');
  const [bookings, setBookings] = useState([
    {
      id: '1',
      property: 'Villa Serenity',
      date: '2025-06-10 to 2025-06-15',
      status: 'Confirmed' as StatusType,
      user: {
        name: 'John Doe',
        email: 'john@example.com',
      },
    },
    {
      id: '2',
      property: 'Beachfront Escape',
      date: '2025-07-01 to 2025-07-05',
      status: 'Pending' as StatusType,
      user: {
        name: 'Jane Smith',
        email: 'jane@example.com',
      },
    },
    {
      id: '3',
      property: 'Mountain View Cabin',
      date: '2025-06-25 to 2025-06-27',
      status: 'Pending' as StatusType,
      user: {
        name: 'Robert Lang',
        email: 'robert@example.com',
      },
    },
    {
      id: '4',
      property: 'Urban Apartment',
      date: '2025-07-10 to 2025-07-12',
      status: 'Rejected' as StatusType,
      user: {
        name: 'Alice Green',
        email: 'alice@example.com',
      },
    },
  ]);

  const handleAction = (id: string, action: StatusType) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === id ? { ...booking, status: action } : booking,
      ),
    );
  };

  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === 'Semua') return true;
    if (activeTab === 'Menunggu Approval') return booking.status === 'Pending';
    if (activeTab === 'Approved') return booking.status === 'Confirmed';
    if (activeTab === 'Rejected') return booking.status === 'Rejected';
    return false;
  });

  return (
    <div className="flex">
      <TenantSidebar />

      <main className="flex-1 p-6 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Approval</h1>

        {/* Tabs */}
        <div className="flex gap-3 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full border transition ${
                activeTab === tab
                  ? 'bg-indigo-900 text-white'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Booking List */}
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white p-5 rounded-xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center"
            >
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-bold text-gray-800">
                  {booking.property}
                </h2>
                <p className="text-sm text-gray-500">{booking.user.email}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <User size={14} /> {booking.user.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} /> {booking.date}
                  </span>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      booking.status === 'Confirmed'
                        ? 'bg-green-100 text-green-700'
                        : booking.status === 'Rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>

              {booking.status === 'Pending' && (
                <div className="flex gap-2 mt-4 md:mt-0">
                  <button className="px-3 py-1 border text-sm rounded-lg hover:bg-gray-50 flex items-center gap-1">
                    <Eye size={14} /> Lihat Bukti
                  </button>
                  <button
                    onClick={() => handleAction(booking.id, 'Rejected')}
                    className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-sm flex items-center gap-1"
                  >
                    <X size={14} /> Reject
                  </button>
                  <button
                    onClick={() => handleAction(booking.id, 'Confirmed')}
                    className="px-3 py-1 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg text-sm flex items-center gap-1"
                  >
                    <Check size={14} /> Approve
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default withAuthRoles(['TENANT'])(TenantBookingsPage);
