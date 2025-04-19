import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
}

const Login: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (getCookie("auth_token")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Login</h1>
        <p className="text-gray-600">Please use the main login portal to sign in.</p>
      </div>
    </div>
  );
};

export default Login;
