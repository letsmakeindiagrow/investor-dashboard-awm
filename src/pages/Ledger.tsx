import React, { useState } from 'react';

const Ledger: React.FC = () => {
  const [dateRange, setDateRange] = useState<'all' | 'custom'>('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Sample ledger data
  const ledgerEntries = [
    {
      date: '2024-03-15 14:30:22',
      voucher: 'Bank Receipt',
      narration: 'Funds Addition via UPI',
      debit: 0,
      credit: 10000,
      balance: 10000
    },
    {
      date: '2024-03-10 11:15:45',
      voucher: 'Bank Payment',
      narration: 'Fund Withdrawal to Bank Account',
      debit: 5000,
      credit: 0,
      balance: 5000
    },
    {
      date: '2024-03-05 09:45:12',
      voucher: 'Journal Voucher',
      narration: 'TDS Expense',
      debit: 500,
      credit: 0,
      balance: 4500
    },
    {
      date: '2024-03-20 16:22:33',
      voucher: 'Bank Receipt',
      narration: 'Funds Addition via NEFT',
      debit: 0,
      credit: 25000,
      balance: 29500
    },
    {
      date: '2024-03-25 10:05:18',
      voucher: 'Book Voucher',
      narration: 'Profit from Equity Fund Investment',
      debit: 0,
      credit: 2500,
      balance: 32000
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4" style={{color: '#AACF45'}}>Ledger Entries</h2>
        
        {/* Date Range Selector */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <input 
              type="radio" 
              id="all" 
              name="dateRange" 
              checked={dateRange === 'all'}
              onChange={() => setDateRange('all')}
              className="text-blue-500"
            />
            <label htmlFor="all">All Entries</label>
          </div>
          <div className="flex items-center space-x-2">
            <input 
              type="radio" 
              id="custom" 
              name="dateRange" 
              checked={dateRange === 'custom'}
              onChange={() => setDateRange('custom')}
              className="text-blue-500"
            />
            <label htmlFor="custom">Date Range</label>
          </div>
          
          {dateRange === 'custom' && (
            <div className="flex flex-wrap gap-2">
              <input 
                type="date" 
                className="p-2 border rounded"
                placeholder="From Date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
              <input 
                type="date" 
                className="p-2 border rounded"
                placeholder="To Date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="py-2 px-3">Date (TimeStamp)</th>
                <th className="py-2 px-3">Voucher</th>
                <th className="py-2 px-3">Narration</th>
                <th className="py-2 px-3">Dr. Amt (Rs.)</th>
                <th className="py-2 px-3">Cr. Amt (Rs.)</th>
                <th className="py-2 px-3">Rn Balance (Rs.)</th>
              </tr>
            </thead>
            <tbody>
              {ledgerEntries.map((entry, index) => (
                <tr 
                  key={index} 
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="py-2 px-3">{entry.date}</td>
                  <td className="py-2 px-3">{entry.voucher}</td>
                  <td className="py-2 px-3">{entry.narration}</td>
                  <td className="py-2 px-3 text-blue-600">
                    {entry.debit > 0 ? `₹${entry.debit.toLocaleString()}` : '-'}
                  </td>
                  <td className="py-2 px-3 text-blue-600">
                    {entry.credit > 0 ? `₹${entry.credit.toLocaleString()}` : '-'}
                  </td>
                  <td className="py-2 px-3 font-semibold">₹{entry.balance.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Ledger;