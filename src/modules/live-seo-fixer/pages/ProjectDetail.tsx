import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PlayCircle,
  Code,
  Trash2,
  ExternalLink,
  Calendar,
  TrendingUp,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { projectService } from "@/services/liveSeoFixer/projectService";
import { SitemapConfigModal } from "../components/SitemapConfigModal";
import { JSSnippetModal } from "../components/JSSnippetModal";
import { cn } from "@/lib/utils";

export const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSitemapModalOpen, setIsSitemapModalOpen] = useState(false);
  const [isJSModalOpen, setIsJSModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [auditPage, setAuditPage] = useState(1);

  const { data: project, isLoading } = useQuery({
    queryKey: ["seo-project", projectId],
    queryFn: () => projectService.getProjectDetails(projectId!),
    enabled: !!projectId,
  });

  const { data: auditsData } = useQuery({
    queryKey: ["seo-project-audits", projectId, auditPage],
    queryFn: () => projectService.getProjectAudits(projectId!, auditPage, 10),
    enabled: !!projectId,
  });

  const { data: jsCodeData } = useQuery({
    queryKey: ["seo-js-code", projectId],
    queryFn: () => projectService.getJSCode(projectId!),
    enabled: !!projectId && isJSModalOpen,
  });

  const updateStatusMutation = useMutation({
    mutationFn: (status: string) => projectService.updateProjectStatus(projectId!, status),
    onSuccess: () => {
      toast.success("Project status updated");
      queryClient.invalidateQueries({ queryKey: ["seo-project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["seo-projects"] });
    },
    onError: () => {
      toast.error("Failed to update status");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => projectService.deleteProject(projectId!),
    onSuccess: () => {
      toast.success("Project deleted successfully");
      navigate("/module/live-seo-fixer/dashboard");
    },
    onError: () => {
      toast.error("Failed to delete project");
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-700 border-green-500/20";
      case "paused":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20";
      case "completed":
        return "bg-blue-500/10 text-blue-700 border-blue-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">Project not found</p>
          <Button className="mt-4" onClick={() => navigate("/module/live-seo-fixer/dashboard")}>
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{project.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <ExternalLink className="w-4 h-4 text-muted-foreground" />
            <a
              href={project.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {project.website}
            </a>
          </div>
        </div>
        <div className="flex gap-2">
          <Select
            value={project.status}
            onValueChange={(value) => updateStatusMutation.mutate(value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Audits</p>
                <p className="text-3xl font-bold text-foreground mt-2">
                  {project.stats?.total_audits || 0}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Issues Found</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">
                  {project.issues_found}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Issues Fixed</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {project.issues_fixed}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4">
        <Button size="lg" onClick={() => setIsSitemapModalOpen(true)}>
          <PlayCircle className="w-5 h-5 mr-2" />
          Start New Audit
        </Button>
        <Button variant="outline" size="lg" onClick={() => setIsJSModalOpen(true)}>
          <Code className="w-5 h-5 mr-2" />
          View JS Snippet
        </Button>
        <Button
          variant="destructive"
          size="lg"
          onClick={() => setIsDeleteDialogOpen(true)}
        >
          <Trash2 className="w-5 h-5 mr-2" />
          Delete Project
        </Button>
      </div>

      {/* Audit History */}
      <Card>
        <CardHeader>
          <CardTitle>Audit History</CardTitle>
        </CardHeader>
        <CardContent>
          {auditsData?.audits.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No audits yet. Start your first audit to get SEO insights.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Pages Audited</TableHead>
                  <TableHead>Issues Found</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditsData?.audits.map((audit) => (
                  <TableRow key={audit.id}>
                    <TableCell>
                      {new Date(audit.created_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{audit.pages_audited}</TableCell>
                    <TableCell>{audit.issues_found}</TableCell>
                    <TableCell>
                      <Badge className={cn("capitalize", getStatusColor(audit.status))}>
                        {audit.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          navigate(
                            `/module/live-seo-fixer/projects/${projectId}/audit-results-grouped?auditId=${audit.id}`
                          )
                        }
                      >
                        View Results
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <SitemapConfigModal
        isOpen={isSitemapModalOpen}
        onClose={() => setIsSitemapModalOpen(false)}
        projectId={projectId!}
      />

      {jsCodeData && (
        <JSSnippetModal
          isOpen={isJSModalOpen}
          onClose={() => setIsJSModalOpen(false)}
          jsCode={jsCodeData.js_code}
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this project? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
