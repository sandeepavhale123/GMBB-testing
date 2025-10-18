import React from 'react';
import { Outlet } from 'react-router-dom';

export const StandaloneLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Outlet />
    </div>
  );
};