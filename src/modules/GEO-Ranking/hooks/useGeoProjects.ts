import { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { parse, format } from 'date-fns';
import type { GeoProject, DashboardSummary, PaginationInfo, GeoProjectsRequest, ApiProject } from '../types';
import { getGeoOverview, getGeoProjects } from '@/api/geoRankingApi';

// Helper function to format API date
const formatApiDate = (dateString: string): string => {
  try {
    // Parse the API date format "DD-MM-YYYY HH:mm:ss"
    const parsedDate = parse(dateString, 'dd-MM-yyyy HH:mm:ss', new Date());
    // Format to "yyyy-MM-dd" for display
    return format(parsedDate, 'yyyy-MM-dd');
  } catch (error) {
    console.warn('Failed to parse date:', dateString);
    // Fallback to today's date
    return new Date().toISOString().split('T')[0];
  }
};

// Helper function to map API project to UI project
const mapApiProjectToGeoProject = (apiProject: ApiProject): GeoProject => ({
  id: apiProject.id,
  name: apiProject.project_name,
  numberOfChecks: parseInt(apiProject.kcount) || 0,
  createdDate: formatApiDate(apiProject.created_at),
  notificationEmail: apiProject.email || 'No email provided',
  keywords: [], // Default empty array since API doesn't provide keywords here
  isActive: true, // Default to active
});

const fetchProjects = async (params: GeoProjectsRequest): Promise<{ projects: GeoProject[]; pagination: PaginationInfo }> => {
  try {
    const response = await getGeoProjects(params);
    return {
      projects: response.data.projects.map(mapApiProjectToGeoProject),
      pagination: response.data.pagination,
    };
  } catch (error) {
    console.error('Error fetching GEO projects:', error);
    throw error;
  }
};

const fetchDashboardSummary = async (): Promise<DashboardSummary> => {
  try {
    const response = await getGeoOverview();
    return {
      totalProjects: response.data.totalProject,
      totalKeywords: response.data.noOfKeywords,
      scheduledScans: response.data.scheduleKeywords,
      availableCredits: response.data.credits.remainingCredit,
      allowedCredits: response.data.credits.allowedCredit,
    };
  } catch (error) {
    console.error('Error fetching GEO overview:', error);
    // Fallback to default values if API fails
    return {
      totalProjects: 0,
      totalKeywords: 0,
      scheduledScans: 0,
      availableCredits: 0,
      allowedCredits: 0,
    };
  }
};

const createProject = async (projectData: Omit<GeoProject, 'id'>): Promise<GeoProject> => {
  // TODO: Implement actual API call for creating projects
  await new Promise(resolve => setTimeout(resolve, 800));
  const newProject = {
    ...projectData,
    id: Date.now().toString(),
  };
  return newProject;
};

const deleteProject = async (projectId: string): Promise<void> => {
  // TODO: Implement actual API call for deleting projects
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log('Deleting project:', projectId);
};

export const useGeoProjects = () => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Debounced search term
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // Debounce search term
  useMemo(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to first page when searching
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const projectsQuery = useQuery({
    queryKey: ['geo-projects', currentPage, pageSize, debouncedSearch],
    queryFn: () => fetchProjects({
      page: currentPage,
      limit: pageSize,
      search: debouncedSearch,
    }),
  });

  const summaryQuery = useQuery({
    queryKey: ['geo-dashboard-summary'],
    queryFn: fetchDashboardSummary,
  });

  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['geo-projects'] });
      queryClient.invalidateQueries({ queryKey: ['geo-dashboard-summary'] });
      toast.success('Project created successfully');
    },
    onError: () => {
      toast.error('Failed to create project');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['geo-projects'] });
      queryClient.invalidateQueries({ queryKey: ['geo-dashboard-summary'] });
      toast.success('Project deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete project');
    },
  });

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleSearchChange = useCallback((search: string) => {
    setSearchTerm(search);
  }, []);

  return {
    projects: projectsQuery.data?.projects || [],
    pagination: projectsQuery.data?.pagination,
    summary: summaryQuery.data,
    isLoading: projectsQuery.isLoading || summaryQuery.isLoading,
    error: projectsQuery.error || summaryQuery.error,
    createProject: createMutation.mutate,
    deleteProject: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
    // Pagination controls
    currentPage,
    pageSize,
    searchTerm,
    handlePageChange,
    handleSearchChange,
  };
};