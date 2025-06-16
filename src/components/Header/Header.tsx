
import React, { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '../ui/button';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { toggleTheme } from '../../store/slices/themeSlice';
import { BusinessListingSelector } from './BusinessListingSelector';
import { MobileBusinessSelector } from './MobileBusinessSelector';
import { HeaderActions } from './HeaderActions';
import { UserProfileDropdown } from './UserProfileDropdown';
import { HeaderProps, businessListings, BusinessListing } from './types';

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  title,
  showFilters,
  onShowFilters
}) => {
  const dispatch = useAppDispatch();
  const { isDark } = useAppSelector(state => state.theme);
  const [greeting, setGreeting] = useState('');
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessListing>(businessListings[0]);

  useEffect(() => {
    const updateGreeting = () => {
      const now = new Date();
      const hour = now.getHours();
      if (hour < 12) {
        setGreeting('Good morning');
      } else if (hour < 17) {
        setGreeting('Good afternoon');
      } else {
        setGreeting('Good evening');
      }
    };
    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleBusinessSelect = (business: BusinessListing) => {
    setSelectedBusiness(business);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-3 sm:px-4 md:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {/* Left section */}
        <div className="flex items-center gap-3 sm:gap-6 min-w-0 flex-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onToggleSidebar} 
            className="hover:bg-gray-100 p-2 shrink-0"
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </Button>
          
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <div className="min-w-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <h1 className="text-base sm:text-xl font-semibold text-gray-900 truncate">
                  <span className="hidden sm:inline">{greeting}, John!</span>
                  <span className="sm:hidden">John</span>
                </h1>
                <span className="text-base sm:text-lg shrink-0">👋</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5 hidden sm:block">
                Manage your business listings with ease
              </p>
            </div>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-1 sm:gap-3 shrink-0">
          <MobileBusinessSelector
            selectedBusiness={selectedBusiness}
            onBusinessSelect={handleBusinessSelect}
          />

          <BusinessListingSelector
            selectedBusiness={selectedBusiness}
            onBusinessSelect={handleBusinessSelect}
          />

          <HeaderActions />

          <UserProfileDropdown />
        </div>
      </div>
    </header>
  );
};
