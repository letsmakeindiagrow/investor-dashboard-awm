import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'details'>('overview');

  // Sample investment data
  const investmentData = [
    { name: 'Jan', invested: 50000, current: 52000 },
    { name: 'Feb', invested: 50000, current: 53500 },
    { name: 'Mar', invested: 50000, current: 55000 },
    { name: 'Apr', invested: 50000, current: 56500 },
    { name: 'May', invested: 50000, current: 58000 },
    { name: 'Jun', invested: 50000, current: 60000 }
  ];

  // Sample investment details data
  const investmentDetails = [
    {
      id: 1,
      plan: 'Equity Growth Fund',
      investedValue: 50000,
      currentValue: 55000,
      date: '2024-01-15',
      mode: 'Lumpsum',
      period: '3 years',
      roi: 10,
      pnl: 5000,
      withdrawal: 'Quarterly',
      maturity: '2027-01-15'
    },
    {
      id: 2,
      plan: 'Balanced Fund',
      investedValue: 75000,
      currentValue: 78750,
      date: '2024-02-01',
      mode: 'SIP',
      period: '5 years',
      roi: 5,
      pnl: 3750,
      withdrawal: 'Annual',
      maturity: '2029-02-01'
    },
    {
      id: 3,
      plan: 'Debt Fund',
      investedValue: 100000,
      currentValue: 106000,
      date: '2024-02-15',
      mode: 'Lumpsum',
      period: '2 years',
      roi: 6,
      pnl: 6000,
      withdrawal: 'Maturity',
      maturity: '2026-02-15'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex border-b">
        <button 
          className={`px-4 py-2 ${activeTab === 'overview' ? 'border-b-2 text-blue-500 border-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('overview')}
          style={{ color: activeTab === 'overview' ? '#08AFF1' : '' }}
        >
          My Investment
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'details' ? 'border-b-2 text-green-500 border-green-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('details')}
          style={{ color: activeTab === 'details' ? '#AACF45' : '' }}
        >
          Investment Details
        </button>
      </div>

      {/* My Investment Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* Investment Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-sm text-gray-500">Total Invested Value</h3>
              <p className="text-2xl font-bold text-black">₹225,000</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-sm text-gray-500">Total Current Value</h3>
              <p className="text-2xl font-bold text-black">₹239,750</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-sm text-gray-500">Profit & Loss</h3>
              <p className={`text-2xl font-bold ${investmentData.reduce((acc, curr) => acc + curr.current, 0) - investmentData.reduce((acc, curr) => acc + curr.invested, 0) > 0 ? 'text-green-500' : 'text-red-500'}`}>₹{investmentData.reduce((acc, curr) => acc + curr.current, 0) - investmentData.reduce((acc, curr) => acc + curr.invested, 0)}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-sm text-gray-500">No. of Investments</h3>
              <p className="text-2xl font-bold text-black">3</p>
            </div>
          </div>

          {/* Investment Value Graph */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Investment Performance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={investmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="invested" stroke="#08AFF1" activeDot={{ r: 8 }} name="Invested Value" />
                <Line type="monotone" dataKey="current" stroke="#AACF45" name="Current Value" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* Investment Details Tab */}
      {activeTab === 'details' && (
        <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
          <h2 className="text-lg font-semibold mb-4">Investment Details</h2>
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-2 px-3 border-b">No.</th>
                <th className="py-2 px-3 border-b">Investment Plan</th>
                <th className="py-2 px-3 border-b">Invested Value</th>
                <th className="py-2 px-3 border-b">Current Value</th>
                <th className="py-2 px-3 border-b">Date of Investment</th>
                <th className="py-2 px-3 border-b">Investment Mode</th>
                <th className="py-2 px-3 border-b">Investment Period</th>
                <th className="py-2 px-3 border-b">RoI(%)</th>
                <th className="py-2 px-3 border-b">PnL(Rs.)</th>
                <th className="py-2 px-3 border-b">Withdrawal Plan</th>
                <th className="py-2 px-3 border-b">Date of Maturity</th>
              </tr>
            </thead>
            <tbody>
              {investmentDetails.map((item, index) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-3">{index + 1}</td>
                  <td className="py-2 px-3">{item.plan}</td>
                  <td className="py-2 px-3">₹{item.investedValue.toLocaleString()}</td>
                  <td className="py-2 px-3">₹{item.currentValue.toLocaleString()}</td>
                  <td className="py-2 px-3">{item.date}</td>
                  <td className="py-2 px-3">{item.mode}</td>
                  <td className="py-2 px-3">{item.period}</td>
                  <td className="py-2 px-3 text-black">{item.roi}%</td>
                  <td className={`py-2 px-3 ${item.pnl > 0 ? 'text-green-500' : 'text-red-500'}`}>₹{item.pnl.toLocaleString()}</td>
                  <td className="py-2 px-3">{item.withdrawal}</td>
                  <td className="py-2 px-3">{item.maturity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Dashboard;