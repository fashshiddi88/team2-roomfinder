'use client';

import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

const dummyHotels = [
  {
    id: 1,
    name: 'Hotel Indonesia Kempinski',
    location: 'Jakarta',
    badge: 'Top Hotel Jakarta',
    originalPrice: 2500000,
    features: ['Rooftop Bar', 'Kolam Renang', 'Dekat Monas', 'Restoran Mewah'],
    images: ['/jakarta-1.jpg'],
    availableRooms: 4,
  },
  {
    id: 2,
    name: 'The Mulia Resort',
    location: 'Bali',
    badge: 'Beachfront Luxury',
    originalPrice: 4500000,
    features: ['Pantai Pribadi', 'Spa', 'Infinity Pool', 'Restoran Bintang 5'],
    images: ['/bali-1.jpg'],
    availableRooms: 6,
  },
  {
    id: 3,
    name: 'The Trans Luxury Hotel',
    location: 'Bandung',
    badge: 'Popular Hotel',
    originalPrice: 3000000,
    features: ['Dekat Trans Studio', 'Kolam Anak', 'Sauna', 'Rooftop View'],
    images: ['/bandung-1.jpg'],
    availableRooms: 2,
  },
  {
    id: 4,
    name: 'Royal Ambarrukmo',
    location: 'Yogyakarta',
    badge: 'Hotel Heritage',
    originalPrice: 2000000,
    features: ['Dekat Candi Prambanan', 'Live Music', 'Kolam Tradisional'],
    images: ['/yogyakarta-1.jpg'],
    availableRooms: 5,
  },
  {
    id: 5,
    name: 'JW Marriott Hotel',
    location: 'Surabaya',
    badge: 'Top Choice',
    originalPrice: 2300000,
    features: ['Dekat Tunjungan Plaza', 'Fitness Center', 'Spa'],
    images: ['/surabaya-1.jpg'],
    availableRooms: 3,
  },
  {
    id: 6,
    name: 'Katamaran Hotel & Resort',
    location: 'Lombok',
    badge: 'Romantic Getaway',
    originalPrice: 3200000,
    features: ['Pantai Pribadi', 'Sunset View', 'Cocok Honeymoon'],
    images: ['/lombok-1.jpg'],
    availableRooms: 2,
  },
  {
    id: 7,
    name: 'Aryaduta Medan',
    location: 'Medan',
    badge: 'Strategis & Modern',
    originalPrice: 1800000,
    features: ['Kolam Renang', 'City View', 'Dekat Stasiun'],
    images: ['/medan-1.jpg'],
    availableRooms: 4,
  },
  {
    id: 8,
    name: 'Claro Makassar',
    location: 'Makassar',
    badge: 'Best in Makassar',
    originalPrice: 1900000,
    features: ['Sky Lounge', 'Dekat Pantai Losari', 'Ballroom'],
    images: ['/makassar-1.jpg'],
    availableRooms: 7,
  },
  {
    id: 9,
    name: 'Po Hotel Semarang',
    location: 'Semarang',
    badge: 'Mall Connected',
    originalPrice: 2000000,
    features: ['Dekat Paragon Mall', 'Infinity Pool', 'Kamar Luas'],
    images: ['/semarang-1.jpg'],
    availableRooms: 5,
  },
  {
    id: 10,
    name: 'Hotel Santika Premiere',
    location: 'Palembang',
    badge: 'Best Value',
    originalPrice: 1700000,
    features: ['Dekat Jembatan Ampera', 'Resto Lokal', 'Dekat Mall'],
    images: ['/palembang-1.jpg'],
    availableRooms: 3,
  },
];

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const destination = searchParams.get('destination') || 'Bandung';
  const guests = searchParams.get('guests');

  const filteredHotels = dummyHotels.filter(
    (hotel) => hotel.location.toLowerCase().includes(destination.toLowerCase())
  );

  return (
    <div className="px-4 md:px-16 py-8">
      <h1 className="text-2xl font-bold mb-6">
        Menampilkan hasil di {destination} untuk {guests} tamu
      </h1>

      {filteredHotels.map((hotel) => (
        <div
          key={hotel.id}
          className="border rounded-lg shadow-md p-4 flex flex-col md:flex-row gap-4 bg-white mb-6"
        >
          <div className="w-full md:w-1/3">
            <Image
              src={hotel.images[0]}
              alt={hotel.name}
              width={400}
              height={250}
              className="rounded-lg w-full object-cover"
            />
          </div>

          <div className="w-full md:w-2/3 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold">{hotel.name}</h2>
              <p className="text-gray-600">📍 {hotel.location}</p>
              <p className="mt-1 text-sm text-yellow-600 font-medium">
                {hotel.badge}
              </p>

              <div className="flex gap-2 mt-2 flex-wrap">
                {hotel.features.map((f, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-100 px-2 py-1 rounded text-sm"
                  >
                    {f}
                  </span>
                ))}
              </div>

              
              <div className="mt-1 text-sm text-blue-600 font-medium">
                🛏️ Sisa kamar: {hotel.availableRooms}
              </div>
              
            </div>

            <div className="flex items-center justify-between mt-4">
              <div>
                <p className="text-2xl font-bold text-orange-600">
                  Rp {hotel.originalPrice.toLocaleString('id-ID')}
                </p>
                <p className="text-sm text-gray-500">per malam</p>
              </div>
              <button className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600">
                Pilih Kamar
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
