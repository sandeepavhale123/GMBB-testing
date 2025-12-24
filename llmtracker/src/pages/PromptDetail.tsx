import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, RefreshCw, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Prompt = Tables<'prompts'>;
type LLMResult = Tables<'llm_results'> & {
  brand_mentioned?: boolean;
  domain_mentioned?: boolean;
};
type Project = Tables<'projects'>;

const LLM_MODELS = [
  { value: 'openai', label: 'OpenAI GPT-4o-mini', color: 'bg-green-500' },
  { value: 'perplexity', label: 'Perplexity Sonar', color: 'bg-blue-500' },
  { value: 'gemini', label: 'Google Gemini Flash', color: 'bg-purple-500' },
];

export default function PromptDetailPage() {
  const { projectId, promptId } = useParams<{ projectId: string; promptId: string }>();
  const { user } = useAuth();
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [results, setResults] = useState<LLMResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningModels, setRunningModels] = useState<Set<string>>(new Set());
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (promptId && projectId) {
      fetchData();
    }
  }, [promptId, projectId]);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch project
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (projectError) {
      toast({ title: 'Error', description: 'Project not found', variant: 'destructive' });
      navigate('/dashboard');
      return;
    }
    setProject(projectData);

    // Fetch prompt
    const { data: promptData, error: promptError } = await supabase
      .from('prompts')
      .select('*')
      .eq('id', promptId)
      .single();

    if (promptError) {
      toast({ title: 'Error', description: 'Prompt not found', variant: 'destructive' });
      navigate(`/projects/${projectId}`);
      return;
    }
    setPrompt(promptData);

    // Fetch results
    await fetchResults();
    setLoading(false);
  };

  const fetchResults = async () => {
    const { data } = await supabase
      .from('llm_results')
      .select('*')
      .eq('prompt_id', promptId)
      .order('created_at', { ascending: false });

    if (data) {
      setResults(data);
    }
  };

  const runModel = async (model: string) => {
    if (!prompt || !project) return;
    
    setRunningModels(prev => new Set(prev).add(model));
    
    try {
      const response = await supabase.functions.invoke('run-llm', {
        body: { 
          prompt: `For the search query "${prompt.content}"${project.location ? ` in ${project.location}` : ''}, provide a list of 8-12 realistic business names that would appear in search results for this query along with their official website URLs. Include exact source links you used for verification. Return as JSON with this exact format:

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
          brandName: project.name || '',
          domain: project.domain || ''
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      toast({ title: 'Success', description: `Got response from ${model}` });
      await fetchResults();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
    
    setRunningModels(prev => {
      const next = new Set(prev);
      next.delete(model);
      return next;
    });
  };

  const runAllModels = async () => {
    if (!prompt) return;
    
    const selectedModels = (prompt.selected_models as string[]) || [];
    if (selectedModels.length === 0) {
      toast({ title: 'No models selected', description: 'Please select at least one model', variant: 'destructive' });
      return;
    }

    // Run all models in parallel
    await Promise.all(selectedModels.map(model => runModel(model)));
  };

  const getLatestResultForModel = (model: string): LLMResult | undefined => {
    return results.find(r => r.model_name === model);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const selectedModels = (prompt?.selected_models as string[]) || [];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex items-center gap-4 py-4">
          <Link to={`/projects/${projectId}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Project
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{project?.name}</h1>
            <p className="text-sm text-muted-foreground">Prompt Details</p>
          </div>
          <Button 
            onClick={runAllModels} 
            disabled={runningModels.size > 0 || selectedModels.length === 0}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${runningModels.size > 0 ? 'animate-spin' : ''}`} />
            {runningModels.size > 0 ? 'Running...' : 'Run All Models'}
          </Button>
        </div>
      </header>

      <main className="container mx-auto py-8">
        {/* Prompt Content */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg">Prompt</CardTitle>
              <div className="flex gap-2">
                {selectedModels.map((model) => {
                  const modelInfo = LLM_MODELS.find(m => m.value === model);
                  return (
                    <Badge key={model} variant="secondary" className="text-xs">
                      {modelInfo?.label || model}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm">{prompt?.content}</p>
          </CardContent>
        </Card>

        {/* Results Grid */}
        <h2 className="text-xl font-semibold mb-4">Results</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LLM_MODELS.filter(model => selectedModels.includes(model.value)).map((model) => {
            const result = getLatestResultForModel(model.value);
            const isRunning = runningModels.has(model.value);

            return (
              <Card key={model.value} className="flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${model.color}`} />
                      <CardTitle className="text-sm font-medium">{model.label}</CardTitle>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => runModel(model.value)}
                      disabled={isRunning}
                    >
                      {isRunning ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {result && (
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-muted-foreground">
                        {new Date(result.created_at || '').toLocaleString()}
                      </p>
                      <div className="flex items-center gap-1">
                        {result.brand_mentioned ? (
                          <Badge variant="outline" className="text-xs border-green-500 text-green-600 py-0">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Brand
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs border-muted-foreground/30 text-muted-foreground py-0">
                            <XCircle className="h-3 w-3 mr-1" />
                            Brand
                          </Badge>
                        )}
                        {result.domain_mentioned ? (
                          <Badge variant="outline" className="text-xs border-green-500 text-green-600 py-0">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Domain
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs border-muted-foreground/30 text-muted-foreground py-0">
                            <XCircle className="h-3 w-3 mr-1" />
                            Domain
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="flex-1">
                  {isRunning ? (
                    <div className="flex items-center justify-center h-32">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : result ? (
                    <div className="space-y-3">
                      <p className="text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
                        {result.response_text}
                      </p>
                      {result.citations && Array.isArray(result.citations) && result.citations.length > 0 && (
                        <div className="pt-2 border-t">
                          <span className="text-xs font-medium">Citations:</span>
                          <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                            {(result.citations as string[]).map((cite, i) => (
                              <li key={i}>
                                <a 
                                  href={cite} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="hover:underline text-primary"
                                >
                                  {cite}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                      No results yet. Click run to generate.
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {selectedModels.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">No models selected for this prompt.</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
