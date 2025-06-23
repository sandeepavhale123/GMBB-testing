
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Edit, Clock, AlertCircle, MoreVertical, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { EditableBusinessHours } from "./EditableBusinessHours";
import { useListingContext } from '@/context/ListingContext';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { fetchBusinessInfo, clearError } from '@/store/slices/businessInfoSlice';
import { transformBusinessInfo, transformWorkingHours, transformEditLogs } from '@/utils/businessDataTransform';
import type { TransformedBusinessData, TransformedWorkingHour } from '@/utils/businessDataTransform';

export const BusinessManagement: React.FC = () => {
  const { selectedListing } = useListingContext();
  const dispatch = useAppDispatch();
  const { data: businessInfoData, isLoading, error } = useAppSelector(state => state.businessInfo);

  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("business-info");
  const [businessData, setBusinessData] = useState<TransformedBusinessData>({
    name: '',
    address: '',
    phone: '',
    website: '',
    storeCode: '',
    category: '',
    additionalCategory: '',
    labels: '',
    appointmentUrl: '',
    mapUrl: '',
    description: ''
  });

  const [workingHours, setWorkingHours] = useState<TransformedWorkingHour[]>([]);
  const [workingHoursDraft, setWorkingHoursDraft] = useState<TransformedWorkingHour[]>([]);

  // Fetch business info when listing changes
  useEffect(() => {
    if (selectedListing?.id) {
      const listingId = parseInt(selectedListing.id);
      dispatch(fetchBusinessInfo({ listingId }));
    }
  }, [selectedListing?.id, dispatch]);

  // Update local state when API data changes
  useEffect(() => {
    if (businessInfoData) {
      const transformedData = transformBusinessInfo(businessInfoData.business_info);
      setBusinessData(transformedData);
      
      const transformedHours = transformWorkingHours(businessInfoData.working_hours);
      setWorkingHours(transformedHours);
      setWorkingHoursDraft(transformedHours);
    }
  }, [businessInfoData]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (!editMode) {
      setWorkingHoursDraft(workingHours);
    }
  }, [editMode, workingHours]);

  const handleRefresh = () => {
    if (selectedListing?.id) {
      const listingId = parseInt(selectedListing.id);
      dispatch(fetchBusinessInfo({ listingId }));
    }
  };

  const handleSave = () => {
    setEditMode(false);
    toast({
      title: "Changes saved",
      description: "Your business information was updated successfully."
    });
    // TODO: Implement API call to save business info
  };

  const handleCancel = () => {
    if (businessInfoData) {
      const transformedData = transformBusinessInfo(businessInfoData.business_info);
      setBusinessData(transformedData);
    }
    setEditMode(false);
    toast({
      title: "Edit cancelled",
      description: "Your changes were not saved."
    });
  };

  const handleInputChange = (field: keyof TransformedBusinessData, value: string) => {
    setBusinessData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveWorkingHours = (newHours: TransformedWorkingHour[]) => {
    setWorkingHours(newHours);
    setEditMode(false);
    toast({
      title: "Changes saved",
      description: "Your business working hours were updated successfully."
    });
    // TODO: Implement API call to save working hours
  };

  const handleCancelWorkingHours = () => {
    setWorkingHoursDraft(workingHours);
    setEditMode(false);
    toast({
      title: "Edit cancelled",
      description: "Your working hours changes were not saved."
    });
  };

  const handleEditWorkingHours = () => {
    setEditMode(true);
    setActiveTab("opening-hours");
  };

  if (!selectedListing) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            No Listing Selected
          </h2>
          <p className="text-gray-600">Please select a business listing to view management options.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Loading Business Information
          </h2>
          <p className="text-gray-600">Please wait while we fetch your business data...</p>
        </div>
      </div>
    );
  }

  const stats = businessInfoData?.statistics || { profile_views: 0, position: 0, visibility_score: 0 };
  const editLogs = businessInfoData ? transformEditLogs(businessInfoData.edit_logs) : [];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
            Management
            {editMode && <span className="ml-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
                Editing
              </span>}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleRefresh}
            variant="outline"
            disabled={isLoading}
            className="hidden md:inline-flex"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            onClick={() => setEditMode(!editMode)} 
            variant={editMode ? "secondary" : "default"} 
            className="hidden md:inline-flex"
          >
            <Edit className="h-4 w-4 mr-2" />
            {editMode ? "Stop Editing" : "Edit"}
          </Button>
        </div>
      </div>

      {/* Modern Google Business Profile Summary Card */}
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          {/* Main Profile Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
            {/* Left Section - Business Info */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-4">
                {/* Business Logo */}
                <div className="w-25 h-25 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                  <span className="text-white font-bold text-lg">
                    {businessData.name.charAt(0) || 'B'}
                  </span>
                </div>
                
                {/* Business Info and Stats */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-md font-semibold text-gray-900" style={{ marginBottom: '0px' }}>
                      {businessData.name || 'Business Name'}
                    </h2>
                    <Badge variant="default" className="bg-blue-600 text-white text-xs">✓</Badge>
                  </div>
                  <p className="text-gray-600 text-xs mb-3">On Google</p>
                  
                  {/* Stats in single row with background */}
                  <div className="flex gap-4 p-3">
                    <div className="text-center bg-grey-50 p-2 rounded bg-slate-200 text-center">
                      <div className="text-xl font-bold text-gray-900">{stats.profile_views}</div>
                      <div className="text-xs text-gray-600">Profile views</div>
                    </div>
                    <div className="text-center bg-grey-50 p-2 rounded bg-slate-200 w-[100px]">
                      <div className="text-xl font-bold text-gray-900">{stats.position}</div>
                      <div className="text-xs text-gray-600">Position</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Visibility */}
            <div className="lg:col-span-5 space-y-4">
              {/* Visibility Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between w-[200px] ml-auto">
                  <span className="text-sm font-medium text-gray-700">Visibility</span>
                  <span className="text-sm font-bold text-gray-900">{stats.visibility_score}%</span>
                </div>
                <Progress value={stats.visibility_score} className="h-3 w-[200px] ml-auto" />
              </div>

              {/* Mobile Action Buttons */}
              <div className="lg:hidden space-y-2">
                <Button onClick={handleRefresh} variant="outline" disabled={isLoading} className="w-full">
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button onClick={() => setEditMode(!editMode)} variant={editMode ? "secondary" : "default"} className="w-full">
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
          <TabsTrigger value="business-info" className={activeTab === "business-info" ? "animate-fade-in" : ""}>
            Business Information
          </TabsTrigger>
          <TabsTrigger value="opening-hours" className={activeTab === "opening-hours" ? "animate-fade-in" : ""}>
            Opening Hours
          </TabsTrigger>
          <TabsTrigger value="edit-log" className={activeTab === "edit-log" ? "animate-fade-in" : ""}>
            Edit Log
          </TabsTrigger>
        </TabsList>

        <TabsContent value="business-info" className="space-y-6 animate-fade-in">
          <Card className="relative">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-bold">Business Information</CardTitle>
              {!editMode && <Button variant="outline" size="sm" onClick={() => setEditMode(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={businessData.name} onChange={e => handleInputChange('name', e.target.value)} disabled={!editMode} />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={businessData.phone} onChange={e => handleInputChange('phone', e.target.value)} disabled={!editMode} />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" value={businessData.address} onChange={e => handleInputChange('address', e.target.value)} disabled={!editMode} rows={2} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" value={businessData.website} onChange={e => handleInputChange('website', e.target.value)} disabled={!editMode} />
                </div>
                <div>
                  <Label htmlFor="storeCode">Store code</Label>
                  <Input id="storeCode" value={businessData.storeCode} onChange={e => handleInputChange('storeCode', e.target.value)} disabled={!editMode} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" value={businessData.category} onChange={e => handleInputChange('category', e.target.value)} disabled={!editMode} />
                </div>
                <div>
                  <Label htmlFor="additionalCategory">Additional category</Label>
                  <Input id="additionalCategory" value={businessData.additionalCategory} onChange={e => handleInputChange('additionalCategory', e.target.value)} disabled={!editMode} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="labels">Labels</Label>
                  <Input id="labels" value={businessData.labels} onChange={e => handleInputChange('labels', e.target.value)} disabled={!editMode} />
                </div>
                <div>
                  <Label htmlFor="appointmentUrl">Appointment url</Label>
                  <Input id="appointmentUrl" value={businessData.appointmentUrl} onChange={e => handleInputChange('appointmentUrl', e.target.value)} disabled={!editMode} />
                </div>
              </div>
              <div>
                <Label htmlFor="mapUrl">Map url</Label>
                <Input id="mapUrl" value={businessData.mapUrl} onChange={e => handleInputChange('mapUrl', e.target.value)} disabled={!editMode} />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={businessData.description} onChange={e => handleInputChange('description', e.target.value)} disabled={!editMode} rows={6} />
              </div>
            </CardContent>
            {editMode && <div className="sticky z-10 flex justify-end gap-4 bg-gradient-to-t from-white to-white/70 backdrop-blur bottom-0 py-4 px-6 rounded-b-lg w-full border-t border-gray-100 mt-2">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  Save Changes
                </Button>
              </div>}
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
                {editLogs.length > 0 ? (
                  editLogs.map((log, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <div className="flex-1">
                        <p className="font-medium">{log.action}</p>
                        <p className="text-sm text-gray-500">{log.date}</p>
                      </div>
                      <Badge variant={log.status === 'Published' ? 'default' : 'secondary'} className={log.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {log.status}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No edit history available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
