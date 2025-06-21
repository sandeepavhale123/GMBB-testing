
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { MapPin, Eye, Edit } from 'lucide-react';
import { useProfile } from '../../hooks/useProfile';
import { useDashboardListing } from '../../hooks/useDashboardListing';

export const BusinessProfileHeader: React.FC = () => {
  const { listingName, listingAddress } = useDashboardListing();
  const { profileData } = useProfile();

  // Get user's first name for greeting
  const userFirstName = profileData?.first_name || "User";

  // Dynamic greeting based on time
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Business Overview Card - Responsive */}
      <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-6">
            <div className="flex-1">
              <div className="mb-3 sm:mb-4">
                <div className="text-xs sm:text-sm text-purple-200 mb-1">BUSINESS OVERVIEW</div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl sm:text-2xl font-bold">
                    {getTimeBasedGreeting()}, {userFirstName} 👋
                  </h2>
                </div>
                <p className="text-sm sm:text-base text-purple-100">Here's the summary for: "{listingName}"</p>
              </div>
              
              {/* Status indicators - Responsive layout */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-purple-100">Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-purple-200" />
                  <span className="text-purple-100">{listingAddress}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-purple-100">Profile Health: 78%</span>
                </div>
              </div>
            </div>
            
            {/* Action buttons - Responsive */}
            <div className="flex flex-row sm:flex-col gap-2 sm:gap-3 lg:mt-6">
              <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0 flex-1 sm:flex-none text-xs sm:text-sm">
                <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Edit Info</span>
                <span className="sm:hidden">Edit</span>
              </Button>
              <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0 flex-1 sm:flex-none text-xs sm:text-sm">
                <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">View on Google</span>
                <span className="sm:hidden">View</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
