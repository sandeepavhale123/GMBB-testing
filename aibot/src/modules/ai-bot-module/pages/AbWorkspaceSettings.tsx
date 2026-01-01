import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useAbWorkspaceContext } from '../context/AbWorkspaceContext';
import { useAbWorkspaces } from '../hooks/useAbWorkspaces';
import { canEditWorkspace, canDeleteWorkspace } from '../types/workspace';

const AbWorkspaceSettings: React.FC = () => {
  const navigate = useNavigate();
  const { currentWorkspace, currentRole, workspaces } = useAbWorkspaceContext();
  const { updateWorkspace, deleteWorkspace } = useAbWorkspaces();

  const [name, setName] = useState(currentWorkspace?.name || '');

  const canEdit = currentRole ? canEditWorkspace(currentRole) : false;
  const canDelete = currentRole ? canDeleteWorkspace(currentRole) : false;
  const hasMultipleWorkspaces = workspaces.length > 1;

  const handleSave = async () => {
    if (!currentWorkspace || !name.trim()) return;
    await updateWorkspace.mutateAsync({ id: currentWorkspace.id, name: name.trim() });
  };

  const handleDelete = async () => {
    if (!currentWorkspace) return;
    await deleteWorkspace.mutateAsync(currentWorkspace.id);
    navigate('/module/ai-bot/dashboard');
  };

  React.useEffect(() => {
    setName(currentWorkspace?.name || '');
  }, [currentWorkspace]);

  if (!currentWorkspace) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No workspace selected</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/module/ai-bot/dashboard')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Workspace Settings</h1>
            <p className="text-muted-foreground">Manage your workspace configuration</p>
          </div>
        </div>

        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>General</CardTitle>
            <CardDescription>Basic workspace information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="workspace-name">Workspace Name</Label>
              <Input
                id="workspace-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!canEdit}
              />
            </div>
            <div className="grid gap-2">
              <Label>Workspace ID</Label>
              <Input value={currentWorkspace.id} disabled className="font-mono text-sm" />
            </div>
            {canEdit && (
              <Button
                onClick={handleSave}
                disabled={updateWorkspace.isPending || name === currentWorkspace.name}
              >
                <Save className="h-4 w-4 mr-2" />
                {updateWorkspace.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Danger Zone */}
        {canDelete && hasMultipleWorkspaces && (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible actions that affect your workspace
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Workspace
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Workspace?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. All bots and data associated with this
                      workspace will be permanently deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AbWorkspaceSettings;
