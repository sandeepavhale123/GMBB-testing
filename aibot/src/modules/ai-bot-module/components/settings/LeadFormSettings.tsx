import React, { useEffect, useState } from 'react';
import { Users, Eye, Settings, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { useLeadSettings } from '../../hooks/useLeadSettings';
import { LeadFormSettings as LeadFormSettingsType, DEFAULT_LEAD_SETTINGS, LeadTriggerType } from '../../types';

interface LeadFormSettingsProps {
  botId: string;
}

export const LeadFormSettings: React.FC<LeadFormSettingsProps> = ({ botId }) => {
  const { settings, isLoading, upsertSettings, isUpsertingSettings } = useLeadSettings(botId);
  const [localSettings, setLocalSettings] = useState<LeadFormSettingsType>({ ...DEFAULT_LEAD_SETTINGS, bot_id: botId });
  const [showPreview, setShowPreview] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  const handleSave = () => {
    upsertSettings(localSettings);
  };

  const updateLocalSettings = (updates: Partial<LeadFormSettingsType>) => {
    setLocalSettings(prev => ({ ...prev, ...updates }));
  };

  // Get summary of enabled fields
  const getEnabledFieldsSummary = () => {
    const fields = [];
    if (localSettings.collect_name) fields.push('Name');
    if (localSettings.collect_email) fields.push('Email');
    if (localSettings.collect_phone) fields.push('Phone');
    if (localSettings.collect_message) fields.push('Message');
    return fields.length > 0 ? fields.join(', ') : 'None';
  };

  const getTriggerTypeLabel = () => {
    return localSettings.trigger_type === 'pre_chat' ? 'Pre-chat' : 'Manual';
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4" />
            <div className="h-10 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Lead Form Settings
              </CardTitle>
              {!isExpanded && (
                <CardDescription className="mt-1">
                  {localSettings.enabled 
                    ? `Enabled (${getTriggerTypeLabel()}) • Collecting: ${getEnabledFieldsSummary()}`
                    : 'Disabled — Capture visitor information before or during chat'}
                </CardDescription>
              )}
              {isExpanded && (
                <CardDescription className="mt-1">
                  Capture visitor information before or during chat
                </CardDescription>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={localSettings.enabled}
                onCheckedChange={(checked) => updateLocalSettings({ enabled: checked })}
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" />
                    Collapse
                  </>
                ) : (
                  <>
                    <Settings className="h-4 w-4 mr-1" />
                    Configure
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>

        <Collapsible open={isExpanded}>
          <CollapsibleContent>
            {localSettings.enabled && (
              <CardContent className="space-y-6 pt-3 border-t">
                {/* Trigger Type */}
                <div className="space-y-2">
                  <Label>When to show form</Label>
                  <Select
                    value={localSettings.trigger_type}
                    onValueChange={(value: LeadTriggerType) => updateLocalSettings({ trigger_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pre_chat">Before chat starts (Pre-chat)</SelectItem>
                      <SelectItem value="manual">During chat (Manual trigger)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {localSettings.trigger_type === 'pre_chat' 
                      ? 'Form appears before the user can start chatting'
                      : 'Form can be triggered by the bot during conversation'}
                  </p>
                </div>

                {/* Form Title & Description */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="form-title">Form Title</Label>
                    <Input
                      id="form-title"
                      value={localSettings.form_title || ''}
                      onChange={(e) => updateLocalSettings({ form_title: e.target.value })}
                      placeholder="Contact Us"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="submit-text">Submit Button Text</Label>
                    <Input
                      id="submit-text"
                      value={localSettings.submit_button_text || ''}
                      onChange={(e) => updateLocalSettings({ submit_button_text: e.target.value })}
                      placeholder="Start Chat"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="form-desc">Form Description</Label>
                  <Textarea
                    id="form-desc"
                    value={localSettings.form_description || ''}
                    onChange={(e) => updateLocalSettings({ form_description: e.target.value })}
                    placeholder="Please provide your details to start the conversation."
                    rows={2}
                  />
                </div>

                {/* Field Configuration */}
                <div className="space-y-4">
                  <Label>Fields to collect</Label>
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Name Field */}
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={localSettings.collect_name}
                          onCheckedChange={(checked) => updateLocalSettings({ 
                            collect_name: !!checked,
                            name_required: checked ? localSettings.name_required : false
                          })}
                        />
                        <span>Name</span>
                      </div>
                      {localSettings.collect_name && (
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={localSettings.name_required}
                            onCheckedChange={(checked) => updateLocalSettings({ name_required: !!checked })}
                          />
                          <span className="text-sm text-muted-foreground">Required</span>
                        </div>
                      )}
                    </div>

                    {/* Email Field */}
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={localSettings.collect_email}
                          onCheckedChange={(checked) => updateLocalSettings({ 
                            collect_email: !!checked,
                            email_required: checked ? localSettings.email_required : false
                          })}
                        />
                        <span>Email</span>
                      </div>
                      {localSettings.collect_email && (
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={localSettings.email_required}
                            onCheckedChange={(checked) => updateLocalSettings({ email_required: !!checked })}
                          />
                          <span className="text-sm text-muted-foreground">Required</span>
                        </div>
                      )}
                    </div>

                    {/* Phone Field */}
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={localSettings.collect_phone}
                          onCheckedChange={(checked) => updateLocalSettings({ 
                            collect_phone: !!checked,
                            phone_required: checked ? localSettings.phone_required : false
                          })}
                        />
                        <span>Phone</span>
                      </div>
                      {localSettings.collect_phone && (
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={localSettings.phone_required}
                            onCheckedChange={(checked) => updateLocalSettings({ phone_required: !!checked })}
                          />
                          <span className="text-sm text-muted-foreground">Required</span>
                        </div>
                      )}
                    </div>

                    {/* Message Field */}
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={localSettings.collect_message}
                          onCheckedChange={(checked) => updateLocalSettings({ 
                            collect_message: !!checked,
                            message_required: checked ? localSettings.message_required : false
                          })}
                        />
                        <span>Message</span>
                      </div>
                      {localSettings.collect_message && (
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={localSettings.message_required}
                            onCheckedChange={(checked) => updateLocalSettings({ message_required: !!checked })}
                          />
                          <span className="text-sm text-muted-foreground">Required</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Privacy Policy URL */}
                <div className="space-y-2">
                  <Label htmlFor="privacy-url">Privacy Policy URL (optional)</Label>
                  <Input
                    id="privacy-url"
                    value={localSettings.privacy_policy_url || ''}
                    onChange={(e) => updateLocalSettings({ privacy_policy_url: e.target.value })}
                    placeholder="https://example.com/privacy"
                    type="url"
                  />
                  <p className="text-xs text-muted-foreground">
                    Link to your privacy policy, shown at the bottom of the form
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-4 border-t">
                  <Button onClick={handleSave} disabled={isUpsertingSettings}>
                    {isUpsertingSettings ? 'Saving...' : 'Save Settings'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                  </Button>
                </div>
              </CardContent>
            )}

            {!localSettings.enabled && (
              <CardContent className="pt-3 border-t">
                <p className="text-sm text-muted-foreground">
                  Enable lead capture to configure form fields and collect visitor information.
                </p>
              </CardContent>
            )}
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Preview */}
      {showPreview && localSettings.enabled && isExpanded && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Form Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-w-sm mx-auto p-4 border rounded-lg bg-background">
              <h3 className="font-semibold text-lg mb-2">{localSettings.form_title}</h3>
              {localSettings.form_description && (
                <p className="text-sm text-muted-foreground mb-4">{localSettings.form_description}</p>
              )}
              <div className="space-y-3">
                {localSettings.collect_name && (
                  <div>
                    <Label className="text-sm">
                      Name {localSettings.name_required && <span className="text-destructive">*</span>}
                    </Label>
                    <Input placeholder="Your name" disabled />
                  </div>
                )}
                {localSettings.collect_email && (
                  <div>
                    <Label className="text-sm">
                      Email {localSettings.email_required && <span className="text-destructive">*</span>}
                    </Label>
                    <Input placeholder="you@example.com" type="email" disabled />
                  </div>
                )}
                {localSettings.collect_phone && (
                  <div>
                    <Label className="text-sm">
                      Phone {localSettings.phone_required && <span className="text-destructive">*</span>}
                    </Label>
                    <Input placeholder="+1 234 567 8900" type="tel" disabled />
                  </div>
                )}
                {localSettings.collect_message && (
                  <div>
                    <Label className="text-sm">
                      Message {localSettings.message_required && <span className="text-destructive">*</span>}
                    </Label>
                    <Textarea placeholder="How can we help?" rows={2} disabled />
                  </div>
                )}
                <Button className="w-full" disabled>
                  {localSettings.submit_button_text || 'Start Chat'}
                </Button>
                {localSettings.privacy_policy_url && (
                  <p className="text-xs text-center text-muted-foreground">
                    By submitting, you agree to our{' '}
                    <a href={localSettings.privacy_policy_url} target="_blank" rel="noopener noreferrer" className="underline">
                      Privacy Policy
                    </a>
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};