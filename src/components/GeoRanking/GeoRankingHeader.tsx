
import React from 'react';
import { Button } from '../ui/button';
import { Plus, RefreshCcw, Copy, ChevronDown, Sparkles, MapPin } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { useListingContext } from '@/context/ListingContext';

interface GeoRankingHeaderProps {
  headerKeyword: string;
  showKeywordDropdown: boolean;
  onToggleDropdown: () => void;
  onKeywordSelect: (keyword: string) => void;
}

export const GeoRankingHeader: React.FC<GeoRankingHeaderProps> = ({
  headerKeyword,
  showKeywordDropdown,
  onToggleDropdown,
  onKeywordSelect
}) => {
  // Get the selected listing from context
  const { selectedListing } = useListingContext();
  
  const reportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Use selected listing data or fallback values
  const listingName = selectedListing?.name || "Downtown Coffee Shop";
  const listingAddress = selectedListing?.address || "123 Main St, Downtown, City";

  return (
    <div className="mb-6 sm:mb-8">
      {/* Report Header Card */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">GEO ranking report</h1>
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <h2 className="text-lg sm:text-xl font-semibold text-gray-700">{listingName}</h2>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">{listingAddress}</p>
              </div>
            </div>
            
            {/* Report Date and Branding */}
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-2">Report Generated: {reportDate}</p>
              <div className="flex items-center gap-2 justify-end">
                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">G</span>
                </div>
                <span className="text-xs text-gray-500">Powered by GMB-Briefcase</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Header Card */}
      <Card className="bg-white shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6 items-start">
            {/* Left Section - Keyword and Details */}
            <div className="xl:col-span-3 space-y-4">
              {/* Keyword Section */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 relative">
                <div className="flex flex-col gap-1">
                  <div className="text-sm text-gray-500 font-medium">Keyword</div>
                  <div 
                    className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 cursor-pointer"
                    onClick={onToggleDropdown}
                  >
                    {headerKeyword}
                    <ChevronDown className={`w-5 h-5 transition-transform ${showKeywordDropdown ? 'rotate-180' : ''}`} />
                  </div>
                </div>
                
                {/* Keyword Dropdown */}
                {showKeywordDropdown && (
                  <div className="absolute z-50 top-full mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                    <div className="py-1">
                      <div 
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        onClick={() => onKeywordSelect('Web Design')}
                      >
                        Web Design
                      </div>
                      <div 
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        onClick={() => onKeywordSelect('Digital Marketing')}
                      >
                        Digital Marketing
                      </div>
                      <div 
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        onClick={() => onKeywordSelect('SEO Services')}
                      >
                        SEO Services
                      </div>
                      <div 
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        onClick={() => onKeywordSelect('Local Business')}
                      >
                        Local Business
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Center Section - Key Metrics */}
            <div className="xl:col-span-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Overall Visibility */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                  <div className="text-xs text-blue-600 font-medium mb-1 text-center">Overall Visibility</div>
                  <div className="text-2xl font-bold text-blue-900 text-center">36%</div>
                  <div className="text-xs text-green-600 text-center">+5.2% ↑</div>
                </div>

                {/* Click Rate */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
                  <div className="text-xs text-orange-600 font-medium mb-1 text-center">Click Rate</div>
                  <div className="text-2xl font-bold text-orange-900 text-center">12.4%</div>
                  <div className="text-xs text-red-600 text-center">-1.2% ↓</div>
                </div>

                {/* AI Genie Recommendation */}
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-4 rounded-lg">
                  <div className="text-xs text-blue-100 font-medium mb-2 text-center">AI Genie Recommendation</div>
                  <Button size="sm" className="w-full bg-white text-blue-600 hover:bg-blue-50 text-xs font-medium">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Get Insights
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Section - Action Buttons */}
            <div className="xl:col-span-3">
              <div className="flex flex-col gap-2 w-fit">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white justify-start">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Keyword
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 justify-center">
                    <RefreshCcw className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" className="flex-1 justify-center">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
