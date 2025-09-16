
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { RefreshCw } from 'lucide-react';

interface FiltersSidebarProps {
  selectedKeyword: string;
  setSelectedKeyword: (value: string) => void;
  gridSize: string;
  setGridSize: (value: string) => void;
}

export const FiltersSidebar: React.FC<FiltersSidebarProps> = ({
  selectedKeyword,
  setSelectedKeyword,
  gridSize,
  setGridSize
}) => {
  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-xs sm:text-sm font-medium text-gray-700 mb-2 block">Select keyword</label>
          <Select value={selectedKeyword} onValueChange={setSelectedKeyword}>
            <SelectTrigger className="text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Web Design">Web Design</SelectItem>
              <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
              <SelectItem value="SEO Services">SEO Services</SelectItem>
              <SelectItem value="Local Business">Local Business</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-xs sm:text-sm font-medium text-gray-700 mb-2 block">Select Date</label>
          <Input type="date" defaultValue="2023-02-01" className="text-sm" />
        </div>
        
        <div>
          <label className="text-xs sm:text-sm font-medium text-gray-700 mb-2 block">Grid Size</label>
          <Select value={gridSize} onValueChange={setGridSize}>
            <SelectTrigger className="text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="4*4">4×4 Grid</SelectItem>
              <SelectItem value="5*5">5×5 Grid</SelectItem>
              <SelectItem value="6*6">6×6 Grid</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button className="w-full bg-gray-800 hover:bg-gray-900 text-white text-sm">
          <RefreshCw className="w-4 h-4 mr-1" />
          Rescan
        </Button>
      </CardContent>
    </Card>
  );
};
