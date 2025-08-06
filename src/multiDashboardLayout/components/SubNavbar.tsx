import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useRedux';
import { useIsMobile } from '@/hooks/use-mobile';
import { useProfile } from '@/hooks/useProfile';
import { 
  LayoutDashboard, 
  FileText, 
  Images, 
  Star, 
  BarChart3, 
  Settings 
} from 'lucide-react';
export const SubNavbar: React.FC = () => {
  const theme = useAppSelector(state => state.theme);
  const isMobile = useIsMobile(768);
  const { profileData } = useProfile();
  
  const shouldHideSettings = () => {
    const userRole = profileData?.role?.toLowerCase();
    return userRole === 'staff' || userRole === 'client';
  };
  
  const navItems = [{
    label: 'Dashboard',
    path: '/main-dashboard',
    icon: LayoutDashboard
  }, {
    label: 'Bulk Posts',
    path: '/main-dashboard/bulk-post',
    icon: FileText
  }, {
    label: 'Bulk Media',
    path: '/main-dashboard/bulk-media',
    icon: Images
  }, {
    label: 'Bulk Review',
    path: '/main-dashboard/bulk-review',
    icon: Star
  }, {
    label: 'Reports',
    path: '/main-dashboard/reports',
    icon: BarChart3
  }, {
    label: 'Settings',
    path: '/main-dashboard/settings',
    icon: Settings
  }].filter(item => {
    if (item.label === 'Settings' && shouldHideSettings()) {
      return false;
    }
    return true;
  });

  return (
    <nav className="fixed top-[65px] left-0 right-0 z-40 w-full px-4 pt-1 pb-0 border-b border-border bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center md:justify-end gap-1 md:gap-6 flex-wrap">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <NavLink 
                key={item.path} 
                to={item.path} 
                end={index === 0} 
                className={({ isActive }) => 
                  `px-4 py-3 border-b-2 text-sm font-medium transition-colors flex items-center gap-2 ${
                    isActive 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                <span className={isMobile ? 'hidden' : 'block'}>
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
};