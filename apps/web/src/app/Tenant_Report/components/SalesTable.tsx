'use client';

import { format } from 'date-fns';

interface SalesReport {
  id: string;
  propertyName: string;
  roomType: string;
  tenantName: string;
  customerName: string;
  customerEmail?: string;
  checkIn: string;
  checkOut: string;
  totalNights: number;
  basePricePerNight: number;
  totalPrice: number;
  paymentStatus: 'Paid' | 'Waiting for Payment' | 'Canceled';
  createdAt: string;
}

export default function SalesTable({ data }: { data: SalesReport[] }) {
  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="min-w-full table-auto">
        <thead className="bg-blue-50 text-gray-700">
          <tr>
            <th className="p-3 text-left">No</th>
            <th className="p-3 text-left">Property</th>
            <th className="p-3 text-left">Room</th>
            <th className="p-3 text-left">Customer</th>
            <th className="p-3 text-left">Check In</th>
            <th className="p-3 text-left">Check Out</th>
            <th className="p-3 text-left">Total</th>
            <th className="p-3 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((tx, i) => (
            <tr
              key={tx.id}
              className="border-t hover:bg-gray-50 transition-colors"
            >
              <td className="p-3">{i + 1}</td>
              <td className="p-3">{tx.propertyName}</td>
              <td className="p-3">{tx.roomType}</td>
              <td className="p-3">
                <div className="font-medium text-gray-800">
                  {tx.customerName}
                </div>
                <div className="text-sm text-gray-500">{tx.customerEmail}</div>
              </td>
              <td className="p-3">
                {format(new Date(tx.checkIn), 'yyyy-MM-dd')}
              </td>
              <td className="p-3">
                {format(new Date(tx.checkOut), 'yyyy-MM-dd')}
              </td>
              <td className="p-3 font-semibold text-right">
                Rp {tx.totalPrice.toLocaleString('id-ID')}
              </td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 text-sm rounded-full ${
                    tx.paymentStatus === 'Paid'
                      ? 'bg-green-100 text-green-700'
                      : tx.paymentStatus === 'Canceled'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {tx.paymentStatus}
                </span>
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={8} className="p-6 text-center text-gray-500">
                No transactions found for selected date.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
