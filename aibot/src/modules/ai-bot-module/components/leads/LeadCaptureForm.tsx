import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { LeadFormSettings } from '../../types';

interface LeadCaptureFormProps {
  botId: string;
  sessionId: string;
  settings: LeadFormSettings;
  bubbleColor: string;
  onSubmit: (leadId: string) => void;
  conversationSnapshot?: { role: 'user' | 'assistant'; content: string }[];
  showPoweredBy?: boolean;
}

interface FormData {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

export const LeadCaptureForm: React.FC<LeadCaptureFormProps> = ({
  botId,
  sessionId,
  settings,
  bubbleColor,
  onSubmit,
  conversationSnapshot = [],
  showPoweredBy = true,
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Build dynamic zod schema based on settings
  const buildSchema = () => {
    const schemaFields: Record<string, z.ZodTypeAny> = {};

    if (settings.collect_name) {
      schemaFields.name = settings.name_required
        ? z.string().min(1, 'Name is required').max(100)
        : z.string().max(100).optional();
    }

    if (settings.collect_email) {
      schemaFields.email = settings.email_required
        ? z.string().email('Invalid email address').max(255)
        : z.string().email('Invalid email address').max(255).optional().or(z.literal(''));
    }

    if (settings.collect_phone) {
      schemaFields.phone = settings.phone_required
        ? z.string().min(1, 'Phone is required').max(20)
        : z.string().max(20).optional();
    }

    if (settings.collect_message) {
      schemaFields.message = settings.message_required
        ? z.string().min(1, 'Message is required').max(1000)
        : z.string().max(1000).optional();
    }

    return z.object(schemaFields);
  };

  const schema = buildSchema();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onFormSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      const { data: result, error } = await supabase.functions.invoke('ai-bot-save-lead', {
        body: {
          bot_id: botId,
          session_id: sessionId,
          name: data.name || null,
          email: data.email || null,
          phone: data.phone || null,
          message: data.message || null,
          conversation_snapshot: conversationSnapshot,
          source_url: window.location.href,
        },
      });

      if (error) throw error;

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      if (result?.lead_id) {
        onSubmit(result.lead_id);
      }
    } catch (err) {
      console.error('Lead capture error:', err);
      toast.error('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold" style={{ color: bubbleColor }}>
          {settings.form_title || 'Contact Us'}
        </h2>
        {settings.form_description && (
          <p className="text-sm text-muted-foreground">{settings.form_description}</p>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        {settings.collect_name && (
          <div className="space-y-2">
            <Label htmlFor="name">
              Name {settings.name_required && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Your name"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>
        )}

        {settings.collect_email && (
          <div className="space-y-2">
            <Label htmlFor="email">
              Email {settings.email_required && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="your@email.com"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>
        )}

        {settings.collect_phone && (
          <div className="space-y-2">
            <Label htmlFor="phone">
              Phone {settings.phone_required && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id="phone"
              type="tel"
              {...register('phone')}
              placeholder="+1 234 567 890"
              disabled={isSubmitting}
            />
            {errors.phone && (
              <p className="text-xs text-destructive">{errors.phone.message}</p>
            )}
          </div>
        )}

        {settings.collect_message && (
          <div className="space-y-2">
            <Label htmlFor="message">
              Message {settings.message_required && <span className="text-destructive">*</span>}
            </Label>
            <Textarea
              id="message"
              {...register('message')}
              placeholder="How can we help you?"
              rows={3}
              disabled={isSubmitting}
            />
            {errors.message && (
              <p className="text-xs text-destructive">{errors.message.message}</p>
            )}
          </div>
        )}

        {/* Privacy Policy */}
        {settings.privacy_policy_url && (
          <p className="text-xs text-muted-foreground text-center">
            By submitting, you agree to our{' '}
            <a
              href={settings.privacy_policy_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center gap-1"
            >
              Privacy Policy <ExternalLink className="h-3 w-3" />
            </a>
          </p>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
          style={{ backgroundColor: bubbleColor }}
        >
          {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {settings.submit_button_text || 'Start Chat'}
        </Button>
      </form>

      {/* Powered By Footer - Conditional */}
      {showPoweredBy && (
        <div className="mt-4 pt-3 border-t border-border text-center">
          <a 
            href="https://gmbbriefcase.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:underline"
          >
            Powered by GMBBriefcase
          </a>
        </div>
      )}
    </div>
  );
};
