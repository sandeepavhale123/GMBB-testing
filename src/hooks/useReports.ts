import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reportsApi } from '../api/reportsApi';
import { CreateReportRequest } from '../types/reportTypes';
import { toast } from './use-toast';

export const useReports = (listingId: string) => {
  return useQuery({
    queryKey: ['reports', listingId],
    queryFn: () => reportsApi.getReports(listingId),
    enabled: !!listingId,
  });
};

export const useCreateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReportRequest) => reportsApi.createReport(data),
    onSuccess: (newReport, variables) => {
      // Invalidate and refetch reports for the specific listing
      queryClient.invalidateQueries({ queryKey: ['reports', variables.listingId] });
      
      toast({
        title: "Report Created",
        description: `Your ${variables.type.toLowerCase()} report is being generated.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create report. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useReport = (reportId: string) => {
  return useQuery({
    queryKey: ['report', reportId],
    queryFn: () => reportsApi.getReport(reportId),
    enabled: !!reportId,
  });
};