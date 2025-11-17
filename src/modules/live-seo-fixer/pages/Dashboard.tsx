import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProjectCard } from "../components/ProjectCard";
import { Project } from "../types/Project";
import {
  fetchProjects,
  updateProjectStatus,
  deleteProject,
} from "@/services/liveSeoFixer";
import {
  BarChart3,
  CheckCircle,
  AlertCircle,
  Clock,
  Search,
  Loader2,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [debouncedSearch, setDebouncedSearch] = React.useState(searchTerm);

  // Debounce search term
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to first page on search
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch projects query
  const {
    data: projectsResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["projects", currentPage, debouncedSearch, statusFilter],
    queryFn: () =>
      fetchProjects({
        page: currentPage,
        limit: 6,
        search: debouncedSearch,
        status: statusFilter === "all" ? "" : statusFilter,
      }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Update project status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({
      projectId,
      status,
    }: {
      projectId: string;
      status: "active" | "paused" | "completed";
    }) => updateProjectStatus(projectId, status),
    onSuccess: () => {
      toast.success("Project status updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update project status"
      );
    },
  });

  // Delete project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: (projectId: string) => deleteProject(projectId),
    onSuccess: () => {
      toast.success("Project deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete project");
    },
  });

  const handleEditProject = (project: Project) => {
    navigate(`/module/live-seo-fixer/projects/${project.id}`);
  };

  const handleToggleStatus = (project: Project) => {
    const newStatus = project.status === "active" ? "paused" : "active";
    updateStatusMutation.mutate({ projectId: project.id, status: newStatus });
  };

  const handleDeleteProject = (project: Project) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${project.name}"? This action cannot be undone.`
      )
    ) {
      deleteProjectMutation.mutate(project.id);
    }
  };

  const projects = projectsResponse?.data?.projects || [];
  const pagination = projectsResponse?.data;
  const totalProjects = pagination?.total || 0;
  const activeProjects = pagination?.active_count || 0;
  const totalIssuesFound = pagination?.issues_found || 0;
  const totalIssuesFixed = pagination?.issues_fixed || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SEO Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Monitor and optimize your websites for better search engine
            performance.
          </p>
        </div>
        <Button
          onClick={() => navigate("/module/live-seo-fixer/create-project")}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create New Project
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Projects
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              {activeProjects} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Projects
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects}</div>
            <p className="text-xs text-muted-foreground">
              Currently monitoring
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Issues Found</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {totalIssuesFound}
            </div>
            <p className="text-xs text-muted-foreground">Across all projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Issues Fixed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {totalIssuesFixed}
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully resolved
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <h2 className="text-xl font-semibold">Projects</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Projects Section */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        ) : isError ? (
          <Card>
            <CardContent className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <CardTitle className="mb-2 text-destructive">
                Error Loading Projects
              </CardTitle>
              <CardDescription className="mb-4">
                {(error as any)?.response?.data?.message ||
                  "Failed to load projects. Please try again."}
              </CardDescription>
              <Button
                onClick={() =>
                  queryClient.invalidateQueries({ queryKey: ["projects"] })
                }
                variant="outline"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : projects.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <CardTitle className="mb-2">
                {searchTerm || statusFilter !== "all"
                  ? "No projects found"
                  : "No projects yet"}
              </CardTitle>
              <CardDescription className="mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filters."
                  : "Create your first SEO monitoring project to get started."}
              </CardDescription>
              {!searchTerm && statusFilter === "all" && (
                <Button
                  onClick={() =>
                    navigate("/module/live-seo-fixer/create-project")
                  }
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create New Project
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onEdit={handleEditProject}
                  onToggleStatus={handleToggleStatus}
                  onDelete={handleDeleteProject}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.total > pagination.limit && (
              <div className="flex items-center justify-center space-x-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                <span className="text-sm text-muted-foreground px-4">
                  Page {pagination.page} of{" "}
                  {Math.ceil(pagination.total / pagination.limit)}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(
                        prev + 1,
                        Math.ceil(pagination.total / pagination.limit)
                      )
                    )
                  }
                  disabled={
                    currentPage >=
                    Math.ceil(pagination.total / pagination.limit)
                  }
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default Dashboard;
