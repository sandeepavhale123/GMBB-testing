
import React from 'react';
import { Card, CardContent } from '../ui/card';

interface MediaStatsCardsProps {
  totalItems: number;
  currentPageItems: number;
}

export const MediaStatsCards: React.FC<MediaStatsCardsProps> = ({
  totalItems,
  currentPageItems
}) => {
  return (
    <Card className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-md text-black mb-2">Total media uploaded</h3>
        </div>
        <div className="space-y-6">
          <div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{totalItems}</div>
          </div>
          <hr />
          <div>
            <div className="text-md text-black mb-2">Current page items</div>
            <div className="text-3xl font-bold text-gray-900">{currentPageItems}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
