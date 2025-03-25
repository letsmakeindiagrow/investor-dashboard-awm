import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Sample investment plans data
const investmentPlans = [
  { 
    id: 1, 
    name: 'Equity Growth Fund', 
    minInvestment: 5000, 
    expectedReturn: '12-15%', 
    risk: 'High',
    period: '3-5 years'
  },
  { 
    id: 2, 
    name: 'Balanced Mutual Fund', 
    minInvestment: 3000, 
    expectedReturn: '8-10%', 
    risk: 'Medium',
    period: '2-4 years'
  },
  { 
    id: 3, 
    name: 'Debt Fund', 
    minInvestment: 1000, 
    expectedReturn: '6-8%', 
    risk: 'Low',
    period: '1-3 years'
  }
];

// Sample my investments data
const myInvestments = [
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

const Investments: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialTab = location.pathname.includes('/make') ? 'make' : 'my';
  const [activeTab, setActiveTab] = useState<'make' | 'my'>(initialTab);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState<string>('');
  const [investmentMode, setInvestmentMode] = useState<'Lumpsum' | 'SIP'>('Lumpsum');

  useEffect(() => {
    const currentTab = location.pathname.includes('/make') ? 'make' : 'my';
    setActiveTab(currentTab);
  }, [location.pathname]);

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex border-b">
        <button 
          className={`px-4 py-2 ${activeTab === 'make' ? 'border-b-2 border-blue-500' : 'text-gray-500'}`}
          onClick={() => {
            setActiveTab('make');
            navigate('/investments/make');
          }}
          style={{ color: activeTab === 'make' ? '#08AFF1' : '' }}
        >
          Make Investment
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'my' ? 'border-b-2 border-green-500' : 'text-gray-500'}`}
          onClick={() => {
            setActiveTab('my');
            navigate('/investments/my');
          }}
          style={{ color: activeTab === 'my' ? '#AACF45' : '' }}
        >
          My Investments
        </button>
      </div>

      {/* Make Investment Tab */}
      {activeTab === 'make' && (
        <div>
          <h2 className="text-xl font-semibold mb-4" style={{color: '#08AFF1'}}>Available Investment Plans</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {investmentPlans.map(plan => (
              <div 
                key={plan.id} 
                className={`bg-white p-4 rounded-lg shadow-md cursor-pointer transition-all 
                  ${selectedPlan === plan.id ? 'border-2' : 'hover:shadow-xl'}`}
                onClick={() => setSelectedPlan(plan.id)}
                style={{borderColor: selectedPlan === plan.id ? '#08AFF1' : 'transparent'}}
              >
                <h3 className="text-lg font-semibold mb-2" style={{color: '#08AFF1'}}>{plan.name}</h3>
                <div className="space-y-2 text-sm">
                  <p>Min. Investment: <span style={{color: '#AACF45'}}>₹{plan.minInvestment.toLocaleString()}</span></p>
                  <p>Expected Return: <span style={{color: '#AACF45'}}>{plan.expectedReturn}</span></p>
                  <p>Risk Level: {plan.risk}</p>
                  <p>Investment Period: {plan.period}</p>
                </div>
                {selectedPlan === plan.id && (
                  <div className="mt-4 space-y-3">
                    <div>
                      <label className="block text-sm mb-1">Investment Mode</label>
                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="investmentMode" 
                            value="Lumpsum" 
                            checked={investmentMode === 'Lumpsum'}
                            onChange={() => setInvestmentMode('Lumpsum')}
                            className="mr-2"
                          />
                          Lumpsum
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="investmentMode" 
                            value="SIP" 
                            checked={investmentMode === 'SIP'}
                            onChange={() => setInvestmentMode('SIP')}
                            className="mr-2"
                          />
                          SIP
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Investment Amount</label>
                      <input 
                        type="number" 
                        placeholder="Enter Investment Amount" 
                        className="w-full p-2 border rounded"
                        min={plan.minInvestment}
                        value={investmentAmount}
                        onChange={(e) => setInvestmentAmount(e.target.value)}
                      />
                    </div>
                    <button 
                      className="w-full py-2 rounded text-white"
                      style={{backgroundColor: '#08AFF1'}}
                      disabled={!investmentAmount || Number(investmentAmount) < plan.minInvestment}
                    >
                      Invest Now
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My Investments Tab */}
      {activeTab === 'my' && (
        <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4" style={{color: '#AACF45'}}>My Investments</h2>
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
              {myInvestments.map((item, index) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-3">{index + 1}</td>
                  <td className="py-2 px-3">{item.plan}</td>
                  <td className="py-2 px-3">₹{item.investedValue.toLocaleString()}</td>
                  <td className="py-2 px-3">₹{item.currentValue.toLocaleString()}</td>
                  <td className="py-2 px-3">{item.date}</td>
                  <td className="py-2 px-3">{item.mode}</td>
                  <td className="py-2 px-3">{item.period}</td>
                  <td className="py-2 px-3" style={{color: '#08AFF1'}}>{item.roi}%</td>
                  <td className="py-2 px-3" style={{color: '#AACF45'}}>₹{item.pnl.toLocaleString()}</td>
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

export default Investments;