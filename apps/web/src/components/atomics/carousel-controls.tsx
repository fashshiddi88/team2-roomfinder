'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselControlsProps {
  onPrev: () => void;
  onNext: () => void;
}

export default function CarouselControls({
  onPrev,
  onNext,
}: CarouselControlsProps) {
  return (
    <>
      <button
        onClick={onPrev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={onNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </>
  );
}
