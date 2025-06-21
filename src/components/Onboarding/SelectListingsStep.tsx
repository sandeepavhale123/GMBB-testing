import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { MapPin, Search, Building2, ExternalLink, Users, Star } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fetchBusinessListings, selectListing, deselectListing } from '../../store/slices/businessListingsSlice';
import { BusinessListing } from '../../services/businessListingsService';

interface SelectListingsStepProps {
  onNext: () => void;
  onBack: () => void;
}

export const SelectListingsStep: React.FC<SelectListingsStepProps> = ({ onNext, onBack }) => {
  const dispatch = useAppDispatch();
  const { listings, loading, error, selectedListings } = useAppSelector(state => state.businessListings);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchBusinessListings());
  }, [dispatch]);

  const filteredListings = listings.filter(listing =>
    listing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleListingSelect = (listing: BusinessListing, isSelected: boolean) => {
    if (isSelected) {
      dispatch(selectListing(listing));
    } else {
      dispatch(deselectListing(listing.id.toString()));
    }
  };

  const handlePrimarySelection = (listingId: string) => {
    setSelectedListingId(listingId);
  };

  const canProceed = selectedListings.length > 0;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <h2 className="text-2xl font-semibold">Select Your Business Listings</h2>
        <p>Loading listings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <h2 className="text-2xl font-semibold">Select Your Business Listings</h2>
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header section */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold">Select Your Business Listings</h2>
        <p className="text-gray-600">Choose the listings you want to manage with our platform.</p>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search listings by name, address, or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Listings grid */}
      <div className="grid gap-4 md:gap-6">
        {filteredListings.map((listing) => {
          const isSelected = selectedListings.some(selected => selected.id.toString() === listing.id.toString());
          const isPrimary = listing.id.toString() === selectedListingId;

          return (
            <Card 
              key={listing.id} 
              className={`transition-all duration-200 hover:shadow-md cursor-pointer ${
                isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
              } ${isPrimary ? 'ring-2 ring-green-500 bg-green-50' : ''}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => handleListingSelect(listing, checked as boolean)}
                    className="mt-1"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg text-gray-900 truncate">
                            {listing.name}
                          </h3>
                          {listing.verification_status === 'verified' && (
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              Verified
                            </Badge>
                          )}
                          {isPrimary && (
                            <Badge className="bg-green-500 text-white">
                              Primary
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="text-sm truncate">{listing.address}</span>
                        </div>
                        
                        {listing.category && (
                          <div className="flex items-center gap-2 text-gray-600 mb-3">
                            <Building2 className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm">{listing.category}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          {listing.total_reviews !== undefined && (
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{listing.total_reviews} reviews</span>
                            </div>
                          )}
                          {listing.average_rating !== undefined && (
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span>{listing.average_rating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        {listing.google_my_business_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(listing.google_my_business_url, '_blank');
                            }}
                            className="flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            View
                          </Button>
                        )}
                        
                        {isSelected && !isPrimary && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePrimarySelection(listing.id.toString());
                            }}
                            className="text-green-600 border-green-200 hover:bg-green-50"
                          >
                            Set Primary
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} disabled={!canProceed}>
          Next
        </Button>
      </div>
    </div>
  );
};
