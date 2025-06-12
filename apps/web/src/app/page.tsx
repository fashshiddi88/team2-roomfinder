import Navbar from '@/components/molecules/navbar';
import HeroSection from '@/components/molecules/hero-section';
import SearchForm from '@/components/molecules/search-form';
import PropertyList from '@/components/molecules/property-list';
import Footer from '@/components/molecules/footer';

export default function PropertyRentLanding() {
  const cities = [
    'Jakarta',
    'Bali',
    'Yogyakarta',
    'Bandung',
    'Surabaya',
    'Medan',
    'Semarang',
    'Malang',
    'Solo',
    'Lombok',
  ];

  const propertyTypes = ['Rooms', 'Flats', 'Hostels', 'Villas'];

  const heroSlides = [
    {
      id: 1,
      title: 'Find Your Perfect Stay',
      subtitle: 'Discover amazing properties for your next adventure',
      image:
        'https://res.cloudinary.com/dohpngcuj/image/upload/v1746550733/20220921-hitc-banner_1__waifu2x_art_noise2_scale_1_ci6nnk.png',
    },
    {
      id: 2,
      title: 'Luxury Accommodations',
      subtitle: 'Experience comfort and elegance in every stay',
      image:
        'https://res.cloudinary.com/dohpngcuj/image/upload/v1746522352/Group_86_2__waifu2x_noise2_scale2x_1_hsjelh.png',
    },
    {
      id: 3,
      title: 'Best Deals Available',
      subtitle: 'Book now and save up to 30% on your next trip',
      image:
        'https://res.cloudinary.com/dohpngcuj/image/upload/v1746522080/image_4_zcg1gv.png',
    },
  ];

  const properties = [
    {
      id: 1,
      name: 'Well Furnished Apartment',
      location: 'Jakarta, Jakarta',
      price: 'Rp 500.000',
      rating: 4.8,
      image: '/placeholder.svg?height=200&width=300',
      type: 'Apartment',
    },
    {
      id: 2,
      name: 'Comfortable Family Flat',
      location: 'Bandung, Bandung',
      price: 'Rp 750.000',
      rating: 4.9,
      image: '/placeholder.svg?height=200&width=300',
      type: 'Flat',
    },
    {
      id: 3,
      name: 'Beach House Summer',
      location: 'Bali, Bali',
      price: 'Rp 1.200.000',
      rating: 4.7,
      image: '/placeholder.svg?height=200&width=300',
      type: 'Villa',
    },
    {
      id: 4,
      name: 'Deluxe Size Room',
      location: 'Yogyakarta, Yogyakarta',
      price: 'Rp 300.000',
      rating: 4.6,
      image: '/placeholder.svg?height=200&width=300',
      type: 'Room',
    },
    {
      id: 5,
      name: 'Modern Studio Apartment',
      location: 'Surabaya, Surabaya',
      price: 'Rp 450.000',
      rating: 4.8,
      image: '/placeholder.svg?height=200&width=300',
      type: 'Apartment',
    },
    {
      id: 6,
      name: 'Cozy Mountain Cabin',
      location: 'Malang, Malang',
      price: 'Rp 600.000',
      rating: 4.9,
      image: '/placeholder.svg?height=200&width=300',
      type: 'Villa',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <HeroSection slides={heroSlides} />
          <SearchForm cities={cities} propertyTypes={propertyTypes} />
          <PropertyList properties={properties} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
