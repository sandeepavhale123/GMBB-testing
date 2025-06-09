
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { BarChart3, TrendingUp } from 'lucide-react';
import { useAppSelector } from '../../hooks/useRedux';

export const EnhancedActivityChart: React.FC = () => {
  const { performanceData } = useAppSelector((state) => state.dashboard);
  const [chartType, setChartType] = useState<'line' | 'area'>('line');

  const ChartComponent = chartType === 'line' ? LineChart : AreaChart;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Daily Activity Summary</CardTitle>
            <p className="text-sm text-muted-foreground">
              Track your daily activity metrics over time
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={chartType === 'line' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('line')}
            >
              <TrendingUp className="w-4 h-4" />
            </Button>
            <Button
              variant={chartType === 'area' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('area')}
            >
              <BarChart3 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ChartComponent data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                className="text-xs"
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                className="text-xs"
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              
              {chartType === 'line' ? (
                <>
                  <Line type="monotone" dataKey="posts" stroke="hsl(var(--primary))" strokeWidth={2} name="Posts" />
                  <Line type="monotone" dataKey="mediaResponded" stroke="hsl(142 76% 36%)" strokeWidth={2} name="Media Responded" />
                  <Line type="monotone" dataKey="reviews" stroke="hsl(25 95% 53%)" strokeWidth={2} name="Reviews" />
                  <Line type="monotone" dataKey="qa" stroke="hsl(262 83% 58%)" strokeWidth={2} name="Q&A" />
                </>
              ) : (
                <>
                  <Area type="monotone" dataKey="posts" stackId="1" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="mediaResponded" stackId="1" stroke="hsl(142 76% 36%)" fill="hsl(142 76% 36%)" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="reviews" stackId="1" stroke="hsl(25 95% 53%)" fill="hsl(25 95% 53%)" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="qa" stackId="1" stroke="hsl(262 83% 58%)" fill="hsl(262 83% 58%)" fillOpacity={0.3} />
                </>
              )}
            </ChartComponent>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
