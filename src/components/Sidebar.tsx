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

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const navigateTo = (path: string) => {
    navigate(path);
  };

  return (
    <div className="w-64 bg-white shadow-md">
      <div className="p-4">
        {/* Sidebar Menu Items */}
        <div className="space-y-2">
          {/* Dashboard */}
          <div>
            <div 
              onClick={() => toggleMenu('dashboard')} 
              className="flex justify-between items-center p-2 hover:bg-blue-50 cursor-pointer"
              style={{color: '#08AFF1'}}
            >
              <span>Dashboard</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                {openMenus.dashboard ? 
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /> :
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 9.586V6a1 1 0 011-1z" clipRule="evenodd" />
                }
              </svg>
            </div>
            {openMenus.dashboard && (
              <div className="pl-4 space-y-1">
                <div onClick={() => navigateTo('/dashboard')} className="block p-2 text-sm hover:bg-blue-50 cursor-pointer">My Investment</div>
                <div onClick={() => navigateTo('/dashboard/details')} className="block p-2 text-sm hover:bg-blue-50 cursor-pointer">Investment Details</div>
              </div>
            )}
          </div>

          {/* Investments */}
          <div>
            <div 
              onClick={() => toggleMenu('investments')} 
              className="flex justify-between items-center p-2 hover:bg-blue-50 cursor-pointer"
              style={{color: '#AACF45'}}
            >
              <span>Investments</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                {openMenus.investments ? 
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /> :
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 9.586V6a1 1 0 011-1z" clipRule="evenodd" />
                }
              </svg>
            </div>
            {openMenus.investments && (
              <div className="pl-4 space-y-1">
                <div onClick={() => navigateTo('/investments/make')} className="block p-2 text-sm hover:bg-blue-50 cursor-pointer">Make Investment</div>
                <div onClick={() => navigateTo('/investments/my')} className="block p-2 text-sm hover:bg-blue-50 cursor-pointer">My Investments</div>
              </div>
            )}
          </div>

          {/* Funds */}
          <div>
            <div 
              onClick={() => toggleMenu('funds')} 
              className="flex justify-between items-center p-2 hover:bg-blue-50 cursor-pointer"
              style={{color: '#08AFF1'}}
            >
              <span>Funds</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                {openMenus.funds ? 
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /> :
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 9.586V6a1 1 0 011-1z" clipRule="evenodd" />
                }
              </svg>
            </div>
            {openMenus.funds && (
              <div className="pl-4 space-y-1">
                <div onClick={() => navigateTo('/funds/available')} className="block p-2 text-sm hover:bg-blue-50 cursor-pointer">Funds Available</div>
                <div onClick={() => navigateTo('/funds/add')} className="block p-2 text-sm hover:bg-blue-50 cursor-pointer">Add Funds</div>
                <div onClick={() => navigateTo('/funds/withdraw')} className="block p-2 text-sm hover:bg-blue-50 cursor-pointer">Withdraw</div>
                <div onClick={() => navigateTo('/funds/history')} className="block p-2 text-sm hover:bg-blue-50 cursor-pointer">Transaction History</div>
              </div>
            )}
          </div>

          {/* Ledger */}
          <div>
            <div 
              onClick={() => toggleMenu('ledger')} 
              className="flex justify-between items-center p-2 hover:bg-blue-50 cursor-pointer"
              style={{color: '#AACF45'}}
            >
              <span>Ledger</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                {openMenus.ledger ? 
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /> :
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 9.586V6a1 1 0 011-1z" clipRule="evenodd" />
                }
              </svg>
            </div>
            {openMenus.ledger && (
              <div className="pl-4 space-y-1">
                <div onClick={() => navigateTo('/ledger')} className="block p-2 text-sm hover:bg-blue-50 cursor-pointer">View Ledger</div>
              </div>
            )}
          </div>

          {/* Referral */}
          <div>
            <div 
              onClick={() => toggleMenu('referral')} 
              className="flex justify-between items-center p-2 hover:bg-blue-50 cursor-pointer"
              style={{color: '#08AFF1'}}
            >
              <span>Referral</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                {openMenus.referral ? 
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /> :
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 9.586V6a1 1 0 011-1z" clipRule="evenodd" />
                }
              </svg>
            </div>
            {openMenus.referral && (
              <div className="pl-4 space-y-1">
                <div onClick={() => navigateTo('/referral/overview')} className="block p-2 text-sm hover:bg-blue-50 cursor-pointer">Referral Overview</div>
                <div onClick={() => navigateTo('/referral/history')} className="block p-2 text-sm hover:bg-blue-50 cursor-pointer">Referral History</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;