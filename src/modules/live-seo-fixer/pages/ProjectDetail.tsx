import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  ExternalLink,
  Play,
  Pause,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Code,
  Eye,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Settings as SettingsIcon,
  Globe,
  Shield,
  AlertTriangle,
  Copy,
  Save,
  Download,
} from "lucide-react";
import { Project } from "../types/Project";
import { SitemapConfigModal } from "../components/SitemapConfigModal";
import { JSSnippetModal } from "../components/JSSnippetModal";
import {
  getProjectDetails,
  updateProjectStatus,
  getProjectAudits,
  deleteProject,
  updateProject,
} from "@/services/liveSeoFixer";
import {
  generateWordPressApiKey,
  testWordPressConnection,
  connectWordPress,
  disconnectWordPress,
} from "@/services/liveSeoFixer/wordpressService";
import { toast } from "sonner";

const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [auditPage, setAuditPage] = React.useState(1);
  const [activeTab, setActiveTab] = React.useState("overview");

  // Settings state
  const [projectName, setProjectName] = React.useState("");
  const [projectWebsite, setProjectWebsite] = React.useState("");
  const [projectAddress, setProjectAddress] = React.useState("");
  const [projectPhone, setProjectPhone] = React.useState("");
  const [projectStatus, setProjectStatus] = React.useState<
    "active" | "paused" | "completed"
  >("active");

  // WordPress state
  const [wordpressUrl, setWordpressUrl] = React.useState("");
  const [apiKey, setApiKey] = React.useState("");
  const [isConnecting, setIsConnecting] = React.useState(false);
  const [isGeneratingKey, setIsGeneratingKey] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  // Fetch project details
  const {
    data: projectResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["project-details", projectId],
    queryFn: () => getProjectDetails(projectId!),
    enabled: !!projectId,
  });

  const project = projectResponse?.data;

  // Update form fields when project data loads
  React.useEffect(() => {
    if (project) {
      setProjectName(project.name || "");
      setProjectWebsite(project.website || "");
      setProjectAddress(project.address || "");
      setProjectPhone(project.phone || "");
      setProjectStatus(project.status || "active");

      // WordPress data
      const wpConn = project.wordpress_connection;
      if (wpConn) {
        // Use wordpress_url if available, otherwise fallback to project.website
        setWordpressUrl(wpConn.wordpress_url || project.website || "");
        if (!wpConn.api_key && activeTab === "settings") {
          handleGenerateApiKey();
        } else if (wpConn.api_key) {
          setApiKey(wpConn.api_key);
        }
      }
    }
  }, [project]);

  // Fetch project audits
  const { data: auditsResponse, isLoading: auditsLoading } = useQuery({
    queryKey: ["project-audits", projectId, auditPage],
    queryFn: () => getProjectAudits(projectId!, auditPage, 10),
    enabled: !!projectId,
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
      queryClient.invalidateQueries({
        queryKey: ["project-details", projectId],
      });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update project status"
      );
    },
  });

  // Update project mutation
  const updateProjectMutation = useMutation({
    mutationFn: (data: {
      name?: string;
      website?: string;
      address?: string;
      phone?: string;
    }) => updateProject(projectId!, data),
    onSuccess: () => {
      toast.success("Project updated successfully!");
      queryClient.invalidateQueries({
        queryKey: ["project-details", projectId],
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update project");
    },
  });

  // Delete project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: (projectId: string) => deleteProject(projectId),
    onSuccess: () => {
      toast.success("Project deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      navigate("/module/live-seo-fixer/dashboard");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete project");
    },
  });

  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "paused":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "completed":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const handleStartAudit = () => {
    navigate(`/module/live-seo-fixer/projects/${projectId}/sitemap-config`);
  };

  const handleViewResults = () => {
    navigate(
      `/module/live-seo-fixer/projects/${projectId}/audit-results-grouped`
    );
  };

  const handleToggleStatus = () => {
    if (!project) return;
    const newStatus = project.status === "active" ? "paused" : "active";
    updateStatusMutation.mutate({ projectId: project.id, status: newStatus });
  };

  const handleDeleteProject = () => {
    if (!project) return;
    if (showDeleteConfirm) {
      deleteProjectMutation.mutate(project.id);
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 5000);
    }
  };

  const handleSaveSettings = () => {
    updateProjectMutation.mutate({
      name: projectName,
      website: projectWebsite,
      address: projectAddress,
      phone: projectPhone,
    });
    updateStatusMutation.mutate({
      projectId: projectId!,
      status: projectStatus,
    });
  };

  const handleGenerateApiKey = async () => {
    if (!projectId) return;

    setIsGeneratingKey(true);
    try {
      const response = await generateWordPressApiKey(projectId);
      setApiKey(response.api_key);
      toast.success("API key generated successfully");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to generate API key"
      );
    } finally {
      setIsGeneratingKey(false);
    }
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast.success("API key copied to clipboard");
  };

  const handleTestConnection = async () => {
    if (!projectId || !wordpressUrl || !apiKey) return;

    setIsConnecting(true);
    try {
      const testResponse = await testWordPressConnection(
        projectId,
        wordpressUrl,
        apiKey
      );
      await connectWordPress(projectId, wordpressUrl, apiKey);

      queryClient.invalidateQueries({
        queryKey: ["project-details", projectId],
      });

      toast.success(`Successfully connected to ${testResponse.site_name}`);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to connect to WordPress"
      );
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!projectId) return;

    // Get API key from project data or local state
    const keyToUse = project?.wordpress_connection?.api_key || apiKey;

    if (!keyToUse) {
      toast.error("API key not found. Cannot disconnect.");
      return;
    }

    try {
      await disconnectWordPress(projectId, keyToUse);
      queryClient.invalidateQueries({
        queryKey: ["project-details", projectId],
      });
      setWordpressUrl("");
      toast.success(
        "WordPress disconnected successfully. You can use the same API key to reconnect."
      );
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to disconnect WordPress"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading project details...</span>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Failed to load project</h3>
          <p className="text-muted-foreground mb-4">
            {error?.message || "Project not found or unavailable"}
          </p>
          <Button onClick={() => navigate("/module/live-seo-fixer")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">
              {project.name}
            </h1>
            <Badge className={`${getStatusColor(project.status)} capitalize`}>
              {project.status}
            </Badge>
            {project.wordpress_connection?.connected && (
              <Badge
                variant="outline"
                className="flex items-center gap-1.5 bg-blue-50 text-blue-700 border-blue-200"
              >
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12.158.783c-6.315 0-11.43 5.116-11.43 11.43 0 6.315 5.115 11.43 11.43 11.43 6.315 0 11.43-5.115 11.43-11.43 0-6.314-5.115-11.43-11.43-11.43zm-5.21 16.544c.55-.223 1.27-.65 1.744-1.395l-2.102-5.756c-.655 2.079-.687 5.195.358 7.151zm9.24-.893l-2.453-7.17c-.38-1.112-.51-1.997-.51-2.784 0-.286.018-.552.054-.8-.55.855-1.455 1.75-2.79 2.47l2.286 6.796c.41 1.22.75 2.1 1.008 2.684 1.005-.58 1.85-1.48 2.404-2.596zm1.118-7.736c.318-.852.426-1.53.426-2.137 0-.218-.014-.42-.042-.61 1.094 2.01 1.027 4.56-.384 6.747zm-4.726-5.96c.586-.03 1.114-.093 1.114-.093.525-.062.463-.832-.062-.803 0 0-1.577.124-2.598.124-0.956 0-2.57-.124-2.57-.124-.525-.03-.587.772-.062.803 0 0 .494.062 1.02.093l1.514 4.147-2.128 6.38-3.547-10.527c.586-.03 1.114-.093 1.114-.093.525-.062.463-.832-.062-.803 0 0-1.577.124-2.598.124-.182 0-.398-.005-.626-.012C7.69 4.36 9.757 3.408 12.158 3.408c1.836 0 3.506.7 4.76 1.847-.03-.002-.06-.006-.092-.006-.956 0-1.635.832-1.635 1.726 0 .802.463 1.48.956 2.283.37.647.803 1.48.803 2.684 0 .832-.32 1.796-.74 3.14l-.97 3.238-3.512-10.448z" />
                </svg>
                WordPress
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>{project.website}</span>
            <ExternalLink size={14} />
          </div>
          {project.address && (
            <p className="text-sm text-muted-foreground">
              📍 {project.address}
            </p>
          )}
          {project.phone && (
            <p className="text-sm text-muted-foreground">📞 {project.phone}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleToggleStatus}>
            {project.status === "active" ? (
              <Pause size={16} />
            ) : (
              <Play size={16} />
            )}
            {project.status === "active" ? "Pause" : "Resume"}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Pages
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{project.total_pages}</div>
                <p className="text-xs text-muted-foreground">
                  {project.audited_pages} audited
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Issues Found
                </CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">
                  {project.issues_found}
                </div>
                <p className="text-xs text-muted-foreground">
                  Across audited pages
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Issues Fixed
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {project.issues_fixed}
                </div>
                <p className="text-xs text-muted-foreground">
                  Auto-fixed via JS
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  JS Snippet
                </CardTitle>
                <Code className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${
                    project.js_snippet_installed
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {project.js_snippet_installed ? "Active" : "Not Installed"}
                </div>
                <p className="text-xs text-muted-foreground">Live fix status</p>
              </CardContent>
            </Card>
          </div>

          {/* Actions Section */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>SEO Audit</CardTitle>
                <CardDescription>
                  {project.has_active_audit
                    ? "Audit in progress - view status or start a new audit"
                    : project.last_audit_date
                    ? `Last audit completed on ${new Date(
                        project.last_audit_date
                      ).toLocaleDateString()}`
                    : "Start your first SEO audit to identify issues"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <SitemapConfigModal
                  projectId={project.id}
                  trigger={
                    <Button className="w-full">
                      <BarChart3 size={16} className="mr-2" />
                      Start New Audit
                    </Button>
                  }
                />
                {project.last_audit_date && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleViewResults}
                  >
                    <Eye size={16} className="mr-2" />
                    View Previous Audit Result
                  </Button>
                )}
                {project.audited_pages > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {project.audited_pages} pages audited,{" "}
                    {project.issues_found} issues found
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>JavaScript Integration</CardTitle>
                <CardDescription>
                  Install the JS snippet on your website to enable live SEO
                  fixes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <JSSnippetModal
                    projectId={project.id}
                    trigger={
                      <Button variant="outline" className="flex-1">
                        <Code size={16} className="mr-2" />
                        View Snippet
                      </Button>
                    }
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      project.js_snippet_installed
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  />
                  <span className="text-sm text-muted-foreground">
                    {project.js_snippet_installed
                      ? "Snippet installed and active"
                      : "Snippet not detected"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Audit History */}
          <Card>
            <CardHeader>
              <CardTitle>Audit History</CardTitle>
              <CardDescription>
                Previous SEO audits for this project
              </CardDescription>
            </CardHeader>
            <CardContent>
              {auditsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Loading audits...</span>
                </div>
              ) : auditsResponse?.data?.audits?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No audits have been completed yet</p>
                  <p className="text-sm mt-1">
                    Start your first audit to see results here
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {auditsResponse?.data?.audits?.map((audit) => (
                      <div
                        key={audit.id}
                        className="flex items-center gap-3 text-sm p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
                        onClick={() =>
                          navigate(
                            `/module/live-seo-fixer/projects/${projectId}/audit-results-grouped`
                          )
                        }
                      >
                        <div className="flex-shrink-0">
                          {audit.status === "completed" ? (
                            <CheckCircle size={20} className="text-green-600" />
                          ) : audit.status === "in_progress" ? (
                            <Loader2
                              size={20}
                              className="text-blue-600 animate-spin"
                            />
                          ) : audit.status === "failed" ? (
                            <AlertCircle size={20} className="text-red-600" />
                          ) : (
                            <BarChart3
                              size={20}
                              className="text-muted-foreground"
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">
                            Audit #{audit.id} -{" "}
                            {audit.status === "completed"
                              ? "Completed"
                              : audit.status === "in_progress"
                              ? "In Progress"
                              : audit.status === "failed"
                              ? "Failed"
                              : "Pending"}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {audit.pages_count} pages • {audit.issues_count}{" "}
                            issues found • {audit.applied_fixes_count} fixes
                            applied
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(audit.created_date).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {auditsResponse?.data?.pagination &&
                    auditsResponse.data.pagination.total_pages > 1 && (
                      <div className="flex items-center justify-between mt-4 pt-4 border-t">
                        <div className="text-sm text-muted-foreground">
                          Page {auditsResponse.data.pagination.current_page} of{" "}
                          {auditsResponse.data.pagination.total_pages}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setAuditPage((prev) => Math.max(1, prev - 1))
                            }
                            disabled={!auditsResponse.data.pagination.has_prev}
                          >
                            <ChevronLeft size={16} />
                            Previous
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setAuditPage((prev) => prev + 1)}
                            disabled={!auditsResponse.data.pagination.has_next}
                          >
                            Next
                            <ChevronRight size={16} />
                          </Button>
                        </div>
                      </div>
                    )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6 mt-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Update the basic details of your project.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Project Name</Label>
                  <Input
                    id="name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website URL</Label>
                  <Input
                    id="website"
                    value={projectWebsite}
                    onChange={(e) => setProjectWebsite(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="address">Address (Optional)</Label>
                  <Input
                    id="address"
                    value={projectAddress}
                    onChange={(e) => setProjectAddress(e.target.value)}
                    placeholder="123 Main St, City, State 12345"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (Optional)</Label>
                  <Input
                    id="phone"
                    value={projectPhone}
                    onChange={(e) => setProjectPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Project Status</Label>
                <Select
                  value={projectStatus}
                  onValueChange={(value: Project["status"]) =>
                    setProjectStatus(value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleSaveSettings} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>

          {/* WordPress Integration */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <ExternalLink className="h-5 w-5" />
                    WordPress Integration
                  </CardTitle>
                  <CardDescription>
                    Connect your WordPress site to apply SEO fixes server-side
                  </CardDescription>
                </div>
                {project.wordpress_connection?.connected && (
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200"
                  >
                    Connected
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="wordpress-url">WordPress Site URL</Label>
                <Input
                  id="wordpress-url"
                  placeholder="https://yoursite.com"
                  value={wordpressUrl}
                  onChange={(e) => setWordpressUrl(e.target.value)}
                  disabled={project.wordpress_connection?.connected}
                />
              </div>

              {!project.wordpress_connection?.connected && (
                <>
                  <div className="space-y-2">
                    <Label>Download Plugin</Label>
                    <div className="bg-muted p-4 rounded-md">
                      <p className="text-sm text-muted-foreground mb-3">
                        Download and install the SEO Fixer WordPress plugin to
                        connect your site
                      </p>
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href="https://old.gmbbriefcase.com/wp-plugin/seo-fixer.zip"
                          download
                          className="inline-flex items-center gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Download SEO Fixer Plugin
                        </a>
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Setup Instructions</Label>
                    <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-2 bg-muted p-4 rounded-md">
                      <li>
                        Install the{" "}
                        <span className="font-medium text-foreground">
                          SEO Fixer
                        </span>{" "}
                        plugin on your WordPress site
                      </li>
                      <li>
                        Navigate to{" "}
                        <span className="font-medium text-foreground">
                          Settings → SEO Fixer
                        </span>{" "}
                        in your WordPress dashboard
                      </li>
                      <li>
                        Copy the{" "}
                        <span className="font-medium text-foreground">
                          API Key
                        </span>{" "}
                        from below and paste it into the plugin settings
                      </li>
                      <li>
                        Copy the{" "}
                        <span className="font-medium text-foreground">
                          Project ID
                        </span>{" "}
                        from below and paste it into the plugin settings
                      </li>
                      <li>
                        Click{" "}
                        <span className="font-medium text-foreground">
                          Save Settings
                        </span>{" "}
                        in the WordPress plugin
                      </li>
                      <li>
                        Test the connection using the button below or from
                        within the plugin
                      </li>
                      <li>
                        Once connected, approve any fixes from your audits and
                        they'll automatically sync to your website
                      </li>
                    </ol>
                  </div>
                </>
              )}

              {!apiKey ? (
                <div className="space-y-2">
                  <Label>Step 1: Generate API Key</Label>
                  <Button
                    onClick={handleGenerateApiKey}
                    disabled={isGeneratingKey}
                    className="w-full"
                  >
                    {isGeneratingKey ? "Generating..." : "Generate API Key"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-8 space-y-2">
                      <Label>API Key</Label>
                      <div className="flex gap-2">
                        <Input
                          value={apiKey}
                          readOnly
                          className="font-mono text-sm flex-1"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleCopyApiKey}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="col-span-4 space-y-2">
                      <Label>Project ID</Label>
                      <div className="flex gap-2">
                        <Input
                          value={projectId}
                          readOnly
                          className="font-mono text-sm flex-1"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            navigator.clipboard.writeText(projectId!);
                            toast.success("Project ID copied to clipboard");
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {project.wordpress_connection?.connected && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Last Sync</p>
                      <p className="font-medium">
                        {project.wordpress_connection.last_sync
                          ? new Date(
                              project.wordpress_connection.last_sync
                            ).toLocaleString()
                          : "Never"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Fixes Synced
                      </p>
                      <p className="font-medium">
                        {project.wordpress_connection.total_fixes_synced || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge
                        className={
                          project.wordpress_connection.sync_status === "success"
                            ? "bg-green-100 text-green-800"
                            : project.wordpress_connection.sync_status ===
                              "error"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {project.wordpress_connection.sync_status || "pending"}
                      </Badge>
                    </div>
                  </div>

                  <Button
                    variant="destructive"
                    onClick={handleDisconnect}
                    className="w-full"
                  >
                    Disconnect WordPress
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Irreversible and destructive actions for this project.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                <div>
                  <h4 className="font-medium text-red-900 mb-1">
                    Delete this project
                  </h4>
                  <p className="text-sm text-red-700">
                    Once deleted, all audit data and fixes will be permanently
                    removed.
                  </p>
                </div>
                <Button variant="destructive" onClick={handleDeleteProject}>
                  {showDeleteConfirm ? "Confirm Delete?" : "Delete Project"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDetail;
