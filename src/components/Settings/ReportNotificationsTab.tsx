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
    id: 'review-report',
    name: 'New / Updated Review Report',
    description: 'Detailed analysis of new and updated customer reviews and ratings, with report notifications sent daily or whenever updates occur.',
    icon: MessageSquare,
    enabled: true,
    frequency: 'when-updated',
    recipients: 'Default recipients',
    lastSent: '2024-01-14 14:30',
    status: 'active'
  },
  {
    id: 'post-report',
    name: 'GMB Post Report',
    description: 'Performance analysis of your GMB posts, with report notifications sent daily or whenever new updates are available.',
    icon: FileText,
    enabled: false,
    frequency: 'off',
    recipients: 'Default recipients',
    status: 'paused'
  },
  
  {
    id: 'geo-ranking',
    name: 'GEO Ranking Report',
    description: 'Local search ranking performance analysis, with report notifications sent daily or whenever updates occur.',
    icon: MapPin,
    enabled: false,
    frequency: 'off',
    recipients: 'Default recipients',
    status: 'paused'
  },
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
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 flex items-center gap-2">
                 <Checkbox 
              id="select-all"
              checked={selectAll}
              onCheckedChange={handleSelectAll}
            />
              </TableHead>
              <TableHead>Report Type</TableHead>
              <TableHead>Frequency</TableHead>
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
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};