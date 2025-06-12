'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
import Image from 'next/image';

type Slide = {
  id: number;
  image: string;
  title: string;
  subtitle: string;
};

interface HeroSectionProps {
  slides: Slide[];
}

export default function HeroSection({ slides }: HeroSectionProps) {
  return (
    <section className="relative w-full h-[400px] rounded-xl overflow-hidden shadow-md">
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 3000 }}
        loop={true}
        slidesPerView={1}
        className="w-full h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="relative w-full h-full">
            <Image
              src={slide.image || '/placeholder.svg'}
              alt={slide.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 z-10" />
            <div className="absolute inset-0 flex items-center justify-center z-20 text-white text-center px-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-2xl">{slide.subtitle}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
