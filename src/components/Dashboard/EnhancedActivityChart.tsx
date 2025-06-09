import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { BarChart3, TrendingUp } from 'lucide-react';
import { useAppSelector } from '../../hooks/useRedux';
export const EnhancedActivityChart: React.FC = () => {
  const {
    performanceData
  } = useAppSelector(state => state.dashboard);
  const [chartType, setChartType] = useState<'line' | 'area'>('line');
  const ChartComponent = chartType === 'line' ? LineChart : AreaChart;
  return <Card>
      
      
    </Card>;
};