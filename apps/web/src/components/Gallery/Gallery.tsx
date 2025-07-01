'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

type Props = {
  property: {
    name: string;
    image: string;
    propertyImages: string[];
  };
};

export default function GallerySection({ property }: Props) {
  const [mainImage, setMainImage] = useState(property.image);

  useEffect(() => {
    if (property.propertyImages.length > 0) {
      setMainImage(property.propertyImages[0]);
    } else {
      setMainImage(property.image);
    }
  }, [property]);

  return (
    <div className="space-y-2">
      <div className="relative w-full h-72 md:h-96 rounded-xl overflow-hidden">
        <Image
          src={mainImage}
          alt={property.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="grid grid-cols-4 gap-2">
        {property.propertyImages.map((img, i) => (
          <div
            key={i}
            onClick={() => setMainImage(img)}
            className="relative h-20 cursor-pointer rounded-lg overflow-hidden border"
          >
            <Image src={img} alt={`img-${i}`} fill className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
