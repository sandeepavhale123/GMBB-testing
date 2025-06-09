
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { CheckCircle, Clock, MessageSquare } from 'lucide-react';
import { useAppSelector } from '../../hooks/useRedux';

export const QACard: React.FC = () => {
  const { qaStats } = useAppSelector((state) => state.dashboard);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Questions & Answers</CardTitle>
          <span className="text-sm font-medium text-muted-foreground">{qaStats.responseRate}% response rate</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats */}
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-3 rounded-lg bg-green-50">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm text-gray-900">Answered</p>
              <p className="text-xs text-muted-foreground">Questions responded to</p>
            </div>
            <span className="text-2xl font-bold text-green-600">{qaStats.answered}</span>
          </div>

          <div className="flex items-center gap-4 p-3 rounded-lg bg-yellow-50">
            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm text-gray-900">Pending</p>
              <p className="text-xs text-muted-foreground">Awaiting response</p>
            </div>
            <span className="text-2xl font-bold text-yellow-600">{qaStats.pending}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button className="w-full bg-gray-900 hover:bg-gray-800">
            <MessageSquare className="w-4 h-4 mr-2" />
            Answer Pending Questions
          </Button>
          <Button variant="outline" className="w-full">
            View All Q&A
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
