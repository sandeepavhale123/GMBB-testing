import React from 'react';
import { format } from 'date-fns';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useWebhookLogs, WEBHOOK_EVENTS } from '../../hooks/useWebhooks';

interface WebhookLogsProps {
  webhookId: string | null;
  webhookName?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const WebhookLogs: React.FC<WebhookLogsProps> = ({
  webhookId,
  webhookName,
  isOpen,
  onClose,
}) => {
  const { data: logs = [], isLoading } = useWebhookLogs(webhookId || undefined);

  const getEventLabel = (eventValue: string) => {
    return WEBHOOK_EVENTS.find(e => e.value === eventValue)?.label || eventValue;
  };

  const getStatusIcon = (status: number | null, error: string | null) => {
    if (error) return <XCircle className="h-4 w-4 text-destructive" />;
    if (status === null) return <Clock className="h-4 w-4 text-muted-foreground" />;
    if (status >= 200 && status < 300) return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <XCircle className="h-4 w-4 text-destructive" />;
  };

  const getStatusBadge = (status: number | null, error: string | null) => {
    if (error) return <Badge variant="destructive">Error</Badge>;
    if (status === null) return <Badge variant="secondary">Pending</Badge>;
    if (status >= 200 && status < 300) return <Badge variant="default">{status}</Badge>;
    return <Badge variant="destructive">{status}</Badge>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Webhook Delivery Logs</DialogTitle>
          <DialogDescription>
            {webhookName ? `Recent deliveries for "${webhookName}"` : 'Recent webhook deliveries'}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No delivery logs yet.</p>
              <p className="text-sm mt-1">Logs will appear here when the webhook is triggered.</p>
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {logs.map((log) => (
                <AccordionItem key={log.id} value={log.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      {getStatusIcon(log.response_status, log.error_message)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{getEventLabel(log.event_type)}</span>
                          {getStatusBadge(log.response_status, log.error_message)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(log.created_at), 'MMM d, yyyy HH:mm:ss')}
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      {log.error_message && (
                        <div>
                          <h5 className="text-sm font-medium text-destructive mb-1">Error</h5>
                          <pre className="text-xs bg-destructive/10 p-2 rounded overflow-x-auto">
                            {log.error_message}
                          </pre>
                        </div>
                      )}
                      
                      <div>
                        <h5 className="text-sm font-medium mb-1">Request Payload</h5>
                        <pre className="text-xs bg-muted p-2 rounded overflow-x-auto max-h-48">
                          {JSON.stringify(log.payload, null, 2)}
                        </pre>
                      </div>

                      {log.response_body && (
                        <div>
                          <h5 className="text-sm font-medium mb-1">Response Body</h5>
                          <pre className="text-xs bg-muted p-2 rounded overflow-x-auto max-h-32">
                            {log.response_body}
                          </pre>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
