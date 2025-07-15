import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Upload, Eye, EyeOff, ArrowLeft, Save } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Checkbox } from "../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

// Mock data for team member
const mockMember = {
  id: "1",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  profilePicture: "",
  role: "Moderator",
  password: "••••••••",
  listingsCount: 25,
  isActive: true,
};

// Mock data for listings
const mockListings = [
  { id: "1", name: "Business Location A", enabled: true },
  { id: "2", name: "Business Location B", enabled: false },
  { id: "3", name: "Business Location C", enabled: true },
];

// Mock data for accounts
const mockAccounts = [
  { id: "1", name: "Main Account" },
  { id: "2", name: "Secondary Account" },
];

// Mock permissions structure
const mockPermissions = {
  "Manage Google Account": { level: "View" },
  "Manage GMB Tags": { level: "Edit" },
  "Bulk Actions": { level: "Hide" },
  "Manage Reports": { level: "View" },
  "Social Media": { level: "Edit" },
  "Gallery": { level: "View" },
  "RSS Feed": { level: "Hide" },
  "Reputation": { level: "Edit" },
  "Lead Dashboard": { level: "View" },
  "Proposal": { level: "Edit" },
  "To-Do List": { level: "View" },
  "Performance Report": { level: "Edit" },
  "Genie Module": { level: "Hide" },
  "Posts": { level: "Edit" },
  "Media": { level: "View" },
  "Reviews": { level: "Edit" },
  "Q&A": { level: "View" },
  "Insights": { level: "Edit" },
  "Management": { level: "View" },
  "Ranking": { level: "Edit" },
  "Competitor Analysis": { level: "View" },
  "Refer & Earn": { level: "Hide" },
  "Whitelabel Section": { level: "Edit" },
  "My Team": { level: "View" },
  "Pricing": { level: "Hide" },
  "API Key & Documentation": { level: "View" },
  "Razorpay & Stripe Integration": { level: "Edit" },
  "GEO Ranking": { level: "View" },
};

export const EditTeamMemberPage: React.FC = () => {
  const navigate = useNavigate();
  const { memberId } = useParams();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
    profilePicture: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [profilePreview, setProfilePreview] = useState<string>("");
  const [listingAccess, setListingAccess] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState("1");
  const [listingToggles, setListingToggles] = useState<Record<string, boolean>>({});
  const [permissions, setPermissions] = useState<Record<string, { level: string }>>(mockPermissions);

  // Initialize form data and states
  useEffect(() => {
    if (mockMember) {
      setFormData({
        firstName: mockMember.firstName,
        lastName: mockMember.lastName,
        email: mockMember.email,
        password: mockMember.password,
        role: mockMember.role,
        profilePicture: mockMember.profilePicture,
      });
      setProfilePreview(mockMember.profilePicture);
      
      // Initialize listing toggles
      const toggles: Record<string, boolean> = {};
      mockListings.forEach(listing => {
        toggles[listing.id] = listing.enabled;
      });
      setListingToggles(toggles);
    }
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProfileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfilePreview(result);
        setFormData(prev => ({ ...prev, profilePicture: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleListingToggle = (listingId: string) => {
    setListingToggles(prev => ({
      ...prev,
      [listingId]: !prev[listingId]
    }));
  };

  const handlePermissionChange = (permission: string, level: string) => {
    setPermissions(prev => ({
      ...prev,
      [permission]: { level }
    }));
  };

  const handleSaveProfile = () => {
    console.log("Saving profile:", formData);
    // Handle profile save logic here
  };

  const handleSaveListings = () => {
    console.log("Saving listings:", { listingAccess, selectedAccount, listingToggles });
    // Handle listings save logic here
  };

  const handleSavePermissions = () => {
    console.log("Saving permissions:", permissions);
    // Handle permissions save logic here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/settings/team-members")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Team Members
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Team Member</h1>
              <p className="text-sm text-gray-500">
                {formData.firstName} {formData.lastName}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Vertical Tabs Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <Tabs defaultValue="profile" orientation="vertical" className="w-full">
            <TabsList className="grid w-full grid-rows-3 h-auto bg-transparent p-4 gap-2">
              <TabsTrigger
                value="profile"
                className="w-full justify-start text-left data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
              >
                Edit Profile
              </TabsTrigger>
              <TabsTrigger
                value="listings"
                className="w-full justify-start text-left data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
              >
                Listings
              </TabsTrigger>
              <TabsTrigger
                value="permissions"
                className="w-full justify-start text-left data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
              >
                Permissions
              </TabsTrigger>
            </TabsList>

            {/* Content Area */}
            <div className="flex-1">
              <TabsContent value="profile" className="mt-0 p-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Profile Picture Upload */}
                    <div className="flex flex-col items-center space-y-4">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={profilePreview} />
                        <AvatarFallback className="bg-gray-100 text-gray-400">
                          <Upload className="h-8 w-8" />
                        </AvatarFallback>
                      </Avatar>
                      <Input
                        id="profile-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleProfileUpload}
                        className="hidden"
                      />
                      <Label htmlFor="profile-upload" className="cursor-pointer">
                        <Button type="button" variant="outline" size="sm" asChild>
                          <span>Change Photo</span>
                        </Button>
                      </Label>
                    </div>

                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          placeholder="Enter first name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          placeholder="Enter last name"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
                          placeholder="Enter password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Role */}
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Moderator">Moderator</SelectItem>
                          <SelectItem value="Staff">Staff</SelectItem>
                          <SelectItem value="Client">Client</SelectItem>
                          <SelectItem value="Lead Generator">Lead Generator</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Save Button */}
                    <Button onClick={handleSaveProfile} className="w-full">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="listings" className="mt-0 p-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Listing Access</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Allow Listing Access Toggle */}
                    <div className="flex items-center justify-between">
                      <Label htmlFor="listing-access">Allow Listing Access</Label>
                      <Switch
                        id="listing-access"
                        checked={listingAccess}
                        onCheckedChange={setListingAccess}
                      />
                    </div>

                    {listingAccess && (
                      <>
                        {/* Account Filter */}
                        <div className="space-y-2">
                          <Label>Filter to select account</Label>
                          <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select account" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockAccounts.map((account) => (
                                <SelectItem key={account.id} value={account.id}>
                                  {account.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Listings with On/Off toggles */}
                        <div className="space-y-4">
                          <Label>Show listings with On/Off toggle per listing</Label>
                          <div className="space-y-3">
                            {mockListings.map((listing) => (
                              <div key={listing.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="text-sm font-medium">{listing.name}</span>
                                <Switch
                                  checked={listingToggles[listing.id] || false}
                                  onCheckedChange={() => handleListingToggle(listing.id)}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Save Button */}
                    <Button onClick={handleSaveListings} className="w-full">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="permissions" className="mt-0 p-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Feature Permissions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      {Object.entries(permissions).map(([permission, config]) => (
                        <div key={permission} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium">{permission}</span>
                          <Select
                            value={config.level}
                            onValueChange={(value) => handlePermissionChange(permission, value)}
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="View">View</SelectItem>
                              <SelectItem value="Edit">Edit</SelectItem>
                              <SelectItem value="Hide">Hide</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>

                    {/* Save Button */}
                    <Button onClick={handleSavePermissions} className="w-full">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};