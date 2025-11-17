import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Wand2,
  Save,
  Play,
  Loader2,
  Edit,
} from "lucide-react";
import AIContentModal from "../components/AIContentModal";
import {
  getPageAuditDetails,
  approveFixes,
  updateFixStatus,
} from "@/services/liveSeoFixer";
import { useToast } from "@/hooks/use-toast";

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "high":
    case "critical":
      return "bg-red-100 text-red-800 border-red-200";
    case "medium":
    case "warning":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "low":
    case "info":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case "high":
    case "critical":
      return <AlertTriangle className="h-4 w-4" />;
    case "medium":
    case "warning":
      return <AlertCircle className="h-4 w-4" />;
    case "low":
    case "info":
      return <CheckCircle className="h-4 w-4" />;
    default:
      return <AlertCircle className="h-4 w-4" />;
  }
};

const PageAudit: React.FC = () => {
  const { projectId, pageId } = useParams<{
    projectId: string;
    pageId: string;
  }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [fixes, setFixes] = React.useState<
    Record<string, { content: string; approved: boolean }>
  >({});

  // Fetch page audit details
  const {
    data: auditResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["page-audit-details", projectId, pageId],
    queryFn: () => getPageAuditDetails(projectId!, pageId!),
    enabled: !!projectId && !!pageId,
  });

  const audit = auditResponse?.data;

  // Initialize fixes state with existing fix data from audit
  React.useEffect(() => {
    if (audit?.issues) {
      const existingFixes: Record<
        string,
        { content: string; approved: boolean }
      > = {};
      audit.issues.forEach((issue) => {
        const fixContent =
          issue.content || issue.fix_value || issue.suggested_fix;
        if (fixContent) {
          existingFixes[issue.issue_id] = {
            content: fixContent,
            approved:
              issue.approved === 1 ||
              issue.fix_status === "applied" ||
              issue.fix_status === "approved",
          };
        }
      });
      setFixes(existingFixes);
    }
  }, [audit]);

  const handleFixChange = (issueId: string, content: string) => {
    setFixes((prev) => ({
      ...prev,
      [issueId]: { ...prev[issueId], content },
    }));
  };

  const handleApprove = async (issueId: string) => {
    const currentFix = fixes[issueId];
    const issue = audit?.issues.find((i) => i.issue_id === issueId);
    const fixValue =
      currentFix?.content ||
      issue?.content ||
      issue?.fix_value ||
      issue?.suggested_fix ||
      "";
    const currentApprovedState =
      currentFix?.approved ||
      issue?.approved === 1 ||
      issue?.fix_status === "applied" ||
      issue?.fix_status === "approved";
    const newApprovedState = !currentApprovedState;

    if (!fixValue) {
      toast({
        title: "Error",
        description: "Please provide a fix value before approving.",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateFixStatus(
        projectId!,
        pageId!,
        issueId,
        fixValue,
        newApprovedState
      );

      setFixes((prev) => ({
        ...prev,
        [issueId]: {
          content: fixValue,
          approved: newApprovedState,
        },
      }));

      toast({
        title: newApprovedState ? "Fix Approved" : "Fix Disapproved",
        description: newApprovedState
          ? "The fix has been approved and saved."
          : "The fix has been disapproved.",
      });

      // Refetch to get updated status
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update fix status. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading audit details...</span>
      </div>
    );
  }

  if (!audit) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <CardTitle className="mb-2">No audit data found</CardTitle>
          <CardDescription className="mb-4">
            Unable to load audit details for this page.
          </CardDescription>
          <Button
            onClick={() =>
              navigate(
                `/module/live-seo-fixer/projects/${projectId}/audit-results-grouped`
              )
            }
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Results
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            navigate(
              `/module/live-seo-fixer/projects/${projectId}/audit-results-grouped`
            )
          }
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Results
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">
            Page Audit Report
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-muted-foreground">{audit.url}</span>
            <ExternalLink size={14} className="text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Page Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <CardTitle>Page Information</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{audit.page_type}</Badge>
                <Badge variant="outline">Target: {audit.target_keyword}</Badge>
                <Badge variant="outline">Status: {audit.audit_status}</Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{audit.issues.length}</div>
              <div className="text-sm text-muted-foreground">Issues found</div>
              <div className="text-xs text-muted-foreground mt-1">
                Last scanned: {new Date(audit.last_scanned).toLocaleString()}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Issues */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">SEO Issues & Fixes</h2>

        {audit.issues.map((issue) => (
          <Card key={issue.issue_id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className={getSeverityColor(issue.severity)}>
                      {getSeverityIcon(issue.severity)}
                      <span className="ml-1 capitalize">{issue.severity}</span>
                    </Badge>
                    <Badge variant="outline">{issue.type.toUpperCase()}</Badge>
                    {issue.fix_status && (
                      <Badge
                        variant={
                          issue.fix_status === "applied" ? "default" : "outline"
                        }
                      >
                        {issue.fix_status}
                      </Badge>
                    )}
                    {issue.is_merged && issue.sub_issues_count && (
                      <Badge variant="secondary">
                        {issue.sub_issues_count} Sub-Issues
                      </Badge>
                    )}
                  </div>
                  {/* Display message only if not merged, otherwise show sub-issues */}
                  {!issue.is_merged && (
                    <CardTitle className="text-lg">{issue.message}</CardTitle>
                  )}

                  {/* Sub-issues */}
                  {issue.is_merged &&
                    issue.sub_issues &&
                    issue.sub_issues.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {issue.sub_issues.map((subIssue, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2 text-sm"
                          >
                            <div className="flex-1">
                              <p className="text-foreground">
                                {subIssue.message}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                <span className="font-medium">Suggestion:</span>{" "}
                                {subIssue.suggestion}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
                {issue.can_auto_fix && (
                  <div className="flex gap-2">
                    {issue.type === "schema" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigate(
                            `/module/live-seo-fixer/projects/${projectId}/pages/${pageId}/schema-editor`,
                            {
                              state: {
                                schemaData:
                                  issue.fix_value ||
                                  issue.suggested_fix ||
                                  issue.current_value,
                                issueId: issue.issue_id,
                              },
                            }
                          )
                        }
                      >
                        <Edit size={16} className="mr-2" />
                        Edit Schema
                      </Button>
                    )}
                    <AIContentModal
                      projectName={audit.project?.name || "Project"}
                      pageUrl={audit.url}
                      pageType={audit.page_type}
                      targetKeyword={audit.target_keyword}
                      contentType={issue.type as any}
                      currentContent={issue.current_value}
                      onContentGenerated={(content) =>
                        handleFixChange(issue.issue_id, content)
                      }
                      trigger={
                        <Button variant="outline" size="sm">
                          <Wand2 size={16} className="mr-2" />
                          AI Help
                        </Button>
                      }
                    />
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {issue.current_value && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Current Value:</label>
                  <div className="bg-red-50 border border-red-200 rounded p-3 text-sm">
                    {issue.current_value}
                  </div>
                </div>
              )}

              {issue.can_auto_fix && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {fixes[issue.issue_id]?.content ||
                    issue.content ||
                    issue.fix_value
                      ? "Your Fix:"
                      : "Suggested Fix:"}
                  </label>
                  <Textarea
                    placeholder={
                      issue.suggested_fix || "Enter your fix here..."
                    }
                    value={
                      fixes[issue.issue_id]?.content ||
                      issue.content ||
                      issue.fix_value ||
                      issue.suggested_fix ||
                      ""
                    }
                    onChange={(e) =>
                      handleFixChange(issue.issue_id, e.target.value)
                    }
                    className="min-h-[80px]"
                  />

                  <div className="flex items-center justify-between">
                    <Button
                      variant={
                        fixes[issue.issue_id]?.approved ||
                        issue.approved === 1 ||
                        issue.fix_status === "applied" ||
                        issue.fix_status === "approved"
                          ? "destructive"
                          : "default"
                      }
                      size="sm"
                      onClick={() => handleApprove(issue.issue_id)}
                    >
                      {fixes[issue.issue_id]?.approved ||
                      issue.approved === 1 ||
                      issue.fix_status === "applied" ||
                      issue.fix_status === "approved"
                        ? "Disapprove"
                        : "Approve for Live Deployment"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleFixChange(
                          issue.issue_id,
                          issue.suggested_fix || ""
                        )
                      }
                    >
                      <Save size={16} className="mr-2" />
                      Use Suggested
                    </Button>
                  </div>
                </div>
              )}

              {!issue.can_auto_fix && (
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    This issue requires manual intervention and cannot be
                    automatically fixed via JavaScript.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PageAudit;
