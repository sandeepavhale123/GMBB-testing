
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Edit, Clock, AlertCircle, MoreVertical } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { EditableBusinessHours } from "./EditableBusinessHours";

export const BusinessManagement: React.FC = () => {
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("business-info");
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

  const [workingHours, setWorkingHours] = useState([
    { day: 'Monday', hours: '9:00 AM - 6:00 PM', isOpen: true },
    { day: 'Tuesday', hours: '9:00 AM - 6:00 PM', isOpen: true },
    { day: 'Wednesday', hours: '9:00 AM - 6:00 PM', isOpen: true },
    { day: 'Thursday', hours: '9:00 AM - 6:00 PM', isOpen: true },
    { day: 'Friday', hours: '9:00 AM - 6:00 PM', isOpen: true },
    { day: 'Saturday', hours: '10:00 AM - 4:00 PM', isOpen: true },
    { day: 'Sunday', hours: 'Closed', isOpen: false }
  ]);

  const [workingHoursDraft, setWorkingHoursDraft] = useState(workingHours);
  useEffect(() => {
    if (!editMode) {
      setWorkingHoursDraft(workingHours);
    }
  }, [editMode]);

  const editLogs = [
    { date: '2024-01-15', action: 'Updated business description', status: 'Published' },
    { date: '2024-01-10', action: 'Changed opening hours', status: 'Under Review' },
    { date: '2024-01-05', action: 'Added new category', status: 'Published' },
    { date: '2023-12-28', action: 'Updated contact information', status: 'Published' }
  ];

  const handleSave = () => {
    setEditMode(false);
    toast({
      title: "Changes saved",
      description: "Your business information was updated successfully.",
    });
    // Here you would typically save to backend
  };

  const handleCancel = () => {
    setEditMode(false);
    toast({
      title: "Edit cancelled",
      description: "Your changes were not saved.",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setBusinessData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveWorkingHours = (newHours: typeof workingHours) => {
    setWorkingHours(newHours);
    setEditMode(false);
    toast({
      title: "Changes saved",
      description: "Your business working hours were updated successfully.",
    });
  };

  const handleCancelWorkingHours = () => {
    setWorkingHoursDraft(workingHours);
    setEditMode(false);
    toast({
      title: "Edit cancelled",
      description: "Your working hours changes were not saved.",
    });
  };

  const handleEditWorkingHours = () => {
    setEditMode(true);
    setActiveTab("opening-hours");
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
            Management
            {editMode && (
              <span className="ml-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
                Editing
              </span>
            )}
          </h1>
          <p className="text-gray-500 text-sm">KSoft &rarr; Management</p>
        </div>
        <Button
          onClick={() => setEditMode(!editMode)}
          variant={editMode ? "secondary" : "default"}
          className={`hidden md:inline-flex`}
        >
          <Edit className="h-4 w-4 mr-2" />
          {editMode ? "Stop Editing" : "Edit"}
        </Button>
      </div>

      {/* Modern Google Business Profile Summary Card */}
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          {/* Main Profile Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
            {/* Left Section (col-4) - Single Row Layout */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-4">
                {/* Business Logo */}
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                  <div className="text-white font-bold text-lg">
                    KS
                  </div>
                </div>
                
                {/* Business Info and Stats */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg font-semibold text-gray-900">{businessData.name}</h2>
                    <Badge variant="default" className="bg-blue-600 text-white text-xs">✓</Badge>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">On Google</p>
                  
                  {/* Stats in single row with background */}
                  <div className="flex gap-4">
                    <Card className="bg-gray-50 p-1 rounded">
                      <CardContent>
                         <div className="text-center">
                            <div className="text-xl font-bold text-gray-900">{stats.profileViews}</div>
                            <div className="text-xs text-gray-600">Profile views</div>
                          </div>
                      </CardContent>
                    </Card>
                     <Card className="bg-gray-50 p-1 rounded">
                      <CardContent>
                         <div className="text-center">
                            <div className="text-xl font-bold text-gray-900">{stats.position}</div>
                            <div className="text-xs text-gray-600">Position</div>
                          </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section (col-8) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Visibility Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between w-[200px] ml-auto">
                  <span className="text-sm font-medium text-gray-700">Visibility</span>
                  <span className="text-sm font-bold text-gray-900">{stats.visibility}%</span>
                </div>
                <Progress value={stats.visibility} className="h-3 w-[200px] ml-auto" />
              </div>

              {/* Mobile Edit Button */}
              <div className="lg:hidden">
                <Button
                  onClick={() => setEditMode(!editMode)}
                  variant={editMode ? "secondary" : "default"}
                  className="w-full"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {editMode ? "Stop Editing" : "Edit"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <Tabs defaultValue="business-info" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 transition-all duration-200">
          <TabsTrigger
            value="business-info"
            className={activeTab === "business-info" ? "animate-fade-in" : ""}
          >
            Business Information
          </TabsTrigger>
          <TabsTrigger
            value="opening-hours"
            className={activeTab === "opening-hours" ? "animate-fade-in" : ""}
          >
            Opening Hours
          </TabsTrigger>
          <TabsTrigger
            value="edit-log"
            className={activeTab === "edit-log" ? "animate-fade-in" : ""}
          >
            Edit Log
          </TabsTrigger>
        </TabsList>

        <TabsContent value="business-info" className="space-y-6 animate-fade-in">
          <Card className="relative">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-bold">Business Information</CardTitle>
              {!editMode && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditMode(true)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
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
            </CardContent>
            {editMode && (
              <div className="sticky z-10 flex justify-end gap-4 bg-gradient-to-t from-white to-white/70 backdrop-blur bottom-0 py-4 px-6 rounded-b-lg w-full border-t border-gray-100 mt-2">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  Save Changes
                </Button>
              </div>
            )}
          </Card>

          {/* Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800">Notice</h4>
                <p className="text-sm text-yellow-700">
                  Please note Google may review edits for quality and can take up to 3 days to be published.{' '}
                  <a href="#" className="text-blue-600 underline">Learn more.</a>
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="opening-hours" className="space-y-6 animate-fade-in">
          <EditableBusinessHours
            initialWorkingHours={editMode ? workingHoursDraft : workingHours}
            editMode={editMode}
            onSave={handleSaveWorkingHours}
            onCancel={handleCancelWorkingHours}
            onEdit={handleEditWorkingHours}
          />
        </TabsContent>

        <TabsContent value="edit-log" className="space-y-6 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold">Edit Log</CardTitle>
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
