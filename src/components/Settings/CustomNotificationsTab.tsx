import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

interface CustomNotification {
  id: string;
  locationName: string;
  reportType: string;
  frequency: 'daily' | 'when-updated';
  recipients: string[];
  status: 'active' | 'paused';
  lastSent?: string;
}

const CUSTOM_NOTIFICATIONS: CustomNotification[] = [
  {
    id: '1',
    locationName: 'Downtown Store',
    reportType: 'GMB Health Report',
    frequency: 'daily',
    recipients: ['manager@downtown.com', 'owner@company.com'],
    status: 'active',
    lastSent: '2024-01-15 09:00'
  },
  {
    id: '2',
    locationName: 'Mall Location',
    reportType: 'Review Report',
    frequency: 'when-updated',
    recipients: ['mall-manager@company.com'],
    status: 'active',
    lastSent: '2024-01-14 16:30'
  },
  {
    id: '3',
    locationName: 'Airport Branch',
    reportType: 'Insight Report',
    frequency: 'daily',
    recipients: ['airport@company.com', 'analytics@company.com'],
    status: 'paused'
  }
];

const REPORT_TYPES = [
  'GMB Health Report',
  'Review Report',
  'Post Report',
  'Insight Report',
  'GEO Ranking Report',
  'Citation Audit Report'
];

export const CustomNotificationsTab: React.FC = () => {
  const [notifications, setNotifications] = useState<CustomNotification[]>(CUSTOM_NOTIFICATIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState<CustomNotification | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    locationName: '',
    reportType: '',
    frequency: 'daily' as 'daily' | 'when-updated',
    recipients: ''
  });

  const filteredNotifications = notifications.filter(notification =>
    notification.locationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notification.recipients.some(email => email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddNotification = () => {
    const newNotification: CustomNotification = {
      id: Date.now().toString(),
      locationName: formData.locationName,
      reportType: formData.reportType,
      frequency: formData.frequency,
      recipients: formData.recipients.split(',').map(email => email.trim()),
      status: 'active'
    };
    
    setNotifications(prev => [...prev, newNotification]);
    setFormData({ locationName: '', reportType: '', frequency: 'daily', recipients: '' });
    setIsAddModalOpen(false);
  };

  const handleEditNotification = (notification: CustomNotification) => {
    setEditingNotification(notification);
    setFormData({
      locationName: notification.locationName,
      reportType: notification.reportType,
      frequency: notification.frequency,
      recipients: notification.recipients.join(', ')
    });
  };

  const handleUpdateNotification = () => {
    if (!editingNotification) return;
    
    setNotifications(prev => prev.map(notification =>
      notification.id === editingNotification.id
        ? {
            ...notification,
            locationName: formData.locationName,
            reportType: formData.reportType,
            frequency: formData.frequency,
            recipients: formData.recipients.split(',').map(email => email.trim())
          }
        : notification
    ));
    
    setEditingNotification(null);
    setFormData({ locationName: '', reportType: '', frequency: 'daily', recipients: '' });
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const toggleNotificationStatus = (id: string) => {
    setNotifications(prev => prev.map(notification =>
      notification.id === id
        ? { ...notification, status: notification.status === 'active' ? 'paused' : 'active' }
        : notification
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by location or recipient..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
        </div>
        
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Custom Recipient
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Custom Notification</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="location">Location Name</Label>
                <Input
                  id="location"
                  value={formData.locationName}
                  onChange={(e) => setFormData(prev => ({ ...prev, locationName: e.target.value }))}
                  placeholder="Enter location name"
                />
              </div>
              
              <div>
                <Label htmlFor="report-type">Report Type</Label>
                <Select 
                  value={formData.reportType} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, reportType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    {REPORT_TYPES.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="frequency">Frequency</Label>
                <Select 
                  value={formData.frequency} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="when-updated">When Updated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="recipients">Email Recipients</Label>
                <Textarea
                  id="recipients"
                  value={formData.recipients}
                  onChange={(e) => setFormData(prev => ({ ...prev, recipients: e.target.value }))}
                  placeholder="Enter email addresses separated by commas"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Separate multiple email addresses with commas
                </p>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddNotification} disabled={!formData.locationName || !formData.reportType || !formData.recipients}>
                  Add Notification
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Location Name</TableHead>
              <TableHead>Report Type</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead>Recipients</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Sent</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredNotifications.map((notification) => (
              <TableRow key={notification.id}>
                <TableCell>
                  <div className="font-medium">{notification.locationName}</div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{notification.reportType}</span>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="secondary"
                    className={notification.frequency === 'daily' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}
                  >
                    {notification.frequency === 'daily' ? 'Daily' : 'When Updated'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {notification.recipients.map((email, index) => (
                      <div key={index} className="text-muted-foreground">{email}</div>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => toggleNotificationStatus(notification.id)}
                    className="cursor-pointer"
                  >
                    <Badge 
                      variant="secondary"
                      className={notification.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}
                    >
                      {notification.status}
                    </Badge>
                  </button>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {notification.lastSent || 'Never'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditNotification(notification)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Edit Custom Notification</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="edit-location">Location Name</Label>
                            <Input
                              id="edit-location"
                              value={formData.locationName}
                              onChange={(e) => setFormData(prev => ({ ...prev, locationName: e.target.value }))}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="edit-report-type">Report Type</Label>
                            <Select 
                              value={formData.reportType} 
                              onValueChange={(value) => setFormData(prev => ({ ...prev, reportType: value }))}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {REPORT_TYPES.map(type => (
                                  <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label htmlFor="edit-frequency">Frequency</Label>
                            <Select 
                              value={formData.frequency} 
                              onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value as any }))}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="when-updated">When Updated</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label htmlFor="edit-recipients">Email Recipients</Label>
                            <Textarea
                              id="edit-recipients"
                              value={formData.recipients}
                              onChange={(e) => setFormData(prev => ({ ...prev, recipients: e.target.value }))}
                              rows={3}
                            />
                          </div>
                          
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setEditingNotification(null)}>
                              Cancel
                            </Button>
                            <Button onClick={handleUpdateNotification}>
                              Update
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteNotification(notification.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredNotifications.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No custom notifications found.</p>
          <p className="text-sm text-muted-foreground mt-1">
            {searchTerm ? 'Try adjusting your search terms.' : 'Add your first custom notification above.'}
          </p>
        </div>
      )}
    </div>
  );
};