import React, { useState } from 'react';
import { Plus, Webhook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useWebhooks } from '../../hooks/useWebhooks';
import { WebhookList } from './WebhookList';
import { WebhookForm } from './WebhookForm';
import { WebhookLogs } from './WebhookLogs';

interface WebhookSettingsProps {
  botId: string;
}

export const WebhookSettings: React.FC<WebhookSettingsProps> = ({ botId }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingWebhookId, setEditingWebhookId] = useState<string | null>(null);
  const [viewingLogsWebhookId, setViewingLogsWebhookId] = useState<string | null>(null);
  
  const { data: webhooks = [], isLoading } = useWebhooks(botId);

  const editingWebhook = editingWebhookId 
    ? webhooks.find(w => w.id === editingWebhookId) 
    : null;

  const handleEdit = (webhookId: string) => {
    setEditingWebhookId(webhookId);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingWebhookId(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Webhook className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Webhooks</CardTitle>
                <CardDescription>
                  Send real-time notifications to external services when events occur
                </CardDescription>
              </div>
            </div>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Webhook
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <WebhookList
            webhooks={webhooks}
            isLoading={isLoading}
            botId={botId}
            onEdit={handleEdit}
            onViewLogs={setViewingLogsWebhookId}
          />
        </CardContent>
      </Card>

      <WebhookForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        botId={botId}
        webhook={editingWebhook}
      />

      <WebhookLogs
        webhookId={viewingLogsWebhookId}
        webhookName={webhooks.find(w => w.id === viewingLogsWebhookId)?.name}
        isOpen={!!viewingLogsWebhookId}
        onClose={() => setViewingLogsWebhookId(null)}
      />
    </div>
  );
};
