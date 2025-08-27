import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Key, CheckCircle, XCircle, ExternalLink, Info } from 'lucide-react';
import { useGoogleApiKey } from '../hooks/useGoogleApiKey';

export const ManageGoogleAPIKey: React.FC = () => {
  const { apiKeyData, isLoading, saveApiKey, validateApiKey, isSaving, isValidating } = useGoogleApiKey();
  const [apiKeyInput, setApiKeyInput] = useState('');

  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      saveApiKey(apiKeyInput.trim());
      setApiKeyInput('');
    }
  };

  const handleValidateKey = () => {
    if (apiKeyInput.trim()) {
      validateApiKey(apiKeyInput.trim());
    }
  };

  const quotaPercentage = apiKeyData?.quotaUsed && apiKeyData?.quotaLimit 
    ? (apiKeyData.quotaUsed / apiKeyData.quotaLimit) * 100 
    : 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Manage Google Place API Key</h1>
        <p className="text-muted-foreground">Configure your Google Places API key for location-based ranking checks</p>
      </div>

      {/* Information Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          You need a valid Google Places API key to perform location-based ranking checks. 
          Make sure your API key has the Places API and Geocoding API enabled.
          <a 
            href="https://developers.google.com/places/web-service/get-api-key" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center ml-2 text-primary hover:underline"
          >
            Get API Key <ExternalLink className="w-3 h-3 ml-1" />
          </a>
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Key Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Key className="w-5 h-5 mr-2" />
              API Key Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="api-key">Google Place API Key</Label>
              <Input
                id="api-key"
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="Enter your Google Place API Key"
                className="mt-1"
              />
            </div>
            
            <div className="flex space-x-2">
              <Button 
                onClick={handleSaveApiKey} 
                disabled={!apiKeyInput.trim() || isSaving}
                className="flex-1"
              >
                {isSaving ? 'Saving...' : 'Save API Key'}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleValidateKey}
                disabled={!apiKeyInput.trim() || isValidating}
              >
                {isValidating ? 'Validating...' : 'Validate'}
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>• Your API key is encrypted and stored securely</p>
              <p>• Only the masked version is displayed for security</p>
              <p>• The key is used only for authorized ranking checks</p>
            </div>
          </CardContent>
        </Card>

        {/* Current API Key Status */}
        <Card>
          <CardHeader>
            <CardTitle>Current API Key Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
              </div>
            ) : apiKeyData ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">API Key:</span>
                  <code className="text-sm bg-muted px-2 py-1 rounded">{apiKeyData.apiKey}</code>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status:</span>
                  <Badge variant={apiKeyData.isValid ? "default" : "destructive"}>
                    {apiKeyData.isValid ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Valid
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 mr-1" />
                        Invalid
                      </>
                    )}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Last Validated:</span>
                  <span className="text-sm text-muted-foreground">{apiKeyData.lastValidated}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Quota Usage:</span>
                    <span className="text-sm text-muted-foreground">
                      {apiKeyData.quotaUsed} / {apiKeyData.quotaLimit}
                    </span>
                  </div>
                  <Progress value={quotaPercentage} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {Math.round(quotaPercentage)}% of daily quota used
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Key className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No API key configured</p>
                <p className="text-sm text-muted-foreground">Add your Google Places API key to get started</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* API Key Requirements */}
      <Card>
        <CardHeader>
          <CardTitle>API Key Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Required APIs</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Places API - For location data</li>
                <li>• Geocoding API - For address conversion</li>
                <li>• Maps JavaScript API - For map display</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Permissions</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Read place details</li>
                <li>• Search nearby places</li>
                <li>• Convert addresses to coordinates</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};