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
            {recentReports.map((report, index) => <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">{report.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {report.type} • {report.date} • {report.listings} listings
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${report.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {report.status}
                  </span>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              </div>)}
          </div>
        </div>
      </div>
    </div>;
};