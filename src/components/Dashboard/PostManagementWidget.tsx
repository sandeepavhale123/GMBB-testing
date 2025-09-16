
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Plus, Settings, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useAppSelector } from '../../hooks/useRedux';

export const PostManagementWidget: React.FC = () => {
  const { postStatus } = useAppSelector((state) => state.dashboard);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Post Overview</CardTitle>
        <p className="text-sm text-muted-foreground">
          Manage your Google Business Profile posts
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Post Status Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
              <div className="flex justify-center mb-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">{postStatus.live}</div>
              <div className="text-sm text-muted-foreground">Live Posts</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <div className="flex justify-center mb-2">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600">{postStatus.scheduled}</div>
              <div className="text-sm text-muted-foreground">Scheduled</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
              <div className="flex justify-center mb-2">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="text-2xl font-bold text-red-600">{postStatus.failed}</div>
              <div className="text-sm text-muted-foreground">Failed</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button className="flex-1">
              <Plus className="w-4 h-4 mr-1" />
              Create New Post
            </Button>
            <Button variant="outline" className="flex-1">
              <Settings className="w-4 h-4 mr-1" />
              Manage Posts
            </Button>
          </div>

          {/* Status Indicators */}
          {postStatus.failed > 0 && (
            <div className="p-3 rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-800 dark:text-red-200">
                  {postStatus.failed} posts need attention
                </span>
                <Badge variant="destructive" className="ml-auto">Action Required</Badge>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
