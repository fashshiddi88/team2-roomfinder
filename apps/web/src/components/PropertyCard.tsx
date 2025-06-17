'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface Property {
  id: string | number;
  name: string;
  image: string;
  rating: number;
  price: number;
  location: string;
}

export default function PropertyCard({ property }: { property: Property }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

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

        {/* Wishlist button */}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
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

        {/* Rating badge */}
        <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 flex items-center shadow">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
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
            <span className="text-xs">/night</span>
          </div>
        </div>

        <p className="text-gray-600 mt-1 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          {property.location}
        </p>

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
            href={`/properties/${property.id}`}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
