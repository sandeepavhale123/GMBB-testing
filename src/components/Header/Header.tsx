import React from 'react';
import { Menu, ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { toggleTheme } from '../../store/slices/themeSlice';
import { BusinessListingSelector } from './BusinessListingSelector';
import { MobileBusinessSelector } from './MobileBusinessSelector';
import { HeaderActions } from './HeaderActions';
import { UserProfileDropdown } from './UserProfileDropdown';
import { PageTitle } from './PageTitle';
import { PageBreadcrumb } from './PageBreadcrumb';
import { HeaderProps } from './types';
export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  showFilters,
  onShowFilters
}) => {
  const dispatch = useAppDispatch();
  const {
    isDark
  } = useAppSelector(state => state.theme);
  return <header className="bg-white border-b border-gray-200">
      {/* Main header content */}
      <div className="px-3 sm:px-4 md:px-6 py-4 sm:py-6">
        <div className="flex items-start justify-between gap-4">
          {/* Left section - Page Title and Menu */}
          <div className="flex items-start gap-4 min-w-0 flex-1">
            <Button variant="ghost" size="sm" onClick={onToggleSidebar} className="hover:bg-gray-100 p-2 shrink-0 mt-1">
              <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </Button>
            
            <div className="min-w-0 flex-1">
              <PageTitle />
              <div className="mt-2">
                <PageBreadcrumb />
              </div>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            <Button variant="secondary" size="sm" onClick={() => window.location.href = "https://old.gmbbriefcase.com/login"} className="bg-white text-foreground border-2 hover:bg-gray-50 rounded-sm">
              <span className="hidden md:block ml-1">Back to old version </span>
              <ExternalLink className="w-4 h-4" />
            </Button>
            <MobileBusinessSelector />
            <BusinessListingSelector />
            <HeaderActions />
            <UserProfileDropdown className="rounded-sm text-slate-900 font-medium border-2" />
          </div>
        </div>
      </div>
    </header>;
};