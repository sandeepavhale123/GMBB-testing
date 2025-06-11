
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { AlertTriangle, Clock, Camera, ArrowRight } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../hooks/useRedux';
import { completeQuickWin } from '../../store/slices/dashboardSlice';

export const QuickWinsCard: React.FC = () => {
  const { quickWins } = useAppSelector((state) => state.dashboard);
  const dispatch = useAppDispatch();

  const getIcon = (title: string) => {
    if (title.toLowerCase().includes('photo')) return Camera;
    if (title.toLowerCase().includes('hours')) return Clock;
    return AlertTriangle;
  };

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Quick Wins ({quickWins.length})</CardTitle>
            <p className="text-sm text-muted-foreground">
              Improve your listing with these quick actions
            </p>
          </div>
        </div>
        {/* Main CTA Button */}
        <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white">
          Fix All Issues
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {quickWins.map((win) => {
          const Icon = getIcon(win.title);
          return (
            <div key={win.id} className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getPriorityColor(win.priority)}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-900">{win.title}</p>
                <p className="text-xs text-muted-foreground">{win.description}</p>
              </div>
              <Button
                size="sm"
                className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => dispatch(completeQuickWin(win.id))}
              >
                Fix Issue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          );
        })}
        <Button variant="outline" className="w-full">
          View All Fixes
        </Button>
      </CardContent>
    </Card>
  );
};
