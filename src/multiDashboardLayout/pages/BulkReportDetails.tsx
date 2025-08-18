import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  Mail, 
  ChevronLeft, 
  ChevronRight,
  Search,
  RefreshCw,
  FileText,
  Users,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  XCircle
} from 'lucide-react';
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

export const BulkReportDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
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
    bulkResendEmails
  } = useBulkReportDetails(projectId || '');

  const handleSearch = useCallback((value: string) => {
    setSearchInput(value);
    updateFilters({ search: value });
  }, [updateFilters]);

  const handleStatusFilter = useCallback((status: string) => {
    updateFilters({ status: status as any });
  }, [updateFilters]);

  const handleDeliveryFilter = useCallback((deliveryStatus: string) => {
    updateFilters({ deliveryStatus: deliveryStatus as any });
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
        description: "Report email has been resent successfully.",
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to resend email",
        variant: "destructive"
      });
    }
  }, [resendEmail]);

  const handleDownload = useCallback(async (reportId: string) => {
    const result = await downloadReport(reportId);
    if (result.success) {
      toast({
        title: "Download Started",
        description: "Report download has started.",
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to download report",
        variant: "destructive"
      });
    }
  }, [downloadReport]);

  const handleBulkResend = useCallback(async () => {
    if (selectedReports.size === 0) return;
    
    const result = await bulkResendEmails(Array.from(selectedReports));
    if (result.success) {
      toast({
        title: "Emails Sent",
        description: `${selectedReports.size} emails have been resent successfully.`,
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
        return <Badge variant="default" className="bg-green-500/10 text-green-700 border-green-200">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Generated
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
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-muted rounded w-1/3"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">
          {error || 'Failed to load bulk report details'}
        </p>
        <Button onClick={refresh}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  const { project, reports, pagination } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{project.name}</h1>
          <p className="text-muted-foreground">
            Bulk report details • {project.totalLocations} locations
          </p>
        </div>
      </div>

      {/* Project Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Reports</p>
                <p className="text-2xl font-bold">{pagination.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Generated</p>
                <p className="text-2xl font-bold">
                  {reports.filter(r => r.status === 'generated').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Emails Sent</p>
                <p className="text-2xl font-bold">
                  {reports.filter(r => r.deliveryStatus === 'sent').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Schedule</p>
                <p className="text-lg font-semibold capitalize">{project.scheduleType}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by location name..."
                  value={searchInput}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filters.status} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Report Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reports</SelectItem>
                <SelectItem value="generated">Generated</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.deliveryStatus} onValueChange={handleDeliveryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Delivery Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Delivery</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedReports.size > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">
                {selectedReports.size} report{selectedReports.size > 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleBulkResend}>
                  <Mail className="w-4 h-4 mr-2" />
                  Resend Emails
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Report Details</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={reports.length > 0 && selectedReports.size === reports.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Report Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Delivery</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedReports.has(report.id)}
                      onCheckedChange={(checked) => handleSelectReport(report.id, checked as boolean)}
                    />
                  </TableCell>
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
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(report.reportDate), 'hh:mm a')}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(report.status)}
                    {report.errorMessage && (
                      <div className="text-xs text-red-600 mt-1">
                        {report.errorMessage}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {getDeliveryBadge(report.deliveryStatus)}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-48">
                      {report.recipients.map((email, index) => (
                        <div key={index} className="text-xs text-muted-foreground truncate">
                          {email}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 justify-end">
                      {report.status === 'generated' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(report.id)}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      )}
                      {(report.deliveryStatus === 'failed' || report.deliveryStatus === 'pending') && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleResendEmail(report.id)}
                        >
                          <Mail className="w-4 h-4 mr-1" />
                          Resend
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * pagination.limit + 1} to{' '}
            {Math.min(currentPage * pagination.limit, pagination.total)} of{' '}
            {pagination.total} entries
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {pagination.pages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.pages))}
              disabled={currentPage === pagination.pages}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};