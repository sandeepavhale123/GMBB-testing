import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Plus, Edit2, Trash2, FileText } from 'lucide-react';
import { useUserTemplates } from '../hooks/useUserTemplates';
import { SystemTemplate, SYSTEM_TEMPLATES, DEFAULT_USER_MESSAGE_TEMPLATE } from '../types';

const TemplateSettings: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { templates, loading, createTemplate, updateTemplate, deleteTemplate } = useUserTemplates(projectId);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<SystemTemplate | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    systemMessage: '',
    userMessageTemplate: DEFAULT_USER_MESSAGE_TEMPLATE,
  });

  const builtInTemplates = SYSTEM_TEMPLATES.filter((t) => t.id !== 'custom');
  const userTemplates = templates.filter((t) => !t.isBuiltIn);

  const handleCreate = async () => {
    if (!projectId || !formData.name.trim() || !formData.systemMessage.trim()) return;

    await createTemplate(projectId, {
      name: formData.name,
      description: formData.description,
      systemMessage: formData.systemMessage,
      userMessageTemplate: formData.userMessageTemplate,
    });

    setIsCreateDialogOpen(false);
    resetForm();
  };

  const handleEdit = async () => {
    if (!selectedTemplate || !formData.name.trim() || !formData.systemMessage.trim()) return;

    await updateTemplate(selectedTemplate.id, {
      name: formData.name,
      description: formData.description,
      systemMessage: formData.systemMessage,
      userMessageTemplate: formData.userMessageTemplate,
    });

    setIsEditDialogOpen(false);
    setSelectedTemplate(null);
    resetForm();
  };

  const handleDelete = async () => {
    if (!selectedTemplate) return;

    await deleteTemplate(selectedTemplate.id);
    setIsDeleteDialogOpen(false);
    setSelectedTemplate(null);
  };

  const openEditDialog = (template: SystemTemplate) => {
    setSelectedTemplate(template);
    setFormData({
      name: template.name,
      description: template.description,
      systemMessage: template.systemMessage,
      userMessageTemplate: template.userMessageTemplate,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (template: SystemTemplate) => {
    setSelectedTemplate(template);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      systemMessage: '',
      userMessageTemplate: DEFAULT_USER_MESSAGE_TEMPLATE,
    });
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Template Settings</h1>
          <p className="text-muted-foreground">Manage your system message templates</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* User Templates Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Your Templates</h2>
            <Button onClick={() => setIsCreateDialogOpen(true)} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading templates...</div>
          ) : userTemplates.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="w-12 h-12 text-muted-foreground/50 mb-4" />
                <h3 className="font-medium mb-2">No Custom Templates Yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create your own templates to reuse across multiple bots.
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Template
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {userTemplates.map((template) => (
                <Card key={template.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        <CardDescription>{template.description || 'No description'}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(template)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(template)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs font-mono bg-muted p-3 rounded-md max-h-24 overflow-hidden">
                      {template.systemMessage.substring(0, 200)}
                      {template.systemMessage.length > 200 && '...'}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        <Separator />

        {/* Built-in Templates Section (Read-only) */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Built-in Templates</h2>
            <p className="text-sm text-muted-foreground">Pre-configured templates for common use cases</p>
          </div>

          <div className="grid gap-4">
            {builtInTemplates.map((template) => (
              <Card key={template.id} className="bg-muted/30">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        {template.name}
                        <Badge variant="secondary">Built-in</Badge>
                      </CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-xs font-mono bg-background p-3 rounded-md max-h-24 overflow-hidden">
                    {template.systemMessage.substring(0, 200)}
                    {template.systemMessage.length > 200 && '...'}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog
        open={isCreateDialogOpen || isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateDialogOpen(false);
            setIsEditDialogOpen(false);
            setSelectedTemplate(null);
            resetForm();
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditDialogOpen ? 'Edit Template' : 'Create New Template'}</DialogTitle>
            <DialogDescription>
              {isEditDialogOpen
                ? 'Update your template settings.'
                : 'Create a reusable template for your bots.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., My Sales Bot"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Brief description..."
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="systemMessage">System Message *</Label>
              <Textarea
                id="systemMessage"
                placeholder="Define how your bot should behave..."
                value={formData.systemMessage}
                onChange={(e) => setFormData((prev) => ({ ...prev, systemMessage: e.target.value }))}
                rows={8}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                {formData.systemMessage.length} characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="userMessageTemplate">User Message Template</Label>
              <Textarea
                id="userMessageTemplate"
                placeholder="Context:\n{context}\n\nUser Question:\n{question}"
                value={formData.userMessageTemplate}
                onChange={(e) => setFormData((prev) => ({ ...prev, userMessageTemplate: e.target.value }))}
                rows={5}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Use <code className="bg-muted px-1 rounded">{'{context}'}</code> for knowledge base and{' '}
                <code className="bg-muted px-1 rounded">{'{question}'}</code> for user's question.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false);
                setIsEditDialogOpen(false);
                setSelectedTemplate(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={isEditDialogOpen ? handleEdit : handleCreate}
              disabled={!formData.name.trim() || !formData.systemMessage.trim()}
            >
              {isEditDialogOpen ? 'Save Changes' : 'Create Template'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedTemplate?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TemplateSettings;
