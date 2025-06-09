
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { ExternalLink, MapPin, AlertTriangle, Eye, Edit } from 'lucide-react';
import { useAppSelector } from '../../hooks/useRedux';

export const BusinessProfileHeader: React.FC = () => {
  const {
    businessProfile
  } = useAppSelector(state => state.dashboard);

  return (
    <div className="space-y-4">
      {/* Action Required Alert */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <div>
            <h3 className="font-semibold text-red-900">Action Required</h3>
            <p className="text-sm text-red-700">This listing is suspended. Take action to appeal and restore visibility.</p>
          </div>
        </div>
        <Button className="bg-red-600 hover:bg-red-700 text-white">
          Resolve
        </Button>
      </div>

      {/* Business Overview Card */}
      <Card className="bg-gradient-to-r from-purple-600 to-purple-700 text-white border-0">
        <CardContent className="p-6">
          <div className="mb-4">
            <div className="text-sm text-purple-200 mb-1">BUSINESS OVERVIEW</div>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              Good Morning, Vijay 👋
            </h2>
            <p className="text-purple-100">Here's the summary for: "XYZ Plumbing Services"</p>
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-purple-100">Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-200" />
              <span className="text-purple-100">New York, NY</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-purple-100">Profile Health: 78%</span>
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0">
              <Edit className="w-4 h-4 mr-2" />
              Edit Info
            </Button>
            <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0">
              <Eye className="w-4 h-4 mr-2" />
              View on Google
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
