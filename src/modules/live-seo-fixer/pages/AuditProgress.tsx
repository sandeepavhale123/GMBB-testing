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
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3,
  Mail,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuditProgress as AuditProgressType } from "../types/Audit";
import { getAuditStatus } from "@/services/liveSeoFixer";

const AuditProgress: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  // Fetch audit status with polling
  const { data: auditStatusResponse } = useQuery({
    queryKey: ["audit-status", projectId],
    queryFn: () => getAuditStatus(projectId!),
    enabled: !!projectId,
    refetchInterval: (query) => {
      // Stop polling if completed or failed
      const status = query.state.data?.data?.status;
      if (status === "completed" || status === "failed") {
        return false;
      }
      // Poll every 2 seconds
      return 2000;
    },
    refetchIntervalInBackground: false, // Stop polling when tab is not active
  });

  const auditStatus = auditStatusResponse?.data;

  // Auto-redirect when audit is completed
  React.useEffect(() => {
    if (auditStatus?.status === "completed") {
      const timer = setTimeout(() => {
        navigate(
          `/module/live-seo-fixer/projects/${projectId}/audit-results-grouped`
        );
      }, 2000); // Wait 2 seconds before redirect

      return () => clearTimeout(timer);
    }
  }, [auditStatus?.status, navigate, projectId]);

  const handleViewResults = () => {
    navigate(
      `/module/live-seo-fixer/projects/${projectId}/audit-results-grouped`
    );
  };

  const handleReturnToDashboard = () => {
    navigate(`/module/live-seo-fixer/projects/${projectId}`);
  };

  const progressSteps = [
    { key: "started", label: "Preparing audit", icon: Clock },
    { key: "in_progress", label: "Analyzing pages", icon: BarChart3 },
    { key: "completed", label: "Audit complete", icon: CheckCircle },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getCurrentStepIndex = () => {
    return progressSteps.findIndex((step) => step.key === auditStatus?.status);
  };

  if (!auditStatus) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
        <span className="ml-2">Loading audit status...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          SEO Audit in Progress
        </h1>
        <p className="text-muted-foreground">
          We're analyzing your selected pages. This usually takes 2-5 minutes.
        </p>
      </div>

      {/* Status Card */}
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Badge className={getStatusColor(auditStatus.status)}>
              {auditStatus.status === "in_progress"
                ? "In Progress"
                : auditStatus.status.charAt(0).toUpperCase() +
                  auditStatus.status.slice(1)}
            </Badge>
          </div>
          <CardTitle className="text-xl">{auditStatus.current_step}</CardTitle>
          <CardDescription>
            {auditStatus.pages_completed} of {auditStatus.pages_total} pages
            processed
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(auditStatus.progress_percentage)}%</span>
            </div>
            <Progress
              value={auditStatus.progress_percentage}
              className="w-full"
            />
          </div>

          {/* Step Indicators */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Audit Steps:</h4>
            <div className="space-y-3">
              {progressSteps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === getCurrentStepIndex();
                const isCompleted = index < getCurrentStepIndex();
                const isPending = index > getCurrentStepIndex();

                return (
                  <div
                    key={step.key}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-primary/10 border border-primary/20"
                        : isCompleted
                        ? "bg-green-50 border border-green-200"
                        : "bg-muted/50"
                    }`}
                  >
                    <div
                      className={`p-1.5 rounded-full ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : isCompleted
                          ? "bg-green-500 text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Icon size={16} />
                    </div>
                    <span
                      className={`text-sm ${
                        isActive
                          ? "font-medium"
                          : isPending
                          ? "text-muted-foreground"
                          : ""
                      }`}
                    >
                      {step.label}
                    </span>
                    {isCompleted && (
                      <CheckCircle
                        size={16}
                        className="text-green-500 ml-auto"
                      />
                    )}
                    {isActive && auditStatus?.status !== "completed" && (
                      <div className="ml-auto">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                      </div>
                    )}
                    {isActive && auditStatus?.status === "completed" && (
                      <div className="ml-auto text-xs text-green-600 font-medium">
                        Audit completed successfully!
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Email Notification Info */}
          {auditStatus.status !== "completed" && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex items-start gap-3">
              <Mail className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-blue-900 mb-1">
                  You don't need to wait here
                </h4>
                <p className="text-sm text-blue-700">
                  You can close this page or return to the dashboard. We'll send
                  you an email notification when the audit is complete.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={handleReturnToDashboard}
                >
                  <Home size={16} className="mr-2" />
                  Return to Dashboard
                </Button>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">What we're checking:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Page titles and meta descriptions</li>
              <li>• Heading structure (H1, H2, H3)</li>
              <li>• Image alt attributes</li>
              <li>• JSON-LD schema markup</li>
              <li>• Page loading performance</li>
              <li>• Mobile responsiveness indicators</li>
            </ul>
          </div>

          {auditStatus.status === "completed" && (
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200 space-y-3">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="font-medium text-green-800">
                Audit completed successfully!
              </p>
              <Button onClick={handleViewResults} className="w-full">
                View Audit Results
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditProgress;
