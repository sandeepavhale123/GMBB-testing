import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Globe, Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface AbDomainSettingsProps {
  customDomain: string | null;
  domainVerified: boolean;
  verificationToken: string | null;
  onDomainChange: (value: string) => void;
  onVerifyDomain: () => void;
  isVerifying?: boolean;
}

export const AbDomainSettings: React.FC<AbDomainSettingsProps> = ({
  customDomain,
  domainVerified,
  verificationToken,
  onDomainChange,
  onVerifyDomain,
  isVerifying = false,
}) => {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Custom Domain
        </CardTitle>
        <CardDescription>
          Use your own domain for the login page (e.g., chatbot.yourdomain.com)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="custom-domain">Domain</Label>
          <div className="flex gap-2">
            <Input
              id="custom-domain"
              value={customDomain || ''}
              onChange={(e) => onDomainChange(e.target.value)}
              placeholder="chatbot.yourdomain.com"
              className="flex-1"
            />
            {customDomain && (
              <Badge variant={domainVerified ? 'default' : 'secondary'}>
                {domainVerified ? (
                  <><CheckCircle className="h-3 w-3 mr-1" /> Verified</>
                ) : (
                  <><XCircle className="h-3 w-3 mr-1" /> Not Verified</>
                )}
              </Badge>
            )}
          </div>
        </div>

        {customDomain && !domainVerified && (
          <div className="space-y-4 p-4 bg-muted rounded-lg">
            <h4 className="font-medium text-sm">DNS Configuration</h4>
            <p className="text-xs text-muted-foreground">
              Add these DNS records to your domain provider:
            </p>

            <div className="space-y-3">
              {/* A Record */}
              <div className="p-3 bg-background rounded border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium">A Record</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard('185.158.133.1', 'IP address')}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Name:</span>
                    <span className="ml-2 font-mono">@</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Value:</span>
                    <span className="ml-2 font-mono">185.158.133.1</span>
                  </div>
                </div>
              </div>

              {/* TXT Record */}
              {verificationToken && (
                <div className="p-3 bg-background rounded border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium">TXT Record (Verification)</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(`ab_verify=${verificationToken}`, 'TXT record')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Name:</span>
                      <span className="ml-2 font-mono">_ab_verify</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Value:</span>
                      <span className="ml-2 font-mono break-all">ab_verify={verificationToken}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Button
              onClick={onVerifyDomain}
              disabled={isVerifying}
              className="w-full"
            >
              {isVerifying ? 'Verifying...' : 'Verify Domain'}
            </Button>

            <a
              href="https://docs.lovable.dev/features/custom-domain"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 text-xs text-muted-foreground hover:underline"
            >
              <ExternalLink className="h-3 w-3" />
              View full documentation
            </a>
          </div>
        )}

        {customDomain && domainVerified && (
          <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Domain Active</span>
            </div>
            <p className="text-xs text-green-600 dark:text-green-500 mt-1">
              Your login page is available at{' '}
              <a
                href={`https://${customDomain}/ai-bot-login`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                https://{customDomain}/ai-bot-login
              </a>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
