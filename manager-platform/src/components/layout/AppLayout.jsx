import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import FuelAlertBanner from './FuelAlertBanner';
import { cn } from '@/lib/utils';

export default function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className={cn(
        "transition-all duration-300",
        sidebarCollapsed ? "mr-[72px]" : "mr-[240px]"
      )}>
        <TopBar />
        <FuelAlertBanner />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}