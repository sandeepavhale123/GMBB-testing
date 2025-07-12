import React from 'react';
import { format } from 'date-fns';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Card, CardContent } from '../ui/card';
import { Eye } from 'lucide-react';
import { Report, DateRange, CompareDateRange } from '@/types/reportTypes';

interface ReportsTableProps {
  reports: Report[];
}

export const ReportsTable: React.FC<ReportsTableProps> = ({ reports }) => {
  const formatDateRange = (dateRange: DateRange | CompareDateRange, type: 'Individual' | 'Compare') => {
    if (type === 'Individual') {
      const range = dateRange as DateRange;
      return `${format(range.from, 'dd/MM/yyyy')} to ${format(range.to, 'dd/MM/yyyy')}`;
    } else {
      const compareRange = dateRange as CompareDateRange;
      return (
        <div className="space-y-1">
          <div>Period 1: {format(compareRange.period1.from, 'dd/MM/yyyy')} to {format(compareRange.period1.to, 'dd/MM/yyyy')}</div>
          <div>Period 2: {format(compareRange.period2.from, 'dd/MM/yyyy')} to {format(compareRange.period2.to, 'dd/MM/yyyy')}</div>
        </div>
      );
    }
  };

  const getReportTypeBadgeVariant = (section: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      insights: "default",
      reviews: "secondary", 
      posts: "outline",
      media: "destructive",
      qa: "default",
      'geo-ranking': "secondary",
    };
    return variants[section] || "outline";
  };

  if (reports.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground mb-4">No reports found</p>
          <p className="text-sm text-muted-foreground">Create your first report to get started</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Report Name</TableHead>
              <TableHead>Reports</TableHead>
              <TableHead>Report Type</TableHead>
              <TableHead>Report Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>
                  <div className="font-medium">{report.name}</div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {report.reportSections.map((section) => (
                      <Badge 
                        key={section.id}
                        variant={getReportTypeBadgeVariant(section.id)}
                        className="text-xs"
                      >
                        {section.name.replace(' Section', '')}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{report.type} Report</span>
                </TableCell>
                <TableCell className="min-w-[200px]">
                  {formatDateRange(report.dateRange, report.type)}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" className="flex items-center justify-center w-10 h-10 p-0">
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};