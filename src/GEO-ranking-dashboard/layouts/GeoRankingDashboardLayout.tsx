import React from 'react';
import { Outlet } from 'react-router-dom';

export const GeoRankingDashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      
      <Outlet />
    </div>
  );
};