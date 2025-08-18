import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, TrendingUp, BarChart3, PieChart } from 'lucide-react';
export const Reports: React.FC = () => {
  const quickStats = [{
    icon: FileText,
    label: 'Total Reports',
    value: '24',
    color: 'text-blue-600'
  }, {
    icon: TrendingUp,
    label: 'This Month',
    value: '8',
    color: 'text-green-600'
  }, {
    icon: BarChart3,
    label: 'Pending',
    value: '3',
    color: 'text-yellow-600'
  }, {
    icon: PieChart,
    label: 'Completed',
    value: '21',
    color: 'text-purple-600'
  }];
  const recentReports = [{
    name: 'Monthly Performance Report',
    type: 'Performance',
    date: '2024-01-15',
    status: 'Completed',
    listings: 5
  }, {
    name: 'Review Analysis Report',
    type: 'Reviews',
    date: '2024-01-14',
    status: 'Processing',
    listings: 3
  }, {
    name: 'Media Optimization Report',
    type: 'Media',
    date: '2024-01-13',
    status: 'Completed',
    listings: 8
  }];
  return <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports Management</h1>
          <p className="text-muted-foreground mt-1">
            Generate and manage reports across multiple listings
          </p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <FileText className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </div>

      {/* Quick Stats */}
      

      {/* Recent Reports */}
      <div className="bg-card rounded-lg border border-border">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Recent Reports</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentReports.map((report, index) => <div key={index} className="p-6 bg-card rounded-lg border border-border hover:shadow-md transition-shadow">
                <div className="space-y-4">
                  {/* Project Name */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{report.name}</h3>
                  </div>
                  
                  {/* Project Details Grid */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">No. of locations:</span>
                      <p className="font-medium text-foreground">{report.listings}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Scheduled Status:</span>
                      <p className="font-medium text-foreground">One Time</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Last Update:</span>
                      <p className="font-medium text-foreground">{report.date}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Next Update:</span>
                      <p className="font-medium text-foreground">N/A</p>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <TrendingUp className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                      <BarChart3 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>)}
          </div>
        </div>
      </div>
    </div>;
};