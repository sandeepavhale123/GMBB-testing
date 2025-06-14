
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Edit, Globe, Phone, MapPin, Clock, AlertCircle } from 'lucide-react';

export const BusinessManagement: React.FC = () => {
  const [editMode, setEditMode] = useState(false);
  const [businessData, setBusinessData] = useState({
    name: 'KSoft Solution',
    address: '26, 2nd Floor, Software Technology Parks of India, MIDC Industrial Area, Chhatrapati Sambhaji Nagar, Maharashtra 431006',
    phone: '097654 12319',
    website: 'https://ksoftsolution.com/',
    storeCode: '-',
    category: 'Digital Marketing Agency',
    additionalCategory: 'Website Development',
    labels: '-',
    appointmentUrl: '-',
    mapUrl: 'https://maps.google.com/maps?cid=10608805766938911470',
    description: 'KSoft Solution is a premier Digital Agency based in Aurangabad, Maharashtra, offering top-quality Website Design and Development services. Our expert team specializes in creating custom websites that drive business growth, increase online visibility, and enhance user experience. Leveraging advanced technologies and the latest industry trends, KSoft Solution delivers responsive, SEO-friendly websites tailored to meet your unique business needs. Our Aurangabad-based digital agency ensures robust website architecture, fast loading times, and seamless performance. Trust KSoft Solution for unparalleled website design and development that sets you apart in the competitive digital landscape.'
  });

  const stats = {
    profileViews: 302,
    position: 52,
    visibility: 50
  };

  const workingHours = [
    { day: 'Monday', hours: '9:00 AM - 6:00 PM', isOpen: true },
    { day: 'Tuesday', hours: '9:00 AM - 6:00 PM', isOpen: true },
    { day: 'Wednesday', hours: '9:00 AM - 6:00 PM', isOpen: true },
    { day: 'Thursday', hours: '9:00 AM - 6:00 PM', isOpen: true },
    { day: 'Friday', hours: '9:00 AM - 6:00 PM', isOpen: true },
    { day: 'Saturday', hours: '10:00 AM - 4:00 PM', isOpen: true },
    { day: 'Sunday', hours: 'Closed', isOpen: false }
  ];

  const editLogs = [
    { date: '2024-01-15', action: 'Updated business description', status: 'Published' },
    { date: '2024-01-10', action: 'Changed opening hours', status: 'Under Review' },
    { date: '2024-01-05', action: 'Added new category', status: 'Published' },
    { date: '2023-12-28', action: 'Updated contact information', status: 'Published' }
  ];

  const handleSave = () => {
    setEditMode(false);
    // Here you would typically save to backend
  };

  const handleInputChange = (field: string, value: string) => {
    setBusinessData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Management</h1>
          <p className="text-gray-600">KSoft → Management</p>
        </div>
      </div>

      {/* Business Profile Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start space-x-4">
              <div className="w-20 h-20 bg-gray-900 rounded-lg flex items-center justify-center">
                <div className="text-white font-bold text-lg">
                  <div className="grid grid-cols-2 gap-1">
                    <div className="w-2 h-2 bg-white rounded-sm"></div>
                    <div className="w-2 h-2 bg-white rounded-sm"></div>
                    <div className="w-2 h-2 bg-white rounded-sm"></div>
                    <div className="w-2 h-2 bg-white rounded-sm"></div>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <h2 className="text-xl font-semibold">{businessData.name}</h2>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">✓</Badge>
                </div>
                <p className="text-gray-600 text-sm">On Google</p>
              </div>
            </div>
            <Button 
              onClick={() => setEditMode(!editMode)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Edit GMB Access
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <div className="text-2xl font-bold">{stats.profileViews}</div>
              <div className="text-sm text-gray-600">Profile views</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.position}</div>
              <div className="text-sm text-gray-600">Position</div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Visibility</div>
                  <div className="text-lg font-semibold">{stats.visibility}%</div>
                </div>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${stats.visibility}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <Tabs defaultValue="business-info" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="business-info">Business Information</TabsTrigger>
          <TabsTrigger value="opening-hours">Opening Hours</TabsTrigger>
          <TabsTrigger value="edit-log">Edit Log</TabsTrigger>
        </TabsList>

        <TabsContent value="business-info" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Business Information</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditMode(!editMode)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={businessData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={!editMode}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={businessData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!editMode}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={businessData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  disabled={!editMode}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={businessData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    disabled={!editMode}
                  />
                </div>
                <div>
                  <Label htmlFor="storeCode">Store code</Label>
                  <Input
                    id="storeCode"
                    value={businessData.storeCode}
                    onChange={(e) => handleInputChange('storeCode', e.target.value)}
                    disabled={!editMode}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={businessData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    disabled={!editMode}
                  />
                </div>
                <div>
                  <Label htmlFor="additionalCategory">Additional category</Label>
                  <Input
                    id="additionalCategory"
                    value={businessData.additionalCategory}
                    onChange={(e) => handleInputChange('additionalCategory', e.target.value)}
                    disabled={!editMode}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="labels">Labels</Label>
                  <Input
                    id="labels"
                    value={businessData.labels}
                    onChange={(e) => handleInputChange('labels', e.target.value)}
                    disabled={!editMode}
                  />
                </div>
                <div>
                  <Label htmlFor="appointmentUrl">Appointment url</Label>
                  <Input
                    id="appointmentUrl"
                    value={businessData.appointmentUrl}
                    onChange={(e) => handleInputChange('appointmentUrl', e.target.value)}
                    disabled={!editMode}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="mapUrl">Map url</Label>
                <Input
                  id="mapUrl"
                  value={businessData.mapUrl}
                  onChange={(e) => handleInputChange('mapUrl', e.target.value)}
                  disabled={!editMode}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={businessData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  disabled={!editMode}
                  rows={6}
                />
              </div>

              {editMode && (
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setEditMode(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    Save Changes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800">Notice</h4>
                <p className="text-sm text-yellow-700">
                  Please note Google may be review edits for quality and can take up to 3 days to be published.{' '}
                  <a href="#" className="text-blue-600 underline">Learn more.</a>
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="opening-hours" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Opening Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workingHours.map((schedule, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="font-medium w-20">{schedule.day}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm ${schedule.isOpen ? 'text-green-600' : 'text-gray-500'}`}>
                        {schedule.hours}
                      </span>
                      <Badge variant={schedule.isOpen ? "default" : "secondary"}>
                        {schedule.isOpen ? 'Open' : 'Closed'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="edit-log" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Edit Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {editLogs.map((log, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex-1">
                      <p className="font-medium">{log.action}</p>
                      <p className="text-sm text-gray-500">{log.date}</p>
                    </div>
                    <Badge 
                      variant={log.status === 'Published' ? 'default' : 'secondary'}
                      className={log.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                    >
                      {log.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
