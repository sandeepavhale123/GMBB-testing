
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { CheckCircle, MoreVertical } from 'lucide-react'; // Removed MapPin, ExternalLink, Eye, Edit as they are not used, Added MoreVertical
import { useAppSelector } from '../../hooks/useRedux';
import { Progress } from '../ui/progress'; // Assuming Progress component is suitable

export const BusinessProfileHeader: React.FC = () => {
  const {
    businessProfile
  } = useAppSelector(state => state.dashboard);

  // Mock data for display based on the request
  const displayName = "KSoft Solution";
  const profileViews = 302;
  const position = 52;
  const visibilityPercentage = 50;

  return (
    <div className="space-y-4">
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            {/* Left Section (col-4 equivalent) */}
            <div className="lg:w-1/3 flex items-start gap-4">
              <Avatar className="w-20 h-20 rounded-lg">
                <AvatarImage src="/lovable-uploads/753b47db-62f2-448f-815e-9b695b1a4ea1.png" alt="Business Logo" />
                <AvatarFallback className="rounded-lg bg-gray-100 text-gray-600 text-lg font-semibold">
                  {displayName.substring(0,3).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl font-semibold text-gray-900">{displayName}</h1>
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-sm text-gray-600 mb-2">On Google</p>
                
                {/* Stats */}
                <div className="flex items-center gap-6 mb-3">
                  <div>
                    <div className="text-2xl font-semibold text-gray-900">{profileViews}</div>
                    <div className="text-sm text-gray-500">Profile views</div>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-gray-900">{position}</div>
                    <div className="text-sm text-gray-500">Position</div>
                  </div>
                </div>
                {/* Location was here, removed as per latest request */}
              </div>
            </div>
            
            {/* Right Section (col-8 equivalent) */}
            <div className="lg:w-2/3 flex flex-col lg:items-end gap-4">
              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2">
                  Edit GMB Access
                </Button>
                <Button variant="outline" size="icon" aria-label="More options">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </div>

              {/* Visibility Indicator */}
              <div className="w-full max-w-xs"> {/* Added max-w-xs for better control on large screens */}
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Visibility</span>
                  <span className="text-sm font-medium text-gray-900">{visibilityPercentage}%</span>
                </div>
                {/* Using shadcn/ui Progress component */}
                <Progress value={visibilityPercentage} className="h-2 [&>div]:bg-green-500" />
              </div>
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

