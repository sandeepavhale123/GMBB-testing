import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, Plus, MoreVertical, Eye, Edit, Share, Trash2, Users, Target, Calendar, CreditCard, Loader2 } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from '@/components/ui/pagination';
import { useGeoProjects } from '../hooks/useGeoProjects';
import type { GeoProject } from '../types';
import { comprehensiveCleanup, startBodyStyleObserver, stopBodyStyleObserver } from '@/utils/domUtils';
export const Dashboard: React.FC = () => {
  const {
    projects,
    pagination,
    summary,
    isLoading,
    createProject,
    updateProject,
    deleteProject,
    isCreating,
    isUpdating,
    isDeleting,
    currentPage,
    searchTerm,
    handlePageChange,
    handleSearchChange
  } = useGeoProjects();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProject, setEditingProject] = useState<GeoProject | null>(null);
  const [newProject, setNewProject] = useState({
    name: '',
    notificationEmail: ''
  });

  // Delete confirmation dialog state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<GeoProject | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const handleCreateProject = () => {
    if (isEditMode && editingProject) {
      updateProject({
        projectId: parseInt(editingProject.id),
        projectName: newProject.name,
        emails: newProject.notificationEmail
      });
    } else {
      createProject({
        projectName: newProject.name,
        emails: newProject.notificationEmail
      });
    }
    setNewProject({
      name: '',
      notificationEmail: ''
    });
    setShowCreateModal(false);
    setIsEditMode(false);
    setEditingProject(null);
  };
  const handleEditProject = (project: GeoProject) => {
    setEditingProject(project);
    setNewProject({
      name: project.name,
      notificationEmail: project.notificationEmail
    });
    setIsEditMode(true);
    setShowCreateModal(true);
  };
  const handleCloseModal = () => {
    setShowCreateModal(false);
    setIsEditMode(false);
    setEditingProject(null);
    setNewProject({
      name: '',
      notificationEmail: ''
    });
  };
  const handleDeleteClick = (project: GeoProject) => {
    setProjectToDelete(project);
    setDeleteConfirmText('');
    setShowDeleteDialog(true);
  };
  const handleConfirmDelete = () => {
    if (projectToDelete && deleteConfirmText === 'delete') {
      deleteProject({
        projectId: parseInt(projectToDelete.id),
        confirm: 'delete'
      });
      setShowDeleteDialog(false);
      setProjectToDelete(null);
      setDeleteConfirmText('');
      // Immediate cleanup after successful deletion
      comprehensiveCleanup();
      // Additional delayed cleanup
      setTimeout(() => {
        comprehensiveCleanup();
      }, 300);
    }
  };
  const handleCloseDeleteDialog = () => {
    setShowDeleteDialog(false);
    setProjectToDelete(null);
    setDeleteConfirmText('');
    // Force comprehensive cleanup of body styles after dialog closes
    setTimeout(() => {
      comprehensiveCleanup();
    }, 200);
  };

  // Additional safety cleanup when dialog state changes
  useEffect(() => {
    if (!showDeleteDialog) {
      setTimeout(() => {
        comprehensiveCleanup();
      }, 100);
    }
  }, [showDeleteDialog]);

  // Start MutationObserver as backup cleanup monitor
  useEffect(() => {
    startBodyStyleObserver();
    return () => {
      stopBodyStyleObserver();
    };
  }, []);
  const summaryCards = [{
    title: 'No Of Project',
    value: summary?.totalProjects || 0,
    icon: Users,
    color: 'text-blue-500'
  }, {
    title: 'No Of Keywords',
    value: summary?.totalKeywords || 0,
    icon: Target,
    color: 'text-green-500'
  }, {
    title: 'No Of Scheduled Scan',
    value: summary?.scheduledScans || 0,
    icon: Calendar,
    color: 'text-orange-500'
  }, {
    title: 'Available Credits',
    value: summary ? `${summary.availableCredits.toLocaleString()} remaining of ${summary.allowedCredits.toLocaleString()} total` : '0 remaining of 0 total',
    icon: CreditCard,
    color: 'text-purple-500'
  }];
  if (isLoading) {
    return <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>)}
        </div>
      </div>;
  }
  return <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Project Management</h1>
          <p className="text-muted-foreground">Manage your GEO ranking projects</p>
        </div>
        <Dialog open={showCreateModal} onOpenChange={open => {
        if (!open) {
          handleCloseModal();
        } else {
          setShowCreateModal(true);
        }
      }}>
          <DialogTrigger asChild>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditMode ? 'Edit Project' : 'Create New Project'}</DialogTitle>
              <DialogDescription>
                {isEditMode ? 'Update the details for your GEO ranking project.' : 'Enter the details for your new GEO ranking project.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="project-name">Project Name</Label>
                <Input id="project-name" value={newProject.name} onChange={e => setNewProject({
                ...newProject,
                name: e.target.value
              })} placeholder="Enter project name" />
              </div>
              <div>
                <Label htmlFor="notification-email">Notification Email</Label>
                <Input id="notification-email" type="email" value={newProject.notificationEmail} onChange={e => setNewProject({
                ...newProject,
                notificationEmail: e.target.value
              })} placeholder="Enter emails separated by commas" />
              </div>
              <DialogFooter className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button onClick={handleCreateProject} disabled={!newProject.name || !newProject.notificationEmail || isCreating || isUpdating}>
                  {(isCreating || isUpdating) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isEditMode ? 'Update Project' : 'Create Project'}
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map(card => {
        const Icon = card.icon;

        // Special layout for Credits card
        if (card.title === 'Available Credits') {
          const remainingCredits = summary?.availableCredits || 0;
          const totalCredits = summary?.allowedCredits || 0;
          const progressPercentage = totalCredits > 0 ? remainingCredits / totalCredits * 100 : 0;
          return <Card key={card.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="">
                      <p className="text-sm font-medium text-muted-foreground">Available Credit</p>
                      <h3 className="text-2xl font-bold text-foreground">{remainingCredits.toLocaleString()} </h3>
                    </div>

                    <Icon className={`w-8 h-8 ${card.color}`} />
                    
                    
                  </div>
                </CardContent>
              </Card>;
        }

        // Default layout for other cards
        return <Card key={card.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                    <p className="text-2xl font-bold text-foreground">{card.value}</p>
                  </div>
                  <Icon className={`w-8 h-8 ${card.color}`} />
                </div>
              </CardContent>
            </Card>;
      })}
      </div>

      {/* Projects Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center w-full">
           
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input placeholder="Search projects..." value={searchTerm} onChange={e => handleSearchChange(e.target.value)} className="pl-10 w-full" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="border-b border-border bg-gray-50 ">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Project Name</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">No of Keywords</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Notification Email</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {projects.length === 0 ? <tr>
                    <td colSpan={5} className="py-8 text-center">
                      <div className="text-muted-foreground">
                        {isLoading ? 'Loading projects...' : 'No projects found'}
                      </div>
                    </td>
                  </tr> : projects.map(project => <tr key={project.id} className="border-b border-border/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-foreground">{project.name}</span>
                          
                        </div>
                      </td>
                      <td className="py-3 px-4 text-foreground">{project.numberOfChecks}</td>
                      <td className="py-3 px-4 text-muted-foreground">{project.createdDate}</td>
                      <td className="py-3 px-4 text-muted-foreground">{project.notificationEmail}</td>
                      <td className="py-3 px-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditProject(project)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share className="w-4 h-4 mr-2" />
                              Shareable Link
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteClick(project)}>
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>)}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && <div className="flex items-center justify-between mt-6 pt-4 border-t border-border p-4 ">
              <div className="text-sm text-muted-foreground flex-1 max-w[200px]">
                Showing {(currentPage - 1) * pagination.limit + 1} to {Math.min(currentPage * pagination.limit, pagination.total)} of {pagination.total} projects
              </div>
              
              <Pagination className="flex justify-end max-w-[300px]">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} className={currentPage <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
                  </PaginationItem>
                  
                  {/* Page numbers */}
                  {Array.from({
                length: Math.min(5, pagination.totalPages)
              }, (_, i) => {
                let pageNum: number;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return <PaginationItem key={pageNum}>
                        <PaginationLink onClick={() => handlePageChange(pageNum)} isActive={currentPage === pageNum} className="cursor-pointer">
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>;
              })}
                  
                  {pagination.totalPages > 5 && currentPage < pagination.totalPages - 2 && <>
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink onClick={() => handlePageChange(pagination.totalPages)} className="cursor-pointer">
                          {pagination.totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    </>}
                  
                  <PaginationItem>
                    <PaginationNext onClick={() => handlePageChange(currentPage + 1)} className={currentPage >= pagination.totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={open => {
      if (!open) {
        handleCloseDeleteDialog();
        // Additional cleanup when dialog closes via onOpenChange
        setTimeout(() => {
          comprehensiveCleanup();
        }, 250);
      }
    }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project "{projectToDelete?.name}" and all its related data including keywords and map points.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="delete-confirm">Type "delete" to confirm</Label>
              <Input id="delete-confirm" value={deleteConfirmText} onChange={e => setDeleteConfirmText(e.target.value)} placeholder="delete" className="mt-2" />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseDeleteDialog}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} disabled={deleteConfirmText !== 'delete' || isDeleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>;
};
export default Dashboard;