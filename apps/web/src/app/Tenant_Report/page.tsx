'use client';

import SalesFilter from './components/SalesFilter';
import SalesTable from './components/SalesTable';
import RevenueSummary from './components/RevenueSummary';
import TenantSidebar from '../Tenant_Navbar/page';
import { useState, useMemo } from 'react';
import { salesReports } from '@/app/data/dummy-sales-report';
import { Divide } from 'lucide-react';

export default function TenantReportPage() {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-06-30'),
      key: 'selection',
    },
  ]);

  const filteredReports = useMemo(() => {
    const from = dateRange[0].startDate;
    const to = dateRange[0].endDate;
    return salesReports
      .filter((tx) => {
        const txDate = new Date(tx.createdAt);
        return txDate >= from && txDate <= to;
      })
      .sort((a, b) =>
        sortOrder === 'asc'
          ? a.totalPrice - b.totalPrice
          : b.totalPrice - a.totalPrice,
      );
  }, [sortOrder, dateRange]);

  const totalRevenue = filteredReports
    .filter((tx) => tx.paymentStatus === 'Paid')
    .reduce((acc, tx) => acc + tx.totalPrice, 0);

  return (
    <div className="flex">
      <TenantSidebar />
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Sales & Report</h1>

        {/* Flexbox layout dengan alignment stretch */}
        <div className="flex flex-col md:flex-row gap-6 items-stretch">
          <SalesFilter
            dateRange={dateRange}
            setDateRange={setDateRange}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />
          <RevenueSummary totalRevenue={totalRevenue} />
        </div>

        <SalesTable data={filteredReports} />
      </div>
    </div>
  );
}
