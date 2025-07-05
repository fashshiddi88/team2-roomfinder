'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import Link from 'next/link';

type TransactionStatus = 'success' | 'pending' | 'failed';

interface TransactionDetail {
  orderId: string;
  propertyName: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: TransactionStatus;
}

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');

  const [transaction, setTransaction] = useState<TransactionDetail | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    async function fetchTransaction() {
      try {
        // Ganti dengan API backend nyata
        const res = await fetch(`/api/transaction/${orderId}`);
        const data = await res.json();
        setTransaction(data);
      } catch (error: unknown) {
        setTransaction({
          orderId: orderId!,
          propertyName: 'Unknown',
          roomType: 'Unknown',
          checkIn: '-',
          checkOut: '-',
          totalPrice: 0,
          status: 'failed',
        });
        const err = error as AxiosError<{ detail?: string }>;
        toast.error(
          err.response?.data?.detail || 'Gagal memuat status transaksi',
        );
      } finally {
        setLoading(false);
      }
    }

    fetchTransaction();
  }, [orderId]);

  const getStatusUI = (status: TransactionStatus) => {
    switch (status) {
      case 'success':
        return (
          <div className="flex flex-col items-center gap-2 text-green-600">
            <CheckCircle className="w-16 h-16" />
            <h2 className="text-xl font-semibold">Pembayaran Berhasil</h2>
          </div>
        );
      case 'pending':
        return (
          <div className="flex flex-col items-center gap-2 text-yellow-600">
            <Clock className="w-16 h-16" />
            <h2 className="text-xl font-semibold">Menunggu Pembayaran</h2>
          </div>
        );
      case 'failed':
      default:
        return (
          <div className="flex flex-col items-center gap-2 text-red-600">
            <XCircle className="w-16 h-16" />
            <h2 className="text-xl font-semibold">Pembayaran Gagal</h2>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Memuat status transaksi...</p>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Transaksi tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white shadow-md rounded-xl p-8 space-y-6 text-gray-800">
        <div className="text-center">{getStatusUI(transaction.status)}</div>

        <div className="text-sm border-t pt-4 space-y-2">
          <p>
            <span className="font-medium">Order ID:</span> {transaction.orderId}
          </p>
          <p>
            <span className="font-medium">Properti:</span>{' '}
            {transaction.propertyName}
          </p>
          <p>
            <span className="font-medium">Tipe Kamar:</span>{' '}
            {transaction.roomType}
          </p>
          <p>
            <span className="font-medium">Check-in:</span> {transaction.checkIn}
          </p>
          <p>
            <span className="font-medium">Check-out:</span>{' '}
            {transaction.checkOut}
          </p>
          <p>
            <span className="font-medium">Total Harga:</span> Rp{' '}
            {transaction.totalPrice.toLocaleString('id-ID')}
          </p>
        </div>

        {transaction.status === 'success' && (
          <div className="p-4 bg-green-100 text-green-800 rounded-md text-sm">
            Terima kasih! Detail pemesanan telah dikirim ke email kamu. Silakan
            cek inbox atau folder spam.
          </div>
        )}

        {transaction.status === 'pending' && (
          <div className="p-4 bg-yellow-100 text-yellow-800 rounded-md text-sm">
            Mohon segera selesaikan pembayaran sebelum batas waktu yang
            ditentukan. Jika tidak, pesanan akan otomatis dibatalkan.
          </div>
        )}

        {transaction.status === 'failed' && (
          <div className="p-4 bg-red-100 text-red-800 rounded-md text-sm">
            Pembayaran gagal. Silakan coba kembali atau hubungi layanan bantuan.
          </div>
        )}

        <div className="flex justify-center gap-4 pt-6">
          <a
            href="/user/transactions"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded"
          >
            Lihat Transaksi Saya
          </a>
          <Link
            href="/"
            className="border border-gray-300 hover:bg-gray-100 text-gray-700 text-sm px-4 py-2 rounded"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
