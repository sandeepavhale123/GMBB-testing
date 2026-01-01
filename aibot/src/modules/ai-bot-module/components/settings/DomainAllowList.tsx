import React, { useState } from 'react';
import { Globe, Plus, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DomainAllowListProps {
  domains: string[];
  onAddDomain: (domain: string) => void;
  onRemoveDomain: (index: number) => void;
}

export const DomainAllowList: React.FC<DomainAllowListProps> = ({
  domains,
  onAddDomain,
  onRemoveDomain,
}) => {
  const [newDomain, setNewDomain] = useState('');
  const [error, setError] = useState<string | null>(null);

  const validateDomain = (domain: string): boolean => {
    // Basic domain validation
    const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    // Also allow localhost for development
    if (domain === 'localhost' || domain.startsWith('localhost:')) {
      return true;
    }
    return domainRegex.test(domain);
  };

  const handleAddDomain = () => {
    const trimmed = newDomain.trim().toLowerCase();
    
    if (!trimmed) {
      setError('Please enter a domain');
      return;
    }
    
    // Remove protocol if included
    const cleanDomain = trimmed.replace(/^https?:\/\//, '').split('/')[0];
    
    if (!validateDomain(cleanDomain)) {
      setError('Please enter a valid domain (e.g., example.com)');
      return;
    }
    
    if (domains.includes(cleanDomain)) {
      setError('This domain is already in the list');
      return;
    }
    
    setError(null);
    onAddDomain(cleanDomain);
    setNewDomain('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddDomain();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Allowed Domains
        </CardTitle>
        <CardDescription>
          Restrict which websites can embed your chatbot. Leave empty to allow all domains.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {domains.length === 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No domains configured. Your chatbot can be embedded on any website.
              Add domains to restrict access.
            </AlertDescription>
          </Alert>
        )}

        {/* Domain list */}
        {domains.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {domains.map((domain, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="flex items-center gap-1 pr-1"
              >
                {domain}
                <button
                  onClick={() => onRemoveDomain(index)}
                  className="ml-1 rounded-full p-0.5 hover:bg-destructive/20"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {/* Add domain input */}
        <div className="space-y-2">
          <Label htmlFor="new-domain">Add Domain</Label>
          <div className="flex gap-2">
            <Input
              id="new-domain"
              value={newDomain}
              onChange={(e) => {
                setNewDomain(e.target.value);
                setError(null);
              }}
              onKeyPress={handleKeyPress}
              placeholder="example.com"
              className="flex-1"
            />
            <Button onClick={handleAddDomain} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {error && (
            <p className="text-xs text-destructive">{error}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Enter domain without protocol (e.g., mysite.com, not https://mysite.com).
            Subdomains are automatically allowed.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
