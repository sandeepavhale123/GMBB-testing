import React, { useState } from 'react';
import { Header } from '../Header';
import { Sidebar } from '../Sidebar';
import { Button } from '../ui/button';
import { Upload } from 'lucide-react';
import { HealthStatsCards } from './HealthStatsCards';
import { ListingPresenceSection } from './ListingPresenceSection';
import { ListingReputationSection } from './ListingReputationSection';
import { ListingInsightsSection } from './ListingInsightsSection';
import { CommunicationSection } from './CommunicationSection';

export const GMBHealthPage: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen flex w-full">
      <Sidebar 
        activeTab="health-report" 
        onTabChange={() => {}} 
        collapsed={sidebarCollapsed} 
        onToggleCollapse={toggleSidebar} 
      />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <Header onToggleSidebar={toggleSidebar} />
        
        <div className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">GMB Health Report</h1>
                <p className="text-muted-foreground">Monitor and optimize your Google My Business presence</p>
              </div>
              <Button variant="outline" className="gap-2">
                <Upload className="w-4 h-4" />
                Upload Health Report
              </Button>
            </div>

            {/* Health Stats Cards */}
            <HealthStatsCards />

            {/* Sections */}
            <div className="space-y-4">
              <ListingPresenceSection />
              <ListingReputationSection />
              <ListingInsightsSection />
              <CommunicationSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};