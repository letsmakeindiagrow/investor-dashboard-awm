import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Funds: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine active tab based on URL path
  const getActiveTabFromPath = () => {
    if (location.pathname.includes('/add')) {
      return 'add';
    } else if (location.pathname.includes('/withdraw')) {
      return 'withdraw';
    } else if (location.pathname.includes('/history')) {
      return 'history';
    }
    return 'available';
  };
  
  const [activeTab, setActiveTab] = useState<'available' | 'add' | 'withdraw' | 'history'>(getActiveTabFromPath());
  
  // Update active tab when URL changes
  useEffect(() => {
    setActiveTab(getActiveTabFromPath());
  }, [location.pathname]);
  
  // Handle tab change
  const handleTabChange = (tab: 'available' | 'add' | 'withdraw' | 'history') => {
    setActiveTab(tab);
    navigate(`/funds/${tab}`);
  };
  
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [addAmount, setAddAmount] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [comments, setComments] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Sample transaction history data
  const transactionHistory = [
    {
      id: 'TID1001',
      date: '2024-03-15 14:30:22',
      type: 'Deposit',
      amount: 10000,
      method: 'UPI',
      refNo: 'UPI123456',
      balance: 10000,
      remark: 'Fund added'
    },
    {
      id: 'TID1002',
      date: '2024-03-10 11:15:45',
      type: 'Withdrawal',
      amount: 5000,
      method: 'NEFT',
      refNo: 'NEFT789012',
      balance: 5000,
      remark: 'Fund withdrawn'
    },
    {
      id: 'TID1003',
      date: '2024-03-20 09:45:12',
      type: 'Deposit',
      amount: 25000,
      method: 'UPI',
      refNo: 'UPI654321',
      balance: 30000,
      remark: 'Fund added'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex border-b overflow-x-auto">
        {[
          { key: 'available', label: 'Funds Available' },
          { key: 'add', label: 'Add Funds' },
          { key: 'withdraw', label: 'Withdraw' },
          { key: 'history', label: 'Transaction History' }
        ].map(tab => (
          <button 
            key={tab.key}
            className={`px-4 py-2 whitespace-nowrap
              ${activeTab === tab.key 
                ? 'border-b-2' 
                : 'text-gray-500'}`}
            onClick={() => handleTabChange(tab.key as any)}
            style={{ 
              color: activeTab === tab.key 
                ? tab.key === 'add' || tab.key === 'history' 
                  ? '#AACF45' 
                  : '#08AFF1' 
                : '',
              borderColor: activeTab === tab.key 
                ? tab.key === 'add' || tab.key === 'history' 
                  ? '#AACF45' 
                  : '#08AFF1' 
                : ''
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Funds Available Tab */}
      {activeTab === 'available' && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2" style={{color: '#08AFF1'}}>Total Balance</h3>
            <p className="text-3xl font-bold" style={{color: '#08AFF1'}}>₹1,25,000</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2" style={{color: '#AACF45'}}>Withdrawable Balance</h3>
            <p className="text-3xl font-bold" style={{color: '#AACF45'}}>₹1,00,000</p>
          </div>
        </div>
      )}

      {/* Add Funds Tab */}
{activeTab === 'add' && (
  <div className="bg-white p-4 rounded-lg shadow-md">
    <h3 className="text-lg font-semibold mb-4" style={{color: '#AACF45'}}>Add Funds</h3>
    
    <div className="flex flex-col md:flex-row gap-6">
      {/* Left Column - Form */}
      <div className="flex-1 space-y-4">
        <div>
          <label className="block mb-2">Payment Method</label>
          <select 
            className="w-full p-2 border rounded"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="UPI">UPI</option>
            <option value="NEFT">NEFT (Account Details will be shared)</option>
          </select>
        </div>
        
        <div>
          <label className="block mb-2">Amount</label>
          <input 
            type="number" 
            placeholder="Enter amount" 
            className="w-full p-2 border rounded"
            value={addAmount}
            onChange={(e) => setAddAmount(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block mb-2">Ref. No. (Last 4 Digits of UPI/UTR/IMPS Ref. No.)</label>
          <input 
            type="text" 
            placeholder="Enter reference number" 
            className="w-full p-2 border rounded"
            value={referenceNumber}
            onChange={(e) => setReferenceNumber(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block mb-2">Comments (Optional)</label>
          <textarea 
            placeholder="Enter any comments" 
            className="w-full p-2 border rounded"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </div>
        
        <button 
          className="w-full py-2 rounded text-white"
          style={{backgroundColor: '#AACF45'}}
          disabled={!addAmount || !referenceNumber}
        >
          Add Funds
        </button>
      </div>
      
      {/* Right Column - QR Code */}
      <div className="flex-1 flex flex-col items-center justify-center border-l-0 md:border-l md:border-gray-200 md:pl-6">
        <div className="text-center mb-4">
          <h4 className="font-medium mb-1">Scan to Pay via UPI</h4>
          <p className="text-sm text-gray-600">Use any UPI app to scan this code</p>
        </div>
        
        {/* QR Code Placeholder */}
        <div className="bg-white-100 p-4 rounded-lg mb-3">
          <img 
            src="/cleaned_qr.png" 
            alt="UPI QR Code" 
            className="w-48 h-48 object-contain"
          />
        </div>
        
        <div className="text-center">
          <p className="font-medium mb-1">OR</p>
          <p className="text-sm text-gray-600">Send to UPI ID:</p>
          <p className="font-mono bg-gray-100 px-3 py-1 rounded-md mt-1">your.upi@id</p>
        </div>
      </div>
    </div>
  </div>
)}
      {/* Withdraw Tab */}
      {activeTab === 'withdraw' && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4" style={{color: '#08AFF1'}}>Withdraw Funds</h3>
          <div className="space-y-4">
            <div>
              <label className="block mb-2">Available Balance</label>
              <p className="text-2xl font-bold" style={{color: '#08AFF1'}}>₹1,25,000</p>
            </div>
            <div>
              <label className="block mb-2">Withdrawable Balance</label>
              <p className="text-2xl font-bold" style={{color: '#AACF45'}}>₹1,00,000</p>
            </div>
            <div>
              <label className="block mb-2">Withdraw Amount</label>
              <input 
                type="number" 
                placeholder="Enter amount to withdraw" 
                className="w-full p-2 border rounded"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                max={100000}
              />
            </div>
            <div>
              <label className="block mb-2">Withdraw To</label>
              <select className="w-full p-2 border rounded">
                <option>Linked Bank Account (XXXX1234)</option>
              </select>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-lg mb-2">How long does it take to process a withdrawal request?</h4>
              <p className="mb-2">Upon placing a withdrawal request with us, here's what you need to know:</p>
              <ol className="list-decimal pl-5 mb-2">
                <li className="mb-1">All withdrawal requests will be processed in the T+3 days.</li>
              </ol>
              <p className="font-semibold mb-1">Points to remember:</p>
              <ol className="list-decimal pl-5">
                <li>Withdrawal requests are not processed on weekends, trading holidays, and clearing/settlement holidays.</li>
              </ol>
            </div>
            <button 
              className="w-full py-2 rounded text-white"
              style={{backgroundColor: '#08AFF1'}}
              disabled={!withdrawAmount || Number(withdrawAmount) > 100000}
            >
              Proceed to Withdraw
            </button>
          </div>
        </div>
      )}

      {/* Transaction History Tab */}
      {activeTab === 'history' && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4" style={{color: '#AACF45'}}>Transaction History</h3>
          <div className="flex flex-wrap mb-4 gap-2">
            <div className="flex items-center">
              <input 
                type="radio" 
                id="all" 
                name="dateRange" 
                value="all"
                checked={dateRange === 'all'}
                onChange={() => setDateRange('all')}
                className="mr-2"
              />
              <label htmlFor="all">All</label>
            </div>
            <div className="flex items-center">
              <input 
                type="radio" 
                id="range" 
                name="dateRange" 
                value="range"
                checked={dateRange === 'range'}
                onChange={() => setDateRange('range')}
                className="mr-2"
              />
              <label htmlFor="range">Date Range</label>
            </div>
            {dateRange === 'range' && (
              <div className="flex flex-wrap gap-2">
                <input 
                  type="date" 
                  placeholder="From Date"
                  className="p-2 border rounded"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
                <input 
                  type="date" 
                  placeholder="To Date"
                  className="p-2 border rounded"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-2 px-3 border-b">Transaction ID</th>
                  <th className="py-2 px-3 border-b">Date and Timestamp</th>
                  <th className="py-2 px-3 border-b">Method</th>
                  <th className="py-2 px-3 border-b">Transaction Type</th>
                  <th className="py-2 px-3 border-b">Amount</th>
                  <th className="py-2 px-3 border-b">Ref. No. (UTR/UPI ID)</th>
                  <th className="py-2 px-3 border-b">Balance</th>
                  <th className="py-2 px-3 border-b">Remark</th>
                </tr>
              </thead>
              <tbody>
                {transactionHistory.map(transaction => (
                  <tr key={transaction.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-3">{transaction.id}</td>
                    <td className="py-2 px-3">{transaction.date}</td>
                    <td className="py-2 px-3">{transaction.method}</td>
                    <td className="py-2 px-3">{transaction.type}</td>
                    <td className="py-2 px-3" style={{color: transaction.type === 'Deposit' ? '#AACF45' : '#08AFF1'}}>
                      {transaction.type === 'Deposit' ? '+' : '-'}₹{transaction.amount.toLocaleString()}/-
                    </td>
                    <td className="py-2 px-3">{transaction.refNo}</td>
                    <td className="py-2 px-3">₹{transaction.balance.toLocaleString()}/-</td>
                    <td className="py-2 px-3">{transaction.remark}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Funds;