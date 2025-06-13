
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { MapPin, Star, Clock } from 'lucide-react';

interface SelectListingsStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  onNext: () => void;
}

const SelectListingsStep = ({ formData, updateFormData, onNext }: SelectListingsStepProps) => {
  const [selectedListings, setSelectedListings] = useState(formData.selectedListings || []);

  // Mock business listings data
  const listings = [
    {
      id: '1',
      name: 'Downtown Location',
      address: '123 Main St, Downtown, NY 10001',
      rating: 4.5,
      reviewCount: 127,
      status: 'Verified',
      category: 'Restaurant'
    },
    {
      id: '2', 
      name: 'Uptown Branch',
      address: '456 Broadway Ave, Uptown, NY 10002',
      rating: 4.2,
      reviewCount: 89,
      status: 'Verified',
      category: 'Restaurant'
    },
    {
      id: '3',
      name: 'Westside Store',
      address: '789 West End Rd, Westside, NY 10003',
      rating: 4.7,
      reviewCount: 203,
      status: 'Pending',
      category: 'Retail'
    }
  ];

  const handleListingToggle = (listingId: string) => {
    const updatedListings = selectedListings.includes(listingId)
      ? selectedListings.filter((id: string) => id !== listingId)
      : [...selectedListings, listingId];
    setSelectedListings(updatedListings);
  };

  const handleSelectAll = () => {
    if (selectedListings.length === listings.length) {
      setSelectedListings([]);
    } else {
      setSelectedListings(listings.map(listing => listing.id));
    }
  };

  const handleNext = () => {
    updateFormData({ selectedListings });
    onNext();
  };

  return (
    <div className="max-w-3xl mx-auto px-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Select your business listings
        </h2>
        <p className="text-gray-600">
          Choose which Google Business Profile listings you'd like to manage with GMB Briefcase
        </p>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Found {listings.length} business listings
          </h3>
          <Button 
            variant="outline" 
            onClick={handleSelectAll}
            className="text-sm"
          >
            {selectedListings.length === listings.length ? 'Deselect All' : 'Select All'}
          </Button>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {listings.map((listing) => {
          const isSelected = selectedListings.includes(listing.id);
          
          return (
            <Card 
              key={listing.id}
              className={`p-6 cursor-pointer transition-all duration-200 border-2 ${
                isSelected 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleListingToggle(listing.id)}
            >
              <div className="flex items-start gap-4">
                <Checkbox 
                  checked={isSelected}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">{listing.name}</h4>
                      <div className="flex items-center gap-2 text-gray-600 mt-1">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{listing.address}</span>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      listing.status === 'Verified' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {listing.status}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{listing.rating}</span>
                      <span>({listing.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{listing.category}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="text-center">
        <Button 
          onClick={handleNext}
          disabled={selectedListings.length === 0}
          className="px-8 py-3 text-base"
          size="lg"
        >
          Continue with {selectedListings.length} listing{selectedListings.length !== 1 ? 's' : ''}
        </Button>
      </div>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-500">
          Don't see your business? You can{' '}
          <a href="#" className="text-blue-600 hover:underline">add it manually</a>
          {' '}or{' '}
          <a href="#" className="text-blue-600 hover:underline">contact support</a>
        </p>
      </div>
    </div>
  );
};

export default SelectListingsStep;
