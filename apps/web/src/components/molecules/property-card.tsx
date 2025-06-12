import Image from 'next/image';
import { MapPin, Star, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Property {
  id: number;
  name: string;
  location: string;
  price: string;
  rating: number;
  image: string;
  type: string;
}

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <Image
          src={property.image || '/placeholder.svg'}
          alt={property.name}
          width={300}
          height={200}
          className="w-full h-48 object-cover"
        />
        <button className="absolute top-4 right-4 p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all">
          <Heart className="h-5 w-5 text-gray-600 hover:text-red-500" />
        </button>
      </div>
      <CardContent>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {property.name}
        </h3>
        <p className="text-gray-600 mb-3 flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          {property.location}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm text-gray-600">
              {property.rating}
            </span>
          </div>
          <div className="text-lg font-bold text-blue-600">
            {property.price}
            <span className="text-sm text-gray-500 font-normal">/night</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
