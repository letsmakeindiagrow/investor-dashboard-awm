import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import BigNumber from "bignumber.js";

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
  const [filterType, setFilterType] = useState<"ALL" | "SIP" | "LUMPSUM">(
    "ALL"
  );
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
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/investor/getInvestmentPlans`, {
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
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/investor/getInvestments`, {
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

  // Add balance fetch
  const fetchBalance = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/investor/getBalance`, {
        withCredentials: true,
      });
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
      setSubscribeError(`Amount must be at least ₹${plan.minInvestment}.`);
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

  const handleWithdrawInvestment = async (investmentId: string) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getWithdrawalDetails/${investmentId}`
      );

      if (response.status === 200) {
        const data = response.data.withdrawalDetails;

        const investment = myInvestments.find((inv) => inv.id === investmentId);
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
          id: investmentId,
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

        setShowWithdrawConfirm(investmentId);
      }
    } catch (error) {
      console.error("Error fetching withdrawal details:", error);
      console.error("Failed to fetch withdrawal details");
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
          <div className="flex space-x-4 mb-6">
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

          <div className="grid md:grid-cols-3 gap-4">
            {investmentPlans
              .filter(
                (plan) => filterType === "ALL" || plan.type === filterType
              )
              .map((plan) => (
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
                    {plan.type}
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
                        {plan.type}
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
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                              <span className="font-medium">Insufficient Balance</span>
                            </div>
                            <p className="text-sm text-yellow-600 mb-2 text-center">
                              Your current balance (₹{balance.toLocaleString()}) is insufficient for this investment amount (₹{Number(investmentAmount).toLocaleString()}).
                            </p>
                            <button
                              onClick={() => {
                                setSelectedPlan(null);
                                navigate('/funds/add');
                              }}
                              className="w-full py-2 px-4 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                              Add Funds
                            </button>
                          </div>
                        )}
                        {/* End enhanced warning */}
                        {subscribeError && selectedPlan === plan.id && Number(investmentAmount) <= balance && (
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
                <th className="py-2 px-3 border-b">Plan Type</th>
                <th className="py-2 px-3 border-b">Invested Value</th>
                <th className="py-2 px-3 border-b">Date of Investment</th>
                <th className="py-2 px-3 border-b">Investment Period</th>
                <th className="py-2 px-3 border-b">RoI(%)</th>
                <th className="py-2 px-3 border-b">Withdrawal Frequency</th>
                <th className="py-2 px-3 border-b">Date of Maturity</th>
                <th className="py-2 px-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {myInvestments.map((item, index) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-3 text-center">{index + 1}</td>
                  <td className="py-2 px-3 text-left">
                    {item.investmentPlan?.type} ({item.investmentPlan?.investmentTerm} yr, {item.investmentPlan?.roiAAR}%)
                  </td>
                  <td className="py-2 px-3 text-right">
                    {item.investedAmount
                      ? `₹${item.investedAmount.toLocaleString()}`
                      : "—"}
                  </td>
                  <td className="py-2 px-3 text-center">
                    {item.investmentDate
                      ? new Date(item.investmentDate).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="py-2 px-3 text-center">
                    {item.investmentPlan?.investmentTerm
                      ? `${item.investmentPlan.investmentTerm} yr`
                      : "—"}
                  </td>
                  <td className="py-2 px-3 text-right">
                    {item.investmentPlan?.roiAAR ?? "—"}
                  </td>
                  <td className="py-2 px-3 text-center">
                    {item.withdrawalFrequency || "—"}
                  </td>
                  <td className="py-2 px-3 text-center">
                    {item.maturityDate
                      ? new Date(item.maturityDate).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="py-2 px-3">
                    <button
                      className={`px-4 py-2 rounded text-white ${
                        withdrawMessage?.id === item.id
                          ? "bg-gray-400"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                      disabled={withdrawMessage?.id === item.id}
                      onClick={() => handleWithdrawInvestment(item.id)}
                    >
                      {withdrawMessage?.id === item.id
                        ? "Processing..."
                        : "Withdraw"}
                    </button>
                    {withdrawMessage?.id === item.id && (
                      <div
                        className={`mt-1 text-sm ${
                          withdrawMessage.message.includes("success")
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {withdrawMessage.message}
                      </div>
                    )}
                  </td>
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
                      ₹{withdrawalDetails.expenseAmountDeducted.toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Net Amount to Receive:</span>
                      <span className="font-medium text-green-600">
                        ₹{withdrawalDetails.netAmountPaid.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2 text-blue-700">Transaction Details</h4>
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
                onClick={() => handleWithdrawInvestment(showWithdrawConfirm)}
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
