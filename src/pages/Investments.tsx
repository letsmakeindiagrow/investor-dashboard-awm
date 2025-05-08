import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

interface InvestmentPlan {
  id: number;
  name: string;
  minInvestment: number;
  expectedReturn: string;
  investmentTerm: string;
  type: string;
  status: string;
}

interface Investment {
  id: number;
  investmentPlanId: number;
  investedAmount: number;
  investmentDate: string;
  investmentMode: string;
  withdrawalFrequency: string;
  maturityDate: string;
}

interface SubscribeInvestmentRequest {
  investmentPlanId: string;
  investedAmount: number;
  investmentMode: string;
  withdrawalFrequency: string;
}

interface SubscribeInvestmentResponse {
  message: string;
  investment: Investment;
}

const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/investor`;

const Investments: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialTab = location.pathname.includes("/make") ? "make" : "my";
  const [activeTab, setActiveTab] = useState<"make" | "my">(initialTab);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState<string>("");
  const [investmentMode, setInvestmentMode] = useState<"LUMPSUM" | "SIP">(
    "LUMPSUM"
  );
  const [showSipComingSoon, setShowSipComingSoon] = useState(false);
  const [withdrawalFrequency, setWithdrawalFrequency] =
    useState<string>("QUARTERLY");
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [subscribeError, setSubscribeError] = useState<string | null>(null);
  const [subscribeSuccess, setSubscribeSuccess] = useState<string | null>(null);

  // Add useEffect to handle SIP message timeout
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (showSipComingSoon) {
      timeoutId = setTimeout(() => {
        setShowSipComingSoon(false);
      }, 3000); // Hide after 3 seconds
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [showSipComingSoon]);

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
        const response = await axios.get(`${API_URL}/getInvestmentPlans`, {
          withCredentials: true,
        });
        console.log(response.data.investmentPlans);
        setInvestmentPlans(response.data.investmentPlans);
      } catch (err) {
        setError("Failed to fetch investment plans");
        console.error("Error fetching plans:", err);
      }
    };

    fetchPlans();
  }, []);

  // Fetch user investments
  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const response = await axios.get(`${API_URL}/getInvestments`, {
          withCredentials: true,
        });
        console.log(response.data.investments);
        setMyInvestments(response.data.investments);
      } catch (err) {
        setError("Failed to fetch investments");
        console.error("Error fetching investments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestments();
  }, []);

  // Success modal auto-dismiss
  useEffect(() => {
    if (subscribeSuccess) {
      const timer = setTimeout(() => {
        setSubscribeSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [subscribeSuccess]);

  const handleLumpsumSubmit = async () => {
    setSubscribeError(null);
    setSubscribeSuccess(null);

    if (!selectedPlan || !investmentAmount) {
      setSubscribeError("Please select a plan and enter an amount.");
      return;
    }

    const plan = investmentPlans.find((p) => p.id === selectedPlan);
    if (!plan) {
      setSubscribeError("Selected plan not found.");
      return;
    }

    if (plan.type === "SIP") {
      setSubscribeError("SIP investments are coming soon.");
      return;
    }

    if (plan.status !== "ACTIVE") {
      setSubscribeError("This investment plan is not active.");
      return;
    }

    const amount = Number(investmentAmount);
    if (amount < plan.minInvestment) {
      setSubscribeError(`Amount must be at least ₹${plan.minInvestment}.`);
      return;
    }

    const requestData: SubscribeInvestmentRequest = {
      investmentPlanId: String(selectedPlan),
      investedAmount: amount,
      investmentMode: "LUMPSUM",
      withdrawalFrequency: withdrawalFrequency,
    };

    console.log("Request Data:", requestData);

    setSubscribeLoading(true);
    try {
      const response = await axios.post<SubscribeInvestmentResponse>(
        `${API_URL}/subscribeInvestment`,
        requestData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.message) {
        setSubscribeSuccess(response.data.message);
        // Refresh investments list
        const updatedInvestments = await axios.get(
          `${API_URL}/getInvestments`,
          { withCredentials: true }
        );
        setMyInvestments(updatedInvestments.data.investments);
        // Reset form
        setInvestmentAmount("");
        setSelectedPlan(null);
      }
    } catch (error: any) {
      console.error("Error details:", error.response?.data);
      if (axios.isAxiosError(error) && error.response) {
        setSubscribeError(error.response.data.message || "An error occurred.");
      } else {
        setSubscribeError("An error occurred. Please try again.");
      }
    } finally {
      setSubscribeLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
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
            navigate("/dashboard/investments/make");
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
            navigate("/dashboard/investments/my");
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
                  ${
                    selectedPlan === plan.id
                      ? "border-2 border-blue-400"
                      : "hover:shadow-xl"
                  }`}
                onClick={() => setSelectedPlan(plan.id)}
                style={{
                  borderColor:
                    selectedPlan === plan.id ? "#08AFF1" : "transparent",
                  zIndex: selectedPlan === plan.id ? 1 : 0,
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
                  <p>Investment Period: {plan.investmentTerm}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Modal overlay for expanded card */}
          {selectedPlan && (
            <div
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50"
              onClick={() => setSelectedPlan(null)}
            >
              <div
                className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative"
                onClick={(e) => e.stopPropagation()}
              >
                {(() => {
                  const plan = investmentPlans.find(
                    (p) => p.id === selectedPlan
                  );
                  if (!plan) return null;
                  return (
                    <>
                      <h3
                        className="text-lg font-semibold mb-2"
                        style={{ color: "#08AFF1" }}
                      >
                        {plan.name}
                      </h3>
                      <div className="space-y-2 text-sm mb-4">
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
                        <p>Investment Period: {plan.investmentTerm}</p>
                      </div>
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
                                value="LUMPSUM"
                                checked={investmentMode === "LUMPSUM"}
                                onChange={() => {
                                  setInvestmentMode("LUMPSUM");
                                  setShowSipComingSoon(false);
                                }}
                                className="mr-2"
                              />
                              LUMPSUM
                            </label>
                            <label className="flex items-center text-gray-400 cursor-not-allowed">
                              <input
                                type="radio"
                                name="investmentMode"
                                value="SIP"
                                checked={false}
                                onChange={() => {
                                  setShowSipComingSoon(true);
                                }}
                                className="mr-2 cursor-not-allowed"
                              />
                              SIP
                            </label>
                          </div>
                          {showSipComingSoon && (
                            <div className="text-sm text-orange-500 mt-2">
                              SIP option is coming soon!
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm mb-1">
                            Withdrawal Frequency
                          </label>
                          <select
                            className="w-full p-2 border rounded"
                            value={withdrawalFrequency}
                            onChange={(e) =>
                              setWithdrawalFrequency(e.target.value)
                            }
                          >
                            <option value="QUARTERLY">Quarterly</option>
                            <option value="ANNUAL">Annual</option>
                            <option value="MATURITY">Maturity</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm mb-1">
                            Investment Amount
                          </label>
                          <input
                            type="number"
                            placeholder="Enter Investment Amount"
                            className="w-full p-2 border rounded"
                            min={plan.minInvestment}
                            value={investmentAmount}
                            onChange={(e) =>
                              setInvestmentAmount(e.target.value)
                            }
                          />
                        </div>

                        <button
                          className="w-full py-2 rounded text-white"
                          style={{ backgroundColor: "#08AFF1" }}
                          disabled={
                            !investmentAmount ||
                            Number(investmentAmount) < plan.minInvestment ||
                            subscribeLoading
                          }
                          onClick={handleLumpsumSubmit}
                        >
                          {subscribeLoading ? "Processing..." : "Invest Now"}
                        </button>
                        {subscribeError && selectedPlan === plan.id && (
                          <div className="text-red-500 mt-2">
                            {subscribeError}
                          </div>
                        )}
                        {subscribeSuccess && selectedPlan === plan.id && null}
                      </div>
                      <button
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                        onClick={() => setSelectedPlan(null)}
                        aria-label="Close"
                      >
                        &times;
                      </button>
                    </>
                  );
                })()}
              </div>
            </div>
          )}
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
                  <td className="py-2 px-3">{item.investmentPlanId}</td>
                  <td className="py-2 px-3">
                    ₹{item.investedAmount.toLocaleString()}
                  </td>
                  <td className="py-2 px-3">
                    {/* ₹{item.currentValue.toLocaleString()} */}
                  </td>
                  <td className="py-2 px-3">{item.investmentDate}</td>
                  <td className="py-2 px-3">{item.investmentMode}</td>
                  <td className="py-2 px-3">{item.maturityDate}</td>
                  <td className="py-2 px-3">{item.withdrawalFrequency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Success Modal Overlay */}
      {subscribeSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xs text-center relative">
            <div className="text-green-600 text-lg font-semibold mb-2">
              {subscribeSuccess}
            </div>
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setSubscribeSuccess(null)}
              aria-label="Close"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Investments;
