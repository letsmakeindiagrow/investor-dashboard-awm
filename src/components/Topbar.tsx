import React from 'react';

const Topbar: React.FC = () => {
  return (
    <div className="bg-white shadow-md h-16 flex items-center justify-between px-6">
      {/* Company Logo Space */}
      <div className="flex items-center justify-center">
        <img src="/straight_logo.png" alt="Company Logo" className="h-100 w-48" />
      </div>
      
      {/* User Info and Notifications */}
      <div className="flex items-center space-x-4">
        <div className="text-sm text-gray-600">
          Welcome, User
        </div>
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </div>
      </div>
    </div>
  );
}

export default Topbar;