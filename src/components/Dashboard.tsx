import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface DashboardProps {
  view?: "overview" | "details";
}

const Dashboard: React.FC<DashboardProps> = ({ view = "overview" }) => {
  const navigate = useNavigate();
  const [totalCurrentValue, setTotalCurrentValue] = useState<number>(0);
  const [totalInvestedValue, setTotalInvestedValue] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchInvestmentData = async () => {
      try {
        const [currentValueRes, investmentsRes] = await Promise.all([
          axios.get('/api/investments/totalCurrentValue'),
          axios.get('/api/investments/totalInvestment')
        ]);

        setTotalCurrentValue(Number(currentValueRes.data?.totalCurrentValue || 0));
        setTotalInvestedValue(Number(investmentsRes.data?.totalInvestment?._sum?.investedAmount || 0));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching investment data:', error);
        setTotalCurrentValue(0);
        setTotalInvestedValue(0);
        setLoading(false);
      }
    };

    fetchInvestmentData();
  }, []);

  const profitLoss = totalCurrentValue - totalInvestedValue;

  const handleTabChange = (newView: "overview" | "details") => {
    if (newView === "overview") {
      navigate("/dashboard");
    } else {
      navigate("/details");
    }
  };

  // Sample investment data
  const investmentData = [
    { name: "Jan", invested: 50000, current: 52000 },
    { name: "Feb", invested: 50000, current: 53500 },
    { name: "Mar", invested: 50000, current: 55000 },
    { name: "Apr", invested: 50000, current: 56500 },
    { name: "May", invested: 50000, current: 58000 },
    { name: "Jun", invested: 50000, current: 60000 },
  ];

  // Sample investment details data
  const investmentDetails = [
    {
      id: 1,
      plan: "Equity Growth Fund",
      investedValue: 50000,
      currentValue: 55000,
      date: "2024-01-15",
      mode: "Lumpsum",
      period: "3 years",
      roi: 10,
      pnl: 5000,
      withdrawal: "Quarterly",
      maturity: "2027-01-15",
    },
    {
      id: 2,
      plan: "Balanced Fund",
      investedValue: 75000,
      currentValue: 78750,
      date: "2024-02-01",
      mode: "SIP",
      period: "5 years",
      roi: 5,
      pnl: 3750,
      withdrawal: "Annual",
      maturity: "2029-02-01",
    },
    {
      id: 3,
      plan: "Debt Fund",
      investedValue: 100000,
      currentValue: 106000,
      date: "2024-02-15",
      mode: "Lumpsum",
      period: "2 years",
      roi: 6,
      pnl: 6000,
      withdrawal: "Maturity",
      maturity: "2026-02-15",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex border-b">
        <button
          className={`px-4 py-2 ${
            view === "overview"
              ? "border-b-2 text-blue-500 border-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => handleTabChange("overview")}
          style={{ color: view === "overview" ? "#08AFF1" : "" }}
        >
          My Portfolio
        </button>
        <button
          className={`px-4 py-2 ${
            view === "details"
              ? "border-b-2 text-green-500 border-green-500"
              : "text-gray-500"
          }`}
          onClick={() => handleTabChange("details")}
          style={{ color: view === "details" ? "#AACF45" : "" }}
        >
          Investment Details
        </button>
      </div>

      {/* My Investment Overview Tab */}
      {view === "overview" && (
        <>
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
                {loading ? 'Loading...' : totalInvestedValue}
              </p>
            </div>
          </div>

          {/* Investment Value Graph */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2
                className="text-xl font-semibold"
                style={{ color: "#08AFF1" }}
              >
                Investment Performance
              </h2>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-full">
                  1M
                </button>
                <button className="px-3 py-1 text-xs bg-green-100 text-green-600 rounded-full">
                  1Y
                </button>
                <button className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                  All
                </button>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={350}>
              <AreaChart
                data={investmentData}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <defs>
                  <linearGradient
                    id="investedGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#08AFF1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#08AFF1" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient
                    id="currentGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#AACF45" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#AACF45" stopOpacity={0.1} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  tickMargin={10}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  tickFormatter={(value) => `₹${value.toLocaleString()}`}
                />

                <Tooltip
                  contentStyle={{
                    background: "rgba(255, 255, 255, 0.96)",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.5rem",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    padding: "12px",
                  }}
                  formatter={(value, name) => [
                    `₹${Number(value).toLocaleString()}`,
                    name === "invested" ? "Invested Value" : "Current Value",
                  ]}
                  labelFormatter={(label) => `Period: ${label}`}
                />

                <Legend
                  verticalAlign="top"
                  height={36}
                  iconType="circle"
                  iconSize={10}
                  wrapperStyle={{
                    paddingBottom: "20px",
                  }}
                  formatter={(value) => (
                    <span className="text-sm text-gray-600">
                      {value === "invested"
                        ? "Invested Value"
                        : "Current Value"}
                    </span>
                  )}
                />

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
        </>
      )}

      {/* Investment Details Tab */}
      {view === "details" && (
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
                  <td className="py-2 px-3">
                    ₹{item.investedValue.toLocaleString()}
                  </td>
                  <td className="py-2 px-3">
                    ₹{item.currentValue.toLocaleString()}
                  </td>
                  <td className="py-2 px-3">{item.date}</td>
                  <td className="py-2 px-3">{item.mode}</td>
                  <td className="py-2 px-3">{item.period}</td>
                  <td className="py-2 px-3 text-black">{item.roi}%</td>
                  <td
                    className={`py-2 px-3 ${
                      item.pnl > 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    ₹{item.pnl.toLocaleString()}
                  </td>
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
};

export default Dashboard;
