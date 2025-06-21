
import React, { useEffect, useState, useMemo } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Check, MapPin, Search } from 'lucide-react';
import { useOnboarding } from '@/store/slices/onboarding/useOnboarding';

interface SelectListingsStepProps {
  onNext: () => void;
  onBack: () => void;
}

export const SelectListingsStep: React.FC<SelectListingsStepProps> = ({ onNext, onBack }) => {
  const { googleBusinessData, toggleListingSelection } = useOnboarding();
  
  // Use the actual Google Business data from the store
  const listings = googleBusinessData?.locations || [];
  const [selectedListings, setSelectedListings] = React.useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
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

  // Filter listings based on search query
  const filteredListings = useMemo(() => {
    if (!searchQuery.trim()) return listings;
    
    const query = searchQuery.toLowerCase();
    return listings.filter(listing => 
      listing.locationName.toLowerCase().includes(query) ||
      listing.address.toLowerCase().includes(query) ||
      listing.country.toLowerCase().includes(query)
    );
  }, [listings, searchQuery]);

  // Check if all filtered listings are selected
  const allFilteredSelected = filteredListings.length > 0 && filteredListings.every(listing => 
    selectedListings.includes(listing.id)
  );

  const handleListingToggle = (listingId: string) => {
    const isSelected = selectedListings.includes(listingId);
    if (isSelected) {
      setSelectedListings(prev => prev.filter(id => id !== listingId));
    } else {
      setSelectedListings(prev => [...prev, listingId]);
    }
    
    // Update the store as well
    toggleListingSelection(listingId);
  };

  const handleSelectAll = () => {
    if (allFilteredSelected) {
      // Deselect all filtered listings
      const filteredIds = filteredListings.map(listing => listing.id);
      setSelectedListings(prev => prev.filter(id => !filteredIds.includes(id)));
      
      // Update store for each deselected listing
      filteredListings.forEach(listing => {
        if (selectedListings.includes(listing.id)) {
          toggleListingSelection(listing.id);
        }
      });
    } else {
      // Select all filtered listings
      const filteredIds = filteredListings.map(listing => listing.id);
      const newSelections = [...new Set([...selectedListings, ...filteredIds])];
      setSelectedListings(newSelections);
      
      // Update store for each newly selected listing
      filteredListings.forEach(listing => {
        if (!selectedListings.includes(listing.id)) {
          toggleListingSelection(listing.id);
        }
      });
    }
  };

  const canProceed = selectedListings.length > 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading your businesses...</h2>
          <p className="text-gray-600">Please wait while we fetch your business listings.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Error Loading Businesses</h2>
        <p className="text-red-600">{error}</p>
        <Button onClick={() => {}}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Your Business Listings</h2>
        <p className="text-gray-600">
          Choose the business listings you want to manage with our platform.
        </p>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No business listings found. Please connect your Google account first.</p>
        </div>
      ) : (
        <>
          {/* Search and Select All Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50 p-4 rounded-lg">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search listings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Button
              variant="outline"
              onClick={handleSelectAll}
              disabled={filteredListings.length === 0}
              className="whitespace-nowrap"
            >
              {allFilteredSelected ? 'Deselect All' : 'Select All'}
              {searchQuery && ` (${filteredListings.length})`}
            </Button>
          </div>

          {/* Results info */}
          {searchQuery && (
            <div className="text-sm text-gray-600">
              Showing {filteredListings.length} of {listings.length} listings
              {filteredListings.length === 0 && ' - No matches found'}
            </div>
          )}

          {/* Listings Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredListings.map((listing) => {
              const isSelected = selectedListings.includes(listing.id);
              
              return (
                <Card 
                  key={listing.id} 
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    isSelected 
                      ? 'ring-2 ring-blue-500 bg-blue-50' 
                      : 'hover:ring-1 hover:ring-gray-300'
                  }`}
                  onClick={() => handleListingToggle(listing.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg font-semibold text-gray-900 flex-1">
                        {listing.locationName}
                      </CardTitle>
                      {isSelected && (
                        <div className="ml-2 p-1 bg-blue-500 rounded-full">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span className="flex-1">{listing.address}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {listing.country}
                        </Badge>
                        
                        {listing.isVerified === 1 && (
                          <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                            Verified
                          </Badge>
                        )}
                        
                        {listing.isActive === 1 && (
                          <Badge variant="default" className="text-xs bg-blue-100 text-blue-800">
                            Active
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredListings.length === 0 && searchQuery && (
            <div className="text-center py-8">
              <p className="text-gray-600">No listings found matching "{searchQuery}"</p>
              <Button 
                variant="outline" 
                onClick={() => setSearchQuery('')}
                className="mt-2"
              >
                Clear Search
              </Button>
            </div>
          )}
        </>
      )}

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        
        <Button 
          onClick={onNext} 
          disabled={!canProceed}
          className={canProceed ? 'bg-blue-600 hover:bg-blue-700' : ''}
        >
          Continue ({selectedListings.length} selected)
        </Button>
      </div>
    </div>
  );
};

export default SelectListingsStep;
