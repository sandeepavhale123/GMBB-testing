
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Building, Check, User } from 'lucide-react';

interface StatisticsCardsProps {
  totalListings: number;
  verifiedListings: number;
  managedListings: number;
}

export const ListingStatisticsCards: React.FC<StatisticsCardsProps> = ({
  totalListings,
  verifiedListings,
  managedListings
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalListings}</p>
              <p className="text-sm text-gray-600">Total listings</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{verifiedListings}</p>
              <p className="text-sm text-gray-600">Verified listings</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <User className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{managedListings}</p>
              <p className="text-sm text-gray-600">Managed listings</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
