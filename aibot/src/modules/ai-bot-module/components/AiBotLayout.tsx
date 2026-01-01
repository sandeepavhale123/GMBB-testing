import React from 'react';
import { Outlet } from 'react-router-dom';
import { AbWorkspaceProvider } from '../context/AbWorkspaceContext';
import { AbBotSidebar } from './AbBotSidebar';

const AiBotLayout: React.FC = () => {
  return (
    <AbWorkspaceProvider>
      <div className="min-h-screen bg-background flex">
        <AbBotSidebar />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </AbWorkspaceProvider>
  );
};

export default AiBotLayout;
