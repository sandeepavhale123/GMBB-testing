import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { GeoProject, DashboardSummary } from '../types';

// Mock API functions - replace with actual API calls
const mockProjects: GeoProject[] = [
  {
    id: '1',
    name: 'Local Restaurant Campaign',
    numberOfChecks: 45,
    createdDate: '2024-01-15',
    notificationEmail: 'owner@restaurant.com',
    keywords: ['best pizza near me', 'italian restaurant'],
    isActive: true,
  },
  {
    id: '2',
    name: 'Medical Practice SEO',
    numberOfChecks: 32,
    createdDate: '2024-02-10',
    notificationEmail: 'marketing@medpractice.com',
    keywords: ['dentist near me', 'family doctor'],
    isActive: true,
  },
];

const fetchProjects = async (): Promise<GeoProject[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockProjects;
};

const fetchDashboardSummary = async (): Promise<DashboardSummary> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return {
    totalProjects: mockProjects.length,
    totalKeywords: mockProjects.reduce((sum, project) => sum + project.keywords.length, 0),
    scheduledScans: 5,
    availableCredits: 1250,
  };
};

const createProject = async (projectData: Omit<GeoProject, 'id'>): Promise<GeoProject> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  const newProject = {
    ...projectData,
    id: Date.now().toString(),
  };
  mockProjects.push(newProject);
  return newProject;
};

const deleteProject = async (projectId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = mockProjects.findIndex(p => p.id === projectId);
  if (index > -1) {
    mockProjects.splice(index, 1);
  }
};

export const useGeoProjects = () => {
  const queryClient = useQueryClient();

  const projectsQuery = useQuery({
    queryKey: ['geo-projects'],
    queryFn: fetchProjects,
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

  return {
    projects: projectsQuery.data || [],
    summary: summaryQuery.data,
    isLoading: projectsQuery.isLoading || summaryQuery.isLoading,
    error: projectsQuery.error || summaryQuery.error,
    createProject: createMutation.mutate,
    deleteProject: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};