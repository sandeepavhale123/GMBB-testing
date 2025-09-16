import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plug, Settings, Plus, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';

const Integration: React.FC = () => {
  const integrations = [
    {
      name: 'Salesforce',
      description: 'Sync leads to your Salesforce CRM',
      status: 'Connected',
      icon: '🏢',
      lastSync: '2 hours ago'
    },
    {
      name: 'HubSpot',
      description: 'Import contacts and track interactions',
      status: 'Available',
      icon: '🎯',
      lastSync: null
    },
    {
      name: 'Mailchimp',
      description: 'Add leads to email marketing campaigns',
      status: 'Connected',
      icon: '📧',
      lastSync: '1 hour ago'
    },
    {
      name: 'Slack',
      description: 'Get notified of new leads in Slack',
      status: 'Connected',
      icon: '💬',
      lastSync: '30 minutes ago'
    },
    {
      name: 'Zapier',
      description: 'Connect to 5000+ apps via Zapier',
      status: 'Available',
      icon: '⚡',
      lastSync: null
    },
    {
      name: 'Google Sheets',
      description: 'Export leads to Google Sheets automatically',
      status: 'Available',
      icon: '📊',
      lastSync: null
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Integrations</h1>
        <p className="text-muted-foreground">Connect your lead management with other tools</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Available Integrations */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plug className="w-5 h-5" />
              Available Integrations
            </CardTitle>
            <CardDescription>Connect with your favorite tools and services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {integrations.map((integration, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{integration.icon}</div>
                      <div>
                        <h3 className="font-medium">{integration.name}</h3>
                        <p className="text-sm text-muted-foreground">{integration.description}</p>
                      </div>
                    </div>
                    {integration.status === 'Connected' ? (
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={integration.status === 'Connected' ? 'default' : 'secondary'}>
                        {integration.status}
                      </Badge>
                      {integration.lastSync && (
                        <span className="text-xs text-muted-foreground">
                          Last sync: {integration.lastSync}
                        </span>
                      )}
                    </div>
                    <Button 
                      size="sm" 
                      variant={integration.status === 'Connected' ? 'outline' : 'default'}
                    >
                      {integration.status === 'Connected' ? (
                        <>
                          <Settings className="w-4 h-4 mr-1" />
                          Configure
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-1" />
                          Connect
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* API Settings */}
        <Card>
          <CardHeader>
            <CardTitle>API Settings</CardTitle>
            <CardDescription>Manage your API access and webhooks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="api-key">API Key</Label>
              <div className="flex gap-2 mt-1">
                <Input 
                  id="api-key" 
                  type="password" 
                  value="sk_live_••••••••••••••••"
                  readOnly 
                />
                <Button size="icon" variant="outline">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="webhook-url">Webhook URL</Label>
              <Input 
                id="webhook-url" 
                placeholder="https://yourapp.com/webhook"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Webhooks</Label>
                <p className="text-sm text-muted-foreground">Send real-time data to your endpoint</p>
              </div>
              <Switch />
            </div>

            <Button className="w-full">
              Save API Settings
            </Button>

            <div className="bg-muted/30 p-3 rounded-lg">
              <p className="text-sm font-medium mb-2">API Usage:</p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Requests this month:</span>
                  <span>2,450</span>
                </div>
                <div className="flex justify-between">
                  <span>Rate limit:</span>
                  <span>1000/hour</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Integration Activity</CardTitle>
            <CardDescription>Recent sync and integration events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { service: 'Salesforce', action: 'Synced 12 new leads', time: '2 hours ago', status: 'Success' },
                { service: 'Mailchimp', action: 'Added 5 contacts to campaign', time: '3 hours ago', status: 'Success' },
                { service: 'Slack', action: 'New lead notification sent', time: '4 hours ago', status: 'Success' },
                { service: 'HubSpot', action: 'Connection failed - API timeout', time: '6 hours ago', status: 'Error' },
                { service: 'Google Sheets', action: 'Exported 25 leads to spreadsheet', time: '1 day ago', status: 'Success' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${activity.status === 'Success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <div>
                      <p className="font-medium">{activity.service}</p>
                      <p className="text-sm text-muted-foreground">{activity.action}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={activity.status === 'Success' ? 'default' : 'destructive'}>
                      {activity.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
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

export default Integration;