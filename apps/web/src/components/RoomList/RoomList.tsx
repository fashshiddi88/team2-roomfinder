'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Swal from 'sweetalert2';
import Image from 'next/image';

type Room = {
  id: number;
  name: string;
  image: string;
  description: string;
  capacity: number;
  totalAvailable: number;
  effectivePrice: number;
};

type Props = {
  rooms: Room[];
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  propertyId: number;
};

export default function RoomList({ rooms, propertyId }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const guests = Number(searchParams.get('guests') || '1');

  return (
    <section className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Available Room Types</h2>

      <div className="border rounded-xl overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[2fr_1fr_1.5fr_100px] bg-gray-100 px-4 py-3 text-sm font-semibold">
          <div>Pilihan Kamar</div>
          <div className="text-center">Guests</div>
          <div className="text-center">Price</div>
          <div></div>
        </div>

        {/* List */}
        {rooms.map((room) => (
          <div
            key={room.id}
            className="grid grid-cols-[2fr_1fr_1.5fr_100px] border-t px-4 py-4 items-start text-sm gap-4"
          >
            {/* Info Kamar */}
            <div className="space-y-2">
              <div className="relative w-full h-40 rounded-lg overflow-hidden">
                <Image
                  src={room.image || '/default-room.jpg'}
                  alt={room.name}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="font-semibold text-base">{room.name}</p>
              <ul className="text-gray-700 text-sm space-y-1">
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">✓</span> Termasuk Sarapan
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">✓</span> {room.description}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span> Gratis pembatalan
                  sebelum H-1
                </li>
                <li className="text-xs text-gray-500">
                  Tersisa{' '}
                  <span className="font-semibold">{room.totalAvailable}</span>{' '}
                  kamar
                </li>
              </ul>
            </div>

            {/* Guest */}
            <div className="text-center pt-1 font-medium text-gray-700">
              {room.capacity}
            </div>

            {/* Harga */}
            <div className="text-center">
              <p className="text-orange-600 font-bold text-lg leading-tight">
                Rp {room.effectivePrice.toLocaleString('id-ID')}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Di luar pajak & biaya
              </p>
            </div>

            {/* Tombol Pilih */}
            <div className="flex justify-center items-start">
              <button
                onClick={() => {
                  if (!checkIn || !checkOut || guests === 0) {
                    alert('Please select dates and at least one guest.');
                    return;
                  }

                  const query = new URLSearchParams({
                    room: room.name,
                    price: room.effectivePrice.toString(),
                    checkIn,
                    checkOut,
                    propertyId: propertyId.toString(),
                  });

                  const targetUrl = `/Reservation?${query.toString()}`;
                  const token = localStorage.getItem('token');

                  if (!token) {
                    Swal.fire({
                      icon: 'warning',
                      title: 'Login Diperlukan',
                      text: 'Silakan login terlebih dahulu untuk melanjutkan pemesanan.',
                      confirmButtonText: 'Login',
                    }).then(() => {
                      localStorage.setItem('redirectAfterLogin', targetUrl); // simpan tujuan
                      router.push('/Login');
                    });
                    return;
                  }

                  router.push(targetUrl);
                }}
                className="bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold px-4 py-1.5 rounded"
              >
                Pilih
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
