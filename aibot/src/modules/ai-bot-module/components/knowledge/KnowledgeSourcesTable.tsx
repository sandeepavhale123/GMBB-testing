import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Trash2, FileText, Globe, HelpCircle, Building2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface KnowledgeSource {
  id: string;
  bot_id: string;
  source_type: string;
  title: string;
  content: string | null;
  url: string | null;
  file_url: string | null;
  file_name: string | null;
  char_count: number;
  status: string;
  error_message: string | null;
  created_at: string;
}

interface KnowledgeSourcesTableProps {
  botId: string;
}

export const KnowledgeSourcesTable: React.FC<KnowledgeSourcesTableProps> = ({ botId }) => {
  const [sources, setSources] = useState<KnowledgeSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  const fetchSources = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    const { data, error } = await supabase
      .from('ab_knowledge_sources')
      .select('*')
      .eq('bot_id', botId)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load knowledge sources');
      console.error(error);
    } else {
      setSources(data || []);
    }
    setLoading(false);
  }, [botId]);

  // Initial fetch with loading skeleton
  useEffect(() => {
    fetchSources(true);
  }, [fetchSources]);

  // Auto-refresh when sources are pending or processing (NO loading flash)
  useEffect(() => {
    const hasPendingSources = sources.some(
      s => s.status === 'pending' || s.status === 'processing'
    );
    
    if (hasPendingSources) {
      const interval = setInterval(() => fetchSources(false), 3000);
      return () => clearInterval(interval);
    }
  }, [sources, fetchSources]);

  const handleReprocess = async (source: KnowledgeSource) => {
    setProcessingIds(prev => new Set(prev).add(source.id));
    
    try {
      // Update status to pending
      await supabase
        .from('ab_knowledge_sources')
        .update({ status: 'pending', error_message: null })
        .eq('id', source.id);

      // Get content for processing
      let content = source.content;
      
      // If it's a file, download and get content
      if (source.source_type === 'file' && source.file_url) {
        const { data: fileData, error: downloadError } = await supabase
          .storage
          .from('knowledge-files')
          .download(source.file_url);
        
        if (downloadError) {
          throw new Error('Failed to download file');
        }
        content = await fileData.text();
      }

      if (!content) {
        throw new Error('No content available to process');
      }

      // Call the process function
      const { error: processError } = await supabase.functions.invoke('ai-bot-process-knowledge', {
        body: {
          knowledge_source_id: source.id,
          bot_id: botId,
          source_type: source.source_type,
          content,
        },
      });

      if (processError) {
        throw processError;
      }

      toast.success('Processing started');
      
      // Poll for completion
      const pollStatus = async () => {
        const { data: updatedSource } = await supabase
          .from('ab_knowledge_sources')
          .select('status, error_message')
          .eq('id', source.id)
          .single();

        if (updatedSource?.status === 'completed') {
          toast.success(`${source.title} processed successfully`);
          setProcessingIds(prev => {
            const next = new Set(prev);
            next.delete(source.id);
            return next;
          });
          fetchSources();
        } else if (updatedSource?.status === 'failed') {
          toast.error(`Failed: ${updatedSource.error_message || 'Unknown error'}`);
          setProcessingIds(prev => {
            const next = new Set(prev);
            next.delete(source.id);
            return next;
          });
          fetchSources();
        } else {
          // Still processing, poll again
          setTimeout(pollStatus, 2000);
        }
      };

      setTimeout(pollStatus, 2000);
    } catch (error) {
      console.error('Reprocess error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to reprocess');
      setProcessingIds(prev => {
        const next = new Set(prev);
        next.delete(source.id);
        return next;
      });
      fetchSources();
    }
  };

  const handleDelete = async (source: KnowledgeSource) => {
    try {
      // 1. Delete all embeddings for this source
      const { error: embeddingsError } = await supabase
        .from('ab_knowledge_embeddings')
        .delete()
        .eq('knowledge_source_id', source.id);

      if (embeddingsError) {
        console.error('Failed to delete embeddings:', embeddingsError);
      }

      // 2. Delete file from storage if exists
      if (source.file_url) {
        const { error: storageError } = await supabase.storage
          .from('knowledge-files')
          .remove([source.file_url]);

        if (storageError) {
          console.error('Failed to delete storage file:', storageError);
        }
      }

      // 3. Delete the source record
      const { error } = await supabase
        .from('ab_knowledge_sources')
        .delete()
        .eq('id', source.id);

      if (error) {
        toast.error('Failed to delete source');
      } else {
        toast.success('Source and embeddings deleted');
        fetchSources();
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete source');
    }
  };

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'file':
        return <FileText className="h-4 w-4" />;
      case 'website':
        return <Globe className="h-4 w-4" />;
      case 'qa':
        return <HelpCircle className="h-4 w-4" />;
      case 'company_info':
        return <Building2 className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-500">Completed</Badge>;
      case 'pending':
        return (
          <Badge variant="secondary" className="flex items-center gap-1 w-fit">
            <Loader2 className="h-3 w-3 animate-spin" />
            Pending
          </Badge>
        );
      case 'processing':
        return (
          <Badge variant="outline" className="flex items-center gap-1 w-fit">
            <Loader2 className="h-3 w-3 animate-spin" />
            Processing
          </Badge>
        );
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (sources.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No knowledge sources added yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={() => fetchSources(true)}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Characters</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sources.map((source) => (
            <TableRow key={source.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getSourceIcon(source.source_type)}
                  <span className="capitalize">{source.source_type.replace('_', ' ')}</span>
                </div>
              </TableCell>
              <TableCell className="max-w-[200px] truncate" title={source.title}>
                {source.title}
              </TableCell>
              <TableCell>{source.char_count.toLocaleString()}</TableCell>
              <TableCell>
                <div className="space-y-1">
                  {getStatusBadge(source.status)}
                  {source.error_message && (
                    <p className="text-xs text-destructive">{source.error_message}</p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {new Date(source.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  {(source.status === 'pending' || source.status === 'failed') && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReprocess(source)}
                      disabled={processingIds.has(source.id)}
                    >
                      <RefreshCw className={`h-4 w-4 ${processingIds.has(source.id) ? 'animate-spin' : ''}`} />
                    </Button>
                  )}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Knowledge Source</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{source.title}"? This will also remove all associated embeddings and cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(source)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
