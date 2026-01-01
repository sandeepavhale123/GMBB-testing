import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot } from 'lucide-react';

interface AbLoginPreviewProps {
  logoUrl: string | null;
  companyName: string | null;
  primaryColor: string;
  backgroundColor: string;
  loginTitle: string;
  loginDescription: string;
}

export const AbLoginPreview: React.FC<AbLoginPreviewProps> = ({
  logoUrl,
  companyName,
  primaryColor,
  backgroundColor,
  loginTitle,
  loginDescription,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Login Page Preview</CardTitle>
        <CardDescription>
          How your custom login page will appear
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className="rounded-lg border overflow-hidden"
          style={{ backgroundColor }}
        >
          <div className="p-6 flex flex-col items-center space-y-4">
            {/* Logo or Icon */}
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={companyName || 'Logo'}
                className="h-12 w-auto object-contain"
              />
            ) : (
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${primaryColor}20` }}
              >
                <Bot className="w-6 h-6" style={{ color: primaryColor }} />
              </div>
            )}

            {/* Title & Description */}
            <div className="text-center space-y-1">
              <h3 className="text-lg font-semibold text-foreground">
                {loginTitle || 'AI Bot'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {loginDescription || 'Sign in to manage your AI bots'}
              </p>
            </div>

            {/* Mock Form */}
            <div className="w-full max-w-[200px] space-y-2">
              <div className="h-8 bg-muted rounded border" />
              <div className="h-8 bg-muted rounded border" />
              <div
                className="h-8 rounded text-center text-xs flex items-center justify-center text-white font-medium"
                style={{ backgroundColor: primaryColor }}
              >
                Sign In
              </div>
            </div>

            {companyName && (
              <p className="text-xs text-muted-foreground mt-4">
                {companyName}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
