import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

interface UserData {
  firstName: string;
  lastName: string;
}

const Dashboard: React.FC = () => {
  const [totalCurrentValue, setTotalCurrentValue] = useState<number>(0);
  const [totalInvestedValue, setTotalInvestedValue] = useState<number>(0);
  const [totalInvestmentsCount, setTotalInvestmentsCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [investmentHistory, setInvestmentHistory] = useState<any[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/investor/getUserInfo`, {
          withCredentials: true,
        });
        setUserData(response.data.user);
      } catch (error) {
        setUserData(null);
      }
    };
    fetchUserInfo();
  }, []);

  useEffect(() => {
    const fetchInvestmentData = async () => {
      try {
        const [currentValueRes, investmentsRes, investmentsCountRes, historyRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/v1/investor/totalCurrentValue`, {
            withCredentials: true
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/v1/investor/totalInvestment`, {
            withCredentials: true
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/v1/investor/totalInvestments`, {
            withCredentials: true
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/v1/investor/getInvestments`, {
            withCredentials: true
          })
        ]);

        setTotalCurrentValue(Number(currentValueRes.data?.totalCurrentValue || 0));
        setTotalInvestedValue(Number(investmentsRes.data?.totalInvestment?._sum?.investedAmount || 0));
        setTotalInvestmentsCount(investmentsCountRes.data?.totalInvestmentGain?._count || 0);
        
        // Process investment history for the graph
        const investments = historyRes.data?.investments || [];
        const historyData = investments.map((inv: any) => ({
          date: new Date(inv.investmentDate).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }),
          invested: inv.investedAmount,
          current: inv.investedAmount * (1 + (Number(inv.investmentPlan?.roiAAR || 0) / 100))
        }));
        setInvestmentHistory(historyData);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching investment data:', error);
        setTotalCurrentValue(0);
        setTotalInvestedValue(0);
        setTotalInvestmentsCount(0);
        setInvestmentHistory([]);
        setLoading(false);
      }
    };

    fetchInvestmentData();
  }, []);

  const profitLoss = totalCurrentValue - totalInvestedValue;

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-semibold mb-1">{label}</p>
          <p className="text-sm" style={{ color: "#08AFF1" }}>
            Invested: ₹{payload[0].value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-sm" style={{ color: "#AACF45" }}>
            Current: ₹{payload[1].value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* User Welcome */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          {userData ? `Welcome, ${userData.firstName} ${userData.lastName}` : 'Welcome'}
        </h2>
      </div>

      {/* Investment Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-sm text-gray-500">Total Invested Value</h3>
          <p className="text-2xl font-bold text-black">
            {loading ? 'Loading...' : `₹${totalInvestedValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-sm text-gray-500">Total Current Value</h3>
          <p className="text-2xl font-bold text-black">
            {loading ? 'Loading...' : `₹${totalCurrentValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-sm text-gray-500">Profit & Loss</h3>
          <p className={`text-2xl font-bold ${profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {loading ? 'Loading...' : `₹${profitLoss.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-sm text-gray-500">No. of Investments</h3>
          <p className="text-2xl font-bold text-black">
            {loading ? 'Loading...' : totalInvestmentsCount}
          </p>
        </div>
      </div>

      {/* Investment Value Graph */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Investment Value Trend</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={investmentHistory}>
              <defs>
                <linearGradient id="investedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#08AFF1" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#08AFF1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="currentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#AACF45" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#AACF45" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="invested"
                stroke="#08AFF1"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#investedGradient)"
                activeDot={{
                  r: 6,
                  strokeWidth: 2,
                  fill: "#fff",
                  stroke: "#08AFF1",
                }}
              />
              <Area
                type="monotone"
                dataKey="current"
                stroke="#AACF45"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#currentGradient)"
                activeDot={{
                  r: 6,
                  strokeWidth: 2,
                  fill: "#fff",
                  stroke: "#AACF45",
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
