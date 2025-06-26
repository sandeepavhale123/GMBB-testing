
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { FileImage } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

interface MediaStatsChartProps {
  imageCount: number;
  videoCount: number;
  isLoading?: boolean;
}

export const MediaStatsChart: React.FC<MediaStatsChartProps> = ({
  imageCount,
  videoCount,
  isLoading = false
}) => {
  const data = [
    {
      name: 'Images',
      count: imageCount,
      views: imageCount * 50, // Placeholder calculation
      fill: '#3b82f6'
    },
    {
      name: 'Videos', 
      count: videoCount,
      views: videoCount * 92, // Placeholder calculation
      fill: '#10b981'
    }
  ];

  if (isLoading) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <FileImage className="w-5 h-5" />
            Media Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center">
            <Skeleton className="w-32 h-32 rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <FileImage className="w-5 h-5" />
          Media Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="40%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={5}
                dataKey="count"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Legend 
                verticalAlign="middle" 
                align="right"
                layout="vertical"
                iconType="circle"
                wrapperStyle={{
                  paddingLeft: '20px',
                  fontSize: '14px'
                }}
                formatter={(value) => {
                  const item = data.find(d => d.name === value);
                  return (
                    <span style={{ color: item?.fill }}>
                      {item?.count} {value}
                    </span>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
