import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Mail, Save, Eye, Plus, Edit } from 'lucide-react';

const EmailTemplate: React.FC = () => {
  const templates = [
    { name: 'Welcome Email', status: 'Active', lastModified: '2 days ago' },
    { name: 'Follow-up Sequence', status: 'Active', lastModified: '1 week ago' },
    { name: 'Newsletter Template', status: 'Draft', lastModified: '3 days ago' },
    { name: 'Promotional Offer', status: 'Inactive', lastModified: '2 weeks ago' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Email Templates</h1>
          <p className="text-muted-foreground">Create and manage your email templates</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          New Template
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Templates</CardTitle>
            <CardDescription>Manage your email templates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {templates.map((template, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <div>
                    <p className="font-medium">{template.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant={
                          template.status === 'Active' ? 'default' : 
                          template.status === 'Draft' ? 'secondary' : 'outline'
                        }
                        className="text-xs"
                      >
                        {template.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{template.lastModified}</span>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Template Editor */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Template Editor
            </CardTitle>
            <CardDescription>Edit your email template content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="template-name">Template Name</Label>
                <Input id="template-name" placeholder="Enter template name" defaultValue="Welcome Email" />
              </div>
              <div>
                <Label htmlFor="subject-line">Subject Line</Label>
                <Input id="subject-line" placeholder="Enter email subject" defaultValue="Welcome to our service!" />
              </div>
            </div>

            <div>
              <Label htmlFor="email-content">Email Content</Label>
              <Textarea 
                id="email-content"
                placeholder="Enter your email content here..."
                className="min-h-[200px]"
                defaultValue="Hi {{firstName}},

Welcome to our service! We're excited to have you on board.

Here's what you can expect:
- Personalized lead management
- Advanced analytics and reporting
- 24/7 customer support

If you have any questions, feel free to reach out to us.

Best regards,
The Team"
              />
            </div>

            <div className="bg-muted/30 p-3 rounded-lg">
              <p className="text-sm font-medium mb-2">Available Variables:</p>
              <div className="flex flex-wrap gap-2">
                {['{{firstName}}', '{{lastName}}', '{{email}}', '{{company}}', '{{phone}}'].map((variable) => (
                  <Badge key={variable} variant="outline" className="text-xs">
                    {variable}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" className="gap-2">
                <Eye className="w-4 h-4" />
                Preview
              </Button>
              <div className="flex gap-2">
                <Button variant="outline">Save as Draft</Button>
                <Button className="gap-2">
                  <Save className="w-4 h-4" />
                  Save & Activate
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailTemplate;