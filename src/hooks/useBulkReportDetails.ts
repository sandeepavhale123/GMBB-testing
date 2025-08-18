import { useState, useEffect, useCallback } from 'react';
import { BulkReportDetailsResponse, BulkReportFilters, ReportDetail } from '@/types/bulkReportTypes';

// Mock data for development - replace with actual API calls
const mockBulkReportDetails: BulkReportDetailsResponse = {
  project: {
    id: 'prj-001',
    name: 'Q1 2024 Hotel Performance Report',
    totalLocations: 24,
    reportSections: ['GMB Health', 'Reviews', 'Insights', 'Media'],
    scheduleType: 'monthly',
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
    lastUpdate: '2024-01-30T15:30:00Z',
    emailRecipients: ['manager@hotel.com', 'analytics@hotel.com']
  },
  reports: [
    {
      id: 'rpt-001',
      locationName: 'Grand Plaza Hotel Downtown',
      address: '123 Main St, New York, NY 10001',
      reportDate: '2024-01-30T10:00:00Z',
      status: 'generated',
      deliveryStatus: 'sent',
      recipients: ['manager@hotel.com', 'analytics@hotel.com'],
      reportUrl: '#',
      fileSize: '2.4 MB',
      sections: ['GMB Health', 'Reviews', 'Insights', 'Media']
    },
    {
      id: 'rpt-002',
      locationName: 'Boutique Hotel Midtown',
      address: '456 Park Ave, New York, NY 10022',
      reportDate: '2024-01-30T10:05:00Z',
      status: 'generated',
      deliveryStatus: 'pending',
      recipients: ['manager@hotel.com'],
      reportUrl: '#',
      fileSize: '1.8 MB',
      sections: ['GMB Health', 'Reviews', 'Insights']
    },
    {
      id: 'rpt-003',
      locationName: 'Luxury Resort Upstate',
      address: '789 Mountain View Rd, Albany, NY 12203',
      reportDate: '2024-01-30T10:10:00Z',
      status: 'failed',
      deliveryStatus: 'failed',
      recipients: ['manager@hotel.com'],
      errorMessage: 'Insufficient data for insights section',
      sections: ['GMB Health', 'Reviews']
    },
    {
      id: 'rpt-004',
      locationName: 'Business Hotel Times Square',
      address: '321 Broadway, New York, NY 10036',
      reportDate: '2024-01-30T10:15:00Z',
      status: 'pending',
      deliveryStatus: 'pending',
      recipients: ['manager@hotel.com', 'analytics@hotel.com'],
      sections: ['GMB Health', 'Reviews', 'Insights', 'Media']
    }
  ],
  pagination: {
    total: 24,
    page: 1,
    pages: 6,
    limit: 4
  }
};

export const useBulkReportDetails = (projectId: string) => {
  const [data, setData] = useState<BulkReportDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<BulkReportFilters>({
    search: '',
    status: 'all',
    deliveryStatus: 'all'
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In real implementation, make API call here
      // const response = await bulkReportApi.getBulkReportDetails(projectId, currentPage, filters);
      
      setData(mockBulkReportDetails);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bulk report details');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [projectId, currentPage, filters]);

  useEffect(() => {
    if (projectId) {
      fetchData();
    }
  }, [projectId, fetchData]);

  const updateFilters = useCallback((newFilters: Partial<BulkReportFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filtering
  }, []);

  const resendEmail = useCallback(async (reportId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state to reflect the resend
      setData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          reports: prev.reports.map(report =>
            report.id === reportId
              ? { ...report, deliveryStatus: 'sent' as const }
              : report
          )
        };
      });
      
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to resend email' };
    }
  }, []);

  const downloadReport = useCallback(async (reportId: string) => {
    try {
      // Simulate download
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to download report' };
    }
  }, []);

  const bulkResendEmails = useCallback(async (reportIds: string[]) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update local state
      setData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          reports: prev.reports.map(report =>
            reportIds.includes(report.id)
              ? { ...report, deliveryStatus: 'sent' as const }
              : report
          )
        };
      });
      
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to resend emails' };
    }
  }, []);

  return {
    data,
    loading,
    error,
    currentPage,
    setCurrentPage,
    filters,
    updateFilters,
    refresh: fetchData,
    resendEmail,
    downloadReport,
    bulkResendEmails
  };
};