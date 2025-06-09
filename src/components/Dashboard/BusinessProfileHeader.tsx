
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { ExternalLink, Settings, MapPin, Clock } from 'lucide-react';
import { useAppSelector } from '../../hooks/useRedux';

export const BusinessProfileHeader: React.FC = () => {
  const { businessProfile } = useAppSelector((state) => state.dashboard);

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={businessProfile.avatar}
                alt={businessProfile.name}
                className="w-16 h-16 rounded-2xl object-cover shadow-md border border-gray-200"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                {businessProfile.name}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-600 font-medium">
                  {businessProfile.address}
                </p>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-3 h-3 text-gray-400" />
                <p className="text-xs text-gray-500">
                  Last updated: {businessProfile.lastUpdated}
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="border-gray-200 hover:bg-gray-50">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Listing
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 shadow-sm">
              <Settings className="w-4 h-4 mr-2" />
              Optimize
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
