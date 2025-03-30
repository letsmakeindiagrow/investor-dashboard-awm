import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Dashboard from "./components/Dashboard";
import Investments from "./pages/Investments";
import Funds from "./pages/Funds";
import Ledger from "./pages/Ledger";
import Referral from "./pages/Referral";
import Login from "./components/Login";
import RegistrationForm from "./components/RegistrationForm";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  return isLoggedIn ? children : <Login />;
};

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <RegistrationForm />,
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <App />
      </PrivateRoute>
    ),
    children: [
      { path: "", element: <Dashboard /> },
      { path: "details", element: <Dashboard /> },
      
      // Investments Routes
      { path: "investments", element: <Investments /> },
      { path: "investments/make", element: <Investments /> },
      { path: "investments/my", element: <Investments /> },
      
      // Funds Routes
      { path: "funds", element: <Funds /> },
      { path: "funds/available", element: <Funds /> },
      { path: "funds/add", element: <Funds /> },
      { path: "funds/withdraw", element: <Funds /> },
      { path: "funds/history", element: <Funds /> },
      
      // Ledger Routes
      { path: "ledger", element: <Ledger /> },
      
      // Referral Routes
      { path: "referral", element: <Referral /> },
      { path: "referral/overview", element: <Referral /> },
      { path: "referral/history", element: <Referral /> },
    ],
  },
]);

export default appRouter;
