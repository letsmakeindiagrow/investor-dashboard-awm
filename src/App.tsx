import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const LOGIN_URL = import.meta.env.VITE_LOGIN_URL;

const checkAuth = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/investor/checkAuth`, {
      withCredentials: true,
    });
    return res.data.authenticated;
  } catch {
    console.log("Not authenticated");
  }
};
const App: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuthenticationAndRedirect = async () => {
      const authenticated = await checkAuth();
      if (authenticated) {
        navigate("/dashboard");
      } else {
        window.location.href = LOGIN_URL;
      }
    };

    verifyAuthenticationAndRedirect();
  }, []);
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex flex-col flex-1">
        {/* Topbar with logo space */}
        <Topbar />

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default App;
