'use client';

import PropertyDetail from '@/components/PropertyDetail';
import { useParams } from 'next/navigation';

// Simulasi data, bisa diganti dengan fetch API nanti
const properties = [
  {
    id: '1',
    name: 'Villa Serenity',
    location: 'Jakarta, Indonesia',
    price: 750000,
    rating: 4.8,
    description: 'In the heart of Midtown of Jakarta!',
    images: [
      '/detail_1.jpg',
      '/detail_2.jpeg',
      '/detail_3.jpeg',
      '/detail_4.jpeg'
    ],
    amenities: [
      'Wifi',
      'Workspace',
      'Kitchen',
      'Eating utensils',
      'Fridge',
      'Pool',
      'Gym',
      'Parking area',
      'TV',
    ],
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=...' // URL iframe dari Google Maps
  },
];

export default function PropertyDetailPage() {
  const { id } = useParams();
  const property = properties.find((p) => p.id === id);

  if (!property) return <div>Property not found</div>;

  return <PropertyDetail property={property} />;
}
