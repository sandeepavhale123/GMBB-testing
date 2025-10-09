import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Save, ArrowLeft, AlertTriangle, Trash2, Globe, Shield } from 'lucide-react';
import { Project } from '../types/Project';

// Mock project data
const mockProject: Project & {
  description?: string;
  auditFrequency: string;
  autoFix: boolean;
  notifications: boolean;
} = {
  id: '1',
  subdomain_id: '1',
  user_id: '1',
  name: 'E-commerce Website',
  website: 'https://example-store.com',
  address: '123 Main St, City, State 12345',
  phone: '+1 (555) 123-4567',
  status: 'active',
  issues_found: '12',
  issues_fixed: '8',
  created_date: '2024-01-15',
  last_updated: '2024-01-20',
  description: 'Main e-commerce website for our online store with product catalog and checkout functionality.',
  auditFrequency: 'weekly',
  autoFix: true,
  notifications: true
};

export const ProjectSettings: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = React.useState(mockProject);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  const handleSave = () => {
    console.log('Saving project settings:', project);
    // Mock save success
    alert('Project settings saved successfully!');
  };

  const handleDelete = () => {
    if (showDeleteConfirm) {
      console.log('Deleting project:', projectId);
      // Mock delete
      navigate('/module/live-seo-fixer/dashboard');
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 5000);
    }
  };

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => navigate(`/module/live-seo-fixer/projects/${projectId}`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Project
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">Project Settings</h1>
            <Badge className={`${getStatusColor(project.status)} capitalize`}>
              {project.status}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">{project.name}</p>
        </div>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Basic Information
          </CardTitle>
          <CardDescription>
            Update the basic details of your project.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                value={project.name}
                onChange={(e) => setProject(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website URL</Label>
              <Input
                id="website"
                value={project.website}
                onChange={(e) => setProject(prev => ({ ...prev, website: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="address">Address (Optional)</Label>
              <Input
                id="address"
                value={project.address || ''}
                onChange={(e) => setProject(prev => ({ ...prev, address: e.target.value }))}
                placeholder="123 Main St, City, State 12345"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (Optional)</Label>
              <Input
                id="phone"
                value={project.phone || ''}
                onChange={(e) => setProject(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={project.description || ''}
              onChange={(e) => setProject(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of your website..."
              className="min-h-20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Project Status</Label>
            <Select
              value={project.status}
              onValueChange={(value: Project['status']) =>
                setProject(prev => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Automation Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Automation Settings
          </CardTitle>
          <CardDescription>
            Configure how the system handles audits and fixes automatically.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Audit Frequency</Label>
            <Select
              value={project.auditFrequency}
              onValueChange={(value) =>
                setProject(prev => ({ ...prev, auditFrequency: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="manual">Manual Only</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              How often to automatically run SEO audits on your pages
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-Apply Fixes</Label>
              <p className="text-sm text-muted-foreground">
                Automatically apply approved fixes without manual review
              </p>
            </div>
            <Switch
              checked={project.autoFix}
              onCheckedChange={(checked) =>
                setProject(prev => ({ ...prev, autoFix: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive email updates about audit results and fixes
              </p>
            </div>
            <Switch
              checked={project.notifications}
              onCheckedChange={(checked) =>
                setProject(prev => ({ ...prev, notifications: checked }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible and destructive actions for this project.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
            <div>
              <h4 className="font-medium text-red-900">Delete Project</h4>
              <p className="text-sm text-red-700">
                Once you delete a project, there is no going back. All data, audits, and fixes will be permanently removed.
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="ml-4"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {showDeleteConfirm ? 'Confirm Delete' : 'Delete Project'}
            </Button>
          </div>
          {showDeleteConfirm && (
            <p className="text-sm text-red-600 mt-2 font-medium">
              Click "Confirm Delete" again within 5 seconds to permanently delete this project.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="min-w-32">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
};