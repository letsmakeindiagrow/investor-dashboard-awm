import React, { useState } from 'react';
import { ChevronDown, User, LogOut, Bell, HelpCircle } from 'lucide-react';
import axios from 'axios';


const Topbar: React.FC = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

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
    </div>
  );
}

export default Topbar;
