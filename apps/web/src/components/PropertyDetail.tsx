'use client';

import Navbar from '@/components/navbar';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Property {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  description: string;
  images: string[];
  amenities: string[];
  mapEmbedUrl?: string;
}

export default function PropertyDetail({ property }: { property: Property }) {
  const router = useRouter();
  const [mainImage, setMainImage] = useState(property.images[0]);
  const [counts, setCounts] = useState({ Adults: 0, Children: 0, Pets: 0 });
  const [openDropdown, setOpenDropdown] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const totalGuests = counts.Adults + counts.Children;

  const rooms = [
    {
      id: 'room1',
      name: 'Deluxe Room',
      price: 750000,
      originalPrice: 900000,
      available: 3,
      capacity: '2 Adults',
      amenities: ['Free Wi-Fi', 'Breakfast Included', 'City View'],
    },
    {
      id: 'room2',
      name: 'Executive Suite',
      price: 1200000,
      originalPrice: 1400000,
      available: 2,
      capacity: '2 Adults + 1 Child',
      amenities: ['Bathtub', 'Balcony', 'Living Area'],
    },
    {
      id: 'room3',
      name: 'Family Room',
      price: 1500000,
      originalPrice: 1750000,
      available: 1,
      capacity: '4 Guests',
      amenities: ['2 Queen Beds', 'Private Bathroom', 'TV + Netflix'],
    },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(false);
      }
    };
    if (openDropdown) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  const reviews = [
    {
      id: '1',
      name: 'Alice Johnson',
      rating: 5,
      comment: 'Amazing place! Very clean and close to all attractions.',
      avatarUrl: 'https://i.pravatar.cc/40?img=1',
    },
    {
      id: '2',
      name: 'Bob Smith',
      rating: 4,
      comment: 'Comfortable stay but the Wi-Fi was a bit slow.',
      avatarUrl: 'https://i.pravatar.cc/40?img=2',
    },
    {
      id: '3',
      name: 'Carol Lee',
      rating: 5,
      comment: 'Host was very helpful and the amenities were excellent.',
      avatarUrl: 'https://i.pravatar.cc/40?img=3',
    },
  ];

  return (
    <>
      <Navbar />

      {/* Sticky Search Bar */}
      <div className="bg-white shadow sticky top-0 z-50 border-b">
        <div className="max-w-screen-xl mx-auto px-4 py-3 grid grid-cols-1 lg:grid-cols-[1fr_180px_180px_200px_auto] gap-4 items-end">
          <div>
            <h2 className="text-lg font-semibold">{property.name}</h2>
            <p className="text-sm text-gray-500">{property.location}</p>
          </div>
          <div>
            <label className="text-xs text-gray-500">Check‑In</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Check‑Out</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            />
          </div>
          <div className="relative" ref={dropdownRef}>
            <label className="text-xs text-gray-500">Guests</label>
            <button
              onClick={() => setOpenDropdown((o) => !o)}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-left flex justify-between items-center"
            >
              <span>
                {totalGuests ? `${totalGuests} guest${totalGuests > 1 ? 's' : ''}` : 'Add guests'}
              </span>
              <svg
                className={`w-4 h-4 transition-transform ${openDropdown ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {openDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow p-3 space-y-2">
                {(['Adults', 'Children', 'Pets'] as const).map((label) => (
                  <div key={label} className="flex justify-between items-center">
                    <span className="capitalize">{label}</span>
                    <div className="inline-flex items-center space-x-2">
                      <button
                        onClick={() =>
                          setCounts((prev) => ({
                            ...prev,
                            [label]: prev[label] ? prev[label] - 1 : 0,
                          }))
                        }
                        disabled={!counts[label]}
                        className="w-6 h-6 border rounded-full text-sm disabled:opacity-50"
                      >
                        −
                      </button>
                      <span>{counts[label]}</span>
                      <button
                        onClick={() =>
                          setCounts((prev) => ({
                            ...prev,
                            [label]: prev[label] + 1,
                          }))
                        }
                        className="w-6 h-6 border rounded-full text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => {
              if (!checkIn || !checkOut || totalGuests === 0) {
                alert('Please select dates and guests');
              } else {
                alert('Please choose a room below');
              }
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
          >
            Check Availability
          </button>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Gallery */}
          <div className="space-y-2">
            <div className="relative w-full h-72 md:h-96 rounded-xl overflow-hidden">
              <Image src={mainImage} alt="Main" fill className="object-cover" />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {property.images.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setMainImage(img)}
                  className="relative h-20 cursor-pointer rounded-lg overflow-hidden border"
                >
                  <Image src={img} alt={`img-${i}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Room Types */}
          <section>
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
                  {/* Kamar Info */}
                  <div className="space-y-1">
                    <p className="font-semibold text-base">{room.name}</p>
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li className="flex items-center gap-2">
                        <span className="text-blue-600">✓</span> Termasuk Sarapan
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-blue-600">✓</span> {room.amenities.join(', ')}
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-600">✓</span> Gratis pembatalan sebelum H-1
                      </li>
                      <li className="text-xs text-gray-500">
                        Tersisa <span className="font-semibold">{room.available}</span> kamar
                      </li>
                    </ul>
                  </div>

                  {/* Tamu */}
                  <div className="text-center pt-1 font-medium text-gray-700">
                    {room.capacity}
                  </div>

                  {/* Harga */}
                  <div className="text-center">
                    <p className="text-xs text-gray-400 line-through">
                      Rp {room.originalPrice.toLocaleString('id-ID')}
                    </p>
                    <p className="text-orange-600 font-bold text-lg leading-tight">
                      Rp {room.price.toLocaleString('id-ID')}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Di luar pajak & biaya</p>
                  </div>

                  {/* Tombol Pilih */}
                  <div className="flex justify-center items-start">
                    <button
                      onClick={() => {
                        if (!checkIn || !checkOut || totalGuests === 0) {
                          alert('Please select dates and at least one guest.');
                          return;
                        }

                        const query = new URLSearchParams({
                          room: room.name,
                          price: room.price.toString(),
                          in: checkIn,
                          out: checkOut,
                          guests: totalGuests.toString(),
                          propertyId: property.id,
                        });

                        window.open(`/Reservation?${query.toString()}`, '_blank');
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-1.5 rounded"
                    >
                      Pilih
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>




          {/* Location */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Location</h2>
            {property.mapEmbedUrl ? (
              <iframe
                src={property.mapEmbedUrl}
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                className="rounded-xl"
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-xl text-gray-600 text-sm">
                Google Maps Placeholder
              </div>
            )}
          </section>

          {/* Reviews */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Reviews</h2>
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r.id} className="border p-4 rounded-lg shadow-sm">
                  <div className="flex items-center space-x-4 mb-2">
                    {r.avatarUrl && (
                      <img
                        src={r.avatarUrl}
                        alt={r.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <p className="font-semibold">{r.name}</p>
                      <p className="text-yellow-500">{'★'.repeat(r.rating)}</p>
                    </div>
                  </div>
                  <p className="text-gray-700">{r.comment}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="p-6 border rounded-xl shadow-sm h-fit space-y-6">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Start From :</p>
            <p className="text-2xl font-bold text-blue-600 leading-tight">
              Rp {property.price.toLocaleString('id-ID')}
              <span className="text-sm text-gray-500 ml-1 font-medium">/Night</span>
            </p>
          </div>

          <p className="text-gray-600">{property.description}</p>
          <div>
            <h4 className="font-medium mb-2">Amenities</h4>
            <ul className="list-disc pl-5 text-sm text-gray-600">
              {property.amenities.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}
