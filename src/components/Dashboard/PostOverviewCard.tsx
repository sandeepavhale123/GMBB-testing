
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Plus, FileText, Calendar, AlertTriangle } from 'lucide-react';
import { useAppSelector } from '../../hooks/useRedux';

export const PostOverviewCard: React.FC = () => {
  const { postStatus } = useAppSelector((state) => state.dashboard);
  
  const totalPosts = postStatus.live + postStatus.scheduled + postStatus.failed;

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Post Overview</CardTitle>
          <span className="text-sm font-medium text-gray-500">{totalPosts} total</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Live Posts */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">Live Posts</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">All good</p>
            </div>
          </div>
          <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm font-semibold">
            {postStatus.live}
          </div>
        </div>

        {/* Scheduled Posts */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">Scheduled</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">All good</p>
            </div>
          </div>
          <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
            {postStatus.scheduled}
          </div>
        </div>

        {/* Failed Posts */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">Failed</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Needs attention</p>
            </div>
          </div>
          <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-3 py-1 rounded-full text-sm font-semibold">
            {postStatus.failed}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Create New Post
          </Button>
          <Button variant="outline" className="w-full border-gray-200 text-gray-700 hover:bg-gray-50">
            Manage Posts
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
