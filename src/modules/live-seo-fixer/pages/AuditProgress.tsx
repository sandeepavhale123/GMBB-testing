import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { projectService } from "@/services/liveSeoFixer/projectService";

export const AuditProgress: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const { data: progress, isError } = useQuery({
    queryKey: ["seo-audit-status", projectId],
    queryFn: () => projectService.getAuditStatus(projectId!),
    enabled: !!projectId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "completed" || status === "failed" ? false : 2000;
    },
  });

  useEffect(() => {
    if (progress?.status === "completed") {
      const timer = setTimeout(() => {
        navigate(`/module/live-seo-fixer/projects/${projectId}/audit-results-grouped`);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [progress?.status, navigate, projectId]);

  const getStatusIcon = () => {
    switch (progress?.status) {
      case "completed":
        return <CheckCircle2 className="w-16 h-16 text-green-500" />;
      case "failed":
        return <AlertCircle className="w-16 h-16 text-destructive" />;
      default:
        return <Loader2 className="w-16 h-16 text-primary animate-spin" />;
    }
  };

  const getStatusText = () => {
    switch (progress?.status) {
      case "pending":
        return "Preparing audit...";
      case "scraping":
        return "Scraping pages...";
      case "analyzing":
        return "Analyzing SEO issues...";
      case "completed":
        return "Audit completed! Redirecting...";
      case "failed":
        return "Audit failed";
      default:
        return "Processing...";
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pt-12">
      <Card>
        <CardContent className="pt-12 pb-12">
          <div className="flex flex-col items-center space-y-6">
            {getStatusIcon()}

            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {getStatusText()}
              </h2>
              {progress?.currentStep && (
                <p className="text-muted-foreground">{progress.currentStep}</p>
              )}
            </div>

            {progress && progress.status !== "failed" && (
              <div className="w-full space-y-2">
                <Progress value={progress.progress} className="h-2" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>
                    {progress.pagesProcessed} / {progress.totalPages} pages
                  </span>
                  <span>{progress.progress}%</span>
                </div>
              </div>
            )}

            {progress?.status === "completed" && (
              <div className="text-center">
                <p className="text-green-600 font-medium mb-4">
                  All pages have been audited successfully!
                </p>
                <Button
                  onClick={() =>
                    navigate(
                      `/module/live-seo-fixer/projects/${projectId}/audit-results-grouped`
                    )
                  }
                >
                  View Results Now
                </Button>
              </div>
            )}

            {(progress?.status === "failed" || isError) && (
              <div className="text-center space-y-4">
                <p className="text-destructive">
                  Something went wrong during the audit. Please try again.
                </p>
                <Button
                  variant="outline"
                  onClick={() =>
                    navigate(`/module/live-seo-fixer/projects/${projectId}`)
                  }
                >
                  Back to Project
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Status Steps */}
      {progress && progress.status !== "failed" && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {["pending", "scraping", "analyzing", "completed"].map((step, index) => {
                const isActive = progress.status === step;
                const isCompleted =
                  ["pending", "scraping", "analyzing", "completed"].indexOf(
                    progress.status
                  ) > index;

                return (
                  <div key={step} className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? "bg-green-500 text-white"
                          : isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <span className="text-sm">{index + 1}</span>
                      )}
                    </div>
                    <div>
                      <p
                        className={`font-medium capitalize ${
                          isActive || isCompleted
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {step}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
