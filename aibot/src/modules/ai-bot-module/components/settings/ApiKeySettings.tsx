import React, { useState } from 'react';
import { Key, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ApiKeySettingsProps {
  hasOpenaiKey?: boolean;
  hasGeminiKey?: boolean;
  onSaveKeys: (openaiKey?: string, geminiKey?: string) => void;
  isLoading?: boolean;
}

export const ApiKeySettings: React.FC<ApiKeySettingsProps> = ({
  hasOpenaiKey = false,
  hasGeminiKey = false,
  onSaveKeys,
  isLoading = false,
}) => {
  const [openaiKey, setOpenaiKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [showOpenai, setShowOpenai] = useState(false);
  const [showGemini, setShowGemini] = useState(false);

  const handleSave = () => {
    onSaveKeys(
      openaiKey.trim() || undefined,
      geminiKey.trim() || undefined
    );
    // Clear inputs after save for security
    setOpenaiKey('');
    setGeminiKey('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          API Keys
        </CardTitle>
        <CardDescription>
          Add your own API keys for AI providers. Keys are encrypted and never shown again.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* OpenAI API Key */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="openai-key">OpenAI API Key</Label>
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              Get API Key <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <div className="relative">
            <Input
              id="openai-key"
              type={showOpenai ? 'text' : 'password'}
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              placeholder={hasOpenaiKey ? '••••••••••••••••' : 'sk-...'}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowOpenai(!showOpenai)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showOpenai ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {hasOpenaiKey && (
            <p className="text-xs text-muted-foreground">
              ✓ OpenAI key is configured. Enter a new key to replace it.
            </p>
          )}
        </div>

        {/* Gemini API Key */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="gemini-key">Google Gemini API Key</Label>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              Get API Key <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <div className="relative">
            <Input
              id="gemini-key"
              type={showGemini ? 'text' : 'password'}
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder={hasGeminiKey ? '••••••••••••••••' : 'AIza...'}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowGemini(!showGemini)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showGemini ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {hasGeminiKey && (
            <p className="text-xs text-muted-foreground">
              ✓ Gemini key is configured. Enter a new key to replace it.
            </p>
          )}
        </div>

        <Button
          onClick={handleSave}
          disabled={isLoading || (!openaiKey.trim() && !geminiKey.trim())}
          className="w-full"
        >
          {isLoading ? 'Saving...' : 'Save API Keys'}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Your API keys are encrypted and stored securely. They are never displayed after saving.
        </p>
      </CardContent>
    </Card>
  );
};
