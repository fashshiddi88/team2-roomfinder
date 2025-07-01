'use client';

import React from 'react';

type Props = {
  effectivePrice: number;
  description: string;
};

export default function SidebarProperty({
  effectivePrice,
  description,
}: Props) {
  return (
    <aside className="p-6 border rounded-xl shadow-sm h-fit space-y-6">
      <div className="space-y-1">
        <p className="text-sm text-gray-500">Start From :</p>
        <p className="text-2xl font-bold text-orange-600 leading-tight">
          Rp {effectivePrice.toLocaleString('id-ID')}
          <span className="text-sm text-gray-500 ml-1 font-medium">/Night</span>
        </p>
      </div>

      <p className="text-gray-600">{description}</p>
    </aside>
  );
}
