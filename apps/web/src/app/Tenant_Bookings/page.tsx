'use client';

import { useState, useEffect } from 'react';
import {
  getTenantBookings,
  acceptBookingByTenant,
  rejectBookingByTenant,
} from '@/lib/api/axios';
import { BookingStatus } from '@/types/property';
import { withAuthRoles } from '@/middleware/withAuthRoles';
import TenantSidebar from '../Tenant_Navbar/page';
import { User, Calendar, Check, X, Eye } from 'lucide-react';
import Swal from 'sweetalert2';

function TenantBookingsPage() {
  const tabs = ['All', 'Waiting Payment', 'Waiting Confirmation', 'Confirmed'];
  const [activeTab, setActiveTab] = useState('All');
  const [bookings, setBookings] = useState<any[]>([]);

  const fetchBookings = async () => {
    try {
      const data = await getTenantBookings();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching tenant bookings:', error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Waiting Payment')
      return booking.status === 'WAITING_PAYMENT';
    if (activeTab === 'Waiting Confirmation')
      return booking.status === 'WAITING_CONFIRMATION';
    if (activeTab === 'Confirmed') return booking.status === 'CONFIRMED';
    return booking.status === activeTab.toUpperCase();
  });

  const handleAction = async (bookingId: number, newStatus: BookingStatus) => {
    const confirm = await Swal.fire({
      title: `Sudah periksa bukti? Apakah anda yakin untuk ${newStatus === 'CONFIRMED' ? 'approve' : 'reject'}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
    });

    if (!confirm.isConfirmed) return;

    try {
      if (newStatus === BookingStatus.CONFIRMED) {
        await acceptBookingByTenant(bookingId);
        Swal.fire('Approved', 'Booking has been approved.', 'success');
      } else if (newStatus === BookingStatus.REJECTED) {
        await rejectBookingByTenant(bookingId);
        Swal.fire('Rejected', 'Booking has been rejected.', 'success');
      }
      await fetchBookings();
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

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
                      booking.status === 'CONFIRMED'
                        ? 'bg-green-100 text-green-700'
                        : booking.status === 'WAITING_CONFIRMATION'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>

              {booking.status === 'WAITING_CONFIRMATION' && (
                <div className="flex gap-2 mt-4 md:mt-0">
                  <button className="px-3 py-1 border text-sm rounded-lg hover:bg-gray-50 flex items-center gap-1">
                    <Eye size={14} /> Lihat Bukti
                  </button>
                  <button
                    onClick={() =>
                      handleAction(booking.id, BookingStatus.REJECTED)
                    }
                    className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-sm flex items-center gap-1"
                  >
                    <X size={14} /> Reject
                  </button>
                  <button
                    onClick={() =>
                      handleAction(booking.id, BookingStatus.CONFIRMED)
                    }
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
