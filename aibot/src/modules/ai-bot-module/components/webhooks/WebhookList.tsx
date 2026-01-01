import React from 'react';
import { MoreHorizontal, Pencil, Trash2, History, Play, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Webhook, 
  useDeleteWebhook, 
  useToggleWebhook, 
  useTestWebhook,
  WEBHOOK_EVENTS 
} from '../../hooks/useWebhooks';

interface WebhookListProps {
  webhooks: Webhook[];
  isLoading: boolean;
  botId: string;
  onEdit: (webhookId: string) => void;
  onViewLogs: (webhookId: string) => void;
}

export const WebhookList: React.FC<WebhookListProps> = ({
  webhooks,
  isLoading,
  botId,
  onEdit,
  onViewLogs,
}) => {
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  
  const deleteWebhook = useDeleteWebhook();
  const toggleWebhook = useToggleWebhook();
  const testWebhook = useTestWebhook();

  const handleToggle = (webhook: Webhook) => {
    toggleWebhook.mutate({ id: webhook.id, botId, isActive: !webhook.is_active });
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteWebhook.mutate({ id: deleteId, botId });
      setDeleteId(null);
    }
  };

  const handleTest = (webhook: Webhook) => {
    testWebhook.mutate(webhook);
  };

  const getEventLabel = (eventValue: string) => {
    return WEBHOOK_EVENTS.find(e => e.value === eventValue)?.label || eventValue;
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map(i => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (webhooks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No webhooks configured yet.</p>
        <p className="text-sm mt-1">Add a webhook to send lead data to your CRM or other tools.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {webhooks.map((webhook) => (
          <div
            key={webhook.id}
            className="flex items-center justify-between p-4 border rounded-lg bg-card"
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <Switch
                checked={webhook.is_active}
                onCheckedChange={() => handleToggle(webhook)}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium truncate">{webhook.name}</h4>
                  {webhook.secret_key && (
                    <Badge variant="outline" className="text-xs">Signed</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">{webhook.url}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {webhook.events.map((event) => (
                    <Badge key={event} variant="secondary" className="text-xs">
                      {getEventLabel(event)}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleTest(webhook)}>
                  <Play className="h-4 w-4 mr-2" />
                  Send Test
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onViewLogs(webhook.id)}>
                  <History className="h-4 w-4 mr-2" />
                  View Logs
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.open(webhook.url, '_blank')}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open URL
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onEdit(webhook.id)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-destructive"
                  onClick={() => setDeleteId(webhook.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Webhook</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this webhook? All delivery logs will also be deleted.
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
    </>
  );
};
