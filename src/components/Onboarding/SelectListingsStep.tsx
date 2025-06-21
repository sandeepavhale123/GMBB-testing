
import React, { useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { MapPin, User } from 'lucide-react';
import { useOnboarding } from '@/store/slices/onboarding/useOnboarding';

interface SelectListingsStepProps {
  onNext: () => void;
  onBack: () => void;
}

export const SelectListingsStep: React.FC<SelectListingsStepProps> = ({ onNext, onBack }) => {
  const { googleBusinessData, toggleListingSelection, setAllListingsSelection } = useOnboarding();
  
  const listings = googleBusinessData?.locations || [];
  const [selectedListings, setSelectedListings] = React.useState<string[]>([]);
  const loading = false;
  const error = null;

  // Initialize selected listings based on isActive status
  useEffect(() => {
    if (listings.length > 0) {
      const activeListings = listings
        .filter(listing => listing.isActive === 1)
        .map(listing => listing.id);
      setSelectedListings(activeListings);
    }
  }, [listings]);

  const handleListingToggle = (listingId: string) => {
    const isSelected = selectedListings.includes(listingId);
    if (isSelected) {
      setSelectedListings(prev => prev.filter(id => id !== listingId));
    } else {
      setSelectedListings(prev => [...prev, listingId]);
    }
    
    toggleListingSelection(listingId);
  };

  const handleSelectAll = () => {
    const allSelected = selectedListings.length === listings.length;
    if (allSelected) {
      // Deselect all
      setSelectedListings([]);
      setAllListingsSelection(false);
    } else {
      // Select all
      const allListingIds = listings.map(listing => listing.id);
      setSelectedListings(allListingIds);
      setAllListingsSelection(true);
    }
  };

  const canProceed = selectedListings.length > 0;
  const allSelected = selectedListings.length === listings.length && listings.length > 0;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Loading your businesses...</h2>
          <p className="text-gray-600">Please wait while we fetch your business listings.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Error Loading Businesses</h2>
          <p className="text-red-600">{error}</p>
          <Button onClick={() => {}}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-gray-900">Select your business listings</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose which Google Business Profile listings you'd like to manage with GMB Briefcase
          </p>
          
          {/* Connection Info */}
          {googleBusinessData && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-2 text-green-800">
                <User className="w-5 h-5" />
                <span className="font-medium">Connected to: {googleBusinessData.profileEmail}</span>
              </div>
              <p className="text-sm text-green-700 mt-1">Account ID: {googleBusinessData.accountId}</p>
            </div>
          )}
        </div>

        {/* Listings Count and Controls */}
        {listings.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-lg font-medium text-gray-900">
              Found {listings.length} business listing{listings.length !== 1 ? 's' : ''}
            </p>
            <Button
              variant="outline"
              onClick={handleSelectAll}
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              {allSelected ? 'Deselect All' : 'Select All'}
            </Button>
          </div>
        )}

        {/* Listings */}
        {listings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No business listings found. Please connect your Google account first.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {listings.map((listing) => {
              const isSelected = selectedListings.includes(listing.id);
              
              return (
                <Card 
                  key={listing.id} 
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    isSelected 
                      ? 'border-2 border-blue-500 bg-blue-50' 
                      : 'border border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleListingToggle(listing.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Checkbox */}
                      <div className="mt-1">
                        <Checkbox 
                          checked={isSelected}
                          onChange={() => handleListingToggle(listing.id)}
                          className="w-5 h-5"
                        />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {listing.locationName}
                          </h3>
                          
                          <div className="flex items-start gap-2 text-gray-600 mt-2">
                            <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                            <span>{listing.address}</span>
                          </div>
                          
                          {listing.category && (
                            <p className="text-gray-500 mt-1">{listing.category}</p>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {listing.country}
                          </Badge>
                          
                          <Badge 
                            variant={listing.isVerified === 1 ? "default" : "secondary"} 
                            className={`text-xs ${
                              listing.isVerified === 1 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {listing.isVerified === 1 ? 'Verified' : 'Not-Verified'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Bottom Section */}
        <div className="text-center space-y-4 pt-8">
          <Button 
            onClick={onNext} 
            disabled={!canProceed}
            size="lg"
            className={`px-8 py-3 text-lg ${canProceed ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
          >
            Connect with {selectedListings.length} listing{selectedListings.length !== 1 ? 's' : ''}
          </Button>
          
          <p className="text-sm text-gray-500">
            Don't see your business? You can add it manually or contact support
          </p>
        </div>
      </div>
    </div>
  );
};

export default SelectListingsStep;
