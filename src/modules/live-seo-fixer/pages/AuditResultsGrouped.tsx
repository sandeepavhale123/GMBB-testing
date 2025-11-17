import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Check,
  RefreshCw,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Tag,
  Heading1,
  Hash,
  Code,
  Globe,
  Twitter,
  Settings,
  Edit,
  ChevronLeft,
  ChevronRight,
  KeyRound,
  Ruler,
  Link2,
  Share2,
  Eye,
  Bot,
  MapPin,
  AlertCircle,
  GitBranch,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  getAuditResultsGrouped,
  applyFixesBulk,
  getCategoryIssues,
  updateIssueFix,
  bulkApproveCategory,
  regenerateIssueFix,
  getProjectAudits,
  getAuditCategories,
  rollbackCategoryFixes,
  getProjectDetails,
} from "@/services/liveSeoFixer";
import { toast } from "sonner";
import { JSSnippetModal } from "../components/JSSnippetModal";
import { EditFixModal } from "../components/EditFixModal";
import { AIContentModal } from "../components/AIContentModal";
import { SchemaViewModal } from "../components/SchemaViewModal";
import { useToast } from "@/hooks/use-toast";
import {
  syncFixToWordPress,
  syncBulkFixesToWordPress,
} from "@/services/liveSeoFixer/wordpressService";

const AuditResultsGrouped: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast: toastHook } = useToast();
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    null
  );
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [appliedCount, setAppliedCount] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState<
    "all" | "approved" | "pending"
  >("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);
  const [editingIssue, setEditingIssue] = React.useState<any>(null);
  const [regeneratingIssue, setRegeneratingIssue] = React.useState<any>(null);
  const [viewingSchema, setViewingSchema] = React.useState<{
    data: string;
    title: string;
  } | null>(null);

  // Fetch project details
  const { data: projectData } = useQuery({
    queryKey: ["project-details", projectId],
    queryFn: () => getProjectDetails(projectId!),
    enabled: !!projectId,
  });

  const project = projectData?.data;

  // Fetch audit ID first
  const { data: auditData, isLoading: isLoadingAudit } = useQuery({
    queryKey: ["project-audits", projectId],
    queryFn: () => getProjectAudits(projectId!, 1, 1, "completed"),
    enabled: !!projectId,
  });

  const auditId = auditData?.data?.audits?.[0]?.id;

  // Fetch audit categories
  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["audit-categories", projectId, auditId],
    queryFn: () => getAuditCategories(projectId!, auditId!),
    enabled: !!projectId && !!auditId,
  });

  // Fetch category issues with pagination
  const { data: categoryIssuesResponse, isLoading: isLoadingIssues } = useQuery(
    {
      queryKey: [
        "category-issues",
        projectId,
        auditId,
        selectedCategory,
        currentPage,
        itemsPerPage,
        activeTab,
      ],
      queryFn: () =>
        getCategoryIssues(
          projectId!,
          auditId!,
          selectedCategory!,
          currentPage,
          itemsPerPage,
          activeTab
        ),
      enabled: !!projectId && !!auditId && !!selectedCategory,
    }
  );

  // Mutations
  const applyFixesMutation = useMutation({
    mutationFn: ({
      mode,
      options,
    }: {
      mode: "all" | "category" | "individual";
      options?: any;
    }) => applyFixesBulk(projectId!, mode, options),
    onSuccess: (response) => {
      const count = response?.data?.applied_count || 0;
      setAppliedCount(count);
      setShowSuccessModal(true);
      queryClient.invalidateQueries({
        queryKey: ["audit-results-grouped", projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["category-issues", projectId, auditId],
      });
      queryClient.invalidateQueries({
        queryKey: ["audit-categories", projectId, auditId],
      });
      queryClient.invalidateQueries({
        queryKey: ["project-details", projectId],
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to apply fixes");
    },
  });

  const updateFixMutation = useMutation({
    mutationFn: ({
      issueId,
      fixValue,
      approved,
    }: {
      issueId: string;
      fixValue: string;
      approved: boolean;
    }) => updateIssueFix(projectId!, auditId!, issueId, fixValue, approved),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["category-issues", projectId, auditId, selectedCategory],
      });
      queryClient.invalidateQueries({
        queryKey: ["audit-categories", projectId, auditId],
      });
    },
  });

  const bulkApproveMutation = useMutation({
    mutationFn: ({ type, approved }: { type: string; approved: boolean }) =>
      bulkApproveCategory(projectId!, auditId!, type, approved),
    onSuccess: (response) => {
      const count = response?.data?.affected_issues || 0;
      setAppliedCount(count);
      setShowSuccessModal(true);

      queryClient.invalidateQueries({
        queryKey: ["category-issues", projectId, auditId, selectedCategory],
      });
      queryClient.invalidateQueries({
        queryKey: ["audit-categories", projectId, auditId],
      });
    },
  });

  const regenerateFixMutation = useMutation({
    mutationFn: ({ issueId }: { issueId: string }) =>
      regenerateIssueFix(projectId!, issueId, true),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["category-issues", projectId, auditId, selectedCategory],
      });
      queryClient.invalidateQueries({
        queryKey: ["audit-categories", projectId, auditId],
      });
    },
  });

  const rollbackMutation = useMutation({
    mutationFn: ({ type, approved }: { type: string; approved: boolean }) =>
      rollbackCategoryFixes(projectId!, auditId!, type, approved),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["category-issues", projectId, auditId, selectedCategory],
      });
      queryClient.invalidateQueries({
        queryKey: ["audit-categories", projectId, auditId],
      });
    },
  });

  const categories = categoriesData?.data?.categories || [];
  const categoryIssues = categoryIssuesResponse?.data?.issues || [];
  const pagination = categoryIssuesResponse?.data?.pagination;
  const valueStats = (categoryIssuesResponse?.data as any)?.value_stats;

  // Calculate total issues from categories
  const totalIssues = React.useMemo<number>(() => {
    return categories.reduce(
      (total: number, cat: any) => total + cat.total_issues,
      0
    );
  }, [categories]);

  const criticalIssues = categories.reduce(
    (sum: number, cat: any) => sum + cat.severity_breakdown.critical,
    0
  );
  const warningIssues = categories.reduce(
    (sum: number, cat: any) => sum + cat.severity_breakdown.warning,
    0
  );
  const infoIssues = categories.reduce(
    (sum: number, cat: any) => sum + cat.severity_breakdown.info,
    0
  );

  // Auto-select first category on load
  React.useEffect(() => {
    if (!selectedCategory && categories.length > 0) {
      setSelectedCategory(categories[0].type);
    }
  }, [categories, selectedCategory]);

  const categoryIcons: Record<string, any> = {
    title: Tag,
    "meta-description": FileText,
    "alt-tags": ImageIcon,
    images: ImageIcon,
    links: LinkIcon,
    "meta-keywords": KeyRound,
    headings: Heading1,
    "heading-length": Ruler,
    canonical: Link2,
    "open-graph": Share2,
    "twitter-card": Twitter,
    schema: Code,
    h1: Heading1,
    miscellaneous: Settings,
    robots: Bot,
    nap: MapPin,
    "broken-link": AlertCircle,
    "redirect-chain": GitBranch,
    "keyword-placement": Hash,
    "semantic-entities": Globe,
  };

  const categoryLabels: Record<string, string> = {
    title: "Title Tags",
    "meta-description": "Meta Description",
    "alt-tags": "Missing Image Alt Text",
    images: "Image Issues",
    links: "Issues with Links",
    "meta-keywords": "Meta Keywords",
    headings: "Heading Optimizations",
    "heading-length": "Headings Length",
    canonical: "Canonical Link",
    "open-graph": "Open Graph",
    "twitter-card": "Twitter Card",
    schema: "Schema Markup",
    h1: "H1 Tags",
    miscellaneous: "Miscellaneous",
    robots: "Robots Meta",
    nap: "NAP Consistency",
    "broken-link": "Broken Links",
    "redirect-chain": "Redirect Chain",
    "keyword-placement": "Keyword Placement",
    "semantic-entities": "Semantic Entities",
  };

  // Use API data for issues and pagination
  const paginatedIssues = categoryIssues;
  const totalPages = pagination?.total_pages || 1;
  const approvedCount = categoryIssues.filter(
    (i: any) => i.fix?.approved
  ).length;
  const pendingCount = categoryIssues.filter(
    (i: any) => !i.fix?.approved
  ).length;
  const totalItemsInCategory = pagination?.total_items || 0;

  const handleFixAll = () => {
    if (
      confirm(
        `Apply all ${totalIssues} fixes? This will prepare all approved fixes for deployment.`
      )
    ) {
      applyFixesMutation.mutate({ mode: "all" });
    }
  };

  const handleFixCategory = (category: string, count: number) => {
    if (confirm(`Apply all ${count} fixes in ${categoryLabels[category]}?`)) {
      applyFixesMutation.mutate({ mode: "category", options: { category } });
    }
  };

  const handleViewPageAudit = (auditPageId: string) => {
    const pageId = auditPageId.replace("audit_page_", "");
    navigate(
      `/module/live-seo-fixer/projects/${projectId}/pages/${pageId}/audit`
    );
  };

  const handleToggleApprove = async (issue: any) => {
    const currentState = issue.fix?.approved || false;
    const issueId = issue.id.toString();
    const fixValue = issue.fix?.content || issue.suggested_value || "";

    try {
      await updateFixMutation.mutateAsync({
        issueId,
        fixValue,
        approved: !currentState,
      });

      // Sync to WordPress if connected
      if (project?.wordpress_connected && projectId && auditId) {
        try {
          await syncFixToWordPress({
            projectId: projectId,
            auditId: auditId,
            issue: {
              issue_id: issueId,
              page_url: issue.page?.url || "",
              issue_type: issue.type,
              fix_content: fixValue,
              element: issue.element || "",
              approved: !currentState,
            },
          });
        } catch (wpError) {
          console.error("WordPress sync failed:", wpError);
          // Don't fail the whole operation if WP sync fails
        }
      }

      toastHook({
        title: currentState ? "Fix Disapproved" : "Fix Approved",
        description: currentState
          ? project?.wordpress_connected
            ? "The fix has been disapproved and removed from WordPress."
            : "The fix has been disapproved."
          : project?.wordpress_connected
          ? "The fix has been approved and synced to WordPress."
          : "The fix has been approved for deployment.",
      });
    } catch (error: any) {
      toastHook({
        title: "Error",
        description:
          error.response?.data?.message ||
          "Failed to update approval status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleApproveAll = async () => {
    if (!selectedCategory) return;

    try {
      await bulkApproveMutation.mutateAsync({
        type: selectedCategory,
        approved: true,
      });

      // Sync all to WordPress if connected
      if (project?.wordpress_connected && projectId && auditId) {
        try {
          await syncBulkFixesToWordPress({
            projectId: projectId,
            auditId: auditId,
            categoryType: selectedCategory,
          });
        } catch (wpError) {
          console.error("WordPress bulk sync failed:", wpError);
          // Don't fail the whole operation if WP sync fails
        }
      }

      toastHook({
        title: "All Fixes Approved",
        description: project?.wordpress_connected
          ? `All fixes in this category have been approved and synced to WordPress.`
          : `All fixes in this category have been approved.`,
      });
    } catch (error: any) {
      toastHook({
        title: "Error",
        description:
          error.response?.data?.message ||
          "Failed to approve all fixes. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRollbackAll = async () => {
    if (!selectedCategory) return;

    if (
      !confirm(
        "Are you sure you want to rollback all fixes in this category? This will reset them to their original values."
      )
    ) {
      return;
    }

    try {
      const response = await rollbackMutation.mutateAsync({
        type: selectedCategory,
        approved: true,
      });

      toastHook({
        title: "Rollback Successful",
        description: `${response.data.affected_issues} fixes have been rolled back to original values.`,
      });
    } catch (error: any) {
      toastHook({
        title: "Error",
        description:
          error.response?.data?.message ||
          "Failed to rollback fixes. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditIssue = (issue: any) => {
    // For schema and semantic-entities issues, navigate to schema editor instead of opening modal
    if (issue.type === "schema" || issue.type === "semantic-entities") {
      navigate(
        `/module/live-seo-fixer/projects/${projectId}/audits/${auditId}/schema-editor`,
        {
          state: {
            schemaData:
              issue.fix?.content ||
              issue.suggested_value ||
              issue.current_value,
            issueId: issue.id.toString(),
            auditId: auditId,
            schemaRequirements: issue.schema_requirements || {},
          },
        }
      );
    } else {
      setEditingIssue(issue);
    }
  };

  const handleSaveEdit = async (newValue: string) => {
    if (!editingIssue) return;

    try {
      await updateFixMutation.mutateAsync({
        issueId: editingIssue.id.toString(),
        fixValue: newValue,
        approved: editingIssue.fix?.approved || false,
      });

      toastHook({
        title: "Fix Updated",
        description: "The suggested fix has been updated successfully.",
      });

      setEditingIssue(null);
    } catch (error: any) {
      toastHook({
        title: "Error",
        description:
          error.response?.data?.message ||
          "Failed to update fix. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRegenerateIssue = (issue: any) => {
    setRegeneratingIssue(issue);
  };

  const handleRegenerateSave = async (newValue: string) => {
    if (!regeneratingIssue) return;

    try {
      // Update with AI generated value
      await updateFixMutation.mutateAsync({
        issueId: regeneratingIssue.id.toString(),
        fixValue: newValue,
        approved: regeneratingIssue.fix?.approved || false,
      });

      toastHook({
        title: "Fix Updated",
        description: "The AI-generated fix has been applied successfully.",
      });

      setRegeneratingIssue(null);
    } catch (error: any) {
      toastHook({
        title: "Error",
        description:
          error.response?.data?.message ||
          "Failed to update fix. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getCharacterProgress = (
    text: string,
    optimalMin?: number,
    optimalMax?: number
  ) => {
    // Handle "Missing" case - treat as 0 length
    const length = text === "Missing" ? 0 : text?.length || 0;

    if (!optimalMin || !optimalMax) {
      return null;
    }

    const isOptimal = length >= optimalMin && length <= optimalMax;
    const isBelowMin = length < optimalMin;

    let percentage: number;
    let color: string;

    if (isBelowMin) {
      // Show progress towards optimal_max - Red for too short/missing
      percentage = (length / optimalMax) * 100;
      color = "bg-red-500";
    } else if (isOptimal) {
      // In optimal range - show as green, reaches 100% at optimal_max
      percentage = (length / optimalMax) * 100;
      color = "bg-green-500";
    } else {
      // Above optimal_max - Orange, stays at 100%
      percentage = 100;
      color = "bg-orange-500";
    }

    return {
      length,
      optimalMin,
      optimalMax,
      percentage,
      color,
      isOptimal,
    };
  };

  const isLoading = isLoadingAudit || isLoadingIssues || isLoadingCategories;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
          <span className="text-sm text-muted-foreground">
            Loading audit results...
          </span>
        </div>
      </div>
    );
  }

  if (!categories || totalIssues === 0) {
    return (
      <div className="p-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            navigate(`/module/live-seo-fixer/projects/${projectId}`)
          }
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Project
        </Button>
        <Card className="mt-6">
          <CardContent className="text-center py-12">
            <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No issues found!</h2>
            <p className="text-muted-foreground">
              Your pages are looking great. All SEO elements are properly
              configured.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                navigate(`/module/live-seo-fixer/projects/${projectId}`)
              }
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">SEO Audit Results</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Review and manage technical SEO fixes by category
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Three Column Layout */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Sidebar - Issue Categories */}
        <div className="w-64 border-r bg-card overflow-y-auto">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-sm">Technical Fixes</h2>
          </div>
          <div className="p-2">
            {categories.map((cat: any) => {
              const Icon = categoryIcons[cat.type] || FileText;
              const isSelected = selectedCategory === cat.type;
              const totalInCategory = cat.total_issues;
              const fixedInCategory = cat.fix_status.approved;

              return (
                <button
                  key={cat.type}
                  onClick={() => {
                    setSelectedCategory(cat.type);
                    setCurrentPage(1);
                  }}
                  className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-md text-left transition-colors mb-1 ${
                    isSelected ? "bg-blue-50 text-blue-900" : "hover:bg-accent"
                  }`}
                >
                  <div className="mt-0.5">
                    {isSelected ? (
                      <CheckCircle2 className="h-4 w-4 text-blue-600 fill-blue-600" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <Icon className="h-4 w-4 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">
                      {categoryLabels[cat.type] || cat.type}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {totalInCategory === 0 ? (
                        <span className="text-gray-400">No issues found</span>
                      ) : (
                        <span>
                          {fixedInCategory} of {totalInCategory} fixed
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          {!selectedCategory ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">Select a category</h3>
                <p className="text-sm text-muted-foreground">
                  Choose an issue category from the sidebar to view details
                </p>
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {/* Top Action Bar */}
              <div className="flex items-center justify-between pb-4 border-b">
                <div className="flex items-center gap-3">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {categoryLabels[selectedCategory]} Issues
                    </h2>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {approvedCount} of {totalItemsInCategory} fixed
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={handleApproveAll}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Approve all in Category
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:bg-red-50"
                    onClick={handleRollbackAll}
                    disabled={rollbackMutation.isPending}
                  >
                    {rollbackMutation.isPending ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Rolling back...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Roll back all
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-2 pb-4">
                <Button
                  variant={activeTab === "all" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setActiveTab("all");
                    setCurrentPage(1);
                  }}
                >
                  All
                </Button>
                <Button
                  variant={activeTab === "approved" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setActiveTab("approved");
                    setCurrentPage(1);
                  }}
                >
                  Approved ({approvedCount})
                </Button>
                <Button
                  variant={activeTab === "pending" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setActiveTab("pending");
                    setCurrentPage(1);
                  }}
                >
                  Pending ({pendingCount})
                </Button>
              </div>

              {/* Data Table */}
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px]">STATUS</TableHead>
                      {selectedCategory === "alt-tags" && (
                        <TableHead className="w-[200px]">IMAGE</TableHead>
                      )}
                      <TableHead className="w-[200px]">PAGE URL</TableHead>
                      <TableHead>ORIGINAL VALUE</TableHead>
                      <TableHead>SUGGESTED FIX</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedIssues.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={selectedCategory === "alt-tags" ? 5 : 4}
                          className="text-center py-8 text-muted-foreground"
                        >
                          No issues found matching your filters
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedIssues.map((issue: any, idx: number) => {
                        const isApproved = issue.fix?.approved || false;
                        const originalTitle = issue.current_value || "Missing";
                        const suggestedTitle =
                          issue.fix?.content ||
                          issue.suggested_value ||
                          "No suggestion";
                        const originalProgress = getCharacterProgress(
                          originalTitle,
                          valueStats?.recommended?.optimal_min,
                          valueStats?.recommended?.optimal_max
                        );
                        const suggestedProgress = getCharacterProgress(
                          suggestedTitle,
                          valueStats?.recommended?.optimal_min,
                          valueStats?.recommended?.optimal_max
                        );

                        return (
                          <TableRow key={issue.issue_id || idx}>
                            <TableCell>
                              <Button
                                variant={isApproved ? "default" : "ghost"}
                                size="sm"
                                onClick={() => handleToggleApprove(issue)}
                                disabled={updateFixMutation.isPending}
                                className={`flex items-center gap-2 ${
                                  isApproved
                                    ? "text-green-700 bg-green-50 hover:bg-green-100"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {updateFixMutation.isPending ? (
                                  <RefreshCw className="h-4 w-4 animate-spin" />
                                ) : (
                                  <CheckCircle2
                                    className={`h-4 w-4 ${
                                      isApproved
                                        ? "text-green-600"
                                        : "text-gray-400"
                                    }`}
                                  />
                                )}
                                {isApproved ? "Approved" : "Approve"}
                              </Button>
                            </TableCell>
                            {selectedCategory === "alt-tags" && (
                              <TableCell>
                                {issue.image_url ? (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <a
                                          href={issue.image_url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-blue-600 hover:underline text-xs block"
                                        >
                                          {issue.image_url.length > 30
                                            ? issue.image_url.substring(0, 30) +
                                              "..."
                                            : issue.image_url}
                                        </a>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="max-w-md break-all">
                                          {issue.image_url}
                                        </p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                ) : (
                                  <span className="text-xs text-muted-foreground">
                                    No image
                                  </span>
                                )}
                              </TableCell>
                            )}

                            <TableCell>
                              {issue?.page?.url ? (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <a
                                        href={issue.page.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline text-xs block"
                                      >
                                        {issue.page.url.length > 30
                                          ? issue.page.url.substring(0, 30) +
                                            "..."
                                          : issue.page.url}
                                      </a>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="max-w-md break-all">
                                        {issue.page.url}
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              ) : (
                                <span className="text-xs text-muted-foreground">
                                  No page URL
                                </span>
                              )}
                            </TableCell>

                            <TableCell>
                              <div className="space-y-2">
                                {issue.type === "schema" ||
                                issue.type === "semantic-entities" ? (
                                  originalTitle !== "Missing" ? (
                                    <div className="flex items-center gap-2">
                                      <div className="text-[11px] text-muted-foreground flex-1">
                                        Schema present
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={() =>
                                          setViewingSchema({
                                            data: originalTitle,
                                            title: "Original Schema",
                                          })
                                        }
                                      >
                                        <Eye className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="text-[11px] text-muted-foreground">
                                      Missing
                                    </div>
                                  )
                                ) : (
                                  <>
                                    <div className="text-[11px] text-muted-foreground">
                                      {originalTitle}
                                    </div>
                                    {originalProgress && (
                                      <div className="flex items-center gap-2">
                                        <div
                                          className="flex-1 bg-gray-200 rounded-full h-2 cursor-help"
                                          title={
                                            valueStats?.recommended
                                              ?.description || ""
                                          }
                                        >
                                          <div
                                            className={`h-2 rounded-full ${originalProgress.color}`}
                                            style={{
                                              width: `${originalProgress.percentage}%`,
                                            }}
                                          />
                                        </div>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                                          {originalProgress.length} /{" "}
                                          {originalProgress.optimalMin}-
                                          {originalProgress.optimalMax}
                                        </span>
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-2">
                                {issue.type === "schema" ||
                                issue.type === "semantic-entities" ? (
                                  suggestedTitle !== "No suggestion" ? (
                                    <div className="flex items-center gap-2">
                                      <div className="font-semibold text-[11px] flex-1">
                                        Schema suggested
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={() =>
                                          setViewingSchema({
                                            data: suggestedTitle,
                                            title: "Suggested Schema",
                                          })
                                        }
                                      >
                                        <Eye className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={() => handleEditIssue(issue)}
                                      >
                                        <Edit className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2">
                                      <div className="font-semibold text-[11px] flex-1">
                                        No suggestion
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={() => handleEditIssue(issue)}
                                      >
                                        <Edit className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  )
                                ) : (
                                  <>
                                    <div className="flex items-center gap-2">
                                      <div className="font-semibold text-[11px] flex-1">
                                        {suggestedTitle}
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={() => handleEditIssue(issue)}
                                      >
                                        <Edit className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={() =>
                                          handleRegenerateIssue(issue)
                                        }
                                      >
                                        <RefreshCw className="h-3 w-3" />
                                      </Button>
                                    </div>
                                    {suggestedProgress && (
                                      <div className="flex items-center gap-2">
                                        <div
                                          className="flex-1 bg-gray-200 rounded-full h-2 cursor-help"
                                          title={
                                            valueStats?.recommended
                                              ?.description || ""
                                          }
                                        >
                                          <div
                                            className={`h-2 rounded-full ${suggestedProgress.color}`}
                                            style={{
                                              width: `${suggestedProgress.percentage}%`,
                                            }}
                                          />
                                        </div>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                                          {suggestedProgress.length} /{" "}
                                          {suggestedProgress.optimalMin}-
                                          {suggestedProgress.optimalMax}
                                        </span>
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </Card>

              {/* Pagination Footer */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {paginatedIssues.length > 0 ? (
                    <>
                      {(currentPage - 1) * itemsPerPage + 1}-
                      {Math.min(
                        currentPage * itemsPerPage,
                        totalItemsInCategory
                      )}{" "}
                      of {totalItemsInCategory} results shown
                    </>
                  ) : (
                    "0 results"
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    {currentPage}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages || totalPages === 0}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <div className="ml-4 flex items-center gap-2">
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value={10}>10 / page</option>
                      <option value={20}>20 / page</option>
                      <option value={50}>50 / page</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Success Modal with JS Snippet */}
      <JSSnippetModal
        projectId={projectId!}
        open={showSuccessModal}
        onOpenChange={setShowSuccessModal}
        successMode={true}
        appliedCount={appliedCount}
        wordPressConnected={project?.wordpress_connection?.connected || false}
      />

      {/* Edit Fix Modal */}
      {editingIssue && (
        <EditFixModal
          open={!!editingIssue}
          onOpenChange={(open) => !open && setEditingIssue(null)}
          pageUrl={editingIssue.page?.url || ""}
          pageType={editingIssue.page?.type || "other"}
          targetKeyword={editingIssue.page?.target_keyword || ""}
          projectName={project?.name || "Project"}
          originalValue={editingIssue.current_value}
          suggestedFix={
            editingIssue.fix?.content || editingIssue.suggested_value
          }
          contentType={editingIssue.type as any}
          onSave={handleSaveEdit}
          optimalMin={valueStats?.recommended?.optimal_min}
          optimalMax={valueStats?.recommended?.optimal_max}
          recommendedDescription={valueStats?.recommended?.description}
        />
      )}

      {/* Regenerate Modal */}
      {regeneratingIssue && (
        <AIContentModal
          projectName={project?.name || "Project"}
          pageUrl={regeneratingIssue.page?.url || ""}
          pageType={regeneratingIssue.page?.type || "page"}
          targetKeyword={regeneratingIssue.page?.target_keyword || ""}
          contentType={regeneratingIssue.type as any}
          currentContent={regeneratingIssue.current_value}
          onContentGenerated={handleRegenerateSave}
          trigger={null}
          initiallyOpen={true}
          onClose={() => setRegeneratingIssue(null)}
        />
      )}

      {/* Schema View Modal */}
      {viewingSchema && (
        <SchemaViewModal
          open={!!viewingSchema}
          onOpenChange={(open) => !open && setViewingSchema(null)}
          schemaData={viewingSchema.data}
          title={viewingSchema.title}
        />
      )}
    </div>
  );
};
export default AuditResultsGrouped;
