
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { CircularProgress } from '../ui/circular-progress';
import { Zap, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../hooks/useRedux';
import { completeQuickWin } from '../../store/slices/dashboardSlice';
import { cn } from '../../lib/utils';

export const HealthScoreSection: React.FC = () => {
  const { healthScore, aiActions, manualActions, quickWins } = useAppSelector(
    (state) => state.dashboard
  );
  const dispatch = useAppDispatch();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'critical':
        return 'text-red-600';
      default:
        return 'text-muted-foreground';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'medium':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Health Score & Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Health Score & Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Health Score */}
            <div className="text-center">
              <CircularProgress value={healthScore.score} className="mx-auto">
                <div className="text-center">
                  <div className="text-2xl font-bold">{healthScore.score}%</div>
                  <div className={cn("text-sm font-medium", getStatusColor(healthScore.status))}>
                    {healthScore.status.charAt(0).toUpperCase() + healthScore.status.slice(1)}
                  </div>
                </div>
              </CircularProgress>
              <p className="text-sm text-muted-foreground mt-2">Overall Health Score</p>
            </div>

            {/* AI vs Manual Actions */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-lg bg-accent/20">
                <CircularProgress value={aiActions} size={80} className="mx-auto">
                  <div className="text-lg font-bold">{aiActions}%</div>
                </CircularProgress>
                <p className="text-sm text-muted-foreground mt-2">AI Actions</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-accent/20">
                <CircularProgress value={manualActions} size={80} className="mx-auto">
                  <div className="text-lg font-bold">{manualActions}%</div>
                </CircularProgress>
                <p className="text-sm text-muted-foreground mt-2">Manual Actions</p>
              </div>
            </div>

            <Button className="w-full">
              <Zap className="w-4 h-4 mr-2" />
              AI Auto-Optimize
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Wins */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Quick Wins</CardTitle>
          <p className="text-sm text-muted-foreground">
            Recommended actions to improve your profile
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {quickWins.map((win) => (
              <div
                key={win.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {getPriorityIcon(win.priority)}
                  <div>
                    <p className="font-medium text-sm">{win.title}</p>
                    <p className="text-xs text-muted-foreground">{win.description}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => dispatch(completeQuickWin(win.id))}
                >
                  Complete
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
