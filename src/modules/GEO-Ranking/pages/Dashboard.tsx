import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, Plus, MoreVertical, Eye, Edit, Share, Trash2, Users, Target, Calendar, CreditCard } from 'lucide-react';
import { useGeoProjects } from '../hooks/useGeoProjects';
import type { GeoProject } from '../types';

export const Dashboard: React.FC = () => {
  const { projects, summary, isLoading, createProject, deleteProject, isCreating } = useGeoProjects();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    notificationEmail: '',
    keywords: '',
  });

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.notificationEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProject = () => {
    const keywordsArray = newProject.keywords.split(',').map(k => k.trim()).filter(k => k);
    
    createProject({
      name: newProject.name,
      notificationEmail: newProject.notificationEmail,
      keywords: keywordsArray,
      numberOfChecks: 0,
      createdDate: new Date().toISOString().split('T')[0],
      isActive: true,
    });

    setNewProject({ name: '', notificationEmail: '', keywords: '' });
    setShowCreateModal(false);
  };

  const summaryCards = [
    {
      title: 'No Of Project',
      value: summary?.totalProjects || 0,
      icon: Users,
      color: 'text-blue-500',
    },
    {
      title: 'No Of Keywords',
      value: summary?.totalKeywords || 0,
      icon: Target,
      color: 'text-green-500',
    },
    {
      title: 'No Of Scheduled Scan',
      value: summary?.scheduledScans || 0,
      icon: Calendar,
      color: 'text-orange-500',
    },
    {
      title: 'Available Credits',
      value: summary?.availableCredits || 0,
      icon: CreditCard,
      color: 'text-purple-500',
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Project Management</h1>
          <p className="text-muted-foreground">Manage your GEO ranking projects</p>
        </div>
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder="Enter project name"
                />
              </div>
              <div>
                <Label htmlFor="notification-email">Notification Email</Label>
                <Input
                  id="notification-email"
                  type="email"
                  value={newProject.notificationEmail}
                  onChange={(e) => setNewProject({ ...newProject, notificationEmail: e.target.value })}
                  placeholder="Enter notification email"
                />
              </div>
              <div>
                <Label htmlFor="keywords">Keywords (comma separated)</Label>
                <Textarea
                  id="keywords"
                  value={newProject.keywords}
                  onChange={(e) => setNewProject({ ...newProject, keywords: e.target.value })}
                  placeholder="Enter keywords separated by commas"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateProject} disabled={isCreating}>
                  {isCreating ? 'Creating...' : 'Create Project'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                    <p className="text-2xl font-bold text-foreground">{card.value}</p>
                  </div>
                  <Icon className={`w-8 h-8 ${card.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Projects Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Projects</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Project Name</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">No of Checks</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Notification Email</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="border-b border-border/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-foreground">{project.name}</span>
                        {project.isActive && (
                          <Badge variant="secondary" className="text-xs">Active</Badge>
                        )}
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
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share className="w-4 h-4 mr-2" />
                            Shareable Link
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => deleteProject(project.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};