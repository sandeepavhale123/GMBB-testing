import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '@/multiDashboardLayout/components/Header';

export const GeoRankingDashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-[73px]">
        <Outlet />
      </main>
    </div>
  );
};