import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Trash2, ChevronRight, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { Tables } from '@/integrations/supabase/types';

type Project = Tables<'projects'>;
type Prompt = Tables<'prompts'>;
type LLMResult = Tables<'llm_results'>;

interface PromptWithMentions extends Prompt {
  hasBrandMention: boolean;
  hasDomainMention: boolean;
}

const LLM_MODELS = [
  { value: 'openai', label: 'OpenAI (ChatGPT)', color: 'bg-green-500' },
  { value: 'perplexity', label: 'Perplexity', color: 'bg-blue-500' },
  { value: 'gemini', label: 'Gemini', color: 'bg-purple-500' },
];

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [prompts, setPrompts] = useState<PromptWithMentions[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPromptContent, setNewPromptContent] = useState('');
  const [selectedModels, setSelectedModels] = useState<string[]>(['openai', 'perplexity', 'gemini']);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchProject();
      fetchPromptsWithMentions();
    }
  }, [id]);

  const fetchProject = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      toast({ title: 'Error', description: 'Project not found', variant: 'destructive' });
      navigate('/dashboard');
    } else {
      setProject(data);
    }
  };

  const fetchPromptsWithMentions = async () => {
    // Fetch prompts
    const { data: promptsData, error: promptsError } = await supabase
      .from('prompts')
      .select('*')
      .eq('project_id', id)
      .order('created_at', { ascending: false });

    if (promptsError) {
      toast({ title: 'Error', description: promptsError.message, variant: 'destructive' });
      setLoading(false);
      return;
    }

    // Fetch all LLM results for these prompts
    const promptIds = (promptsData || []).map(p => p.id);
    let resultsData: LLMResult[] = [];
    
    if (promptIds.length > 0) {
      const { data } = await supabase
        .from('llm_results')
        .select('*')
        .in('prompt_id', promptIds);
      resultsData = data || [];
    }

    // Calculate mention status for each prompt
    const promptsWithMentions: PromptWithMentions[] = (promptsData || []).map(prompt => {
      const promptResults = resultsData.filter(r => r.prompt_id === prompt.id);
      const hasBrandMention = promptResults.some(r => (r as any).brand_mentioned === true);
      const hasDomainMention = promptResults.some(r => (r as any).domain_mentioned === true);
      return { ...prompt, hasBrandMention, hasDomainMention };
    });

    setPrompts(promptsWithMentions);
    setLoading(false);
  };

  const toggleModel = (modelValue: string) => {
    setSelectedModels(prev => 
      prev.includes(modelValue)
        ? prev.filter(m => m !== modelValue)
        : [...prev, modelValue]
    );
  };

  // Parse lines from textarea - each non-empty line becomes a prompt
  const promptLines = newPromptContent
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  const createPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (promptLines.length === 0) return;
    if (selectedModels.length === 0) {
      toast({ title: 'Error', description: 'Please select at least one LLM', variant: 'destructive' });
      return;
    }

    setCreating(true);
    
    const createdPrompts: Prompt[] = [];
    
    // Create all prompts
    for (const line of promptLines) {
      const { data: newPrompt, error } = await supabase
        .from('prompts')
        .insert({
          content: line,
          project_id: id,
          selected_models: selectedModels,
        })
        .select()
        .single();

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
        continue;
      }
      createdPrompts.push(newPrompt);
    }

    if (createdPrompts.length === 0) {
      setCreating(false);
      return;
    }

    toast({ 
      title: 'Success', 
      description: `${createdPrompts.length} prompt${createdPrompts.length > 1 ? 's' : ''} created! Running LLMs...` 
    });
    
    // Run all selected models for all prompts in parallel
    try {
      const allCalls = createdPrompts.flatMap(prompt =>
        selectedModels.map(model =>
          supabase.functions.invoke('run-llm', {
            body: { 
              prompt: `For the search query "${prompt.content}"${project?.location ? ` in ${project.location}` : ''}, provide a list of 8-12 realistic business names that would appear in search results for this query along with their official website URLs. Include exact source links you used for verification. Return as JSON with this exact format:

{
  "businesses": [
    {
      "name": "Business Name 1",
      "website": "https://website1.com"
    }
  ],
  "sources": [
    "https://source1.com"
  ]
}`, 
              model: model,
              promptId: prompt.id,
              brandName: project?.name || '',
              domain: project?.domain || ''
            },
          })
        )
      );
      await Promise.all(allCalls);
      toast({ title: 'Complete', description: 'All LLM responses received!' });
    } catch (error: any) {
      toast({ title: 'Warning', description: 'Some LLMs may have failed', variant: 'destructive' });
    }

    setNewPromptContent('');
    setDialogOpen(false);
    setCreating(false);
    fetchPromptsWithMentions();
    
    // Navigate to prompt detail page only if single prompt created
    if (createdPrompts.length === 1) {
      navigate(`/projects/${id}/prompts/${createdPrompts[0].id}`);
    }
  };

  const deletePrompt = async (e: React.MouseEvent, promptId: string) => {
    e.stopPropagation();
    e.preventDefault();
    
    const { error } = await supabase.from('prompts').delete().eq('id', promptId);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Deleted', description: 'Prompt removed' });
      fetchPromptsWithMentions();
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex items-center gap-4 py-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold">{project?.name}</h1>
            {project?.domain && (
              <p className="text-sm text-muted-foreground">{project.domain}</p>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8">
        {/* Summary Stats - Compact Single Row */}
        {prompts.length > 0 && (() => {
          const brandCount = prompts.filter(p => p.hasBrandMention).length;
          const domainCount = prompts.filter(p => p.hasDomainMention).length;
          const brandPercent = Math.round((brandCount / prompts.length) * 100);
          const domainPercent = Math.round((domainCount / prompts.length) * 100);
          
          return (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">Total Prompts</p>
                  <p className="text-2xl font-bold">{prompts.length}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">Brand Mentions</p>
                  <p className="text-2xl font-bold">
                    {brandCount}/{prompts.length}
                    <span className="text-xs font-normal text-muted-foreground ml-1">({brandPercent}%)</span>
                  </p>
                  <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                    <div 
                      className="h-1.5 rounded-full" 
                      style={{ width: `${brandPercent}%`, backgroundColor: 'hsl(142, 76%, 36%)' }} 
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">Domain Mentions</p>
                  <p className="text-2xl font-bold">
                    {domainCount}/{prompts.length}
                    <span className="text-xs font-normal text-muted-foreground ml-1">({domainPercent}%)</span>
                  </p>
                  <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                    <div 
                      className="h-1.5 rounded-full" 
                      style={{ width: `${domainPercent}%`, backgroundColor: 'hsl(221, 83%, 53%)' }} 
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={80}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Brand', value: brandCount },
                          { name: 'Domain', value: domainCount },
                        ]}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={20}
                        outerRadius={35}
                        paddingAngle={2}
                      >
                        <Cell fill="hsl(142, 76%, 36%)" />
                        <Cell fill="hsl(221, 83%, 53%)" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          );
        })()}

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Prompts</h2>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Prompt
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Prompt</DialogTitle>
              </DialogHeader>
              <form onSubmit={createPrompt} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="content">Enter prompts</Label>
                  <p className="text-sm text-muted-foreground">
                    💡 Enter one prompt per line (press Enter after each one)
                  </p>
                  <Textarea
                    id="content"
                    value={newPromptContent}
                    onChange={(e) => setNewPromptContent(e.target.value)}
                    placeholder={`Best email marketing tool 2025
Which tool offers a bulk email campaign feature
Top CRM software for small business`}
                    rows={6}
                    required
                  />
                  {promptLines.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      📊 {promptLines.length} prompt{promptLines.length !== 1 ? 's' : ''} will be created
                    </p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <Label>Select LLM Models</Label>
                  <p className="text-sm text-muted-foreground">
                    Each prompt will be run against all selected models
                  </p>
                  <div className="flex flex-wrap items-center gap-4">
                    {LLM_MODELS.map((model) => (
                      <div
                        key={model.value}
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => toggleModel(model.value)}
                      >
                        <Checkbox
                          id={model.value}
                          checked={selectedModels.includes(model.value)}
                          onCheckedChange={() => toggleModel(model.value)}
                        />
                        <div className={`w-2.5 h-2.5 rounded-full ${model.color}`} />
                        <Label htmlFor={model.value} className="cursor-pointer font-normal text-sm">
                          {model.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={creating || selectedModels.length === 0 || promptLines.length === 0}
                >
                  {creating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating {promptLines.length} prompt{promptLines.length !== 1 ? 's' : ''}...
                    </>
                  ) : (
                    `Create ${promptLines.length || 0} Prompt${promptLines.length !== 1 ? 's' : ''} & Run on ${selectedModels.length} Model${selectedModels.length !== 1 ? 's' : ''}`
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {prompts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">No prompts yet. Create your first one!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {prompts.map((prompt) => {
              const promptModels = (prompt.selected_models as string[]) || [];
              
              return (
                <Link 
                  key={prompt.id} 
                  to={`/projects/${id}/prompts/${prompt.id}`}
                  className="block"
                >
                  <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                    <CardHeader className="flex flex-row items-start justify-between py-4">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-sm font-normal line-clamp-2">
                          {prompt.content}
                        </CardTitle>
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                          {promptModels.map((model) => {
                            const modelInfo = LLM_MODELS.find(m => m.value === model);
                            return (
                              <Badge key={model} variant="secondary" className="text-xs">
                                <div className={`w-2 h-2 rounded-full ${modelInfo?.color} mr-1`} />
                                {modelInfo?.label || model}
                              </Badge>
                            );
                          })}
                          <div className="flex items-center gap-1 ml-2">
                            {prompt.hasBrandMention ? (
                              <Badge variant="outline" className="text-xs border-green-500 text-green-600">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Brand
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs border-muted-foreground/30 text-muted-foreground">
                                <XCircle className="h-3 w-3 mr-1" />
                                Brand
                              </Badge>
                            )}
                            {prompt.hasDomainMention ? (
                              <Badge variant="outline" className="text-xs border-green-500 text-green-600">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Domain
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs border-muted-foreground/30 text-muted-foreground">
                                <XCircle className="h-3 w-3 mr-1" />
                                Domain
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => deletePrompt(e, prompt.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
