import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Save, FileText, Plus } from 'lucide-react';
import { SystemTemplate, SYSTEM_TEMPLATES, DEFAULT_USER_MESSAGE_TEMPLATE } from '../../types';
import { useUserTemplates } from '../../hooks/useUserTemplates';
import { cn } from '@/lib/utils';

interface TemplateSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (template: SystemTemplate) => void;
  projectId?: string;
}

export const TemplateSelectionDialog: React.FC<TemplateSelectionDialogProps> = ({
  open,
  onOpenChange,
  onSelectTemplate,
  projectId,
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'select' | 'create'>('select');
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    systemMessage: '',
    userMessageTemplate: DEFAULT_USER_MESSAGE_TEMPLATE,
  });
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);

  const { templates, loading, createTemplate } = useUserTemplates(projectId);

  const builtInTemplates = templates.filter((t) => t.isBuiltIn && t.id !== 'custom');
  const userTemplates = templates.filter((t) => !t.isBuiltIn);

  const handleSelectExisting = () => {
    const template = templates.find((t) => t.id === selectedTemplateId);
    if (template) {
      onSelectTemplate(template);
      onOpenChange(false);
      resetState();
    }
  };

  const handleCreateNew = async () => {
    if (!newTemplate.name.trim() || !newTemplate.systemMessage.trim()) return;

    const template: SystemTemplate = {
      id: `temp-${Date.now()}`,
      name: newTemplate.name,
      systemMessage: newTemplate.systemMessage,
      userMessageTemplate: newTemplate.userMessageTemplate,
      description: newTemplate.description,
      isBuiltIn: false,
    };

    // Save to database if requested
    if (saveAsTemplate && projectId) {
      const saved = await createTemplate(projectId, template);
      if (saved) {
        onSelectTemplate(saved);
      } else {
        onSelectTemplate(template);
      }
    } else {
      onSelectTemplate(template);
    }

    onOpenChange(false);
    resetState();
  };

  const resetState = () => {
    setSelectedTemplateId(null);
    setActiveTab('select');
    setNewTemplate({
      name: '',
      description: '',
      systemMessage: '',
      userMessageTemplate: DEFAULT_USER_MESSAGE_TEMPLATE,
    });
    setSaveAsTemplate(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Select or Create Template</DialogTitle>
          <DialogDescription>
            Choose from pre-built templates, your saved templates, or create a new one.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'select' | 'create')} className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="select" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Select Template
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create New
            </TabsTrigger>
          </TabsList>

          <TabsContent value="select" className="flex-1 min-h-0 mt-4">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {/* Built-in Templates */}
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">Built-in Templates</h4>
                  <RadioGroup value={selectedTemplateId || ''} onValueChange={setSelectedTemplateId}>
                    <div className="space-y-2">
                      {builtInTemplates.map((template) => (
                        <Card
                          key={template.id}
                          className={cn(
                            'cursor-pointer transition-all hover:border-primary/50',
                            selectedTemplateId === template.id && 'border-primary ring-2 ring-primary/20'
                          )}
                          onClick={() => setSelectedTemplateId(template.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <RadioGroupItem value={template.id} id={template.id} />
                              <div className="flex-1">
                                <Label htmlFor={template.id} className="font-medium cursor-pointer">
                                  {template.name}
                                </Label>
                                <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                              </div>
                              <Badge variant="secondary">Built-in</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                {/* User Templates */}
                {userTemplates.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">Your Saved Templates</h4>
                    <RadioGroup value={selectedTemplateId || ''} onValueChange={setSelectedTemplateId}>
                      <div className="space-y-2">
                        {userTemplates.map((template) => (
                          <Card
                            key={template.id}
                            className={cn(
                              'cursor-pointer transition-all hover:border-primary/50',
                              selectedTemplateId === template.id && 'border-primary ring-2 ring-primary/20'
                            )}
                            onClick={() => setSelectedTemplateId(template.id)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <RadioGroupItem value={template.id} id={template.id} />
                                <div className="flex-1">
                                  <Label htmlFor={template.id} className="font-medium cursor-pointer">
                                    {template.name}
                                  </Label>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {template.description || 'Custom template'}
                                  </p>
                                </div>
                                <Badge variant="outline">Saved</Badge>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {loading && (
                  <div className="text-center py-4 text-muted-foreground">Loading templates...</div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="create" className="flex-1 min-h-0 mt-4">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="template-name">Template Name *</Label>
                    <Input
                      id="template-name"
                      placeholder="e.g., My Sales Bot"
                      value={newTemplate.name}
                      onChange={(e) => setNewTemplate((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template-description">Description</Label>
                    <Input
                      id="template-description"
                      placeholder="Brief description..."
                      value={newTemplate.description}
                      onChange={(e) => setNewTemplate((prev) => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="system-message">System Message *</Label>
                  <Textarea
                    id="system-message"
                    placeholder="Define how your bot should behave... (e.g., You are a helpful assistant...)"
                    value={newTemplate.systemMessage}
                    onChange={(e) => setNewTemplate((prev) => ({ ...prev, systemMessage: e.target.value }))}
                    rows={8}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    This is the main instruction that defines your bot's personality and behavior.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="user-message-template">User Message Template</Label>
                  <Textarea
                    id="user-message-template"
                    placeholder="Context:\n{context}\n\nUser Question:\n{question}"
                    value={newTemplate.userMessageTemplate}
                    onChange={(e) => setNewTemplate((prev) => ({ ...prev, userMessageTemplate: e.target.value }))}
                    rows={5}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use <code className="bg-muted px-1 rounded">{'{context}'}</code> for knowledge base content and{' '}
                    <code className="bg-muted px-1 rounded">{'{question}'}</code> for user's question.
                  </p>
                </div>

                {projectId && (
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <input
                      type="checkbox"
                      id="save-template"
                      checked={saveAsTemplate}
                      onChange={(e) => setSaveAsTemplate(e.target.checked)}
                      className="rounded border-input"
                    />
                    <Label htmlFor="save-template" className="flex items-center gap-2 cursor-pointer">
                      <Save className="w-4 h-4" />
                      Save as reusable template for future bots
                    </Label>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {activeTab === 'select' ? (
            <Button onClick={handleSelectExisting} disabled={!selectedTemplateId}>
              Use Selected Template
            </Button>
          ) : (
            <Button
              onClick={handleCreateNew}
              disabled={!newTemplate.name.trim() || !newTemplate.systemMessage.trim()}
            >
              {saveAsTemplate ? 'Save & Use Template' : 'Use Template'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
