import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { UnderPerformingArea } from '../../api/geoRankingApi';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UnderPerformingTableProps {
  underPerformingAreas: UnderPerformingArea[];
  loading?: boolean;
}

export const UnderPerformingTable: React.FC<UnderPerformingTableProps> = ({
  underPerformingAreas,
  loading = false
}) => {
  const { toast } = useToast();

  const handleCopyCoordinate = (coordinate: string) => {
    navigator.clipboard.writeText(coordinate);
    toast({
      title: "Copied!",
      description: "Coordinate copied to clipboard"
    });
  };

  const formatCoordinate = (coordinate: string) => {
    if (coordinate.length <= 8) return coordinate;
    return coordinate.substring(0, 8) + '...';
  };

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">Top Performance</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">Loading under-performing areas...</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              {/* Header */}
              <div className="grid grid-cols-7 gap-4 pb-3 border-b border-gray-200 mb-2">
                <div className="font-medium text-gray-700 text-xs sm:text-sm">Area</div>
                <div className="font-medium text-gray-700 text-xs sm:text-sm">Coordinate</div>
                <div className="font-medium text-gray-700 text-xs sm:text-sm">Competitor Name</div>
                <div className="font-medium text-gray-700 text-xs sm:text-sm">Competitor Rank</div>
                <div className="font-medium text-gray-700 text-xs sm:text-sm">Your Rank</div>
                <div className="font-medium text-gray-700 text-xs sm:text-sm">Competitor Rating</div>
                <div className="font-medium text-gray-700 text-xs sm:text-sm">Competitor Review</div>
              </div>
              
              {/* Data Rows */}
              <div className="space-y-2">
                {underPerformingAreas.length > 0 ? (
                  underPerformingAreas.map(area => (
                    <div key={area.id} className="grid grid-cols-7 gap-4 py-3 px-3 rounded-lg hover:bg-gray-50 transition-colors items-center">
                      <div className="text-gray-900 text-xs sm:text-sm font-medium">{area.areaName}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-900 text-xs sm:text-sm" title={area.coordinate}>
                          {formatCoordinate(area.coordinate)}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0 hover:bg-gray-200" 
                          onClick={() => handleCopyCoordinate(area.coordinate)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="text-gray-900 text-xs sm:text-sm font-medium">{area.compName}</div>
                      <div className="text-gray-900 text-xs sm:text-sm">#{area.compRank}</div>
                      <div className="text-gray-900 text-xs sm:text-sm">
                        {area.youRank === 'NA' ? 'Not Ranked' : `#${area.youRank}`}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-900 text-xs sm:text-sm">{area.compRating}</span>
                        <span className="text-yellow-500 text-xs">★</span>
                      </div>
                      <div className="text-gray-900 text-xs sm:text-sm">{area.compReview}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No under-performing areas found
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};