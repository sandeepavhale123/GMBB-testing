import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReportNotificationsTab } from './ReportNotificationsTab';
import { CustomNotificationsTab } from './CustomNotificationsTab';

export const NotificationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('report-notifications');

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Manage Report Notifications</h1>
        <p className="text-muted-foreground mt-2">
          Configure automated report notifications and custom recipients for your GMB reports.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="inline-flex h-auto w-full justify-start rounded-none border-b bg-transparent p-0">
          <TabsTrigger value="report-notifications">Report Notifications</TabsTrigger>
          <TabsTrigger value="custom-notifications">Custom Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="report-notifications" className="mt-6">
          <ReportNotificationsTab />
        </TabsContent>
        
        <TabsContent value="custom-notifications" className="mt-6">
          <CustomNotificationsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};