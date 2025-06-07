import React, { useState } from 'react';
import { ChevronDown, User, LogOut, Bell, HelpCircle, X } from 'lucide-react';
import axios from 'axios';

const Topbar: React.FC = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Static user data (to be replaced with API data later)
  const userData = {
    name: "John Doe",
    email: "user@example.com",
    phone: "+91 9876543210",
    address: "123 Main Street, City, State - 123456",
    accountType: "Individual",
    kycStatus: "Verified",
    joinDate: "01/01/2024"
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/investor/logout`, {
        withCredentials: true
      });
      // After successful logout, redirect to login page
      window.location.href = 'https://login.aadyanviwealth.com';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="bg-white shadow-md h-16 flex items-center justify-between px-6 relative">
      {/* Company Logo Space */}
      <div className="pointer-events-none flex items-center justify-center h-16">
        <img src="/straight_logo.png" alt="Company Logo" className="h-100 w-48" />
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
            <span className="text-sm font-medium text-gray-700">User</span>
            <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isProfileOpen ? 'transform rotate-180' : ''}`} />
          </button>
          
          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-800">user@example.com</p>
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
              <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
              <button 
                onClick={() => setIsProfileModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Full Name</label>
                    <p className="mt-1 text-gray-900">{userData.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Email</label>
                    <p className="mt-1 text-gray-900">{userData.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Phone</label>
                    <p className="mt-1 text-gray-900">{userData.phone}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Address</label>
                    <p className="mt-1 text-gray-900">{userData.address}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Account Type</label>
                    <p className="mt-1 text-gray-900">{userData.accountType}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">KYC Status</label>
                    <p className="mt-1 text-gray-900">{userData.kycStatus}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Member Since</label>
                    <p className="mt-1 text-gray-900">{userData.joinDate}</p>
                  </div>
                </div>
              </div>
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
}

export default Topbar;
