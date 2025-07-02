import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Map, Settings, Check, X, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'active' | 'inactive';
  configurable: boolean;
}

export const IntegrationsPage: React.FC = () => {
  const { toast } = useToast();
  const [mapApiKey, setMapApiKey] = useState('');
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'map-api',
      name: 'Map API Key',
      description: 'Configure map services for location-based features',
      icon: Map,
      status: 'inactive',
      configurable: true
    }
  ]);

  const handleConfigureMapApi = () => {
    if (!mapApiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive"
      });
      return;
    }

    // Update integration status
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === 'map-api' 
          ? { ...integration, status: 'active' }
          : integration
      )
    );

    setIsConfiguring(false);
    setMapApiKey('');
    
    toast({
      title: "Success",
      description: "Map API Key has been configured successfully",
    });
  };

  const handleDisconnect = (integrationId: string) => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === integrationId 
          ? { ...integration, status: 'inactive' }
          : integration
      )
    );

    toast({
      title: "Disconnected",
      description: "Integration has been disconnected",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Integrations</h2>
        <p className="text-gray-600">Manage your third-party integrations and API connections</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {integrations.map((integration) => {
          const IconComponent = integration.icon;
          
          return (
            <Card key={integration.id} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{integration.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant={integration.status === 'active' ? 'default' : 'secondary'}
                      className={`flex items-center gap-1 ${
                        integration.status === 'active' 
                          ? 'bg-green-100 text-green-700 hover:bg-green-100' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {integration.status === 'active' ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <X className="w-3 h-3" />
                      )}
                      {integration.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex justify-end gap-2">
                  {integration.status === 'active' ? (
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => handleDisconnect(integration.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Disconnect
                    </Button>
                  ) : (
                    integration.configurable && (
                      <Dialog open={isConfiguring} onOpenChange={setIsConfiguring}>
                        <DialogTrigger asChild>
                          <Button size="sm" className="flex items-center gap-2">
                            <Settings className="w-4 h-4" />
                            Configure
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Configure {integration.name}</DialogTitle>
                          </DialogHeader>
                          
                          {integration.id === 'map-api' && (
                            <div className="space-y-6">
                              <div className="bg-blue-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                                  <Map className="w-4 h-4" />
                                  How to generate Google Places API key
                                </h4>
                                <div className="space-y-2 text-sm text-blue-800">
                                  <div className="flex items-start gap-2">
                                    <span className="font-medium min-w-[20px]">1.</span>
                                    <span>Note - You must enable Billing for Google Project.</span>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <span className="font-medium min-w-[20px]">2.</span>
                                    <span>Visit the Google <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline inline-flex items-center gap-1">Cloud Platform Console <ExternalLink className="w-3 h-3" /></a>.</span>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <span className="font-medium min-w-[20px]">3.</span>
                                    <span>Click the project drop-down and select or create the project for which you want to add an API key.</span>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <span className="font-medium min-w-[20px]">4.</span>
                                    <span>From Dashboard → Go to APIs overview → Click on Library → Enable Maps JavaScript API & Enable Places API by clicking on both respectively.</span>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <span className="font-medium min-w-[20px]">5.</span>
                                    <span>After that Click the menu button and select APIs & Services → Credentials.</span>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <span className="font-medium min-w-[20px]">6.</span>
                                    <span>On the Credentials page, Create credentials Dropdown - Select API Key Option.</span>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <span className="font-medium min-w-[20px]">7.</span>
                                    <span>This creates dialog displays, "your newly created API key" - Copy the key.</span>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <span className="font-medium min-w-[20px]">8.</span>
                                    <span>Use or Paste generated key under Geo Ranking → Manage Key tab. (One-time activity -Only First use of GEO Ranking Check).</span>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <span className="font-medium min-w-[20px]">9.</span>
                                    <span>Once you have added a key it will be used for all of your listings and no more need to generate a separate key for every GMB listing.</span>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-3">
                                <Label htmlFor="apiKey" className="text-sm font-medium">Google Places API Key</Label>
                                <div className="relative">
                                  <Input
                                    id="apiKey"
                                    type={showApiKey ? "text" : "password"}
                                    placeholder="Enter your Google Places API key"
                                    value={mapApiKey}
                                    onChange={(e) => setMapApiKey(e.target.value)}
                                    className="pr-10"
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowApiKey(!showApiKey)}
                                  >
                                    {showApiKey ? (
                                      <EyeOff className="h-4 w-4 text-gray-400" />
                                    ) : (
                                      <Eye className="h-4 w-4 text-gray-400" />
                                    )}
                                  </Button>
                                </div>
                                <p className="text-xs text-gray-500">
                                  This API key will be used for all location-based features including Geo Ranking and map services.
                                </p>
                              </div>
                              
                              <div className="flex justify-end gap-2 pt-4 border-t">
                                <Button 
                                  variant="outline" 
                                  onClick={() => {
                                    setIsConfiguring(false);
                                    setMapApiKey('');
                                    setShowApiKey(false);
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button onClick={handleConfigureMapApi}>
                                  Save Configuration
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};