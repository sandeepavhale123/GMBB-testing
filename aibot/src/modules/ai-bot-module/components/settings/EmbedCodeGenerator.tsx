import React, { useState } from 'react';
import { Copy, Check, Code, Globe, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface EmbedCodeGeneratorProps {
  botId: string;
  botName: string;
  themeColor?: string;
  position?: 'bottom-right' | 'bottom-left';
}

export const EmbedCodeGenerator: React.FC<EmbedCodeGeneratorProps> = ({ 
  botId, 
  botName,
  themeColor = '#3B82F6',
  position = 'bottom-right'
}) => {
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  
  const baseUrl = window.location.origin;
  const embedUrl = `${baseUrl}/embed/ai-bot/${botId}`;
  const widgetScriptUrl = `${baseUrl}/embed/ai-bot-widget.js`;

  // Script embed with config object (lazy loads iframe on click)
  const scriptCode = `<!-- ${botName} Chat Widget -->
<script>
  window.aiBotConfig = {
    botId: "${botId}",
    position: "${position}",
    themeColor: "${themeColor}",
    baseUrl: "${baseUrl}"
  };
</script>
<script src="${widgetScriptUrl}" defer></script>`;

  // Direct iframe embed
  const iframeCode = `<iframe
  src="${embedUrl}"
  width="400"
  height="600"
  style="border: none; border-radius: 12px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);"
  allow="microphone"
  title="${botName} Chat"
></iframe>`;

  const copyToClipboard = (text: string, tab: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTab(tab);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedTab(null), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          Embed Code
        </CardTitle>
        <CardDescription>
          Add your chatbot to any website using one of these methods
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="script" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="script" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Widget
            </TabsTrigger>
            <TabsTrigger value="iframe" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Iframe
            </TabsTrigger>
            <TabsTrigger value="link" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Direct Link
            </TabsTrigger>
          </TabsList>

          <TabsContent value="script" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Add this script to your website's HTML to display a floating chat bubble. 
              The chat loads only when users click the bubble for optimal performance.
            </p>
            <div className="relative">
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
                <code>{scriptCode}</code>
              </pre>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(scriptCode, 'script')}
              >
                {copiedTab === 'script' ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>Configuration options:</strong></p>
              <ul className="list-disc list-inside space-y-0.5">
                <li><code>botId</code> - Your bot's unique identifier (required)</li>
                <li><code>position</code> - "bottom-right" or "bottom-left"</li>
                <li><code>themeColor</code> - Hex color for the chat bubble</li>
                <li><code>baseUrl</code> - The base URL of the chat service (auto-generated)</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="iframe" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Embed the chatbot directly in your page using an iframe.
            </p>
            <div className="relative">
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
                <code>{iframeCode}</code>
              </pre>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(iframeCode, 'iframe')}
              >
                {copiedTab === 'iframe' ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="link" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Share this direct link to your chatbot for use in emails, SMS, WhatsApp, or social media.
            </p>
            <div className="flex gap-2">
              <Input value={embedUrl} readOnly className="font-mono text-sm" />
              <Button
                variant="outline"
                onClick={() => copyToClipboard(embedUrl, 'link')}
              >
                {copiedTab === 'link' ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => window.open(embedUrl, '_blank')}
            >
              <Globe className="h-4 w-4 mr-2" />
              Open in New Tab
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
