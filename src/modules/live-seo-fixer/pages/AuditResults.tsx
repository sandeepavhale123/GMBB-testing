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
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Eye,
  ExternalLink,
  BarChart3,
} from "lucide-react";
import { getAuditResults } from "@/services/liveSeoFixer";

const AuditResults: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  // Fetch audit results
  const { data: auditResultsResponse, isLoading } = useQuery({
    queryKey: ["audit-results", projectId],
    queryFn: () => getAuditResults(projectId!),
    enabled: !!projectId,
  });

  const auditResults = auditResultsResponse?.data;
  const results = auditResults?.pages_audited || [];

  const totalIssues = auditResults?.total_issues || 0;
  const criticalIssues = auditResults?.issues_by_severity?.high || 0;
  const warningIssues = auditResults?.issues_by_severity?.medium || 0;
  const infoIssues = auditResults?.issues_by_severity?.low || 0;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "has_issues":
        return "bg-red-100 text-red-800 border-red-200";
      case "warnings":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "good":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "has_issues":
        return <AlertTriangle className="h-4 w-4" />;
      case "warnings":
        return <AlertCircle className="h-4 w-4" />;
      case "good":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const handleViewPageAudit = (pageId: string) => {
    // Extract numeric ID from "page_123" format
    const numericId = pageId.replace("page_", "");
    navigate(
      `/module/live-seo-fixer/projects/${projectId}/pages/${numericId}/audit`
    );
  };

  const handleNewAudit = () => {
    navigate(`/module/live-seo-fixer/projects/${projectId}/sitemap-config`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
        <span className="ml-2">Loading audit results...</span>
      </div>
    );
  }

  if (!auditResults) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <CardTitle className="mb-2">No audit results</CardTitle>
          <CardDescription className="mb-4">
            Start your first SEO audit to see results here.
          </CardDescription>
          <Button onClick={handleNewAudit}>
            <BarChart3 size={16} className="mr-2" />
            Start New Audit
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
            navigate(`/module/live-seo-fixer/projects/${projectId}`)
          }
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Project
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Audit Results</h1>
          <p className="text-muted-foreground mt-1">
            SEO audit completed for {results.length} pages
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pages Audited</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results.length}</div>
            <p className="text-xs text-muted-foreground">All pages analyzed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalIssues}</div>
            <p className="text-xs text-muted-foreground">Issues detected</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Critical Issues
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {criticalIssues}
            </div>
            <p className="text-xs text-muted-foreground">
              Need immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auto-Fixable</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {results.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Pages available for fixing
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Page Results</h2>
        </div>

        {results.map((result) => (
          <Card key={result.page_id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{result.url}</CardTitle>
                    <ExternalLink size={14} className="text-muted-foreground" />
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline">{result.page_type}</Badge>
                    <Badge variant="outline">
                      Target: {result.target_keyword}
                    </Badge>
                    <Badge className={getSeverityColor(result.status)}>
                      {getSeverityIcon(result.status)}
                      <span className="ml-1 capitalize">
                        {result.status === "has_issues"
                          ? "Issues Found"
                          : result.status}
                      </span>
                    </Badge>
                  </div>
                </div>
                <Button
                  onClick={() => handleViewPageAudit(result.page_id)}
                  className="ml-4"
                >
                  <Eye size={16} className="mr-2" />
                  See Audit
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex items-center gap-6">
                <div className="text-sm">
                  <span className="font-medium">Issues found:</span>
                  <span className="ml-2">{result.issues_count}</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium">Status:</span>
                  <span className="ml-2 capitalize">
                    {result.status === "has_issues"
                      ? "Has Issues"
                      : result.status}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {results.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <CardTitle className="mb-2">No audit results</CardTitle>
            <CardDescription className="mb-4">
              Start your first SEO audit to see results here.
            </CardDescription>
            <Button onClick={handleNewAudit}>
              <BarChart3 size={16} className="mr-2" />
              Start New Audit
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
export default AuditResults;
