import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import BigNumber from "bignumber.js";
import Decimal from 'decimal.js';

interface InvestmentPlan {
  id: string;
  name: string;
  type: "SIP" | "LUMPSUM";
  minInvestment: number;
  expectedReturn: string;
  investmentTerm: number;
  roiAAR: string;
  status: "ACTIVE" | "INACTIVE";
}

interface Investment {
  id: string;
  investedAmount: number;
  investmentDate: string;
  maturityDate: string;
  totalMaturedValue: number | null;
  withdrawalFrequency: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  investmentPlanId: string;
  investmentPlan: {
    investmentTerm: number;
    roiAAR: string;
    type: string;
    name: string;
  };
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

// interface WithdrawInvestmentResponse {
//   message: string;
//   transaction: any;
// }

interface WithdrawalDetails {
  id: string;
  netAmountPaid: number;
  expensePercentageApplied: number;
  expenseAmountDeducted: number;
  lockInStageAchieved: number;
  transaction: {
    fundTransaction: {
      type: string;
      method: string;
      status: string;
    };
  };
}

const Investments: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialTab = location.pathname.includes("/make") ? "make" : "my";
  const [activeTab, setActiveTab] = useState<"make" | "my">(initialTab);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState<string>("");
  const [showSipComingSoon, setShowSipComingSoon] = useState(false);
  const [withdrawalFrequency, setWithdrawalFrequency] =
    useState<string>("QUARTERLY");
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [subscribeError, setSubscribeError] = useState<string | null>(null);
  const [subscribeSuccess, setSubscribeSuccess] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<"ALL" | "SIP" | "LUMPSUM">("ALL");
  const [sortBy, setSortBy] = useState<"name" | "return" | "minInvestment">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [withdrawMessage, setWithdrawMessage] = useState<{
    id: string;
    message: string;
  } | null>(null);
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState<string | null>(
    null
  );
  const [withdrawalDetails, setWithdrawalDetails] =
    useState<WithdrawalDetails | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);

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

  // Success modal auto-dismiss
  useEffect(() => {
    if (subscribeSuccess) {
      const timer = setTimeout(() => {
        setSubscribeSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [subscribeSuccess]);

  // Withdrawal message auto-dismiss
  useEffect(() => {
    if (withdrawMessage) {
      const timer = setTimeout(() => {
        setWithdrawMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [withdrawMessage]);

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
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/investor/getInvestmentPlans`,
          {
            withCredentials: true,
          }
        );
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
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/investor/getInvestments`,
          {
            withCredentials: true,
          }
        );
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

  // Add balance fetch
  const fetchBalance = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/investor/getBalance`,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setBalance(response.data.balance.availableBalance);
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

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
      setSubscribeError(`Amount must be at least ₹${'₹' + Number(plan.minInvestment).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
      return;
    }

    const requestData: SubscribeInvestmentRequest = {
      investmentPlanId: selectedPlan,
      investedAmount: amount,
      investmentMode: plan.type,
      withdrawalFrequency: withdrawalFrequency,
    };

    console.log("Request Data:", requestData);

    setSubscribeLoading(true);
    try {
      const response = await axios.post<SubscribeInvestmentResponse>(
        `${import.meta.env.VITE_API_URL}/api/v1/investor/subscribeInvestment`,
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
          `${import.meta.env.VITE_API_URL}/api/v1/investor/getInvestments`,
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

  const handleWithdrawInvestment = async (userInvestmentId: string) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/v1/investor/getWithdrawalDetails/${userInvestmentId}`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        const data = response.data.withdrawalDetails;

        const investment = myInvestments.find(
          (inv) => inv.id === userInvestmentId
        );
        const plan = investmentPlans.find(
          (p) => p.id === investment?.investmentPlanId
        );

        if (!investment || !plan) {
          console.error("Investment or plan not found");
          return;
        }

        // Calculate total gain
        const totalGain = new BigNumber(investment.investedAmount)
          .multipliedBy(plan.roiAAR)
          .dividedBy(100);

        // Calculate exit expense
        const exitExpense = totalGain
          .multipliedBy(data.expensePercentageApplied)
          .dividedBy(100);

        // Calculate net payout
        const netPayout = totalGain.minus(exitExpense);

        setWithdrawalDetails({
          id: investment.id,
          netAmountPaid: netPayout.toNumber(),
          expensePercentageApplied: data.expensePercentageApplied,
          expenseAmountDeducted: exitExpense.toNumber(),
          lockInStageAchieved: data.lockInStageAchieved,
          transaction: {
            fundTransaction: {
              type: "WITHDRAWAL",
              method: "BANK_TRANSFER",
              status: "PENDING",
            },
          },
        });

        setShowWithdrawConfirm(investment.id);
      }
    } catch (error) {
      console.error("Error fetching withdrawal details:", error);
      console.error("Failed to fetch withdrawal details");
    }
  };

  const handleConfirmWithdrawal = async () => {
    if (!showWithdrawConfirm || !withdrawalDetails) return;
    try {
      const investment = myInvestments.find(inv => inv.id === showWithdrawConfirm);
      if (!investment) throw new Error('Investment not found');
      const payload = {
        investmentPlanId: investment.investmentPlanId,
        userInvestmentId: investment.id,
      };
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/investor/withdrawPreMaturity`,
        payload,
        { withCredentials: true }
      );
      setWithdrawMessage({ id: investment.id, message: response.data.message || 'Withdrawal successful!' });
      setShowWithdrawConfirm(null);
      setWithdrawalDetails(null);
      // Optionally refresh investments list
      const updatedInvestments = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/investor/getInvestments`,
        { withCredentials: true }
      );
      setMyInvestments(updatedInvestments.data.investments);
    } catch (error: any) {
      setWithdrawMessage({ id: showWithdrawConfirm, message: error?.response?.data?.message || 'Withdrawal failed.' });
      setShowWithdrawConfirm(null);
      setWithdrawalDetails(null);
    }
  };

  const sortInvestmentPlans = (plans: InvestmentPlan[]) => {
    return [...plans].sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc" 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === "return") {
        return sortOrder === "asc"
          ? parseFloat(a.roiAAR) - parseFloat(b.roiAAR)
          : parseFloat(b.roiAAR) - parseFloat(a.roiAAR);
      } else {
        return sortOrder === "asc"
          ? a.minInvestment - b.minInvestment
          : b.minInvestment - a.minInvestment;
      }
    });
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

          {/* Filter Tabs */}
          <div className="flex space-x-4 mb-4">
            <button
              className={`px-4 py-2 rounded-full ${
                filterType === "ALL"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-600"
              }`}
              onClick={() => setFilterType("ALL")}
            >
              All
            </button>
            <button
              className={`px-4 py-2 rounded-full ${
                filterType === "SIP"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-600"
              }`}
              onClick={() => setFilterType("SIP")}
            >
              SIP
            </button>
            <button
              className={`px-4 py-2 rounded-full ${
                filterType === "LUMPSUM"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-600"
              }`}
              onClick={() => setFilterType("LUMPSUM")}
            >
              LUMPSUM
            </button>
          </div>

          {/* Sort Buttons */}
          <div className="flex space-x-4 mb-4">
            <button
              className={`px-4 py-2 rounded-full ${
                sortBy === "name"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-600"
              }`}
              onClick={() => {
                if (sortBy === "name") {
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                } else {
                  setSortBy("name");
                  setSortOrder("asc");
                }
              }}
            >
              A-Z {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
            </button>
            <button
              className={`px-4 py-2 rounded-full ${
                sortBy === "return"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-600"
              }`}
              onClick={() => {
                if (sortBy === "return") {
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                } else {
                  setSortBy("return");
                  setSortOrder("asc");
                }
              }}
            >
              Return % {sortBy === "return" && (sortOrder === "asc" ? "↑" : "↓")}
            </button>
            <button
              className={`px-4 py-2 rounded-full ${
                sortBy === "minInvestment"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-600"
              }`}
              onClick={() => {
                if (sortBy === "minInvestment") {
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                } else {
                  setSortBy("minInvestment");
                  setSortOrder("asc");
                }
              }}
            >
              Min. Investment {sortBy === "minInvestment" && (sortOrder === "asc" ? "↑" : "↓")}
            </button>
          </div>

          {/* Investment Plans Grid */}
          <div className="grid md:grid-cols-3 gap-4">
            {sortInvestmentPlans(
              investmentPlans.filter(
                (plan) => filterType === "ALL" || plan.type === filterType
              )
            ).map((plan) => (
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
                <div>
                  <p>
                    Min. Investment:{" "}
                    <span style={{ color: "#AACF45" }}>
                      {'₹' + Number(plan.minInvestment).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </p>
                  <p>
                    Expected Return:{" "}
                    <span style={{ color: "#AACF45" }}>
                      {(() => {
                        let principal = new Decimal(plan.minInvestment);
                        const inputAmount = Number(investmentAmount);
                        if (!isNaN(inputAmount) && inputAmount >= plan.minInvestment) {
                          principal = new Decimal(inputAmount);
                        }
                        const roi = new Decimal(plan.roiAAR);
                        const T_elapsed = plan.investmentTerm * 365;
                        const gainComponent = principal.times(roi.div(100)).times(new Decimal(T_elapsed).div(365));
                        const expectedReturn = principal.plus(gainComponent);
                        return '₹' + expectedReturn.toFixed(2);
                      })()}
                    </span>
                  </p>
                  <p>Investment Period: {plan.investmentTerm} yr</p>
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
                            {'₹' + Number(plan.minInvestment).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </p>
                        <p>
                          Expected Return:{" "}
                          <span style={{ color: "#AACF45" }}>
                            {(() => {
                              let principal = new Decimal(plan.minInvestment);
                              const inputAmount = Number(investmentAmount);
                              if (!isNaN(inputAmount) && inputAmount >= plan.minInvestment) {
                                principal = new Decimal(inputAmount);
                              }
                              const roi = new Decimal(plan.roiAAR);
                              const T_elapsed = plan.investmentTerm * 365;
                              const gainComponent = principal.times(roi.div(100)).times(new Decimal(T_elapsed).div(365));
                              const expectedReturn = principal.plus(gainComponent);
                              return '₹' + expectedReturn.toFixed(2);
                            })()}
                          </span>
                        </p>
                        <p>Investment Period: {plan.investmentTerm} yr</p>
                      </div>
                      <div className="mt-4 space-y-3">
                        <div>
                          <label className="block text-sm mb-1">
                            Investment Mode
                          </label>
                          <div className="flex space-x-4">
                            <div className="text-gray-700 font-medium">
                              {plan.type}
                            </div>
                          </div>
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
                          style={{
                            backgroundColor:
                              plan.type === "SIP" ? "#9CA3AF" : "#08AFF1",
                          }}
                          disabled={
                            plan.type === "SIP" ||
                            !investmentAmount ||
                            Number(investmentAmount) < plan.minInvestment ||
                            subscribeLoading ||
                            Number(investmentAmount) > balance
                          }
                          onClick={handleLumpsumSubmit}
                        >
                          {plan.type === "SIP"
                            ? "Coming Soon"
                            : subscribeLoading
                            ? "Processing..."
                            : "Invest Now"}
                        </button>
                        {/* Enhanced insufficient balance warning and Add Funds button */}
                        {Number(investmentAmount) > balance && (
                          <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded p-3 flex flex-col items-center">
                            <div className="flex items-center gap-2 text-yellow-700 mb-2">
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                              </svg>
                              <span className="font-medium">
                                Insufficient Balance
                              </span>
                            </div>
                            <p className="text-sm text-yellow-600 mb-2 text-center">
                              Your current balance ({'₹' + Number(balance).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                              is insufficient for this investment amount ({'₹' + Number(investmentAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}).
                            </p>
                            <button
                              onClick={() => {
                                setSelectedPlan(null);
                                navigate("/funds/add");
                              }}
                              className="w-full py-2 px-4 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                              </svg>
                              Add Funds
                            </button>
                          </div>
                        )}
                        {/* End enhanced warning */}
                        {subscribeError &&
                          selectedPlan === plan.id &&
                          Number(investmentAmount) <= balance && (
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
                <th className="py-2 px-3 border-b text-center align-middle">No.</th>
                <th className="py-2 px-3 border-b text-left align-middle">Plan Name</th>
                <th className="py-2 px-3 border-b text-center align-middle">Invested Value</th>
                <th className="py-2 px-3 border-b text-center align-middle">Date of Investment</th>
                <th className="py-2 px-3 border-b text-center align-middle">Date of Maturity</th>
                <th className="py-2 px-3 border-b text-center align-middle">More Info</th>
              </tr>
            </thead>
            <tbody>
              {myInvestments.map((item, index) => {
                const investedAmount = Number(item.investedAmount);
                return (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-3 text-center align-middle">{index + 1}</td>
                    <td className="py-2 px-3 text-left align-middle">{item.investmentPlan?.name}</td>
                    <td className="py-2 px-3 text-center align-middle">{item.investedAmount ? '₹' + investedAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—'}</td>
                    <td className="py-2 px-3 text-center align-middle">{item.investmentDate ? new Date(item.investmentDate).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—'}</td>
                    <td className="py-2 px-3 text-center align-middle">{item.maturityDate ? new Date(item.maturityDate).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—'}</td>
                    <td className="py-2 px-3 text-center align-middle">
                      <button
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        onClick={() => setSelectedInvestment(item)}
                      >
                        View Fund
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Investment Details Modal */}
      {selectedInvestment && (() => {
        const dateOfInvestment = new Date(selectedInvestment.investmentDate);
        const today = new Date();
        const investedAmount = Number(selectedInvestment.investedAmount);
        const roi = Number(selectedInvestment.investmentPlan?.roiAAR) / 100;
        const days = Math.floor((today.getTime() - dateOfInvestment.getTime()) / (1000 * 60 * 60 * 24));
        const returnAmountTillDate = days * ((investedAmount * roi) / 365);
        const returnPercentTillDate = investedAmount > 0 ? (returnAmountTillDate / investedAmount) * 100 : 0;
        return (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                onClick={() => setSelectedInvestment(null)}
                aria-label="Close"
              >
                &times;
              </button>
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#08AFF1' }}>
                Investment Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-gray-600 text-sm">Plan Name</div>
                  <div className="font-medium">{selectedInvestment.investmentPlan?.name}</div>
                </div>
                <div>
                  <div className="text-gray-600 text-sm">Invested Value</div>
                  <div className="font-medium">{'₹' + Number(selectedInvestment.investedAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
                <div>
                  <div className="text-gray-600 text-sm">Date of Investment</div>
                  <div className="font-medium">{selectedInvestment.investmentDate ? new Date(selectedInvestment.investmentDate).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  }) : '—'}</div>
                </div>
                <div>
                  <div className="text-gray-600 text-sm">Investment Period</div>
                  <div className="font-medium">{selectedInvestment.investmentPlan?.investmentTerm} yr</div>
                </div>
                <div>
                  <div className="text-gray-600 text-sm">RoI(%)</div>
                  <div className="font-medium">{selectedInvestment.investmentPlan?.roiAAR}</div>
                </div>
                <div>
                  <div className="text-gray-600 text-sm">Withdrawal Frequency</div>
                  <div className="font-medium">{selectedInvestment.withdrawalFrequency}</div>
                </div>
                <div>
                  <div className="text-gray-600 text-sm">Date of Maturity</div>
                  <div className="font-medium">{selectedInvestment.maturityDate ? new Date(selectedInvestment.maturityDate).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  }) : '—'}</div>
                </div>
                <div>
                  <div className="text-gray-600 text-sm">Status</div>
                  <div className="font-medium">{selectedInvestment.status}</div>
                </div>
                <div>
                  <div className="text-gray-600 text-sm">Return (Rs.)</div>
                  <div className="font-medium">
                    {'₹' + Number(returnAmountTillDate).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 text-sm">Return (%)</div>
                  <div className="font-medium">
                    {returnPercentTillDate.toFixed(2)}%
                  </div>
                </div>
              </div>
              <button
                className={`w-full py-2 rounded text-white ${withdrawMessage?.id === selectedInvestment.id ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'}`}
                disabled={withdrawMessage?.id === selectedInvestment.id}
                onClick={() => handleWithdrawInvestment(selectedInvestment.id)}
              >
                {withdrawMessage?.id === selectedInvestment.id ? 'Processing...' : 'Withdraw'}
              </button>
              {withdrawMessage?.id === selectedInvestment.id && (
                <div className={`mt-2 text-sm ${withdrawMessage.message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                  {withdrawMessage.message}
                </div>
              )}
            </div>
          </div>
        );
      })()}

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

      {/* Withdrawal Confirmation Modal */}
      {showWithdrawConfirm && withdrawalDetails && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Confirm Withdrawal</h3>

            <div className="mb-4 space-y-3">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Withdrawal Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lock-in Stage:</span>
                    <span className="font-medium">
                      Stage {withdrawalDetails.lockInStageAchieved}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pre-exit Percentage:</span>
                    <span className="font-medium text-red-500">
                      {withdrawalDetails.expensePercentageApplied}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pre-exit Amount:</span>
                    <span className="font-medium text-red-500">
                      {'₹' + Number(withdrawalDetails.expenseAmountDeducted).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Net Amount to Receive:
                      </span>
                      <span className="font-medium text-green-600">
                        {'₹' + Number(withdrawalDetails.netAmountPaid).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2 text-blue-700">
                  Transaction Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction Type:</span>
                    <span className="font-medium">
                      {withdrawalDetails.transaction.fundTransaction.type}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium">
                      {withdrawalDetails.transaction.fundTransaction.method}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium text-yellow-600">
                      {withdrawalDetails.transaction.fundTransaction.status}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600">
                Are you sure you want to proceed with the withdrawal? The
                pre-exit % will be deducted from your total value.
              </p>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                onClick={() => {
                  setShowWithdrawConfirm(null);
                  setWithdrawalDetails(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={handleConfirmWithdrawal}
              >
                Confirm Withdrawal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
// comment for deployment
export default Investments;
