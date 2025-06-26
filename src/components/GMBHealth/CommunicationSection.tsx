
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { FileText, HelpCircle, Calendar, AlertTriangle } from 'lucide-react';

export const CommunicationSection: React.FC = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Communication</CardTitle>
        <Badge variant="secondary" className="bg-orange-100 text-orange-700">80%</Badge>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="posts" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              GMB Posts
            </TabsTrigger>
            <TabsTrigger value="qa" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              Q&A
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="posts" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Total Posts: 69</p>
                <p className="text-sm text-gray-600">Last post: 2 days ago</p>
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Schedule Post
              </Button>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-800">Good posting frequency</span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                You're maintaining a consistent posting schedule. Keep it up!
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="qa" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Total Questions: 0</p>
                <p className="text-sm text-gray-600">Unanswered: 0</p>
              </div>
              <Button variant="outline">View Q&A</Button>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium text-red-800">No questions yet</span>
              </div>
              <p className="text-sm text-red-700 mt-1">
                Encourage customers to ask questions to improve engagement.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
