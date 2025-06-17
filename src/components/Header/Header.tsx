import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '../ui/button';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { toggleTheme } from '../../store/slices/themeSlice';
import { BusinessListingSelector } from './BusinessListingSelector';
import { MobileBusinessSelector } from './MobileBusinessSelector';
import { HeaderActions } from './HeaderActions';
import { UserProfileDropdown } from './UserProfileDropdown';
import { PageTitle } from './PageTitle';
import { PageBreadcrumb } from './PageBreadcrumb';
import { HeaderProps, BusinessListing } from './types';
import { useBusinessListings } from '@/hooks/useBusinessListings';

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  showFilters,
  onShowFilters
}) => {
  const dispatch = useAppDispatch();
  const { isDark } = useAppSelector(state => state.theme);
  const { listings, loading } = useBusinessListings();
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessListing | null>(null);

  // Set the first business as default when listings are loaded
  useEffect(() => {
    console.log('🏢 Header: useEffect triggered - listings:', listings);
    console.log('🏢 Header: listings.length:', listings.length);
    console.log('🏢 Header: selectedBusiness:', selectedBusiness);
    
    if (listings.length > 0 && !selectedBusiness) {
      console.log('🏢 Header: Setting default business:', listings[0]);
      setSelectedBusiness(listings[0]);
    }
  }, [listings, selectedBusiness]);

  const handleBusinessSelect = (business: BusinessListing) => {
    console.log('🏢 Header: Business selected:', business);
    setSelectedBusiness(business);
  };

  return (
    <header className="bg-white border-b border-gray-200">
      {/* Main header content */}
      <div className="px-3 sm:px-4 md:px-6 py-4 sm:py-6">
        <div className="flex items-start justify-between gap-4">
          {/* Left section - Page Title and Menu */}
          <div className="flex items-start gap-4 min-w-0 flex-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onToggleSidebar} 
              className="hover:bg-gray-100 p-2 shrink-0 mt-1"
            >
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
      </div>
    </header>
  );
};
