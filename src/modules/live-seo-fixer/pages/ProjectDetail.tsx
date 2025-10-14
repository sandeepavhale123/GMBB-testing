import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ExternalLink, 
  Play, 
  Pause, 
  BarChart3, 
  CheckCircle, 
  AlertCircle,
  Code,
  Copy,
  Eye,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Trash2
} from 'lucide-react';
import { Project } from '../types/Project';
import { SitemapConfigModal } from '../components/SitemapConfigModal';
import { JSSnippetModal } from '../components/JSSnippetModal';
import { getProjectDetails, updateProjectStatus, getProjectAudits, deleteProject } from '@/services/liveSeoFixer';
import { toast } from 'sonner';

export const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [auditPage, setAuditPage] = React.useState(1);

  // Fetch project details
  const { data: projectResponse, isLoading, error } = useQuery({
    queryKey: ['project-details', projectId],
    queryFn: () => getProjectDetails(projectId!),
    enabled: !!projectId,
  });

  // Fetch project audits
  const { data: auditsResponse, isLoading: auditsLoading } = useQuery({
    queryKey: ['project-audits', projectId, auditPage],
    queryFn: () => getProjectAudits(projectId!, auditPage, 10),
    enabled: !!projectId,
  });

  // Update project status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ projectId, status }: { projectId: string; status: 'active' | 'paused' | 'completed' }) =>
      updateProjectStatus(projectId, status),
    onSuccess: () => {
      toast.success('Project status updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['project-details', projectId] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update project status');
    },
  });

  // Delete project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: (projectId: string) => deleteProject(projectId),
    onSuccess: () => {
      toast.success('Project deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      navigate('/module/live-seo-fixer/dashboard');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete project');
    },
  });

  const project = projectResponse?.data;

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const handleStartAudit = () => {
    navigate(`/module/live-seo-fixer/projects/${projectId}/sitemap-config`);
  };

  const handleViewResults = () => {
    navigate(`/module/live-seo-fixer/projects/${projectId}/audit-results-grouped`);
  };

  const handleToggleStatus = () => {
    if (!project) return;
    const newStatus = project.status === 'active' ? 'paused' : 'active';
    updateStatusMutation.mutate({ projectId: project.id, status: newStatus });
  };

  const handleDeleteProject = () => {
    if (!project) return;
    if (window.confirm(`Are you sure you want to delete "${project.name}"? This action cannot be undone.`)) {
      deleteProjectMutation.mutate(project.id);
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
            {error?.message || 'Project not found or unavailable'}
          </p>
          <Button onClick={() => navigate('/module/live-seo-fixer')}>
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
            <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
            <Badge className={`${getStatusColor(project.status)} capitalize`}>
              {project.status}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>{project.website}</span>
            <ExternalLink size={14} />
          </div>
          {project.address && (
            <p className="text-sm text-muted-foreground">📍 {project.address}</p>
          )}
          {project.phone && (
            <p className="text-sm text-muted-foreground">📞 {project.phone}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleToggleStatus}>
            {project.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
            {project.status === 'active' ? 'Pause' : 'Resume'}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDeleteProject}
            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 size={16} className="mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
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
            <CardTitle className="text-sm font-medium">Issues Found</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{project.issues_found}</div>
            <p className="text-xs text-muted-foreground">
              Across audited pages
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Issues Fixed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{project.issues_fixed}</div>
            <p className="text-xs text-muted-foreground">
              Auto-fixed via JS
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">JS Snippet</CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${project.js_snippet_installed ? 'text-green-600' : 'text-red-600'}`}>
              {project.js_snippet_installed ? 'Active' : 'Not Installed'}
            </div>
            <p className="text-xs text-muted-foreground">
              Live fix status
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Actions Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>SEO Audit</CardTitle>
            <CardDescription>
              {project.has_active_audit ? 
                'Audit in progress - view status or start a new audit' :
                project.last_audit_date ? 
                  `Last audit completed on ${new Date(project.last_audit_date).toLocaleDateString()}` :
                  'Start your first SEO audit to identify issues'
              }
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
              <Button variant="outline" className="w-full" onClick={handleViewResults}>
                <Eye size={16} className="mr-2" />
                View Previous Audit Result
              </Button>
            )}
            {project.audited_pages > 0 && (
              <p className="text-sm text-muted-foreground">
                {project.audited_pages} pages audited, {project.issues_found} issues found
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>JavaScript Integration</CardTitle>
            <CardDescription>
              Install the JS snippet on your website to enable live SEO fixes
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
              <div className={`w-2 h-2 rounded-full ${project.js_snippet_installed ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-muted-foreground">
                {project.js_snippet_installed ? 'Snippet installed and active' : 'Snippet not detected'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit History */}
      <Card>
        <CardHeader>
          <CardTitle>Audit History</CardTitle>
          <CardDescription>Previous SEO audits for this project</CardDescription>
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
              <p className="text-sm mt-1">Start your first audit to see results here</p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {auditsResponse?.data?.audits?.map((audit) => (
                  <div 
                    key={audit.id} 
                    className="flex items-center gap-3 text-sm p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/module/live-seo-fixer/projects/${projectId}/audit-results-grouped`)}
                  >
                    <div className="flex-shrink-0">
                      {audit.status === 'completed' ? (
                        <CheckCircle size={20} className="text-green-600" />
                      ) : audit.status === 'in_progress' ? (
                        <Loader2 size={20} className="text-blue-600 animate-spin" />
                      ) : audit.status === 'failed' ? (
                        <AlertCircle size={20} className="text-red-600" />
                      ) : (
                        <BarChart3 size={20} className="text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">
                        Audit #{audit.id} - {audit.status === 'completed' ? 'Completed' : audit.status === 'in_progress' ? 'In Progress' : audit.status === 'failed' ? 'Failed' : 'Pending'}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {audit.pages_count} pages • {audit.issues_count} issues found • {audit.applied_fixes_count} fixes applied
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(audit.created_date).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {auditsResponse?.data?.pagination && auditsResponse.data.pagination.total_pages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Page {auditsResponse.data.pagination.current_page} of {auditsResponse.data.pagination.total_pages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAuditPage(prev => Math.max(1, prev - 1))}
                      disabled={!auditsResponse.data.pagination.has_prev}
                    >
                      <ChevronLeft size={16} />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAuditPage(prev => prev + 1)}
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
    </div>
  );
};