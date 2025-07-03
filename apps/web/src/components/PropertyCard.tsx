'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Property {
  id: string | number;
  name: string;
  image: string;
  rating: number;
  price: number;
  location: string;
}

type Props = {
  property: Property;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  cityId?: number | string; // ← Tambahan untuk routing Explore
};

export default function PropertyCard({
  property,
  checkIn,
  checkOut,
  guests,
  cityId,
}: Props) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('wishlist');
    const wishlist = stored ? JSON.parse(stored) : [];
    const exists = wishlist.some((item: any) => item.id === property.id);
    setIsWishlisted(exists);
  }, [property.id]);

  const toggleWishlist = () => {
    setIsWishlisted((prev) => {
      const updated = !prev;
      const stored = localStorage.getItem('wishlist');
      let wishlist = stored ? JSON.parse(stored) : [];

      if (updated) {
        wishlist.push(property);
      } else {
        wishlist = wishlist.filter((item: any) => item.id !== property.id);
      }

      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      return updated;
    });
  };

  // Build URL params
  const queryParams = new URLSearchParams();
  if (cityId) queryParams.set('cityId', cityId.toString());
  if (checkIn) queryParams.set('checkIn', checkIn);
  if (checkOut) queryParams.set('checkOut', checkOut);
  if (guests) queryParams.set('guests', guests.toString());

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow relative">
      <div className="relative h-48">
        <Image
          src={property.image}
          alt={property.name}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-500 hover:scale-105"
        />
        <button
          onClick={toggleWishlist}
          className="absolute top-3 left-3 bg-white rounded-full p-1 shadow-md hover:scale-110 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill={isWishlisted ? 'red' : 'none'}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 
              4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 
              4.5 0 010-6.364z"
            />
          </svg>
        </button>

        <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 flex items-center shadow">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-yellow-400 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="font-medium">{property.rating}</span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-gray-900">{property.name}</h3>
          <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm font-medium">
            <span>Rp. </span>
            <span className="text-lg">{property.price.toLocaleString('id-ID')}</span>
            <span className="text-xs"> /night</span>
          </div>
        </div>

        <p className="text-gray-600 mt-1">{property.location}</p>

        <div className="mt-4 flex justify-between items-center">
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 ${i < Math.floor(property.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>

          <Link
            href={`/Explore/${property.id}?${queryParams.toString()}`}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
