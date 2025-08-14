import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Heart, 
  MessageSquare, 
  FileText, 
  BarChart3, 
  MapPin, 
  Search,
  Send,
  Info
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ReportType {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  enabled: boolean;
  frequency: 'daily' | 'when-updated' | 'off';
  recipients: string;
  lastSent?: string;
  nextScheduled?: string;
  status: 'active' | 'paused';
}

const REPORT_TYPES: ReportType[] = [
  {
    id: 'gmb-health',
    name: 'GMB Health Report',
    description: 'Comprehensive health check of your Google My Business listing',
    icon: Heart,
    enabled: true,
    frequency: 'daily',
    recipients: 'Default recipients',
    lastSent: '2024-01-15 09:00',
    nextScheduled: '2024-01-16 09:00',
    status: 'active'
  },
  {
    id: 'review-report',
    name: 'Review Report',
    description: 'Analysis of customer reviews and ratings',
    icon: MessageSquare,
    enabled: true,
    frequency: 'when-updated',
    recipients: 'Default recipients',
    lastSent: '2024-01-14 14:30',
    status: 'active'
  },
  {
    id: 'post-report',
    name: 'Post Report',
    description: 'Performance metrics for your GMB posts',
    icon: FileText,
    enabled: false,
    frequency: 'off',
    recipients: 'Default recipients',
    status: 'paused'
  },
  {
    id: 'insight-report',
    name: 'Insight Report',
    description: 'Customer interaction insights and analytics',
    icon: BarChart3,
    enabled: true,
    frequency: 'daily',
    recipients: 'Custom: admin@company.com',
    lastSent: '2024-01-15 09:00',
    nextScheduled: '2024-01-16 09:00',
    status: 'active'
  },
  {
    id: 'geo-ranking',
    name: 'GEO Ranking Report',
    description: 'Local search ranking performance',
    icon: MapPin,
    enabled: false,
    frequency: 'off',
    recipients: 'Default recipients',
    status: 'paused'
  },
  {
    id: 'citation-audit',
    name: 'Citation Audit Report',
    description: 'Business listing consistency across directories',
    icon: Search,
    enabled: true,
    frequency: 'when-updated',
    recipients: 'Default recipients',
    lastSent: '2024-01-12 11:15',
    status: 'active'
  }
];

export const ReportNotificationsTab: React.FC = () => {
  const [reportTypes, setReportTypes] = useState<ReportType[]>(REPORT_TYPES);
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setReportTypes(prev => prev.map(report => ({
      ...report,
      enabled: checked,
      status: checked ? 'active' : 'paused',
      frequency: checked ? (report.frequency === 'off' ? 'daily' : report.frequency) : 'off'
    })));
  };

  const handleReportToggle = (reportId: string, enabled: boolean) => {
    setReportTypes(prev => prev.map(report => 
      report.id === reportId 
        ? { 
            ...report, 
            enabled, 
            status: enabled ? 'active' : 'paused',
            frequency: enabled ? (report.frequency === 'off' ? 'daily' : report.frequency) : 'off'
          }
        : report
    ));
  };

  const handleFrequencyChange = (reportId: string, frequency: 'daily' | 'when-updated' | 'off') => {
    setReportTypes(prev => prev.map(report => 
      report.id === reportId 
        ? { 
            ...report, 
            frequency,
            enabled: frequency !== 'off',
            status: frequency !== 'off' ? 'active' : 'paused'
          }
        : report
    ));
  };

  const getFrequencyBadge = (frequency: string) => {
    const variants = {
      daily: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
      'when-updated': 'bg-green-100 text-green-800 hover:bg-green-100',
      off: 'bg-gray-100 text-gray-600 hover:bg-gray-100'
    };
    return variants[frequency as keyof typeof variants] || variants.off;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
           
            <label htmlFor="select-all" className="text-sm font-medium">
              Select All Reports
            </label>
          </div>
        </div>
        <Button className="flex items-center gap-2">
          <Send className="h-4 w-4" />
          Update Notifications
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                 <Checkbox 
              id="select-all"
              checked={selectAll}
              onCheckedChange={handleSelectAll}
            />
                Select
              </TableHead>
              <TableHead>Report Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reportTypes.map((report) => {
              const Icon = report.icon;
              return (
                <TableRow key={report.id}>
                  <TableCell>
                    <Checkbox
                      checked={report.enabled}
                      onCheckedChange={(checked) => handleReportToggle(report.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{report.name}</div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="text-sm text-muted-foreground flex items-center gap-1">
                                {report.description}
                                <Info className="h-3 w-3" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">{report.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary" 
                      className={report.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}
                    >
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select 
                      value={report.frequency} 
                      onValueChange={(value) => handleFrequencyChange(report.id, value as any)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="when-updated">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span>When Updated</span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Send only when there's new or changed report data</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </SelectItem>
                        <SelectItem value="off">Off</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                 
                  <TableCell>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Send className="h-3 w-3" />
                      Test
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Activity Log</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div>• GMB Health Report sent to 3 recipients - Success (Jan 15, 2024 09:00)</div>
          <div>• Insight Report sent to admin@company.com - Success (Jan 15, 2024 09:00)</div>
          <div>• Review Report sent to 3 recipients - Success (Jan 14, 2024 14:30)</div>
          <div>• Citation Audit Report sent to 3 recipients - Success (Jan 12, 2024 11:15)</div>
        </div>
      </div>
    </div>
  );
};