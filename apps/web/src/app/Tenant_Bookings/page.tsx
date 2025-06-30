'use client';

import React from 'react';
import { withAuthRoles } from '@/middleware/withAuthRoles';
import TenantSidebar from '../Tenant_Navbar/page';

function TenantBookingsPage() {
  const bookings = [
    {
      id: '1',
      property: 'Villa Serenity',
      date: '2025-06-10 to 2025-06-15',
      status: 'Confirmed',
    },
    {
      id: '2',
      property: 'Beachfront Escape',
      date: '2025-07-01 to 2025-07-05',
      status: 'Pending',
    },
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <TenantSidebar />

      {/* Main content */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-4">My Bookings</h1>
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-lg font-medium">{booking.property}</h2>
              <p className="text-gray-600">{booking.date}</p>
              <p className="text-sm text-blue-600">{booking.status}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
export default withAuthRoles(['TENANT'])(TenantBookingsPage);
