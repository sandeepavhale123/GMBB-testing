
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { Globe, Navigation, MessageCircle, Phone, Monitor, Smartphone, MapPin } from 'lucide-react';

interface StatPillProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const StatPill: React.FC<StatPillProps> = ({ label, value, icon, color }) => {
  return (
    <div className="bg-white rounded-lg border p-3 flex items-center gap-3 hover:shadow-sm transition-shadow">
      <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}20`, color }}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-600">{label}</p>
        <p className="font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

export const ListingInsightsSection: React.FC = () => {
  const stats = [
    { label: 'Website Visits', value: 245, icon: <Globe className="h-4 w-4" />, color: '#3B82F6' },
    { label: 'Directions', value: 189, icon: <Navigation className="h-4 w-4" />, color: '#10B981' },
    { label: 'Messages', value: 23, icon: <MessageCircle className="h-4 w-4" />, color: '#8B5CF6' },
    { label: 'Calls', value: 67, icon: <Phone className="h-4 w-4" />, color: '#F59E0B' },
    { label: 'Desktop Search', value: 156, icon: <Monitor className="h-4 w-4" />, color: '#EF4444' },
    { label: 'Mobile Search', value: 234, icon: <Smartphone className="h-4 w-4" />, color: '#06B6D4' },
    { label: 'Maps', value: 178, icon: <MapPin className="h-4 w-4" />, color: '#84CC16' },
  ];

  const chartData = [
    { name: 'Google Search', value: 45, color: '#3B82F6' },
    { name: 'Google Maps', value: 35, color: '#10B981' },
    { name: 'Direct', value: 20, color: '#F59E0B' },
  ];

  const chartConfig = {
    'Google Search': { label: 'Google Search', color: '#3B82F6' },
    'Google Maps': { label: 'Google Maps', color: '#10B981' },
    'Direct': { label: 'Direct', color: '#F59E0B' },
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Listing Insights (Last 90 Days)</CardTitle>
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">70%</Badge>
      </CardHeader>
      <CardContent>
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Stats Pills */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Performance Stats</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {stats.map((stat, index) => (
                <StatPill key={index} {...stat} />
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">How customers search for your business</h3>
            <ChartContainer config={chartConfig} className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
