import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
export const ProgressDonutChart: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'manual' | 'genie'>('manual');
  const data = [{
    name: 'Manual',
    value: 66.7,
    color: '#1e3a8a'
  }, {
    name: 'Genie',
    value: 30.2,
    color: '#3b82f6'
  }, {
    name: 'Other',
    value: 3.1,
    color: '#93c5fd'
  }];
  const centerValue = data.find(item => item.name === 'Manual')?.value || 66.7;
  return;
};