import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Bot, Settings, FileText, Users, Calendar, Code, Trash2, ExternalLink, Globe, Lock, Palette, Webhook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
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
import { EmbedSettings, DEFAULT_EMBED_SETTINGS } from '../types';
import { EmbedCodeGenerator } from '../components/settings/EmbedCodeGenerator';
import { LeadFormSettings } from '../components/settings/LeadFormSettings';
import { CalendarSettings } from '../components/settings/CalendarSettings';
import { RetrievalSettings } from '../components/settings/RetrievalSettings';
import { AppearanceSettings } from '../components/settings/AppearanceSettings';
import { LeadsTable } from '../components/leads/LeadsTable';
import { AppointmentsTable } from '../components/appointments/AppointmentsTable';
import { BotChatPreview } from '../components/preview/BotChatPreview';
import { KnowledgeSourcesTable } from '../components/knowledge/KnowledgeSourcesTable';
import { ChatAnalytics } from '../components/analytics/ChatAnalytics';
import { WebhookSettings } from '../components/webhooks/WebhookSettings';
import { toast } from 'sonner';

interface BotData {
  id: string;
  name: string;
  status: string;
  is_active: boolean;
  is_public: boolean;
  embed_settings: EmbedSettings;
  created_at: string;
  project_id: string;
  similarity_threshold: number;
  retrieval_count: number;
}

const BotDetail: React.FC = () => {
  const { botId } = useParams<{ botId: string }>();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPublic, setIsPublic] = useState<boolean>(true);

  const handleVisibilityToggle = async (checked: boolean) => {
    const { error } = await supabase
      .from('ab_bots')
      .update({ is_public: checked })
      .eq('id', botId);
    
    if (!error) {
      setIsPublic(checked);
      toast.success(checked ? 'Bot is now public' : 'Bot is now private');
    } else {
      toast.error('Failed to update visibility');
    }
  };

  // Delete bot with all related data
  const handleDeleteBot = async () => {
    if (!botId) return;
    
    setIsDeleting(true);
    try {
      // Delete in order to respect foreign keys
      // 1. Delete embeddings
      await supabase.from('ab_knowledge_embeddings').delete().eq('bot_id', botId);
      
      // 2. Delete knowledge sources
      await supabase.from('ab_knowledge_sources').delete().eq('bot_id', botId);
      
      // 3. Delete company info
      await supabase.from('ab_company_info').delete().eq('bot_id', botId);
      
      // 4. Delete leads
      await supabase.from('ab_bot_leads').delete().eq('bot_id', botId);
      
      // 5. Delete appointments
      await supabase.from('ab_bot_appointments').delete().eq('bot_id', botId);
      
      // 6. Delete calendar settings
      await supabase.from('ab_bot_calendar_settings').delete().eq('bot_id', botId);
      
      // 7. Delete lead settings
      await supabase.from('ab_bot_lead_settings').delete().eq('bot_id', botId);
      
      // 8. Delete API keys
      await supabase.from('ab_bot_api_keys').delete().eq('bot_id', botId);
      
      // 9. Delete usage records
      await supabase.from('ab_usage').delete().eq('bot_id', botId);
      
      // 10. Delete usage limits
      await supabase.from('ab_usage_limits').delete().eq('bot_id', botId);
      
      // 11. Delete chat logs
      await supabase.from('ab_chat_logs').delete().eq('bot_id', botId);
      
      // 12. Delete files from storage bucket
      const { data: files } = await supabase.storage.from('knowledge-files').list(botId);
      if (files && files.length > 0) {
        const filePaths = files.map(f => `${botId}/${f.name}`);
        await supabase.storage.from('knowledge-files').remove(filePaths);
      }
      
      // 13. Finally delete the bot
      const { error } = await supabase.from('ab_bots').delete().eq('id', botId);
      if (error) throw error;
      
      toast.success('Bot deleted successfully');
      navigate('/module/ai-bot/dashboard');
    } catch (err) {
      console.error('Failed to delete bot:', err);
      toast.error('Failed to delete bot');
    } finally {
      setIsDeleting(false);
    }
  };

  // Fetch bot data
  const { data: bot, isLoading: isBotLoading } = useQuery({
    queryKey: ['bot-detail', botId],
    queryFn: async () => {
      if (!botId) throw new Error('Bot ID required');
      const { data, error } = await supabase
        .from('ab_bots')
        .select('*')
        .eq('id', botId)
        .single();
      
      if (error) throw error;

      const embedSettings = data.embed_settings as unknown as EmbedSettings;
      return {
        ...data,
        embed_settings: embedSettings || DEFAULT_EMBED_SETTINGS,
      } as BotData;
    },
    enabled: !!botId,
  });

  // Sync visibility state when bot data loads
  React.useEffect(() => {
    if (bot) setIsPublic(bot.is_public);
  }, [bot]);

  if (!botId) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Bot ID not found</p>
      </div>
    );
  }

  if (isBotLoading) {
    return (
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!bot) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <p className="text-muted-foreground">Bot not found</p>
        <Button onClick={() => navigate('/module/ai-bot/dashboard')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const embedUrl = `${window.location.origin}/embed/ai-bot/${botId}`;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/module/ai-bot/dashboard')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{bot.name}</h1>
              <Badge variant={bot.status === 'published' ? 'default' : 'secondary'}>
                {bot.status}
              </Badge>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Switch 
                  checked={isPublic} 
                  onCheckedChange={handleVisibilityToggle}
                  className="scale-75"
                />
                {isPublic ? <Globe className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                <span>{isPublic ? 'Public' : 'Private'}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Created {new Date(bot.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => window.open(embedUrl, '_blank')}>
            Preview
          </Button>
          <Button onClick={() => navigate(`/module/ai-bot/edit/${botId}`)}>
            Edit Bot
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Bot</AlertDialogTitle>
                <AlertDialogDescription className="space-y-2">
                  <p>Are you sure you want to delete "{bot.name}"?</p>
                  <p className="text-sm">This will permanently delete:</p>
                  <ul className="text-sm list-disc list-inside space-y-1">
                    <li>All knowledge sources and embeddings</li>
                    <li>All chat logs and leads</li>
                    <li>All appointments and settings</li>
                    <li>All uploaded files</li>
                  </ul>
                  <p className="font-medium text-destructive">This action cannot be undone.</p>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteBot}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Bot'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="chatbot" className="space-y-6">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="chatbot" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            <span className="hidden sm:inline">Chatbot</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="leads" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Leads</span>
          </TabsTrigger>
          <TabsTrigger value="appointments" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Appointments</span>
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="flex items-center gap-2">
            <Webhook className="h-4 w-4" />
            <span className="hidden sm:inline">Webhooks</span>
          </TabsTrigger>
          <TabsTrigger value="sources" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Sources</span>
          </TabsTrigger>
          <TabsTrigger value="embed" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            <span className="hidden sm:inline">Embed</span>
          </TabsTrigger>
        </TabsList>

        {/* Chatbot Preview Tab */}
        <TabsContent value="chatbot">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Live Preview</CardTitle>
                  <CardDescription>
                    Test your chatbot in real-time
                  </CardDescription>
                </div>
                {bot.is_public && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(embedUrl, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Test Public Embed
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <BotChatPreview
                  botId={botId}
                  botName={bot.name}
                  embedSettings={bot.embed_settings}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <RetrievalSettings
            botId={botId}
            currentThreshold={bot.similarity_threshold ?? 0.30}
            currentRetrievalCount={bot.retrieval_count ?? 5}
          />
          <ChatAnalytics botId={botId} />
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>
                Edit your bot's prompts, model, and knowledge base
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate(`/module/ai-bot/edit/${botId}`)}>
                Edit Bot Configuration
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance">
          <AppearanceSettings botId={botId} botName={bot.name} />
        </TabsContent>

        {/* Leads Tab */}
        <TabsContent value="leads" className="space-y-6">
          <LeadFormSettings botId={botId} />
          <LeadsTable botId={botId} />
        </TabsContent>

        {/* Appointments Tab */}
        <TabsContent value="appointments" className="space-y-6">
          <CalendarSettings botId={botId} />
          <AppointmentsTable botId={botId} />
        </TabsContent>

        {/* Webhooks Tab */}
        <TabsContent value="webhooks">
          <WebhookSettings botId={botId} />
        </TabsContent>

        {/* Sources Tab */}
        <TabsContent value="sources">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Knowledge Sources</CardTitle>
                  <CardDescription>
                    Manage your bot's knowledge base
                  </CardDescription>
                </div>
                <Button onClick={() => navigate(`/module/ai-bot/edit/${botId}`)}>
                  Add Sources
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <KnowledgeSourcesTable botId={botId} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Embed Tab */}
        <TabsContent value="embed">
          <EmbedCodeGenerator
            botId={botId}
            botName={bot.name}
            themeColor={bot.embed_settings.bubble_color}
            position={bot.embed_settings.bubble_position}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BotDetail;
