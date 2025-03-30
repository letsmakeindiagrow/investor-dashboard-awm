import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';

const App: React.FC = () => {
  const navigate = useNavigate();
  
  React.useEffect(() => {
    if (!localStorage.getItem('isLoggedIn')) {
      navigate('/login');
    }
  }, [navigate]);

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
}

export default App;