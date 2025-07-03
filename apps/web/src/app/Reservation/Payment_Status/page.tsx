'use client';

import { useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

export default function PaymentStatusPage() {
  const searchParams = useSearchParams();
  const status = searchParams.get('transaction_status');

  const renderContent = () => {
    switch (status) {
      case 'success':
        return {
          icon: <CheckCircle className="text-green-500 w-20 h-20" />,
          title: 'Pembayaran Berhasil!',
          desc: 'Terima kasih, pembayaran kamu berhasil diproses. E-voucher akan segera dikirim ke email kamu.',
        };
      case 'pending':
        return {
          icon: <Clock className="text-yellow-500 w-20 h-20" />,
          title: 'Menunggu Pembayaran',
          desc: 'Kami belum menerima pembayaranmu. Silakan selesaikan pembayaran secepatnya sebelum batas waktu berakhir.',
        };
      case 'failed':
      default:
        return {
          icon: <XCircle className="text-red-500 w-20 h-20" />,
          title: 'Pembayaran Gagal',
          desc: 'Mohon maaf, pembayaran kamu gagal. Silakan coba kembali atau gunakan metode pembayaran lain.',
        };
    }
  };

  const { icon, title, desc } = renderContent();

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white rounded-xl shadow-md p-10 max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">{icon}</div>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        <p className="text-gray-600">{desc}</p>

        <a
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Kembali ke Beranda
        </a>
      </div>
    </main>
  );
}
