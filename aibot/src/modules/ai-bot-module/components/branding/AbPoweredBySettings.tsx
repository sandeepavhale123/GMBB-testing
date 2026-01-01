import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AbPoweredBySettingsProps {
  showPoweredBy: boolean;
  poweredByText: string;
  poweredByUrl: string;
  onShowPoweredByChange: (value: boolean) => void;
  onPoweredByTextChange: (value: string) => void;
  onPoweredByUrlChange: (value: string) => void;
}

export const AbPoweredBySettings: React.FC<AbPoweredBySettingsProps> = ({
  showPoweredBy,
  poweredByText,
  poweredByUrl,
  onShowPoweredByChange,
  onPoweredByTextChange,
  onPoweredByUrlChange,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Widget Footer</CardTitle>
        <CardDescription>
          Configure the "Powered by" text shown in the chat widget footer
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Show "Powered by" text</Label>
            <p className="text-xs text-muted-foreground">
              Display branding text at the bottom of the widget
            </p>
          </div>
          <Switch
            checked={showPoweredBy}
            onCheckedChange={onShowPoweredByChange}
          />
        </div>

        {showPoweredBy && (
          <>
            <div className="space-y-2">
              <Label htmlFor="powered-by-text">Text</Label>
              <Input
                id="powered-by-text"
                value={poweredByText}
                onChange={(e) => onPoweredByTextChange(e.target.value)}
                placeholder="Powered by GMBBriefcase"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="powered-by-url">Link URL</Label>
              <Input
                id="powered-by-url"
                type="url"
                value={poweredByUrl}
                onChange={(e) => onPoweredByUrlChange(e.target.value)}
                placeholder="https://gmbbriefcase.com"
              />
            </div>

            <div className="p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground text-center">Preview:</p>
              <p className="text-center mt-1">
                <a
                  href={poweredByUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:underline"
                >
                  {poweredByText}
                </a>
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
