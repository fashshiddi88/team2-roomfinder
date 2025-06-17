'use client';

import SideNavbar from '@/app/User_Navbar/page';
import { Heart } from 'lucide-react';

export default function WishlistPage() {
  const wishlist = [
    {
      id: 1,
      name: 'Villa Serenity',
      location: 'Bali',
      price: 750000,
      image: '/villa.jpg',
    },
    {
      id: 2,
      name: 'Urban Loft',
      location: 'Jakarta',
      price: 550000,
      image: '/urban_loft.jpg',
    },
    {
      id: 3,
      name: 'Mountain Retreat',
      location: 'Bandung',
      price: 680000,
      image: '/mountain_retreat.jpg',
    },
  ];

  return (
    <div className="flex">
      <SideNavbar />
      <main className="ml-64 p-6 w-full bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Heart className="text-pink-500" /> My Wishlist
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow p-4">
              <img
                src={item.image}
                alt={item.name}
                className="rounded-lg w-full h-40 object-cover mb-4"
              />
              <h2 className="text-lg font-semibold text-gray-800">
                {item.name}
              </h2>
              <p className="text-sm text-gray-600">{item.location}</p>
              <p className="text-blue-600 font-semibold">
                Rp {item.price.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
