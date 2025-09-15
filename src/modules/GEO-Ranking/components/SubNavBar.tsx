import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Search, Key, History, ArrowLeft, MessageSquare, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
const navItems = [{
  label: 'Dashboard',
  path: '/module/geo-ranking',
  icon: LayoutDashboard
}, {
  label: 'Check Rank',
  path: '/module/geo-ranking/check-rank',
  icon: Search
}, {
  label: 'Credits History',
  path: '/module/geo-ranking/credit-history',
  icon: History
}, {
  label: 'Settings',
  path: '/module/geo-ranking/settings',
  icon: Settings
}
// { label: 'AI Chatbot', path: '/module/geo-ranking/aiChatBox/1', icon: MessageSquare },
];
export const SubNavBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Check if we're on the view project details page
  const isViewProjectDetails = location.pathname.includes('/module/geo-ranking/view-project-details/');
  if (isViewProjectDetails) {
    return <nav className="fixed top-[65px] left-0 right-0 z-[403] w-full px-4 pt-1 pb-0 border-b border-border bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-start gap-4 py-4">
            <Button variant="ghost" onClick={() => navigate('/module/geo-ranking')} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
              <ArrowLeft size={18} />
              <span>Back</span>
            </Button>
          </div>
        </div>
      </nav>;
  }
  return <nav className="fixed top-[65px] left-0 right-0 z-40 w-full px-4 pt-1 pb-0 border-b border-border bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-end md:justify-end gap-1 md:gap-6 flex-wrap">
          {navItems.map(item => {
          // Special handling for Settings to include nested routes
          const isActive = item.path === '/module/geo-ranking/settings' 
            ? location.pathname.startsWith('/module/geo-ranking/settings')
            : location.pathname === item.path;
          const IconComponent = item.icon;
          return <NavLink key={item.path} to={item.path} className={cn("flex items-center gap-2 px-3 py-4 text-sm font-medium transition-colors relative", isActive ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground")}>
                <IconComponent size={18} />
                <span className="hidden md:block whitespace-nowrap">{item.label}</span>
              </NavLink>;
        })}
        </div>
      </div>
    </nav>;
};