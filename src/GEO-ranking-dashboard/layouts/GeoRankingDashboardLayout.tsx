import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '@/multiDashboardLayout/components/Header';
import { SubNavbar } from '@/multiDashboardLayout/components/SubNavbar';

export const GeoRankingDashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SubNavbar />
      <main className="pt-[108px]">
        <Outlet />
      </main>
    </div>
  );
};