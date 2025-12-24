import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, FolderOpen, LogOut, Settings } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Project = Tables<'projects'>;

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDomain, setNewProjectDomain] = useState('');
  const [newProjectLocation, setNewProjectLocation] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editName, setEditName] = useState('');
  const [editDomain, setEditDomain] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setProjects(data || []);
    }
    setLoading(false);
  };

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    setCreating(true);
    const { error } = await supabase.from('projects').insert({
      name: newProjectName,
      domain: newProjectDomain || null,
      location: newProjectLocation || null,
      owner_id: user?.id,
    });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Project created!' });
      setNewProjectName('');
      setNewProjectDomain('');
      setNewProjectLocation('');
      setDialogOpen(false);
      fetchProjects();
    }
    setCreating(false);
  };

  const openEditDialog = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProject(project);
    setEditName(project.name);
    setEditDomain(project.domain || '');
    setEditLocation(project.location || '');
    setEditDialogOpen(true);
  };

  const updateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editName.trim()) return;

    setUpdating(true);
    const { error } = await supabase
      .from('projects')
      .update({
        name: editName,
        domain: editDomain || null,
        location: editLocation || null,
      })
      .eq('id', editingProject.id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Project updated!' });
      setEditDialogOpen(false);
      setEditingProject(null);
      fetchProjects();
    }
    setUpdating(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between py-4">
          <h1 className="text-xl font-bold">LLM Prompt Tracker</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Your Projects</h2>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
              </DialogHeader>
              <form onSubmit={createProject} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Project Name</Label>
                  <Input
                    id="name"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="My AI Project"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="domain">Domain (optional)</Label>
                  <Input
                    id="domain"
                    value={newProjectDomain}
                    onChange={(e) => setNewProjectDomain(e.target.value)}
                    placeholder="example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location (optional)</Label>
                  <Input
                    id="location"
                    value={newProjectLocation}
                    onChange={(e) => setNewProjectLocation(e.target.value)}
                    placeholder="United States"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={creating}>
                  {creating ? 'Creating...' : 'Create Project'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : projects.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No projects yet. Create your first one!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card 
                key={project.id} 
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{project.name}</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={(e) => openEditDialog(project, e)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                  {project.domain && (
                    <CardDescription>{project.domain}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Created {new Date(project.created_at || '').toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Edit Project Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <form onSubmit={updateProject} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Project Name</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="My AI Project"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-domain">Domain (optional)</Label>
              <Input
                id="edit-domain"
                value={editDomain}
                onChange={(e) => setEditDomain(e.target.value)}
                placeholder="example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-location">Location (optional)</Label>
              <Input
                id="edit-location"
                value={editLocation}
                onChange={(e) => setEditLocation(e.target.value)}
                placeholder="United States"
              />
            </div>
            <Button type="submit" className="w-full" disabled={updating}>
              {updating ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
