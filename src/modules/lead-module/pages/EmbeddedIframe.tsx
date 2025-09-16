import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Code, Copy, Eye, Settings, ExternalLink } from 'lucide-react';

const EmbeddedIframe: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const embedCode = `<iframe 
  src="https://yourapp.com/embed/lead-form/abc123" 
  width="100%" 
  height="400"
  frameborder="0"
  style="border: none; border-radius: 8px;">
</iframe>`;
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Embedded Iframe</h1>
        <p className="text-muted-foreground">Generate and manage embeddable lead forms</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Iframe Configuration
            </CardTitle>
            <CardDescription>Customize your embedded form settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="form-title">Form Title</Label>
              <Input id="form-title" placeholder="Enter form title" defaultValue="Contact Us" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="iframe-width">Width</Label>
                <Input id="iframe-width" placeholder="100%" defaultValue="100%" />
              </div>
              <div>
                <Label htmlFor="iframe-height">Height</Label>
                <Input id="iframe-height" placeholder="400" defaultValue="400" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Company Logo</Label>
                <p className="text-sm text-muted-foreground">Display your logo in the form</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Allow users to toggle dark theme</p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-resize</Label>
                <p className="text-sm text-muted-foreground">Automatically adjust iframe height</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div>
              <Label htmlFor="success-message">Success Message</Label>
              <Textarea 
                id="success-message"
                placeholder="Message shown after form submission"
                defaultValue="Thank you for your interest! We'll get back to you soon."
              />
            </div>
          </CardContent>
        </Card>

        {/* Generated Code */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5" />
              Embed Code
            </CardTitle>
            <CardDescription>Copy this code to embed the form on your website</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Textarea 
                readOnly
                className="font-mono text-sm min-h-[150px]"
                value={`<iframe 
  src="https://yourapp.com/embed/lead-form/abc123" 
  width="100%" 
  height="400"
  frameborder="0"
  style="border: none; border-radius: 8px;">
</iframe>`}
              />
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2"
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <Badge variant="secondary" className="text-xs">Copied!</Badge>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="gap-2 flex-1">
                <Eye className="w-4 h-4" />
                Preview
              </Button>
              <Button variant="outline" className="gap-2 flex-1">
                <ExternalLink className="w-4 h-4" />
                Test Form
              </Button>
            </div>

            <div className="bg-muted/30 p-3 rounded-lg">
              <p className="text-sm font-medium mb-2">Integration Tips:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Add the iframe to any HTML page or CMS</li>
                <li>• The form will match your site's theme automatically</li>
                <li>• All submissions are captured in your lead dashboard</li>
                <li>• HTTPS is required for iframe embedding</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Active Embeds */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Active Embeds</CardTitle>
            <CardDescription>Manage your deployed iframe forms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Homepage Contact Form', domain: 'yoursite.com', submissions: 45, status: 'Active' },
                { name: 'Landing Page Form', domain: 'landing.yoursite.com', submissions: 23, status: 'Active' },
                { name: 'Blog Sidebar Form', domain: 'blog.yoursite.com', submissions: 12, status: 'Inactive' }
              ].map((embed, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Code className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{embed.name}</p>
                      <p className="text-sm text-muted-foreground">{embed.domain}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="text-sm font-medium">{embed.submissions}</p>
                      <p className="text-xs text-muted-foreground">Submissions</p>
                    </div>
                    <Badge variant={embed.status === 'Active' ? 'default' : 'secondary'}>
                      {embed.status}
                    </Badge>
                    <Button size="sm" variant="ghost">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmbeddedIframe;