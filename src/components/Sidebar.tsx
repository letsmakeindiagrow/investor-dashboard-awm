import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  LineChart,
  Wallet,
  BookOpen,
  Users,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const [openSection, setOpenSection] = useState<string | null>("dashboard");
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Color configuration
  const primaryColor = "#08AFF1";
  const iconColor = primaryColor;
  const textColor = "text-gray-800";
  const hoverEffect = "hover:bg-gray-100 hover:bg-opacity-50";

  const handleSectionClick = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const navigateTo = (path: string) => {
    navigate(path);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Icons with consistent styling
  const menuIcons = {
    dashboard: <LayoutDashboard className="h-5 w-5" stroke={iconColor} />,
    investments: <LineChart className="h-5 w-5" stroke={iconColor} />,
    funds: <Wallet className="h-5 w-5" stroke={iconColor} />,
    ledger: <BookOpen className="h-5 w-5" stroke={iconColor} />,
    referral: <Users className="h-5 w-5" stroke={iconColor} />,
  };

  return (
    <div
      className={`bg-white shadow-md transition-all duration-300 flex flex-col ${
        isCollapsed ? "w-20" : "w-64"
      }`}
      style={{ height: "calc(100vh - 1rem)" }}
    >
      {/* Hamburger Menu Button */}
      <div className="p-5 flex justify-center">
        <button
          onClick={toggleSidebar}
          className="text-gray-500 hover:text-indigo-600 focus:outline-none transition-colors"
        >
          {isCollapsed ? (
            <Menu className="h-6 w-6" />
          ) : (
            <X className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Sidebar Menu Items */}
        <div className="space-y-2">
          {/* Dashboard */}
          <div>
            <div
              onClick={() => handleSectionClick("dashboard")}
              className={`flex items-center p-3 rounded-md cursor-pointer ${hoverEffect} transition-colors`}
            >
              <div className="mr-3">{menuIcons.dashboard}</div>
              {!isCollapsed && (
                <>
                  <span
                    className={`flex-1 ${textColor} font-semibold text-base`}
                  >
                    Dashboard
                  </span>
                  {openSection === "dashboard" ? (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-500" />
                  )}
                </>
              )}
            </div>
            {!isCollapsed && openSection === "dashboard" && (
              <div className="pl-4 space-y-2 mt-1">
                <div
                  onClick={() => navigateTo("/dashboard")}
                  className={`block p-3 rounded-md text-base ${hoverEffect} ${textColor} cursor-pointer transition-colors font-medium`}
                >
                  My Portfolio
                </div>
              </div>
            )}
          </div>

          {/* Investments */}
          <div>
            <div
              onClick={() => handleSectionClick("investments")}
              className={`flex items-center p-3 rounded-md cursor-pointer ${hoverEffect} transition-colors`}
            >
              <div className="mr-3">{menuIcons.investments}</div>
              {!isCollapsed && (
                <>
                  <span
                    className={`flex-1 ${textColor} font-semibold text-base`}
                  >
                    Investments
                  </span>
                  {openSection === "investments" ? (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-500" />
                  )}
                </>
              )}
            </div>
            {!isCollapsed && openSection === "investments" && (
              <div className="pl-4 space-y-2 mt-1">
                <div
                  onClick={() => navigateTo("/investments/make")}
                  className={`block p-3 rounded-md text-base ${hoverEffect} ${textColor} cursor-pointer transition-colors font-medium`}
                >
                  Make Investment
                </div>
                <div
                  onClick={() => navigateTo("/investments/my")}
                  className={`block p-3 rounded-md text-base ${hoverEffect} ${textColor} cursor-pointer transition-colors font-medium`}
                >
                  My Investments
                </div>
              </div>
            )}
          </div>

          {/* Funds */}
          <div>
            <div
              onClick={() => handleSectionClick("funds")}
              className={`flex items-center p-3 rounded-md cursor-pointer ${hoverEffect} transition-colors`}
            >
              <div className="mr-3">{menuIcons.funds}</div>
              {!isCollapsed && (
                <>
                  <span
                    className={`flex-1 ${textColor} font-semibold text-base`}
                  >
                    Funds
                  </span>
                  {openSection === "funds" ? (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-500" />
                  )}
                </>
              )}
            </div>
            {!isCollapsed && openSection === "funds" && (
              <div className="pl-4 space-y-2 mt-1">
                <div
                  onClick={() => navigateTo("/funds/available")}
                  className={`block p-3 rounded-md text-base ${hoverEffect} ${textColor} cursor-pointer transition-colors font-medium`}
                >
                  Funds Available
                </div>
                <div
                  onClick={() => navigateTo("/funds/add")}
                  className={`block p-3 rounded-md text-base ${hoverEffect} ${textColor} cursor-pointer transition-colors font-medium`}
                >
                  Add Funds
                </div>
                <div
                  onClick={() => navigateTo("/funds/withdraw")}
                  className={`block p-3 rounded-md text-base ${hoverEffect} ${textColor} cursor-pointer transition-colors font-medium`}
                >
                  Withdraw
                </div>
                <div
                  onClick={() => navigateTo("/funds/history")}
                  className={`block p-3 rounded-md text-base ${hoverEffect} ${textColor} cursor-pointer transition-colors font-medium`}
                >
                  Transaction History
                </div>
              </div>
            )}
          </div>

          {/* Ledger */}
          <div>
            <div
              onClick={() => handleSectionClick("ledger")}
              className={`flex items-center p-3 rounded-md cursor-pointer ${hoverEffect} transition-colors`}
            >
              <div className="mr-3">{menuIcons.ledger}</div>
              {!isCollapsed && (
                <>
                  <span
                    className={`flex-1 ${textColor} font-semibold text-base`}
                  >
                    Ledger
                  </span>
                  {openSection === "ledger" ? (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-500" />
                  )}
                </>
              )}
            </div>
            {!isCollapsed && openSection === "ledger" && (
              <div className="pl-4 space-y-2 mt-1">
                <div
                  onClick={() => navigateTo("/ledger")}
                  className={`block p-3 rounded-md text-base ${hoverEffect} ${textColor} cursor-pointer transition-colors font-medium`}
                >
                  View Ledger
                </div>
              </div>
            )}
          </div>

          {/* Referral */}
          <div>
            <div
              onClick={() => navigateTo("/referral")}
              className={`flex items-center p-3 rounded-md cursor-pointer ${hoverEffect} transition-colors`}
            >
              <div className="mr-3">{menuIcons.referral}</div>
              {!isCollapsed && (
                <span className={`flex-1 ${textColor} font-semibold text-base`}>
                  Referral
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
