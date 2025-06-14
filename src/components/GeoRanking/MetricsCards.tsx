
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Eye } from 'lucide-react';
import { CircularProgress } from '../ui/circular-progress';

export const MetricsCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
      <Card className="bg-white">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Overall Visibility</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">36%</p>
              <p className="text-xs text-green-600 mt-1">+5.2% from last month</p>
            </div>
            <div className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
              <CircularProgress value={36} size={48} className="text-blue-500 sm:w-16 sm:h-16" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Click Rate</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">12.4%</p>
              <p className="text-xs text-red-600 mt-1">-1.2% CTR</p>
            </div>
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Eye className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white sm:col-span-2 lg:col-span-1">
        <CardContent className="p-4 sm:p-6">
          <div>
            <div className="flex flex-wrap gap-2">
              <div className="flex rounded border overflow-hidden shadow-sm">
                <div className="bg-blue-600 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold">ARP</div>
                <div className="bg-white text-gray-800 px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold border-l">8.50</div>
              </div>
              
              <div className="flex rounded border overflow-hidden shadow-sm">
                <div className="bg-blue-600 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold">ATRP</div>
                <div className="bg-white text-gray-800 px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold border-l">6.20</div>
              </div>
              
              <div className="flex rounded border overflow-hidden shadow-sm">
                <div className="bg-blue-600 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold">SoLV</div>
                <div className="bg-white text-gray-800 px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold border-l">36.0%</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
