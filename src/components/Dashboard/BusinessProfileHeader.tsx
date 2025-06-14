
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { ExternalLink, MapPin, CheckCircle, Eye, Edit } from 'lucide-react';
import { useAppSelector } from '../../hooks/useRedux';

export const BusinessProfileHeader: React.FC = () => {
  const {
    businessProfile
  } = useAppSelector(state => state.dashboard);

  return (
    <div className="space-y-4">
      {/* Business Profile Card - Matching Google My Business Style */}
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            {/* Profile Image and Basic Info */}
            <div className="flex items-start gap-4">
              <Avatar className="w-20 h-20 rounded-lg">
                <AvatarImage src="/lovable-uploads/753b47db-62f2-448f-815e-9b695b1a4ea1.png" alt="Business Logo" />
                <AvatarFallback className="rounded-lg bg-gray-100 text-gray-600 text-lg font-semibold">
                  XYZ
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl font-semibold text-gray-900">XYZ Plumbing Services</h1>
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-sm text-gray-600 mb-2">On Google</p>
                
                {/* Stats */}
                <div className="flex items-center gap-6 mb-3">
                  <div>
                    <div className="text-2xl font-semibold text-gray-900">302</div>
                    <div className="text-sm text-gray-500">Profile views</div>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-gray-900">52</div>
                    <div className="text-sm text-gray-500">Position</div>
                  </div>
                </div>
                
                {/* Location */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>New York, NY</span>
                </div>
              </div>
            </div>
            
            {/* Right side - Visibility and Actions */}
            <div className="flex flex-col lg:items-end gap-4 lg:ml-auto">
              {/* Visibility Indicator */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Visibility</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="w-1/2 h-full bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">50%</span>
                </div>
              </div>
              
              {/* Action Button */}
              <Button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2">
                Edit GMB Access
              </Button>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="mt-6 border-t pt-4">
            <div className="flex gap-6">
              <button className="text-blue-500 border-b-2 border-blue-500 pb-2 px-1 text-sm font-medium">
                Business information
              </button>
              <button className="text-gray-600 hover:text-gray-900 pb-2 px-1 text-sm font-medium">
                Opening Hours
              </button>
              <button className="text-gray-600 hover:text-gray-900 pb-2 px-1 text-sm font-medium">
                Edit Log
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
