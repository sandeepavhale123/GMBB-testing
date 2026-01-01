import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChevronDown, Code2, Info, Key, Eye, EyeOff, ExternalLink, AlertCircle } from 'lucide-react';
import { useBotWizard } from '../../context/BotWizardContext';
import { MODEL_OPTIONS, ModelProvider } from '../../types';

export const Step2Instructions: React.FC = () => {
  const { formData, updateFormData, nextStep, prevStep, isStepComplete } = useBotWizard();
  const [showApiPreview, setShowApiPreview] = React.useState(false);
  const [showApiKey, setShowApiKey] = React.useState(false);
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const handleModelProviderChange = (provider: ModelProvider) => {
    const firstModel = MODEL_OPTIONS.find((p) => p.provider === provider)?.models[0]?.value || '';
    updateFormData({ modelProvider: provider, modelName: firstModel });
  };

  const handleContinue = () => {
    if (isStepComplete(2)) {
      nextStep();
    }
  };

  const currentProviderModels = MODEL_OPTIONS.find((p) => p.provider === formData.modelProvider)?.models || [];

  // Get current API key based on provider
  const currentApiKey = formData.modelProvider === 'openai' 
    ? formData.openaiApiKey 
    : formData.geminiApiKey;

  const apiKeyLabel = formData.modelProvider === 'openai' ? 'OpenAI API Key' : 'Gemini API Key';
  const apiKeyLink = formData.modelProvider === 'openai' 
    ? 'https://platform.openai.com/api-keys' 
    : 'https://aistudio.google.com/apikey';

  const handleApiKeyChange = (value: string) => {
    if (formData.modelProvider === 'openai') {
      updateFormData({ openaiApiKey: value });
    } else {
      updateFormData({ geminiApiKey: value });
    }
  };

  // Generate API preview
  const apiPreview = {
    model: formData.modelName,
    messages: [
      {
        role: 'system',
        content: formData.systemPrompt.substring(0, 100) + (formData.systemPrompt.length > 100 ? '...' : ''),
      },
      {
        role: 'user',
        content: formData.userMessageTemplate.replace('{context}', '[Knowledge Base Content]').replace('{question}', '[User Question]'),
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Configure Your Bot</h2>
        <p className="text-muted-foreground mt-1">
          Customize your bot's name, instructions, and AI model.
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bot-name">Bot Name</Label>
            <Input
              id="bot-name"
              placeholder="e.g., Support Assistant"
              value={formData.name}
              onChange={(e) => updateFormData({ name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bot-domain">Domain</Label>
            <Input
              id="bot-domain"
              placeholder="e.g., example.com"
              value={formData.allowedDomains?.[0] || ''}
              onChange={(e) => updateFormData({ allowedDomains: e.target.value ? [e.target.value] : [] })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="system-prompt">System Instructions</Label>
          <Textarea
            id="system-prompt"
            placeholder="Define how your bot should behave..."
            value={formData.systemPrompt}
            onChange={(e) => updateFormData({ systemPrompt: e.target.value })}
            rows={10}
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            {formData.systemPrompt.length} characters
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="user-message-template" className="flex items-center gap-2">
            User Message Template
            <span className="text-xs text-muted-foreground font-normal">(Advanced)</span>
          </Label>
          <Textarea
            id="user-message-template"
            placeholder="Context:\n{context}\n\nUser Question:\n{question}"
            value={formData.userMessageTemplate}
            onChange={(e) => updateFormData({ userMessageTemplate: e.target.value })}
            rows={5}
            className="font-mono text-sm"
          />
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>
              Use <code className="bg-muted px-1 rounded">{'{context}'}</code> for knowledge base content and{' '}
              <code className="bg-muted px-1 rounded">{'{question}'}</code> for the user's question.
            </span>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">AI Model</CardTitle>
            <CardDescription>Choose the AI provider and model for your bot</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Provider</Label>
                <Select value={formData.modelProvider} onValueChange={handleModelProviderChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI</SelectItem>
                    <SelectItem value="gemini">Google Gemini</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Model</Label>
                <Select
                  value={formData.modelName}
                  onValueChange={(value) => updateFormData({ modelName: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentProviderModels.map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        {model.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* API Key Input - Required */}
            <div className="pt-2 border-t space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="api-key" className="flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  {apiKeyLabel} <span className="text-destructive">*</span>
                </Label>
                <a 
                  href={apiKeyLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  Get API Key <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="relative">
                <Input
                  id="api-key"
                  type={showApiKey ? 'text' : 'password'}
                  placeholder={formData.modelProvider === 'openai' ? 'sk-...' : 'AI...'}
                  value={currentApiKey || ''}
                  onChange={(e) => handleApiKeyChange(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {!currentApiKey && (
                <Alert variant="destructive" className="py-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    API key is required for training your bot on knowledge sources. We never use our own keys.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Advanced Settings - Collapsible */}
        <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between" type="button">
              <span className="flex items-center gap-2">
                ⚙️ Advanced Settings
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Card className="mt-2">
              <CardContent className="pt-4 space-y-6">
                {/* Temperature */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Temperature</Label>
                    <span className="text-sm font-medium">{formData.temperature?.toFixed(1) || '0.3'}</span>
                  </div>
                  <Slider
                    value={[formData.temperature || 0.3]}
                    onValueChange={([value]) => updateFormData({ temperature: value })}
                    min={0}
                    max={1}
                    step={0.1}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Lower = focused responses, Higher = more creative
                  </p>
                </div>

                {/* Max Tokens */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Max Response Length</Label>
                    <span className="text-sm font-medium">{formData.maxTokens || 1024} tokens</span>
                  </div>
                  <Slider
                    value={[formData.maxTokens || 1024]}
                    onValueChange={([value]) => updateFormData({ maxTokens: value })}
                    min={256}
                    max={4096}
                    step={256}
                    className="w-full"
                  />
                </div>

                {/* Make Bot Public */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="space-y-0.5">
                    <Label>Make Bot Public</Label>
                    <p className="text-xs text-muted-foreground">
                      Allow embedding on external websites
                    </p>
                  </div>
                  <Switch
                    checked={formData.isPublic || false}
                    onCheckedChange={(checked) => updateFormData({ isPublic: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>

        {/* API Call Preview */}
        <Collapsible open={showApiPreview} onOpenChange={setShowApiPreview}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between" type="button">
              <span className="flex items-center gap-2">
                <Code2 className="w-4 h-4" />
                API Call Preview
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showApiPreview ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-2 p-4 bg-muted rounded-lg">
              <pre className="text-xs font-mono overflow-x-auto whitespace-pre-wrap">
                {JSON.stringify(apiPreview, null, 2)}
              </pre>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={handleContinue} disabled={!isStepComplete(2)} size="lg">
          Continue
        </Button>
      </div>
    </div>
  );
};
