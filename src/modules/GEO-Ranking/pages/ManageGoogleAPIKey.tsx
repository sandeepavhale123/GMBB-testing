import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Key, CheckCircle, XCircle, ExternalLink, Info, Trash2 } from 'lucide-react';
import { useGoogleApiKey } from '../hooks/useGoogleApiKey';
export const ManageGoogleAPIKey: React.FC = () => {
  const {
    apiKeyData,
    isLoading,
    saveApiKey,
    deleteApiKey,
    isSaving,
    isDeleting
  } = useGoogleApiKey();
  const [apiKeyInput, setApiKeyInput] = useState('');
  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      saveApiKey(apiKeyInput.trim());
      setApiKeyInput('');
    }
  };
  const handleDeleteApiKey = () => {
    deleteApiKey();
  };
  const maskApiKey = (key: string) => {
    if (key.length <= 8) return key;
    return key.substring(0, 4) + '***************' + key.slice(-3);
  };
  return <div className=" mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Google Places API Key</h1>
        <p className="text-muted-foreground mt-2">Manage your Google Places API key for location-based ranking checks</p>
      </div>

      {/* Information Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          You need a valid Google Places API key to perform location-based ranking checks. 
          Make sure your API key has the Places API and Geocoding API enabled.
          <a href="https://developers.google.com/places/web-service/get-api-key" target="_blank" rel="noopener noreferrer" className="inline-flex items-center ml-2 text-primary hover:underline">
            Get API Key <ExternalLink className="w-3 h-3 ml-1" />
          </a>
        </AlertDescription>
      </Alert>

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
            <Label htmlFor="api-key">Google Places API Key</Label>
            <div className="flex gap-2 mt-1">
              <Input 
                id="api-key" 
                type="password" 
                value={apiKeyInput} 
                onChange={e => setApiKeyInput(e.target.value)} 
                placeholder="Enter your Google Places API Key" 
                className="flex-1" 
              />
              <Button onClick={handleSaveApiKey} disabled={!apiKeyInput.trim() || isSaving}>
                {isSaving ? 'Saving...' : apiKeyData ? 'Update' : 'Add'}
              </Button>
            </div>
          </div>

          <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
            <p className="font-medium mb-2">Security Information:</p>
            <ul className="space-y-1">
              <li>• Your API key is encrypted and stored securely</li>
              <li>• Only the masked version is displayed for security</li>
              <li>• The key is used only for authorized ranking checks</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Current API Key Status */}
      <Card>
        <CardHeader>
          <CardTitle>Current Status</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </div>
          ) : apiKeyData ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-medium">API Key Configured</p>
                    <p className="text-sm text-muted-foreground">
                      Key: <code className="bg-background px-2 py-1 rounded text-xs">{maskApiKey(apiKeyData.apiKey)}</code>
                    </p>
                  </div>
                </div>
                <Badge variant="default" className="bg-green-500">
                  Active
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Last Updated:</span>
                <span className="text-sm text-muted-foreground">{apiKeyData.lastValidated}</span>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full" disabled={isDeleting}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    {isDeleting ? 'Deleting...' : 'Delete API Key'}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete API Key</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete your Google Places API key? This action cannot be undone 
                      and will disable all location-based ranking checks.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteApiKey} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Delete API Key
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Key className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-lg font-medium text-muted-foreground mb-2">No API Key Configured</p>
              <p className="text-sm text-muted-foreground">Add your Google Places API key above to get started</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* API Key Requirements */}
      <Card>
        <CardHeader>
          <CardTitle>Requirements & Setup</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                Required APIs
              </h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  Places API - For location data
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  Geocoding API - For address conversion
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  Maps JavaScript API - For map display
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3 flex items-center">
                <Key className="w-4 h-4 mr-2 text-blue-500" />
                Permissions
              </h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Read place details
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Search nearby places
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Convert addresses to coordinates
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
};