
import React, { useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Check, MapPin, Star } from 'lucide-react';

interface SelectListingsStepProps {
  onNext: () => void;
  onBack: () => void;
}

export const SelectListingsStep: React.FC<SelectListingsStepProps> = ({ onNext, onBack }) => {
  // Mock data for now - this would come from your business listings API
  const listings = [
    {
      id: '1',
      business_name: 'Sample Restaurant',
      address: '123 Main St, City, State',
      platform: 'Google',
      rating: 4.5,
      review_count: 120,
      verification_status: 'verified',
      status: 'active'
    }
  ];

  const [selectedListings, setSelectedListings] = React.useState<string[]>([]);
  const loading = false;
  const error = null;

  const handleListingToggle = (listingId: string) => {
    const isSelected = selectedListings.includes(listingId);
    if (isSelected) {
      setSelectedListings(prev => prev.filter(id => id !== listingId));
    } else {
      setSelectedListings(prev => [...prev, listingId]);
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
          <p className="text-gray-600">No business listings found. Please add some businesses first.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => {
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
                      {listing.business_name}
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
                    
                    <div className="flex items-center gap-4 text-sm">
                      {listing.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-medium">{listing.rating}</span>
                        </div>
                      )}
                      
                      {listing.review_count && (
                        <span className="text-gray-600">
                          {listing.review_count} reviews
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {listing.platform}
                      </Badge>
                      
                      {listing.verification_status === 'verified' && (
                        <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                          Verified
                        </Badge>
                      )}
                      
                      {listing.status === 'active' && (
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
