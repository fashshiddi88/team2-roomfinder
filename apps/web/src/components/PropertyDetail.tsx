'use client';

import Image from 'next/image';
interface Property {
  id: number;
  name: string;
  description?: string;
  image?: string;
  images?: string[];
  location?: string;
  city?: {
    name: string;
  };
  category?: {
    name: string;
  };
  price?: number;
  deletedAt?: string | null;
}

export default function PropertyDetail({ property }: { property: Property }) {
  const mainImage =
    property.images?.[0] || property.image || '/default-room.jpg';

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{property.name}</h1>
      <p className="text-gray-600 mb-2">
        {property.city?.name || property.location}
      </p>

      <Image
        src={mainImage}
        alt={property.name}
        width={1200}
        height={500}
        className="rounded-lg object-cover w-full h-80 mb-6"
      />

      <p className="text-lg text-gray-700 mb-6">
        {property.description || 'No description available.'}
      </p>

      <div className="bg-gray-100 rounded-lg p-4">
        <p>
          <strong>Category:</strong> {property.category?.name || '-'}
        </p>
        <p>
          <strong>Price:</strong> Rp{' '}
          {property.price?.toLocaleString('id-ID') || 0} / night
        </p>
        <p>
          <strong>Status:</strong>{' '}
          {property.deletedAt ? 'Unavailable' : 'Available'}
        </p>
      </div>
    </div>
  );
}
