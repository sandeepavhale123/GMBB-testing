
import React from 'react';
import { ArrowLeft, Building, MapPin, Clock, Phone, Globe, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

interface ListingManagementPageProps {
  accountId: string;
}

export const ListingManagementPage: React.FC<ListingManagementPageProps> = ({ accountId }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/settings/google-account');
  };

  // Mock data based on account ID
  const mockListings = [
    {
      id: '1',
      name: 'Downtown Restaurant',
      address: '123 Main St, Downtown, NY 10001',
      phone: '+1 (555) 123-4567',
      website: 'www.downtownrestaurant.com',
      status: 'verified',
      rating: 4.8,
      reviewCount: 247,
      lastUpdated: '2 hours ago'
    },
    {
      id: '2',
      name: 'Uptown Bistro',
      address: '456 Park Ave, Uptown, NY 10002',
      phone: '+1 (555) 987-6543',
      website: 'www.uptownbistro.com',
      status: 'pending',
      rating: 4.5,
      reviewCount: 189,
      lastUpdated: '1 day ago'
    }
  ];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header with Back Button */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-4 p-0 h-auto font-normal text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Google Accounts
        </Button>
        
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Manage Listings - Account {accountId}
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Manage individual business listings for this Google account.
          </p>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {mockListings.map((listing) => (
          <Card key={listing.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{listing.name}</CardTitle>
                    <Badge 
                      variant={listing.status === 'verified' ? 'default' : 'secondary'}
                      className="mt-1"
                    >
                      {listing.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{listing.address}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">{listing.phone}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm">
                  <Globe className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">{listing.website}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-gray-700">{listing.rating} ({listing.reviewCount} reviews)</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-500">Updated {listing.lastUpdated}</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <Button variant="outline" className="w-full">
                  Manage Listing
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
