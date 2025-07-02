import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Map, Settings, Check, X } from 'lucide-react';
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

      <div className="grid gap-6">
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
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Configure {integration.name}</DialogTitle>
                          </DialogHeader>
                          
                          {integration.id === 'map-api' && (
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="apiKey">API Key</Label>
                                <Input
                                  id="apiKey"
                                  type="password"
                                  placeholder="Enter your Map API key"
                                  value={mapApiKey}
                                  onChange={(e) => setMapApiKey(e.target.value)}
                                  className="mt-1"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                  Get your API key from your map service provider
                                </p>
                              </div>
                              
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="outline" 
                                  onClick={() => setIsConfiguring(false)}
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