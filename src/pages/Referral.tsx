import React, { useState, useEffect } from 'react';
import { FiCopy, FiShare2 } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';

const Referral: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [copySuccess, setCopySuccess] = useState(false);
  
  // Determine active tab based on URL path
  const getActiveTabFromPath = () => {
    if (location.pathname.includes('/history')) {
      return 'history';
    }
    return 'overview';
  };
  
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>(getActiveTabFromPath());
  
  // Update active tab when URL changes
  useEffect(() => {
    setActiveTab(getActiveTabFromPath());
  }, [location.pathname]);
  
  const referralCode = 'INVEST2024';
  const referralLink = 'https://awm.com/ref/INVEST2024';

  // Handle tab change
  const handleTabChange = (tab: 'overview' | 'history') => {
    setActiveTab(tab);
    navigate(`/referral/${tab}`);
  };

  // Sample referral data
  const referralStats = {
    totalReferrals: 5,
    referralEarnings: 25000,
    pendingReferrals: 2,
    completedReferrals: 3
  };

  const referralHistory = [
    {
      name: 'John Doe',
      email: 'john.doe@example.com',
      date: '2024-03-15',
      status: 'Completed',
      earnings: 5000
    },
    {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      date: '2024-03-10',
      status: 'Pending',
      earnings: 0
    },
    {
      name: 'Robert Johnson',
      email: 'robert.j@example.com',
      date: '2024-03-05',
      status: 'Completed',
      earnings: 10000
    },
    {
      name: 'Emily Davis',
      email: 'emily.d@example.com',
      date: '2024-02-28',
      status: 'Completed',
      earnings: 10000
    },
    {
      name: 'Michael Wilson',
      email: 'michael.w@example.com',
      date: '2024-02-20',
      status: 'Pending',
      earnings: 0
    }
  ];

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex border-b overflow-x-auto">
        {[
          { key: 'overview', label: 'Referral Overview' },
          { key: 'history', label: 'Referral History' }
        ].map(tab => (
          <button 
            key={tab.key}
            className={`px-4 py-2 whitespace-nowrap
              ${activeTab === tab.key 
                ? 'border-b-2' 
                : 'text-gray-500'}`}
            onClick={() => handleTabChange(tab.key as any)}
            style={{ 
              color: activeTab === tab.key ? '#AACF45' : '',
              borderColor: activeTab === tab.key ? '#AACF45' : ''
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Referral Overview */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2" style={{color: '#AACF45'}}>Total Referrals</h3>
              <p className="text-3xl font-bold" style={{color: '#AACF45'}}>{referralStats.totalReferrals}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2" style={{color: '#08AFF1'}}>Referral Earnings</h3>
              <p className="text-3xl font-bold" style={{color: '#08AFF1'}}>₹{referralStats.referralEarnings.toLocaleString()}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2" style={{color: '#AACF45'}}>Completed Referrals</h3>
              <p className="text-3xl font-bold" style={{color: '#AACF45'}}>{referralStats.completedReferrals}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2" style={{color: '#08AFF1'}}>Pending Referrals</h3>
              <p className="text-3xl font-bold" style={{color: '#08AFF1'}}>{referralStats.pendingReferrals}</p>
            </div>
          </div>

          {/* Referral Code Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-6" style={{color: '#AACF45'}}>Your Referral Details</h3>
            
            <div className="space-y-6">
              {/* Referral Code */}
              <div>
                <h4 className="text-lg font-medium mb-2">Referral Code</h4>
                <div className="flex items-center space-x-4">
                  <div 
                    className="flex-1 p-3 border rounded bg-gray-50 flex justify-between items-center"
                  >
                    <span className="font-bold text-lg">{referralCode}</span>
                    <button 
                      onClick={copyReferralCode}
                      className="flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-100"
                      style={{color: '#08AFF1'}}
                    >
                      <FiCopy />
                      {copySuccess ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Referral Link */}
              <div>
                <h4 className="text-lg font-medium mb-2">Referral Link</h4>
                <div className="flex items-center space-x-4">
                  <div 
                    className="flex-1 p-3 border rounded bg-gray-50 flex justify-between items-center"
                  >
                    <span className="font-medium text-sm text-gray-700 truncate">{referralLink}</span>
                    <button 
                      onClick={copyReferralLink}
                      className="flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-100"
                      style={{color: '#08AFF1'}}
                    >
                      <FiCopy />
                      {copySuccess ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Share Button */}
              <div className="flex justify-center">
                <button 
                  className="flex items-center gap-2 px-6 py-3 rounded text-white"
                  style={{backgroundColor: '#AACF45'}}
                >
                  <FiShare2 />
                  Share with Friends
                </button>
              </div>
            </div>
            
            {/* Referral Info */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-lg mb-2">How Referrals Work</h4>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Share your unique referral code or link with friends</li>
                <li>When they sign up and make their first investment, you both earn rewards</li>
                <li>You earn 1% of their investment amount (up to ₹10,000 per referral)</li>
                <li>Your friend gets ₹500 bonus on their first investment</li>
              </ol>
            </div>
          </div>
        </>
      )}

      {activeTab === 'history' && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4" style={{color: '#AACF45'}}>Referral History</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-2 px-3 border-b">Name</th>
                  <th className="py-2 px-3 border-b">Email</th>
                  <th className="py-2 px-3 border-b">Date</th>
                  <th className="py-2 px-3 border-b">Status</th>
                  <th className="py-2 px-3 border-b">Earnings</th>
                </tr>
              </thead>
              <tbody>
                {referralHistory.map((referral, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-3">{referral.name}</td>
                    <td className="py-2 px-3">{referral.email}</td>
                    <td className="py-2 px-3">{referral.date}</td>
                    <td className="py-2 px-3">
                      <span className="px-2 py-1 rounded-full text-xs" style={{
                        backgroundColor: referral.status === 'Completed' ? 'rgba(170, 207, 69, 0.2)' : 'rgba(8, 175, 241, 0.2)',
                        color: referral.status === 'Completed' ? '#AACF45' : '#08AFF1'
                      }}>
                        {referral.status}
                      </span>
                    </td>
                    <td className="py-2 px-3" style={{color: referral.earnings > 0 ? '#AACF45' : ''}}>
                      {referral.earnings > 0 
                        ? `₹${referral.earnings.toLocaleString()}` 
                        : '-'}
                    </td>
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

export default Referral;