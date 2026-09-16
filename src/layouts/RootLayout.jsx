import { useState, useEffect } from 'react';
import { Outlet } from 'react-router';
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";

function RootLayout() {
  const [collapsed, setCollapsed] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false
  );

  useEffect(() => {
    // Auto-collapse the sidebar the first time the screen crosses into
    // mobile width, without fighting a manual expand/collapse the user
    // makes afterward (only reacts to crossing the breakpoint itself).
    const mql = window.matchMedia('(max-width: 768px)');
    const handleChange = (e) => setCollapsed(e.matches);
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar />
      <div className="flex flex-1 overflow-hidden">
        <SideBar collapsed={collapsed} setCollapsed={setCollapsed} />
        <main className="flex-1 overflow-y-auto p-3 sm:p-6 bg-gray-50 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default RootLayout;