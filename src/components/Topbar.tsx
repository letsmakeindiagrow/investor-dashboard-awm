import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  User,
  LogOut,
  Bell,
  HelpCircle,
  X,
  Mail,
  Phone,
  Calendar,
  Shield,
} from "lucide-react";
import axios from "axios";

interface UserData {
  id: string;
  referralCode: string;
  mobileNumber: string;
  mobileVerified: boolean;
  email: string;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  createdAt: string;
  updatedAt: string;
  verificationState: string;
  availableBalance: string;
}

interface ApiResponse {
  user: UserData;
}

const Topbar: React.FC = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await axios.get<ApiResponse>(
        `${import.meta.env.VITE_API_URL}/api/v1/investor/getUserInfo`,
        {
          withCredentials: true,
        }
      );
      console.log("API userInfo response:", response.data);
      setUserData(response.data.user);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch user info on mount
    fetchUserData();
  }, []);

  useEffect(() => {
    if (isProfileModalOpen) {
      fetchUserData();
    }
  }, [isProfileModalOpen]);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/investor/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      window.location.href = "https://login.aadyanviwealth.com";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatBalance = (balance: string) => {
    const numBalance = parseFloat(balance);
    return numBalance.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="bg-white shadow-md h-16 flex items-center justify-between px-6 relative">
      {/* Company Logo Space */}
      <div className="pointer-events-none flex items-center justify-center h-16">
        <img
          src="/straight_logo.png"
          alt="Company Logo"
          className="h-100 w-48"
        />
      </div>

      {/* User Info and Notifications */}
      <div className="flex items-center space-x-6">
        {/* Notifications */}
        <div className="relative">
          <Bell className="h-6 w-6 text-gray-600" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            className="flex items-center space-x-2 focus:outline-none"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <div className="h-8 w-8 rounded-full bg-[#00A7E1] flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">
              {userData ? `${userData.firstName} ${userData.lastName}` : "User"}
            </span>
            <ChevronDown
              className={`h-4 w-4 text-gray-500 transition-transform ${
                isProfileOpen ? "transform rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-800">
                  {userData?.email || "-"}
                </p>
              </div>
              <button
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  setIsProfileModalOpen(true);
                  setIsProfileOpen(false);
                }}
              >
                <User className="mr-3 h-4 w-4 text-gray-500" />
                Profile
              </button>
              <a
                href="https://www.aadyanviwealth.com/contact"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <HelpCircle className="mr-3 h-4 w-4 text-gray-500" />
                Help
              </a>
              <div className="border-t border-gray-100"></div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <LogOut className="mr-3 h-4 w-4 text-gray-500" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                Profile Information
              </h2>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00A7E1]"></div>
                </div>
              ) : userData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Full Name
                      </label>
                      <p className="mt-1 text-gray-900">{`${
                        userData.firstName || "-"
                      } ${userData.lastName || "-"}`}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Email
                      </label>
                      <div className="mt-1 flex items-center">
                        <Mail className="h-4 w-4 text-gray-500 mr-2" />
                        <p className="text-gray-900">{userData.email || "-"}</p>
                        {userData.emailVerified && (
                          <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Mobile Number
                      </label>
                      <div className="mt-1 flex items-center">
                        <Phone className="h-4 w-4 text-gray-500 mr-2" />
                        <p className="text-gray-900">
                          {userData.mobileNumber || "-"}
                        </p>
                        {userData.mobileVerified && (
                          <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Date of Birth
                      </label>
                      <div className="mt-1 flex items-center">
                        <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                        <p className="text-gray-900">
                          {userData.dateOfBirth
                            ? formatDate(userData.dateOfBirth)
                            : "-"}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Referral Code
                      </label>
                      <p className="mt-1 text-gray-900">
                        {userData.referralCode || "-"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Account Status
                      </label>
                      <div className="mt-1 flex items-center">
                        <Shield className="h-4 w-4 text-gray-500 mr-2" />
                        <p className="text-gray-900">
                          {userData.verificationState || "-"}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Available Balance
                      </label>
                      <p className="mt-1 text-gray-900">
                        ₹
                        {userData.availableBalance
                          ? formatBalance(userData.availableBalance)
                          : "0.00"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Member Since
                      </label>
                      <p className="mt-1 text-gray-900">
                        {userData.createdAt
                          ? formatDate(userData.createdAt)
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Last Updated
                      </label>
                      <p className="mt-1 text-gray-900">
                        {userData.updatedAt
                          ? formatDate(userData.updatedAt)
                          : "-"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  Failed to load user data. Please try again.
                </div>
              )}
            </div>
            <div className="p-6 border-t flex justify-end">
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Topbar;
