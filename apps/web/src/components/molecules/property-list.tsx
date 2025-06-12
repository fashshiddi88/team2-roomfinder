import { Button } from "@/components/ui/button";
import PropertyCard from "./property-card";

interface Property {
  id: number;
  name: string;
  location: string;
  price: string;
  rating: number;
  image: string;
  type: string;
}

interface PropertyListProps {
  properties: Property[];
}

export default function PropertyList({ properties }: PropertyListProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Property List
          </h2>
          <div className="w-16 h-1 bg-blue-600"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" className="px-8 py-3">
            View All Properties
          </Button>
        </div>
      </div>
    </section>
  );
}
