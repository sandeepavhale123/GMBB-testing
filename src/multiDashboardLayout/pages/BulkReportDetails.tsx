import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Mail, ChevronLeft, ChevronRight, Search, RefreshCw, FileText, Users, Calendar, CheckCircle2, AlertCircle, Clock, XCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { useBulkReportDetails } from '@/hooks/useBulkReportDetails';
import { format } from 'date-fns';
import { ReportDetail } from '@/types/bulkReportTypes';
import { ReportsEmptyState } from '@/components/Reports/ReportsEmptyState';
export const BulkReportDetails: React.FC = () => {
  const {
    projectId
  } = useParams<{
    projectId: string;
  }>();
  const navigate = useNavigate();
  const [selectedReports, setSelectedReports] = useState<Set<string>>(new Set());
  const [searchInput, setSearchInput] = useState('');
  const {
    data,
    loading,
    error,
    currentPage,
    setCurrentPage,
    filters,
    updateFilters,
    refresh,
    resendEmail,
    downloadReport,
    downloadAllInOnePdf,
    bulkResendEmails
  } = useBulkReportDetails(projectId || '');
  const handleSearch = useCallback((value: string) => {
    setSearchInput(value);
    updateFilters({
      search: value
    });
  }, [updateFilters]);
  const handleStatusFilter = useCallback((status: string) => {
    updateFilters({
      status: status as any
    });
  }, [updateFilters]);
  const handleDeliveryFilter = useCallback((deliveryStatus: string) => {
    updateFilters({
      deliveryStatus: deliveryStatus as any
    });
  }, [updateFilters]);
  const handleSelectReport = useCallback((reportId: string, checked: boolean) => {
    setSelectedReports(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(reportId);
      } else {
        newSet.delete(reportId);
      }
      return newSet;
    });
  }, []);
  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked && data?.reports) {
      setSelectedReports(new Set(data.reports.map(r => r.id)));
    } else {
      setSelectedReports(new Set());
    }
  }, [data?.reports]);
  const handleResendEmail = useCallback(async (reportId: string) => {
    const result = await resendEmail(reportId);
    if (result.success) {
      toast({
        title: "Email Sent",
        description: "Report email has been resent successfully."
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to resend email",
        variant: "destructive"
      });
    }
  }, [resendEmail]);
  const handleDownload = useCallback(async (reportId: string, format: 'pdf' | 'csv' = 'pdf') => {
    const result = await downloadReport(reportId, format);
    if (result.success) {
      toast({
        title: "Download Started",
        description: `${format.toUpperCase()} download has started.`
      });
    } else {
      toast({
        title: "Error",
        description: result.error || `Failed to download ${format.toUpperCase()}`,
        variant: "destructive"
      });
    }
  }, [downloadReport]);

  const handleDownloadAllPdf = useCallback(async () => {
    const result = await downloadAllInOnePdf();
    if (result.success) {
      toast({
        title: "Download Started",
        description: "All-in-one PDF download has started."
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to download all-in-one PDF",
        variant: "destructive"
      });
    }
  }, [downloadAllInOnePdf]);
  const handleBulkResend = useCallback(async () => {
    if (selectedReports.size === 0) return;
    const result = await bulkResendEmails(Array.from(selectedReports));
    if (result.success) {
      toast({
        title: "Emails Sent",
        description: `${selectedReports.size} emails have been resent successfully.`
      });
      setSelectedReports(new Set());
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to resend emails",
        variant: "destructive"
      });
    }
  }, [bulkResendEmails, selectedReports]);
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'generated':
      case 'completed':
        return <Badge variant="default" className="bg-green-500/10 text-green-700 border-green-200">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Completed
        </Badge>;
      case 'processing':
        return <Badge variant="secondary" className="bg-blue-500/10 text-blue-700 border-blue-200">
          <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
          Processing
        </Badge>;
      case 'failed':
        return <Badge variant="destructive" className="bg-red-500/10 text-red-700 border-red-200">
          <XCircle className="w-3 h-3 mr-1" />
          Failed
        </Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-700 border-yellow-200">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };
  const getDeliveryBadge = (deliveryStatus: string) => {
    switch (deliveryStatus) {
      case 'sent':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-200">
          <Mail className="w-3 h-3 mr-1" />
          Sent
        </Badge>;
      case 'failed':
        return <Badge variant="destructive" className="bg-red-500/10 text-red-700 border-red-200">
          <AlertCircle className="w-3 h-3 mr-1" />
          Failed
        </Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-700 border-yellow-200">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>;
      default:
        return <Badge variant="secondary">{deliveryStatus}</Badge>;
    }
  };
  if (loading) {
    return <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-muted rounded w-1/3"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>;
  }
  if (error || !data) {
    return <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">
          {error || 'Failed to load bulk report details'}
        </p>
        <Button onClick={refresh}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>;
  }
  const {
    project,
    reports,
    pagination
  } = data;
  return <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
          <p className="text-muted-foreground">
            Bulk report details • {project.totalLocations} locations
          </p>
          {project.emailRecipients.length > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              Recipients: {project.emailRecipients.join(', ')}
            </p>
          )}
        </div>
        {data?.allInOnePdfReport && reports.length > 0 && (
          <Button onClick={handleDownloadAllPdf} className="flex items-center gap-2 self-start sm:self-auto">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download All-in-One PDF</span>
            <span className="sm:hidden">Download PDF</span>
          </Button>
        )}
      </div>

      {/* Reports Table or Empty State */}
      <Card>
        {reports.length > 0 ? (
          <>
            <CardHeader>
              <CardTitle>Report Details</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Location</TableHead>
                    <TableHead>Report Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map(report => <TableRow key={report.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{report.locationName}</div>
                          <div className="text-sm text-muted-foreground">{report.address}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {format(new Date(report.reportDate), 'MMM dd, yyyy')}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(report.status)}
                        {report.errorMessage && <div className="text-xs text-red-600 mt-1">
                            {report.errorMessage}
                          </div>}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 justify-end">
                          {report.csvUrl && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDownload(report.id, 'csv')}
                            >
                              CSV
                            </Button>
                          )}
                          {report.pdfUrl && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDownload(report.id, 'pdf')}
                            >
                              PDF
                            </Button>
                          )}
                          {report.htmlUrl && (
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 w-8 p-0"
                              onClick={() => window.open(report.htmlUrl!, '_blank')}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
            </CardContent>
          </>
        ) : (
          <CardContent>
            <ReportsEmptyState onRefresh={refresh} />
          </CardContent>
        )}
      </Card>

      {/* Pagination */}
      {pagination.pages > 1 && <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * pagination.limit + 1} to{' '}
            {Math.min(currentPage * pagination.limit, pagination.total)} of{' '}
            {pagination.total} entries
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {pagination.pages}
            </span>
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.pages))} disabled={currentPage === pagination.pages}>
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>}
    </div>;
};