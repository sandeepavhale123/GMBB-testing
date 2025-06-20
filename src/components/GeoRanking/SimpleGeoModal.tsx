
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { X, Star } from 'lucide-react';

interface SimpleCompetitor {
  position: number;
  name: string;
  address: string;
  rating: number;
  reviewCount: number;
  isUserBusiness?: boolean;
}

interface SimpleGeoModalProps {
  isOpen: boolean;
  onClose: () => void;
  gpsCoordinates: string;
  competitors: SimpleCompetitor[];
  userBusinessName?: string;
}

export const SimpleGeoModal: React.FC<SimpleGeoModalProps> = ({
  isOpen,
  onClose,
  gpsCoordinates,
  competitors,
  userBusinessName
}) => {
  if (!isOpen) return null;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < Math.floor(rating) 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-96 max-h-[500px] bg-white">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 truncate">
              {gpsCoordinates}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <CardContent className="p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Top Results</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {competitors.map((competitor) => (
              <div
                key={competitor.position}
                className={`p-3 rounded-lg border ${
                  competitor.isUserBusiness || competitor.name === userBusinessName
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    competitor.isUserBusiness || competitor.name === userBusinessName
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-600 text-white'
                  }`}>
                    {competitor.position}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {competitor.name}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {competitor.address}
                    </p>
                    
                    <div className="flex items-center gap-1 mt-2">
                      <div className="flex">
                        {renderStars(competitor.rating)}
                      </div>
                      <span className="text-xs text-gray-600 ml-1">
                        {competitor.rating} ({competitor.reviewCount})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
