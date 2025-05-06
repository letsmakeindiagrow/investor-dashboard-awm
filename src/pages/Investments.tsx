import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';

interface InvestmentPlan {
  id: number;
  name: string;
  minInvestment: number;
  expectedReturn: string;
  risk: string;
  period: string;
}

interface Investment {
  id: number;
  plan: string;
  investedValue: number;
  currentValue: number;
  date: string;
  mode: string;
  period: string;
  roi: number;
  pnl: number;
  withdrawal: string;
  maturity: string;
}

const Investments: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialTab = location.pathname.includes("/make") ? "make" : "my";
  const [activeTab, setActiveTab] = useState<"make" | "my">(initialTab);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState<string>("");
  const [investmentMode, setInvestmentMode] = useState<"Lumpsum" | "SIP">("Lumpsum");
  const [sipDate, setSipDate] = useState<string>("1");
  
  // New state for fetched data
  const [investmentPlans, setInvestmentPlans] = useState<InvestmentPlan[]>([]);
  const [myInvestments, setMyInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const currentTab = location.pathname.includes("/make") ? "make" : "my";
    setActiveTab(currentTab);
  }, [location.pathname]);

  // Fetch investment plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/v1/investor/plans', {
          withCredentials: true
        });
        setInvestmentPlans(response.data.plans);
      } catch (err) {
        setError('Failed to fetch investment plans');
        console.error('Error fetching plans:', err);
      }
    };

    fetchPlans();
  }, []);

  // Fetch user investments
  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/v1/investor/investments', {
          withCredentials: true
        });
        setMyInvestments(response.data.investments);
      } catch (err) {
        setError('Failed to fetch investments');
        console.error('Error fetching investments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestments();
  }, []);

  // Helper function to get ordinal suffix (1st, 2nd, 3rd, etc.)
  const getOrdinalSuffix = (day: number): string => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const handleSubmit = async () => {
    if (!selectedPlan || !investmentAmount) return;

    const plan = investmentPlans.find((p) => p.id === selectedPlan);
    if (!plan) return;

    const amount = Number(investmentAmount);
    if (amount < plan.minInvestment) return;

    const investmentData = {
      planId: selectedPlan,
      amount,
      mode: investmentMode,
      ...(investmentMode === "SIP" && { sipDate: parseInt(sipDate) }),
    };

    try {
      const response = await axios.post('http://localhost:5001/api/v1/investor/invest', investmentData, {
        withCredentials: true
      });
      
      if (response.data.success) {
        alert(`Investment ${investmentMode === "SIP" ? "SIP" : ""} submitted successfully!`);
        // Refresh investments list
        const updatedInvestments = await axios.get('http://localhost:5001/api/v1/investor/investments', {
          withCredentials: true
        });
        setMyInvestments(updatedInvestments.data.investments);
      }
    } catch (error) {
      console.error('Error submitting investment:', error);
      alert('Failed to submit investment. Please try again.');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex border-b">
        <button
          className={`px-4 py-2 ${
            activeTab === "make"
              ? "border-b-2 border-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => {
            setActiveTab("make");
            navigate("/investments/make");
          }}
          style={{ color: activeTab === "make" ? "#08AFF1" : "" }}
        >
          Make Investment
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "my" ? "border-b-2 border-green-500" : "text-gray-500"
          }`}
          onClick={() => {
            setActiveTab("my");
            navigate("/investments/my");
          }}
          style={{ color: activeTab === "my" ? "#AACF45" : "" }}
        >
          My Investments
        </button>
      </div>

      {/* Make Investment Tab */}
      {activeTab === "make" && (
        <div>
          <h2
            className="text-xl font-semibold mb-4"
            style={{ color: "#08AFF1" }}
          >
            Available Investment Plans
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {investmentPlans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white p-4 rounded-lg shadow-md cursor-pointer transition-all 
                  ${selectedPlan === plan.id ? "border-2" : "hover:shadow-xl"}`}
                onClick={() => setSelectedPlan(plan.id)}
                style={{
                  borderColor:
                    selectedPlan === plan.id ? "#08AFF1" : "transparent",
                }}
              >
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: "#08AFF1" }}
                >
                  {plan.name}
                </h3>
                <div className="space-y-2 text-sm">
                  <p>
                    Min. Investment:{" "}
                    <span style={{ color: "#AACF45" }}>
                      ₹{plan.minInvestment.toLocaleString()}
                    </span>
                  </p>
                  <p>
                    Expected Return:{" "}
                    <span style={{ color: "#AACF45" }}>
                      {plan.expectedReturn}
                    </span>
                  </p>
                  <p>Risk Level: {plan.risk}</p>
                  <p>Investment Period: {plan.period}</p>
                </div>
                {selectedPlan === plan.id && (
                  <div className="mt-4 space-y-3">
                    <div>
                      <label className="block text-sm mb-1">
                        Investment Mode
                      </label>
                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="investmentMode"
                            value="Lumpsum"
                            checked={investmentMode === "Lumpsum"}
                            onChange={() => setInvestmentMode("Lumpsum")}
                            className="mr-2"
                          />
                          Lumpsum
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="investmentMode"
                            value="SIP"
                            checked={investmentMode === "SIP"}
                            onChange={() => setInvestmentMode("SIP")}
                            className="mr-2"
                          />
                          SIP
                        </label>
                      </div>
                    </div>

                    {investmentMode === "SIP" && (
                      <div className="relative">
                        <label className="block text-sm mb-1">SIP Date</label>
                        <div className="flex items-center">
                          <select
                            className="w-full p-2 border rounded pr-8"
                            value={sipDate}
                            onChange={(e) => setSipDate(e.target.value)}
                          >
                            {Array.from({ length: 28 }, (_, i) => i + 1).map(
                              (day) => (
                                <option key={day} value={day.toString()}>
                                  {day}
                                </option>
                              )
                            )}
                            <option value="30">30</option>
                            <option value="31">31</option>
                          </select>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          SIP will be processed on {sipDate}
                          {getOrdinalSuffix(parseInt(sipDate))} of each month
                        </p>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm mb-1">
                        {investmentMode === "SIP"
                          ? "Monthly SIP Amount"
                          : "Investment Amount"}
                      </label>
                      <input
                        type="number"
                        placeholder={`Enter ${
                          investmentMode === "SIP"
                            ? "Monthly SIP"
                            : "Investment"
                        } Amount`}
                        className="w-full p-2 border rounded"
                        min={plan.minInvestment}
                        value={investmentAmount}
                        onChange={(e) => setInvestmentAmount(e.target.value)}
                      />
                    </div>

                    <button
                      className="w-full py-2 rounded text-white"
                      style={{ backgroundColor: "#08AFF1" }}
                      disabled={
                        !investmentAmount ||
                        Number(investmentAmount) < plan.minInvestment
                      }
                      onClick={handleSubmit}
                    >
                      {investmentMode === "SIP" ? "Start SIP" : "Invest Now"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My Investments Tab */}
      {activeTab === "my" && (
        <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
          <h2
            className="text-xl font-semibold mb-4"
            style={{ color: "#AACF45" }}
          >
            My Investments
          </h2>
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
                  <td className="py-2 px-3">
                    ₹{item.investedValue.toLocaleString()}
                  </td>
                  <td className="py-2 px-3">
                    ₹{item.currentValue.toLocaleString()}
                  </td>
                  <td className="py-2 px-3">{item.date}</td>
                  <td className="py-2 px-3">{item.mode}</td>
                  <td className="py-2 px-3">{item.period}</td>
                  <td className="py-2 px-3" style={{ color: "#08AFF1" }}>
                    {item.roi}%
                  </td>
                  <td className="py-2 px-3" style={{ color: "#AACF45" }}>
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

export default Investments;
