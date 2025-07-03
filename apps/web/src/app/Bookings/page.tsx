'use client';

import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

export default function BookingPage() {
  const searchParams = useSearchParams();
  const propertyName = searchParams.get('propertyName');
  const roomType = searchParams.get('roomType');
  const price = searchParams.get('price');

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md flex flex-col md:flex-row overflow-hidden">
        {/* Kiri - Form Pemesanan */}
        <div className="w-full md:w-2/3 p-6 md:p-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Pemesanan</h2>
          <p className="text-gray-600 text-sm mb-5">
            Pastikan kamu mengisi semua informasi di halaman ini benar sebelum melanjutkan ke pembayaran.
          </p>

          <div>
            <h3 className="text-lg font-semibold mb-2">Data Pemesan (untuk E-voucher)</h3>
            <p className="text-sm text-gray-500 mb-4">
              Isi semua kolom dengan benar untuk memastikan kamu dapat menerima voucher konfirmasi pemesanan di email yang dicantumkan.
            </p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  placeholder="Contoh: John Maeda"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="Contoh: email@example.com"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">E-voucher akan dikirim ke email ini.</p>
              </div>

              <div className="pt-4">
                <button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium transition">
                  Lanjut Pembayaran
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Kanan - Detail Properti */}
        <div className="w-full md:w-1/3 bg-gray-50 border-t md:border-t-0 md:border-l border-gray-200 p-5">
          <div className="border rounded-lg overflow-hidden shadow-sm bg-white">
            <Image
              src="/the-gaia.jpg"
              alt="Gambar properti"
              width={400}
              height={200}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h4 className="font-semibold text-lg mb-1 text-gray-800">{propertyName}</h4>

              <div className="flex justify-between text-sm text-gray-600 mb-3">
                <div>
                  <p className="text-gray-500">Check-in</p>
                  <p className="font-medium">Sab, 12 Jul 2025</p>
                </div>
                <div>
                  <p className="text-gray-500">Check-out</p>
                  <p className="font-medium">Min, 13 Jul 2025</p>
                </div>
              </div>

              <div className="text-sm mb-2 text-gray-700">
                (1x) {roomType}
              </div>

              <ul className="text-sm text-gray-600 list-disc pl-5 mb-4">
                <li>2 Tamu</li>
                <li>1 ranjang twin</li>
                <li>Termasuk sarapan</li>
              </ul>

              <div className="border-t pt-3 text-sm font-semibold text-gray-700">
                Total Harga Kamar:{' '}
                <span className="text-blue-600">
                  Rp {Number(price).toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
