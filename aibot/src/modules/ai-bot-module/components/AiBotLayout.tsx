import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useRedux';
import { AbWorkspaceProvider } from '../context/AbWorkspaceContext';
import { AbHeader } from './layout/AbHeader';
import { AbSubNavBar } from './layout/AbSubNavBar';
import { AbMainBody } from './layout/AbMainBody';

const AiBotLayout: React.FC = () => {
  const theme = useAppSelector((state) => state.theme);

  return (
    <AbWorkspaceProvider>
      <div
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: theme.bg_color || "hsl(var(--background))" }}
      >
        <AbHeader />
        <AbSubNavBar />
        <AbMainBody>
          <Outlet />
        </AbMainBody>
      </div>
    </AbWorkspaceProvider>
  );
};

export default AiBotLayout;
