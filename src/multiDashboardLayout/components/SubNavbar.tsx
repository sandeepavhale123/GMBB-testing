import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useRedux';
export const SubNavbar: React.FC = () => {
  const theme = useAppSelector(state => state.theme);
  const navItems = [{
    label: 'Dashboard',
    path: '/main-dashboard'
  }, {
    label: 'Bulk Posts',
    path: '/main-dashboard/bulk-post'
  }, {
    label: 'Bulk Media',
    path: '/main-dashboard/bulk-media'
  }, {
    label: 'Bulk Review',
    path: '/main-dashboard/bulk-review'
  }, {
    label: 'Reports',
    path: '/main-dashboard/reports'
  }];
  return <nav className="fixed top-[65px] left-0 right-0 z-40 w-full px-4 pt-1 pb-0 border-b border-border bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center md:justify-end gap-1 md:gap-6 flex-wrap">
          {navItems.map((item, index) => <NavLink key={item.path} to={item.path} end={index === 0} className={({
          isActive
        }) => `px-4 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-primary-foreground hover:bg-primary'}`}>
              {item.label}
            </NavLink>)}
        </div>
      </div>
    </nav>;
};