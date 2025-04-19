import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
}

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (getCookie("auth_token")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      {/* Logo and Title Section */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-6">
          <img src="/logo.png" alt="Logo" className="h-16 w-auto" />
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#00A7E1] to-[#A5CF3D] text-transparent bg-clip-text">
          Welcome to Aadyanvi Group
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Your trusted partner in wealth management and investment solutions
        </p>
      </div>

      {/* Buttons Section */}
      <div className="flex gap-6">
        <a
          href="https://login.aadyanviwealth.com"
          className="px-8 py-3 rounded-lg bg-[#00A7E1] text-white font-semibold hover:bg-[#0095c8] transition-colors duration-200 flex items-center gap-2"
          target="_blank"
          rel="noopener noreferrer"
        >
          Sign In
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </a>
        <a
          href="https://login.aadyanviwealth.com/register"
          className="px-8 py-3 rounded-lg bg-[#A5CF3D] text-white font-semibold hover:bg-[#94b937] transition-colors duration-200 flex items-center gap-2"
          target="_blank"
          rel="noopener noreferrer"
        >
          Create Account
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
          </svg>
        </a>
      </div>

      {/* Features Section */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto px-4">
        <div className="text-center p-6 rounded-lg bg-white shadow-sm">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#00A7E1]/10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#00A7E1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Investments</h3>
          <p className="text-gray-600">Access curated investment opportunities with expert guidance</p>
        </div>

        <div className="text-center p-6 rounded-lg bg-white shadow-sm">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#A5CF3D]/10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#A5CF3D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Portfolio Tracking</h3>
          <p className="text-gray-600">Monitor your investments in real-time with detailed analytics</p>
        </div>

        <div className="text-center p-6 rounded-lg bg-white shadow-sm">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#00A7E1]/10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#00A7E1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Support</h3>
          <p className="text-gray-600">Get personalized support from our team of investment experts</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 