
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Zap, ArrowRight, AlertTriangle, Camera, Clock } from 'lucide-react';

export const HealthScoreCard: React.FC = () => {
  const healthScore = 79;
  const quickWins = [
    {
      id: '1',
      title: 'Add 5+ recent photos',
      icon: Camera,
      priority: 'high'
    },
    {
      id: '2', 
      title: 'Update business hours',
      icon: Clock,
      priority: 'medium'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-orange-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Health Score</CardTitle>
          <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
            Good
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Health Score Display */}
        <div className="text-center">
          <div className="text-5xl font-bold text-blue-600 mb-2">
            {healthScore}%
          </div>
          <Progress value={healthScore} className="w-full h-2 mb-2" />
          <p className="text-sm text-muted-foreground">
            Your listing optimization score
          </p>
        </div>

        {/* AI Auto-Optimize Button */}
        <Button className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white">
          <Zap className="w-4 h-4 mr-1" />
          AI Auto-Optimize
        </Button>

        {/* View Detailed Report */}
        <Button variant="ghost" className="w-full text-gray-700 hover:text-gray-900">
          View Detailed Report
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>

        {/* Quick Wins Section */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">
            Quick Wins ({quickWins.length})
          </h3>
          <div className="space-y-3">
            {quickWins.map((win) => {
              const Icon = win.icon;
              return (
                <div key={win.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 transition-colors">
                  <div className={`${getPriorityColor(win.priority)}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="flex-1 text-sm text-gray-700">{win.title}</span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              );
            })}
          </div>
          <Button variant="link" className="w-full text-blue-600 hover:text-blue-700 mt-2">
            +1 more suggestions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
