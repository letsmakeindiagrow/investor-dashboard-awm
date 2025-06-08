import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface LedgerEntry {
  id: string;
  createdAt: string;
  voucherType: string;
  Narration: string | null;
  debitAmount: number | null;
  creditAmount: number | null;
  balance: number | null;
  details?: any;
}

const Ledger: React.FC = () => {
  const [dateRange, setDateRange] = useState<'all' | 'custom'>('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLedger();
  }, []);

  const fetchLedger = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/investor/ledger`, {
        withCredentials: true
      });
      setLedgerEntries(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch ledger entries");
      console.error("Error fetching ledger:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEntries = ledgerEntries.filter(entry => {
    if (dateRange === 'all') return true;
    
    const entryDate = new Date(entry.createdAt);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    if (from && to) {
      return entryDate >= from && entryDate <= to;
    } else if (from) {
      return entryDate >= from;
    } else if (to) {
      return entryDate <= to;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }

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
                <th className="py-2 px-3">Dr. Amt (Rs.)</th>
                <th className="py-2 px-3">Cr. Amt (Rs.)</th>
                <th className="py-2 px-3">Rn Balance (Rs.)</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((entry) => (
                <tr 
                  key={entry.id} 
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="py-2 px-3">{new Date(entry.createdAt).toLocaleString()}</td>
                  <td className="py-2 px-3">{entry.voucherType}</td>
                  <td className="py-2 px-3 text-blue-600">{entry.debitAmount ? `₹${entry.debitAmount.toLocaleString()}` : '-'}</td>
                  <td className="py-2 px-3 text-blue-600">{entry.creditAmount ? `₹${entry.creditAmount.toLocaleString()}` : '-'}</td>
                  <td className="py-2 px-3 font-semibold">{entry.balance ? `₹${entry.balance.toLocaleString()}` : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Ledger;