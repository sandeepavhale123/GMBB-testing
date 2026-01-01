import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Plus, ExternalLink, Settings, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useBots } from '../hooks/useBots';
import { useAbWorkspaceContext } from '../context/AbWorkspaceContext';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentWorkspace, isLoading: workspaceLoading } = useAbWorkspaceContext();
  const { data: bots, isLoading: botsLoading } = useBots(currentWorkspace?.id);
  
  const isLoading = workspaceLoading || botsLoading;

  const handleCreateBot = () => {
    navigate('/module/ai-bot/create');
  };

  const handleManageBot = (botId: string) => {
    navigate(`/module/ai-bot/detail/${botId}`);
  };

  const handleEditBot = (botId: string) => {
    navigate(`/module/ai-bot/edit/${botId}`);
  };

  const handlePreviewBot = (botId: string) => {
    window.open(`${window.location.origin}/embed/ai-bot/${botId}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-5 w-64 mt-2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">AI Bot Builder</h1>
          <p className="text-muted-foreground mt-1">Create and manage your AI chatbots</p>
        </div>
        <Button onClick={handleCreateBot}>
          <Plus className="w-4 h-4 mr-2" />
          Create Bot
        </Button>
      </div>

      {bots && bots.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {bots.map((bot) => (
            <Card key={bot.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleManageBot(bot.id)}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: bot.embed_settings.bubble_color }}
                    >
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{bot.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={bot.status === 'published' ? 'default' : 'secondary'} className="text-xs">
                          {bot.status}
                        </Badge>
                        {bot.is_public && (
                          <Badge variant="outline" className="text-xs">
                            Public
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleManageBot(bot.id); }}>
                        <Settings className="h-4 w-4 mr-2" />
                        Manage
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditBot(bot.id); }}>
                        <Settings className="h-4 w-4 mr-2" />
                        Edit Configuration
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handlePreviewBot(bot.id); }}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Preview
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Created {new Date(bot.created_at).toLocaleDateString()}
                </p>
                <div className="flex items-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleManageBot(bot.id);
                    }}
                  >
                    Manage
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreviewBot(bot.id);
                    }}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Bot className="w-16 h-16 text-muted-foreground mb-4" />
            <CardTitle className="text-xl mb-2">No bots yet</CardTitle>
            <CardDescription className="text-center max-w-md mb-6">
              Create your first AI chatbot to help automate customer support, sales, or appointment booking.
            </CardDescription>
            <Button onClick={handleCreateBot}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Bot
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
