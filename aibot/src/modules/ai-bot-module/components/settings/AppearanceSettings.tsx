import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Palette, Type, Layout, Bot as BotIcon, Save, Shield, Lock, Sparkles, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { EmbedSettings, DEFAULT_EMBED_SETTINGS } from '../../types';
import { AppearancePreview } from './AppearancePreview';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';
import { useAbPlanLimits } from '../../hooks/useAbSubscription';

interface AppearanceSettingsProps {
  botId: string;
  botName: string;
}

const FONT_OPTIONS = [
  { value: 'system-ui', label: 'System Default' },
  { value: 'Inter, sans-serif', label: 'Inter' },
  { value: 'Roboto, sans-serif', label: 'Roboto' },
  { value: 'Open Sans, sans-serif', label: 'Open Sans' },
  { value: 'Poppins, sans-serif', label: 'Poppins' },
  { value: 'Lato, sans-serif', label: 'Lato' },
];

export const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({ botId, botName }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState<EmbedSettings>(DEFAULT_EMBED_SETTINGS);
  const [hasChanges, setHasChanges] = useState(false);
  const [showPoweredBy, setShowPoweredBy] = useState(true);
  
  // Get plan limits to check appearance access
  const { data: planLimits, isLoading: planLoading } = useAbPlanLimits();
  const canCustomizeAppearance = planLimits?.can_customize_appearance ?? false;
  const canRemoveBranding = planLimits?.can_remove_branding ?? false;

  // Fetch current settings
  const { data: botData, isLoading } = useQuery({
    queryKey: ['bot-appearance', botId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ab_bots')
        .select('embed_settings, name, show_powered_by')
        .eq('id', botId)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  // Initialize settings from database
  useEffect(() => {
    if (botData?.embed_settings) {
      const dbSettings = botData.embed_settings as unknown as EmbedSettings;
      setSettings({
        ...DEFAULT_EMBED_SETTINGS,
        ...dbSettings,
      });
      setShowPoweredBy(botData.show_powered_by !== false);
    }
  }, [botData]);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (newSettings: EmbedSettings) => {
      const { error } = await supabase
        .from('ab_bots')
        .update({ 
          embed_settings: newSettings as unknown as Json,
          show_powered_by: showPoweredBy,
        })
        .eq('id', botId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bot-appearance', botId] });
      queryClient.invalidateQueries({ queryKey: ['bot-detail', botId] });
      setHasChanges(false);
      toast.success('Appearance settings saved');
    },
    onError: () => {
      toast.error('Failed to save settings');
    },
  });

  const updateSetting = <K extends keyof EmbedSettings>(key: K, value: EmbedSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    saveMutation.mutate(settings);
  };

  if (isLoading || planLoading) {
    return <div className="animate-pulse h-96 bg-muted rounded-lg" />;
  }

  // Show upgrade prompt if user doesn't have appearance access
  if (!canCustomizeAppearance) {
    return (
      <Card className="max-w-lg mx-auto mt-8">
        <CardContent className="pt-8 text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <Lock className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Appearance Customization</h3>
            <p className="text-muted-foreground">
              Upgrade to a paid plan to customize your chatbot's appearance, colors, fonts, and more.
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              <span>Custom colors and branding</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Palette className="h-4 w-4" />
              <span>Font and layout options</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <EyeOff className="h-4 w-4" />
              <span>Remove "Powered by" branding</span>
            </div>
          </div>
          <Button onClick={() => navigate('/module/ai-bot/subscription')} className="gap-2">
            <Sparkles className="h-4 w-4" />
            View Plans & Upgrade
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Settings Panel */}
      <div className="lg:col-span-3 space-y-6">
        {/* Theme Colors */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Theme Colors
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bubble_color">Widget Bubble</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    id="bubble_color"
                    value={settings.bubble_color}
                    onChange={(e) => updateSetting('bubble_color', e.target.value)}
                    className="w-10 h-10 rounded border cursor-pointer"
                  />
                  <Input 
                    value={settings.bubble_color}
                    onChange={(e) => updateSetting('bubble_color', e.target.value)}
                    className="flex-1 font-mono text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="header_color">Header Background</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    id="header_color"
                    value={settings.header_color || settings.bubble_color}
                    onChange={(e) => updateSetting('header_color', e.target.value)}
                    className="w-10 h-10 rounded border cursor-pointer"
                  />
                  <Input 
                    value={settings.header_color || settings.bubble_color}
                    onChange={(e) => updateSetting('header_color', e.target.value)}
                    className="flex-1 font-mono text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="user_message_color">User Messages</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    id="user_message_color"
                    value={settings.user_message_color || settings.bubble_color}
                    onChange={(e) => updateSetting('user_message_color', e.target.value)}
                    className="w-10 h-10 rounded border cursor-pointer"
                  />
                  <Input 
                    value={settings.user_message_color || settings.bubble_color}
                    onChange={(e) => updateSetting('user_message_color', e.target.value)}
                    className="flex-1 font-mono text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bot_message_color">Bot Messages</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    id="bot_message_color"
                    value={settings.bot_message_color || '#F3F4F6'}
                    onChange={(e) => updateSetting('bot_message_color', e.target.value)}
                    className="w-10 h-10 rounded border cursor-pointer"
                  />
                  <Input 
                    value={settings.bot_message_color || '#F3F4F6'}
                    onChange={(e) => updateSetting('bot_message_color', e.target.value)}
                    className="flex-1 font-mono text-sm"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Text & Display */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Type className="h-4 w-4" />
              Text & Display
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="display_name">Display Name</Label>
                <Input 
                  id="display_name"
                  placeholder={botName}
                  value={settings.display_name || ''}
                  onChange={(e) => updateSetting('display_name', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Shown in chat header</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="font_family">Font Family</Label>
                <Select 
                  value={settings.font_family || 'system-ui'}
                  onValueChange={(value) => updateSetting('font_family', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_OPTIONS.map(font => (
                      <SelectItem key={font.value} value={font.value}>
                        <span style={{ fontFamily: font.value }}>{font.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="welcome_message">Welcome Message</Label>
              <Input 
                id="welcome_message"
                value={settings.welcome_message}
                onChange={(e) => updateSetting('welcome_message', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="input_placeholder">Input Placeholder</Label>
              <Input 
                id="input_placeholder"
                value={settings.input_placeholder || ''}
                onChange={(e) => updateSetting('input_placeholder', e.target.value)}
                placeholder="Type your message..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Layout */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Layout className="h-4 w-4" />
              Layout
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Widget Position</Label>
              <RadioGroup
                value={settings.bubble_position}
                onValueChange={(value: 'bottom-right' | 'bottom-left') => updateSetting('bubble_position', value)}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bottom-right" id="pos-right" />
                  <Label htmlFor="pos-right" className="font-normal cursor-pointer">Bottom Right</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bottom-left" id="pos-left" />
                  <Label htmlFor="pos-left" className="font-normal cursor-pointer">Bottom Left</Label>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>Border Radius</Label>
                <span className="text-sm text-muted-foreground">{settings.border_radius || 12}px</span>
              </div>
              <Slider
                value={[parseInt(settings.border_radius || '12')]}
                onValueChange={([value]) => updateSetting('border_radius', String(value))}
                min={0}
                max={24}
                step={2}
              />
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="chat_width">Widget Width</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="chat_width"
                    type="number"
                    value={parseInt(settings.chat_width) || 400}
                    onChange={(e) => updateSetting('chat_width', `${e.target.value}px`)}
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">px</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="chat_height">Widget Height</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="chat_height"
                    type="number"
                    value={parseInt(settings.chat_height) || 600}
                    onChange={(e) => updateSetting('chat_height', `${e.target.value}px`)}
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">px</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bot Avatar */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BotIcon className="h-4 w-4" />
              Bot Avatar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Show Bot Avatar</Label>
                <p className="text-xs text-muted-foreground">Display avatar next to bot messages</p>
              </div>
              <Switch
                checked={settings.show_bot_avatar !== false}
                onCheckedChange={(checked) => updateSetting('show_bot_avatar', checked)}
              />
            </div>
            {settings.show_bot_avatar !== false && (
              <div className="space-y-2">
                <Label htmlFor="bot_avatar_url">Custom Avatar URL</Label>
                <Input 
                  id="bot_avatar_url"
                  placeholder="https://example.com/avatar.png"
                  value={settings.bot_avatar_url || ''}
                  onChange={(e) => updateSetting('bot_avatar_url', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Leave empty for default icon</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Privacy & Compliance */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Privacy & Compliance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="privacy_policy_url">Privacy Policy URL</Label>
              <Input 
                id="privacy_policy_url"
                placeholder="https://example.com/privacy-policy"
                value={settings.privacy_policy_url || ''}
                onChange={(e) => updateSetting('privacy_policy_url', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="privacy_policy_name">Privacy Policy Link Name</Label>
              <Input 
                id="privacy_policy_name"
                placeholder="Privacy Policy"
                value={settings.privacy_policy_name || ''}
                onChange={(e) => updateSetting('privacy_policy_name', e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Text shown at bottom of chat widget</p>
            </div>
          </CardContent>
        </Card>

        {/* Branding Control - Only for paid users */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Branding
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Show "Powered by GMBBriefcase"</Label>
                <p className="text-xs text-muted-foreground">
                  {canRemoveBranding 
                    ? 'Toggle to show or hide the powered by badge' 
                    : 'Upgrade to remove branding'}
                </p>
              </div>
              <Switch
                checked={showPoweredBy}
                onCheckedChange={(checked) => {
                  if (!canRemoveBranding && !checked) {
                    toast.error('Upgrade to a paid plan to remove branding');
                    return;
                  }
                  setShowPoweredBy(checked);
                  setHasChanges(true);
                }}
                disabled={!canRemoveBranding && !showPoweredBy}
              />
            </div>
            {!canRemoveBranding && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/module/ai-bot/subscription')}
                className="w-full"
              >
                Upgrade to Remove Branding
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={!hasChanges || saveMutation.isPending}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {saveMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="lg:col-span-2">
        <AppearancePreview settings={settings} botName={botName} />
      </div>
    </div>
  );
};
