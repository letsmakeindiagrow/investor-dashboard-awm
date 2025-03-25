import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const [openMenus, setOpenMenus] = useState<{[key: string]: boolean}>({
    dashboard: true,
    investments: false,
    funds: false,
    ledger: false,
    referral: false
  });
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const navigateTo = (path: string) => {
    navigate(path);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Icons for each menu item
  const menuIcons = {
    dashboard: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    investments: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    funds: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    ledger: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    referral: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
    )
  };

  return (
    <div className={`bg-white shadow-md transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      {/* Hamburger Menu Button */}
      <div className="p-5 flex justify-center">
        <button 
          onClick={toggleSidebar}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          {isCollapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </button>
      </div>

      <div className="p-4">
        {/* Sidebar Menu Items */}
        <div className="space-y-3">
          {/* Dashboard */}
          <div>
            <div 
              onClick={() => toggleMenu('dashboard')} 
              className="flex items-center p-3 hover:bg-blue-50 cursor-pointer font-semibold text-lg"
              style={{color: '#08AFF1'}}
            >
              <div className="mr-3">
                {menuIcons.dashboard}
              </div>
              {!isCollapsed && (
                <>
                  <span className="flex-1">Dashboard</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    {openMenus.dashboard ? 
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /> :
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 9.586V6a1 1 0 011-1z" clipRule="evenodd" />
                    }
                  </svg>
                </>
              )}
            </div>
            {!isCollapsed && openMenus.dashboard && (
              <div className="pl-4 space-y-2">
                <div onClick={() => navigateTo('/dashboard')} className="block p-3 text-base hover:bg-blue-50 cursor-pointer font-medium">My Investment</div>
                <div onClick={() => navigateTo('/dashboard/details')} className="block p-3 text-base hover:bg-blue-50 cursor-pointer font-medium">Investment Details</div>
              </div>
            )}
          </div>

          {/* Investments */}
          <div>
            <div 
              onClick={() => toggleMenu('investments')} 
              className="flex items-center p-3 hover:bg-blue-50 cursor-pointer font-semibold text-lg"
              style={{color: '#AACF45'}}
            >
              <div className="mr-3">
                {menuIcons.investments}
              </div>
              {!isCollapsed && (
                <>
                  <span className="flex-1">Investments</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    {openMenus.investments ? 
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /> :
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 9.586V6a1 1 0 011-1z" clipRule="evenodd" />
                    }
                  </svg>
                </>
              )}
            </div>
            {!isCollapsed && openMenus.investments && (
              <div className="pl-4 space-y-2">
                <div onClick={() => navigateTo('/investments/make')} className="block p-3 text-base hover:bg-blue-50 cursor-pointer font-medium">Make Investment</div>
                <div onClick={() => navigateTo('/investments/my')} className="block p-3 text-base hover:bg-blue-50 cursor-pointer font-medium">My Investments</div>
              </div>
            )}
          </div>

          {/* Funds */}
          <div>
            <div 
              onClick={() => toggleMenu('funds')} 
              className="flex items-center p-3 hover:bg-blue-50 cursor-pointer font-semibold text-lg"
              style={{color: '#08AFF1'}}
            >
              <div className="mr-3">
                {menuIcons.funds}
              </div>
              {!isCollapsed && (
                <>
                  <span className="flex-1">Funds</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    {openMenus.funds ? 
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /> :
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 9.586V6a1 1 0 011-1z" clipRule="evenodd" />
                    }
                  </svg>
                </>
              )}
            </div>
            {!isCollapsed && openMenus.funds && (
              <div className="pl-4 space-y-2">
                <div onClick={() => navigateTo('/funds/available')} className="block p-3 text-base hover:bg-blue-50 cursor-pointer font-medium">Funds Available</div>
                <div onClick={() => navigateTo('/funds/add')} className="block p-3 text-base hover:bg-blue-50 cursor-pointer font-medium">Add Funds</div>
                <div onClick={() => navigateTo('/funds/withdraw')} className="block p-3 text-base hover:bg-blue-50 cursor-pointer font-medium">Withdraw</div>
                <div onClick={() => navigateTo('/funds/history')} className="block p-3 text-base hover:bg-blue-50 cursor-pointer font-medium">Transaction History</div>
              </div>
            )}
          </div>

          {/* Ledger */}
          <div>
            <div 
              onClick={() => toggleMenu('ledger')} 
              className="flex items-center p-3 hover:bg-blue-50 cursor-pointer font-semibold text-lg"
              style={{color: '#AACF45'}}
            >
              <div className="mr-3">
                {menuIcons.ledger}
              </div>
              {!isCollapsed && (
                <>
                  <span className="flex-1">Ledger</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    {openMenus.ledger ? 
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /> :
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 9.586V6a1 1 0 011-1z" clipRule="evenodd" />
                    }
                  </svg>
                </>
              )}
            </div>
            {!isCollapsed && openMenus.ledger && (
              <div className="pl-4 space-y-2">
                <div onClick={() => navigateTo('/ledger')} className="block p-3 text-base hover:bg-blue-50 cursor-pointer font-medium">View Ledger</div>
              </div>
            )}
          </div>

          {/* Referral */}
          <div>
            <div 
              onClick={() => toggleMenu('referral')} 
              className="flex items-center p-3 hover:bg-blue-50 cursor-pointer font-semibold text-lg"
              style={{color: '#08AFF1'}}
            >
              <div className="mr-3">
                {menuIcons.referral}
              </div>
              {!isCollapsed && (
                <>
                  <span className="flex-1">Referral</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    {openMenus.referral ? 
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /> :
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 9.586V6a1 1 0 011-1z" clipRule="evenodd" />
                    }
                  </svg>
                </>
              )}
            </div>
            {!isCollapsed && openMenus.referral && (
              <div className="pl-4 space-y-2">
                <div onClick={() => navigateTo('/referral/overview')} className="block p-3 text-base hover:bg-blue-50 cursor-pointer font-medium">Referral Overview</div>
                <div onClick={() => navigateTo('/referral/history')} className="block p-3 text-base hover:bg-blue-50 cursor-pointer font-medium">Referral History</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;