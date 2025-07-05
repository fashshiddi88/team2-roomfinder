'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slides = [
    {
      title: 'Find the Best Accommodation',
      subtitle: 'Compare prices and facilities with ease',
      image: '/hotel1.jpg',
      cta: 'Explore Now',
    },
    {
      title: 'Special Weekend Discounts',
      subtitle: 'Get the best prices for your vacation',
      image: '/diskon_hotel.jpeg',
      cta: 'See Promotions',
    },
    {
      title: 'Unforgettable Stay Experience',
      subtitle: 'Thousands of premium selected properties',
      image: '/sakura.jpg',
      cta: 'Find Properties',
    },
  ];

  useEffect(() => {
    if (isPaused) return; // skip interval if paused

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length, isPaused]);

  return (
    <div
      className="relative h-[500px] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide
              ? 'opacity-100'
              : 'opacity-0 pointer-events-none'
          }`}
          aria-hidden={index !== currentSlide}
        >
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <Image
            src={slide.image}
            alt={slide.title}
            layout="fill"
            objectFit="cover"
            className="w-full h-full"
          />

          <div className="absolute inset-0 flex items-center justify-center z-20 px-4">
            <div className="text-center max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {slide.title}
              </h1>
              <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
                {slide.subtitle}
              </p>
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors">
                {slide.cta}
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide ? 'bg-white' : 'bg-gray-300'
            }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentSlide}
          />
        ))}
      </div>
    </div>
  );
}
