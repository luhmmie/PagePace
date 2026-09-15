import { useState } from 'react';
import { Outlet } from 'react-router';
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";

function RootLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar />
      <div className="flex flex-1 overflow-hidden">
        <SideBar collapsed={collapsed} setCollapsed={setCollapsed} />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default RootLayout;