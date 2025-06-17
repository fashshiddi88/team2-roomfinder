// src/app/page.js
import Navbar from '@/components/navbar';
import HeroCarousel from '@/components/HeroCarousel';
import SearchForm from '@/components/SearchForm';
import PropertyCard from '@/components/PropertyCard';
import Footer from '@/components/Footer';

// Data dummy untuk demo
const featuredProperties = [
  {
    id: 1,
    name: 'Villa Serenity',
    location: 'Bali',
    price: 750000,
    image: '/villa.jpg',
    rating: 4.8,
  },
  {
    id: 2,
    name: 'Urban Loft',
    location: 'Jakarta',
    price: 450000,
    image: '/urban_loft.jpg',
    rating: 4.5,
  },
  {
    id: 3,
    name: 'Mountain Retreat',
    location: 'Bandung',
    price: 620000,
    image: '/mountain_retreat.jpg',
    rating: 4.9,
  },
  {
    id: 4,
    name: 'Beachside Bungalow',
    location: 'Lombok',
    price: 500000,
    image: '/bungalow.jpeg',
    rating: 4.7,
  },
  {
    id: 5,
    name: 'City Apartment',
    location: 'Surabaya',
    price: 400000,
    image: '/city_apartment.jpg',
    rating: 4.4,
  },
  {
    id: 6,
    name: 'Jungle Hideaway',
    location: 'Ubud',
    price: 680000,
    image: '/jungle_hideaway.jpg',
    rating: 4.9,
  },
  {
    id: 7,
    name: 'Modern Studio',
    location: 'Yogyakarta',
    price: 350000,
    image: '/modern_studio.jpg',
    rating: 4.3,
  },
  {
    id: 8,
    name: 'Countryside Villa',
    location: 'Malang',
    price: 570000,
    image: '/countryside_villa.jpeg',
    rating: 4.6,
  },
  {
    id: 9,
    name: 'Lakeview Cabin',
    location: 'Toba',
    price: 610000,
    image: '/lakeview_cabin.jpg',
    rating: 4.8,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroCarousel />

        {/* Search Section */}
        <section className="container mx-auto px-4 py-8 -mt-16 relative z-10">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
              Discover the Perfect Place to Stay
            </h2>
            <SearchForm />
          </div>
        </section>

        {/* Featured Properties */}
        <section className="container mx-auto px-4 py-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Recommended Stays
            </h2>
            <a href="#" className="text-blue-600 hover:underline font-medium">
              See All
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
