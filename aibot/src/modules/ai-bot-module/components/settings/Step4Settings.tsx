import React from 'react';
import { Settings, Sliders } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBotWizard } from '../../context/BotWizardContext';
import { MODEL_OPTIONS } from '../../types';
import { ApiKeySettings } from './ApiKeySettings';
import { DomainAllowList } from './DomainAllowList';
import { EmbedCodeGenerator } from './EmbedCodeGenerator';

interface Step4SettingsProps {
  botId?: string;
}

export const Step4Settings: React.FC<Step4SettingsProps> = ({ botId }) => {
  const {
    formData,
    updateFormData,
    addAllowedDomain,
    removeAllowedDomain,
    updateApiKeys,
  } = useBotWizard();

  const handleTemperatureChange = (value: number[]) => {
    updateFormData({ temperature: value[0] });
  };

  const handleMaxTokensChange = (value: number[]) => {
    updateFormData({ maxTokens: value[0] });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Bot Settings</h2>
        <p className="text-muted-foreground mt-1">
          Configure API keys, model settings, and embedding options.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          {/* API Keys */}
          <ApiKeySettings
            hasOpenaiKey={!!formData.openaiApiKey}
            hasGeminiKey={!!formData.geminiApiKey}
            onSaveKeys={(openai, gemini) => updateApiKeys(openai, gemini)}
          />

          {/* Model Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sliders className="h-5 w-5" />
                Model Settings
              </CardTitle>
              <CardDescription>
                Fine-tune how your AI bot responds
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Model Selection */}
              <div className="space-y-2">
                <Label>AI Model</Label>
                <Select
                  value={`${formData.modelProvider}:${formData.modelName}`}
                  onValueChange={(value) => {
                    const [provider, model] = value.split(':');
                    updateFormData({
                      modelProvider: provider as 'openai' | 'gemini',
                      modelName: model,
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MODEL_OPTIONS.map((group) =>
                      group.models.map((model) => (
                        <SelectItem
                          key={`${group.provider}:${model.value}`}
                          value={`${group.provider}:${model.value}`}
                        >
                          {model.label}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Temperature */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Temperature</Label>
                  <span className="text-sm text-muted-foreground">
                    {formData.temperature.toFixed(1)}
                  </span>
                </div>
                <Slider
                  value={[formData.temperature]}
                  onValueChange={handleTemperatureChange}
                  min={0}
                  max={1}
                  step={0.1}
                />
                <p className="text-xs text-muted-foreground">
                  Lower = more focused, higher = more creative
                </p>
              </div>

              {/* Max Tokens */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Max Response Length</Label>
                  <span className="text-sm text-muted-foreground">
                    {formData.maxTokens} tokens
                  </span>
                </div>
                <Slider
                  value={[formData.maxTokens]}
                  onValueChange={handleMaxTokensChange}
                  min={256}
                  max={4096}
                  step={256}
                />
              </div>

              {/* Fallback Message */}
              <div className="space-y-2">
                <Label htmlFor="fallback">Fallback Message</Label>
                <Textarea
                  id="fallback"
                  value={formData.fallbackMessage}
                  onChange={(e) => updateFormData({ fallbackMessage: e.target.value })}
                  placeholder="Message when no relevant information is found..."
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Shown when the bot can't find relevant information in the knowledge base
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Public/Private Toggle */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Visibility
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="public-toggle">Make Bot Public</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow the bot to be embedded on external websites
                  </p>
                </div>
                <Switch
                  id="public-toggle"
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => updateFormData({ isPublic: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Domain Allow List */}
          <DomainAllowList
            domains={formData.allowedDomains}
            onAddDomain={addAllowedDomain}
            onRemoveDomain={removeAllowedDomain}
          />

          {/* Embed Code Generator - only show if bot is created */}
          {botId && (
            <EmbedCodeGenerator botId={botId} botName={formData.name} />
          )}
        </div>
      </div>
    </div>
  );
};
