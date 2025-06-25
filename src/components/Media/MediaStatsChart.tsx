
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FileImage, Video } from 'lucide-react';

const data = [
  {
    name: 'Images',
    count: 245,
    views: 12400,
    fill: '#3b82f6'
  },
  {
    name: 'Videos', 
    count: 89,
    views: 8200,
    fill: '#10b981'
  }
];

export const MediaStatsChart: React.FC = () => {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <FileImage className="w-5 h-5" />
          Media Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [value, name === 'count' ? 'Total Files' : 'Total Views']}
              />
              <Bar dataKey="count" name="count" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-between items-center mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>245 Images</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>89 Videos</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
