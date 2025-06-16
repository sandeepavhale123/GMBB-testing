
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';

interface SettingsSubHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const SettingsSubHeader: React.FC<SettingsSubHeaderProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          
          <Tabs value={activeTab} onValueChange={onTabChange} className="w-auto">
            <TabsList className="grid w-fit grid-cols-2">
              <TabsTrigger value="google-account" className="px-6">
                Manage Google Account
              </TabsTrigger>
              <TabsTrigger value="genie-subscription" className="px-6">
                Genie Subscription
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
