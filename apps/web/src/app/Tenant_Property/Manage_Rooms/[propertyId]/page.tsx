'use client';

import React from 'react';
import Link from 'next/link';
import { withAuthRoles } from '@/middleware/withAuthRoles';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import TenantSidebar from '@/app/Tenant_Navbar/page';
import TenantRoomTable from '../RoomTable';
import { getRoomsByProperty } from '@/lib/api/axios';
import { toast } from 'sonner';
import { RoomType } from '@/types/property';

function TenantMyRoomPage() {
  const { propertyId } = useParams();
  const [rooms, setRooms] = useState<RoomType[]>([]);

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        if (!propertyId) return;
        const parsedId = Array.isArray(propertyId) ? propertyId[0] : propertyId;
        const room = await getRoomsByProperty(Number(parsedId));
        setRooms(room.data);
      } catch (error) {
        toast.error('Gagal memuat data kamar.');
      }
    };
    fetchRoomData();
  }, [propertyId]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <TenantSidebar />
      <main className="flex-1 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">My Rooms</h1>
            {propertyId && (
              <Link
                href={`/Tenant_Property/Manage_Rooms/${propertyId}/Add_Room`}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                + Add Room
              </Link>
            )}
          </div>

          <div className="bg-white shadow-md rounded-lg overflow-x-auto">
            <TenantRoomTable rooms={rooms} setRooms={setRooms} />
          </div>
          <div className="flex items-center justify-end">
            <Link
              href={`/Tenant_Property`}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mt-4"
            >
              Kembali
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
export default withAuthRoles(['TENANT'])(TenantMyRoomPage);
