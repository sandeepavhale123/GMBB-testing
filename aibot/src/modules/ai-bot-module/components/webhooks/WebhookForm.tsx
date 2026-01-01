import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Webhook, useCreateWebhook, useUpdateWebhook, WEBHOOK_EVENTS } from '../../hooks/useWebhooks';

const webhookSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  url: z.string().url('Must be a valid URL'),
  events: z.array(z.string()).min(1, 'Select at least one event'),
  secret_key: z.string().optional(),
  headers: z.array(z.object({
    key: z.string(),
    value: z.string(),
  })).optional(),
});

type WebhookFormData = z.infer<typeof webhookSchema>;

interface WebhookFormProps {
  isOpen: boolean;
  onClose: () => void;
  botId: string;
  webhook?: Webhook | null;
}

export const WebhookForm: React.FC<WebhookFormProps> = ({
  isOpen,
  onClose,
  botId,
  webhook,
}) => {
  const [showSecret, setShowSecret] = React.useState(false);
  
  const createWebhook = useCreateWebhook();
  const updateWebhook = useUpdateWebhook();
  const isEditing = !!webhook;

  const form = useForm<WebhookFormData>({
    resolver: zodResolver(webhookSchema),
    defaultValues: {
      name: '',
      url: '',
      events: [],
      secret_key: '',
      headers: [],
    },
  });

  useEffect(() => {
    if (webhook) {
      const headersArray = Object.entries(webhook.headers || {}).map(([key, value]) => ({
        key,
        value,
      }));
      
      form.reset({
        name: webhook.name,
        url: webhook.url,
        events: webhook.events,
        secret_key: webhook.secret_key || '',
        headers: headersArray,
      });
    } else {
      form.reset({
        name: '',
        url: '',
        events: [],
        secret_key: '',
        headers: [],
      });
    }
  }, [webhook, form]);

  const headers = form.watch('headers') || [];

  const addHeader = () => {
    const current = form.getValues('headers') || [];
    form.setValue('headers', [...current, { key: '', value: '' }]);
  };

  const removeHeader = (index: number) => {
    const current = form.getValues('headers') || [];
    form.setValue('headers', current.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: WebhookFormData) => {
    const headersObject = (data.headers || [])
      .filter(h => h.key && h.value)
      .reduce((acc, h) => ({ ...acc, [h.key]: h.value }), {});

    if (isEditing && webhook) {
      await updateWebhook.mutateAsync({
        id: webhook.id,
        botId,
        data: {
          name: data.name,
          url: data.url,
          events: data.events,
          secret_key: data.secret_key || undefined,
          headers: headersObject,
        },
      });
    } else {
      await createWebhook.mutateAsync({
        bot_id: botId,
        name: data.name,
        url: data.url,
        events: data.events,
        secret_key: data.secret_key || undefined,
        headers: headersObject,
      });
    }
    onClose();
  };

  const isSubmitting = createWebhook.isPending || updateWebhook.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Webhook' : 'Add Webhook'}</DialogTitle>
          <DialogDescription>
            Configure a webhook to send data to external services
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., CRM Lead Sync" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Webhook URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormDescription>
                    The endpoint that will receive POST requests
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="events"
              render={() => (
                <FormItem>
                  <FormLabel>Events</FormLabel>
                  <FormDescription>
                    Select which events should trigger this webhook
                  </FormDescription>
                  <div className="space-y-2 mt-2">
                    {WEBHOOK_EVENTS.map((event) => (
                      <FormField
                        key={event.value}
                        control={form.control}
                        name="events"
                        render={({ field }) => (
                          <FormItem className="flex items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(event.value)}
                                onCheckedChange={(checked) => {
                                  const current = field.value || [];
                                  if (checked) {
                                    field.onChange([...current, event.value]);
                                  } else {
                                    field.onChange(current.filter((v) => v !== event.value));
                                  }
                                }}
                              />
                            </FormControl>
                            <div className="space-y-0.5">
                              <FormLabel className="font-normal cursor-pointer">
                                {event.label}
                              </FormLabel>
                              <FormDescription className="text-xs">
                                {event.description}
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="secret_key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secret Key (Optional)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showSecret ? 'text' : 'password'}
                        placeholder="Enter a secret for HMAC signature"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0"
                        onClick={() => setShowSecret(!showSecret)}
                      >
                        {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Used to sign payloads for verification (X-Webhook-Signature header)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <FormLabel>Custom Headers (Optional)</FormLabel>
                <Button type="button" variant="outline" size="sm" onClick={addHeader}>
                  <Plus className="h-3 w-3 mr-1" />
                  Add Header
                </Button>
              </div>
              {headers.map((_, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder="Header name"
                    {...form.register(`headers.${index}.key`)}
                  />
                  <Input
                    placeholder="Header value"
                    {...form.register(`headers.${index}.value`)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeHeader(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : isEditing ? 'Update Webhook' : 'Create Webhook'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
