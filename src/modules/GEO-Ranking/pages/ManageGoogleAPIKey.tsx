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
        <h1 className="text-2xl font-bold text-foreground">Google Places API Key</h1>
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


     {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </div>
          ) : apiKeyData ? (
        <Card>
          <CardHeader>
            <CardTitle>Current Status</CardTitle>
          </CardHeader>
          <CardContent>
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
                <div className="flex items-center gap-3">
                  <Badge variant="default" className="bg-green-500">
                    Active
                  </Badge>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" disabled={isDeleting}>
                        <Trash2 className="w-4 h-4 mr-1" />
                        {isDeleting ? 'Deleting...' : 'Delete'}
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
              </div>
            </div>
              </CardContent>
      </Card>
          ) : (
            <></>
          )}

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
            <p className="font-medium mb-2">How to generate Google Place API key:</p>
            <ol className="space-y-1">
              <li>Note - You must enable Billing for Google Project</li>
              <li>Visit the Google <a href="https://console.cloud.google.com/projectselector2/google/maps-apis/overview?pli=1&supportedpurview=project" target="_blank">Cloud Platform Console.</a></li>
              <li>Click the project drop-down and select or create the project for which you want to add an API key.</li>
              <li>From Dashboard &gt; Go to APIs overview &gt; Click on Library &gt; Enable Maps JavaScript API & Enable Places API by clicking on both respectively.</li>
              <li>After that Click the menu button and select APIs &amp; Services &gt; Credentials.</li>
              <li>On the Credentials page, Create credentials Dropdown - Select API Key Option</li>
              <li>This creates a dialog that displays, “your newly created API key” - Copy the key.</li>
              <li>Use or paste the generated key under Geo Ranking &gt; Manage Key tab. (One-time activity -Only First use of GEO Ranking Check).</li>
              <li>Once you have added a key, it will be used for all of your listings, and no more need to generate a separate key for every GMB listing.</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      
         
      
    </div>;
};