'use client';

import React from 'react';
import Image from 'next/image';

type Review = {
  id: number;
  name: string;
  photo?: string;
  rating: number;
  comment: string;
};

type Props = {
  reviews: Review[];
};

export default function Reviews({ reviews }: Props) {
  if (reviews.length === 0) {
    return (
      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Reviews</h2>
        <p className="text-gray-500">No reviews yet.</p>
      </section>
    );
  }

  return (
    <section className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Reviews</h2>
      <div className="space-y-4">
        {reviews.map((r) => (
          <div key={r.id} className="border p-4 rounded-lg shadow-sm">
            <div className="flex items-center space-x-4 mb-2">
              {r.photo && (
                <Image
                  src={r.photo || '/default-avatar.jpg'}
                  alt={r.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
              <div>
                <p className="font-semibold">{r.name}</p>
                <p className="text-yellow-500">
                  {'★'.repeat(r.rating)}
                  {'☆'.repeat(5 - r.rating)}
                </p>
              </div>
            </div>
            <p className="text-gray-700">{r.comment}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
