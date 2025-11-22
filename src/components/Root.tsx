import { useState } from 'react';
import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { LayoutProvider, useLayout } from '../utils/LayoutContext';

function RootContent() {
  const { sidebarCollapsed, setSidebarCollapsed } = useLayout();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <div className="flex-1 overflow-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export function Root() {
  return (
    <LayoutProvider>
      <RootContent />
    </LayoutProvider>
  );
}