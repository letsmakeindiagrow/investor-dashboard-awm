import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import axios from "axios";

const Dashboard: React.FC = () => {
  const [totalCurrentValue, setTotalCurrentValue] = useState<number>(0);
  const [totalInvestedValue, setTotalInvestedValue] = useState<number>(0);
  const [totalInvestmentsCount, setTotalInvestmentsCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchInvestmentData = async () => {
      try {
        const [currentValueRes, investmentsRes, investmentsCountRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/v1/investor/totalCurrentValue`, {
            withCredentials: true
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/v1/investor/totalInvestment`, {
            withCredentials: true
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/v1/investor/totalInvestments`, {
            withCredentials: true
          })
        ]);

        setTotalCurrentValue(Number(currentValueRes.data?.totalCurrentValue || 0));
        setTotalInvestedValue(Number(investmentsRes.data?.totalInvestment?._sum?.investedAmount || 0));
        setTotalInvestmentsCount(investmentsCountRes.data?.totalInvestmentGain?._count || 0);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching investment data:', error);
        setTotalCurrentValue(0);
        setTotalInvestedValue(0);
        setTotalInvestmentsCount(0);
        setLoading(false);
      }
    };

    fetchInvestmentData();
  }, []);

  const profitLoss = totalCurrentValue - totalInvestedValue;

  // Sample investment data
  const investmentData = [
    { name: "Jan", invested: 50000, current: 52000 },
    { name: "Feb", invested: 50000, current: 53500 },
    { name: "Mar", invested: 50000, current: 55000 },
    { name: "Apr", invested: 50000, current: 56500 },
    { name: "May", invested: 50000, current: 58000 },
    { name: "Jun", invested: 50000, current: 60000 },
  ];

  return (
    <div className="space-y-6">
      {/* Investment Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-sm text-gray-500">Total Invested Value</h3>
          <p className="text-2xl font-bold text-black">
            {loading ? 'Loading...' : `₹${totalInvestedValue.toLocaleString()}`}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-sm text-gray-500">Total Current Value</h3>
          <p className="text-2xl font-bold text-black">
            {loading ? 'Loading...' : `₹${totalCurrentValue.toLocaleString()}`}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-sm text-gray-500">Profit & Loss</h3>
          <p className={`text-2xl font-bold ${profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {loading ? 'Loading...' : `₹${profitLoss.toLocaleString()}`}
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
            <AreaChart data={investmentData}>
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
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
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
              <ReferenceLine y={0} stroke="#e5e7eb" />
            </AreaChart>
          </ResponsiveContainer>

          <div className="flex justify-center mt-4 space-x-6">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-sm text-gray-600">Invested Value</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm text-gray-600">Current Value</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
