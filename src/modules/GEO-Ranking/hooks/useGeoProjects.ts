import { useState, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { parse, format } from "date-fns";
import type {
  GeoProject,
  DashboardSummary,
  PaginationInfo,
  GeoProjectsRequest,
  ApiProject,
  CreateGeoProjectRequest,
  UpdateGeoProjectRequest,
  DeleteGeoProjectRequest,
} from "../types";
import {
  getGeoOverview,
  getGeoProjects,
  createGeoProject,
  updateGeoProject,
  deleteGeoProject,
} from "@/api/geoRankingApi";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

// Helper function to format API date
const formatApiDate = (dateString: string): string => {
  try {
    // Parse the API date format "DD-MM-YYYY HH:mm:ss"
    const parsedDate = parse(dateString, "dd-MM-yyyy HH:mm:ss", new Date());
    // Format to "yyyy-MM-dd" for display
    return format(parsedDate, "yyyy-MM-dd");
  } catch (error) {
    console.warn("Failed to parse date:", dateString);
    // Fallback to today's date
    return new Date().toISOString().split("T")[0];
  }
};

// Helper function to map API project to UI project
const mapApiProjectToGeoProject = (apiProject: ApiProject): GeoProject => ({
  id: apiProject.id,
  name: apiProject.project_name,
  numberOfChecks: parseInt(apiProject.kcount) || 0,
  createdDate: formatApiDate(apiProject.created_at),
  notificationEmail: apiProject.email || "No email provided",
  keywords: [], // Default empty array since API doesn't provide keywords here
  isActive: true, // Default to active
  encKey: apiProject.encKey,
});

const fetchProjects = async (
  params: GeoProjectsRequest
): Promise<{ projects: GeoProject[]; pagination: PaginationInfo }> => {
  try {
    const response = await getGeoProjects(params);
    return {
      projects: response.data.projects.map(mapApiProjectToGeoProject),
      pagination: response.data.pagination,
    };
  } catch (error) {
    console.error("Error fetching GEO projects:", error);
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
    console.error("Error fetching GEO overview:", error);
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

const createProjectApi = async (
  projectData: CreateGeoProjectRequest
): Promise<GeoProject> => {
  try {
    const response = await createGeoProject(projectData);

    // Map the API response to GeoProject format
    const newProject: GeoProject = {
      id: response.data.project.id.toString(),
      name: response.data.project.project_name,
      numberOfChecks: 0, // Default for new projects
      createdDate: formatApiDate(response.data.project.created_at),
      notificationEmail: response.data.project.email || "No email provided",
      keywords: [], // Default empty array for new projects
      isActive: true, // Default to active
      encKey: response.data.project.encKey,
    };

    return newProject;
  } catch (error) {
    console.error("Error creating GEO project:", error);
    throw error;
  }
};

const updateProjectApi = async (
  projectData: UpdateGeoProjectRequest
): Promise<GeoProject> => {
  try {
    const response = await updateGeoProject(projectData);

    // Map the API response to GeoProject format
    const updatedProject: GeoProject = {
      id: response.data.projectId.toString(),
      name: response.data.projectName,
      numberOfChecks: 0, // Keep existing or default
      createdDate: new Date().toISOString().split("T")[0], // Keep existing or use current
      notificationEmail: response.data.emails || "No email provided",
      keywords: [], // Keep existing or default
      isActive: true, // Keep existing or default
      encKey: "", // Update response doesn't return encKey, so empty for now
    };

    return updatedProject;
  } catch (error) {
    console.error("Error updating GEO project:", error);
    throw error;
  }
};

const deleteProjectApi = async (
  requestData: DeleteGeoProjectRequest
): Promise<void> => {
  try {
    await deleteGeoProject(requestData);
  } catch (error) {
    console.error("Error deleting GEO project:", error);
    throw error;
  }
};

export const useGeoProjects = (enabled: boolean = true) => {
  const { t } = useI18nNamespace("Geo-Ranking-hook/useGeoProjects");
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // Debounced search term
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search term
  useMemo(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const projectsQuery = useQuery({
    queryKey: ["geo-projects", currentPage, pageSize, debouncedSearch],
    queryFn: () =>
      fetchProjects({
        page: currentPage,
        limit: pageSize,
        search: debouncedSearch,
      }),
    enabled,
  });

  const summaryQuery = useQuery({
    queryKey: ["geo-dashboard-summary"],
    queryFn: fetchDashboardSummary,
    enabled,
  });

  const createMutation = useMutation({
    mutationFn: createProjectApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["geo-projects"] });
      queryClient.invalidateQueries({ queryKey: ["geo-dashboard-summary"] });
      toast.success(t("geoProjects.toast.createSuccess"));
    },
    onError: (error: any) => {
      console.error("Create project error:", error);
      toast.error(t("geoProjects.toast.createError"));
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateProjectApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["geo-projects"] });
      queryClient.invalidateQueries({ queryKey: ["geo-dashboard-summary"] });
      toast.success(t("geoProjects.toast.updateSuccess"));
    },
    onError: (error: any) => {
      console.error("Update project error:", error);
      toast.error(t("geoProjects.toast.updateError"));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProjectApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["geo-projects"] });
      queryClient.invalidateQueries({ queryKey: ["geo-dashboard-summary"] });
      toast.success(t("geoProjects.toast.deleteSuccess"));
    },
    onError: (error: any) => {
      console.error("Delete project error:", error);
      toast.error(t("geoProjects.toast.deleteError"));
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
    updateProject: updateMutation.mutate,
    deleteProject: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    // Pagination controls
    currentPage,
    pageSize,
    searchTerm,
    handlePageChange,
    handleSearchChange,
  };
};
