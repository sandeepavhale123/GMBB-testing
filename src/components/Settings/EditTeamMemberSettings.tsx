import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Upload, ChevronLeft, Building2 } from "lucide-react";
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  profilePicture?: string;
  password?: string;
}

interface ListingAccess {
  listingId: string;
  name: string;
  account: string;
  enabled: boolean;
}

interface Permission {
  feature: string;
  access: 'view' | 'edit' | 'hide';
}

interface Permissions {
  allowListingAccess: boolean;
  listings: ListingAccess[];
  selectedAccount: string;
  features: Permission[];
}

export const EditTeamMemberSettings: React.FC = () => {
  const { memberId } = useParams();
  const navigate = useNavigate();
  
  // Mock data - replace with actual API call
  const [member, setMember] = useState<TeamMember>({
    id: memberId || "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    role: "Moderator",
    password: "password123"
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);

  // Mock accounts and listings data
  const mockAccounts = [
    { id: "1", name: "Main Account", listingsCount: 12 },
    { id: "2", name: "Secondary Account", listingsCount: 8 },
    { id: "3", name: "Enterprise Account", listingsCount: 25 }
  ];

  const mockListings = [
    { listingId: "1", name: "Downtown Restaurant", account: "Main Account", enabled: true },
    { listingId: "2", name: "Uptown Cafe", account: "Main Account", enabled: false },
    { listingId: "3", name: "City Mall Store", account: "Secondary Account", enabled: true },
    { listingId: "4", name: "Suburban Branch", account: "Secondary Account", enabled: true },
  ];

  const featuresList = [
    "Manage Google Account",
    "Manage GMB Tags", 
    "Bulk Actions",
    "Manage Reports",
    "Social Media",
    "Gallery",
    "RSS Feed",
    "Reputation",
    "Lead Dashboard",
    "Proposal",
    "To-Do List",
    "Performance Report",
    "Genie Module",
    "Posts",
    "Media",
    "Reviews",
    "Q&A",
    "Insights",
    "Management",
    "Ranking",
    "Competitor Analysis",
    "Refer & Earn",
    "Whitelabel Section",
    "My Team",
    "Pricing",
    "API Key & Documentation",
    "Razorpay & Stripe Integration",
    "GEO Ranking"
  ];

  const [permissions, setPermissions] = useState<Permissions>({
    allowListingAccess: true,
    listings: mockListings,
    selectedAccount: "all",
    features: featuresList.map(feature => ({ feature, access: 'view' as const }))
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfileImage(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setMember(prev => ({ ...prev, profilePicture: previewUrl }));
    }
  };

  const handleInputChange = (field: keyof TeamMember, value: string) => {
    setMember(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Save logic here
    console.log("Saving member:", member);
    console.log("Saving permissions:", permissions);
    navigate("/settings/team-members");
  };

  const handlePermissionChange = (featureIndex: number, access: 'view' | 'edit' | 'hide') => {
    setPermissions(prev => ({
      ...prev,
      features: prev.features.map((feature, index) => 
        index === featureIndex ? { ...feature, access } : feature
      )
    }));
  };

  const handleListingToggle = (listingId: string) => {
    setPermissions(prev => ({
      ...prev,
      listings: prev.listings.map(listing => 
        listing.listingId === listingId 
          ? { ...listing, enabled: !listing.enabled }
          : listing
      )
    }));
  };

  const filteredListings = permissions.selectedAccount === "all" 
    ? permissions.listings 
    : permissions.listings.filter(listing => 
        mockAccounts.find(acc => acc.name === listing.account)?.id === permissions.selectedAccount
      );

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      {/* Breadcrumb and Page Title */}
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/settings/team-members" className="flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" />
                Team Members
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit Team Member</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-3xl font-bold text-foreground mt-2">
          Edit Team Member
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage team member profile, listing access, and feature permissions
        </p>
      </div>

      {/* Header Card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            {/* Profile Picture */}
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={member.profilePicture} />
                <AvatarFallback className="text-2xl">
                  {member.firstName[0]}{member.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2">
                <Button
                  size="sm"
                  className="rounded-full w-8 h-8 p-0"
                  onClick={() => document.getElementById('profile-upload')?.click()}
                >
                  <Upload className="w-4 h-4" />
                </Button>
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
            </div>

            {/* Name and Role */}
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                {member.firstName} {member.lastName}
              </h1>
              <Badge variant="secondary" className="mt-1">
                {member.role}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="listings">Listings</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardContent className="p-6">
              {/* Upload Profile Picture Section */}
              <div className="mb-6">
                <Label className="text-sm font-medium">Profile Picture</Label>
                <div className="mt-2">
                  <Button
                    variant="outline"
                    className="h-32 w-48 border-dashed"
                    onClick={() => document.getElementById('profile-upload-main')?.click()}
                  >
                    <div className="text-center">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Upload Profile Picture</span>
                    </div>
                  </Button>
                  <input
                    id="profile-upload-main"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-2 gap-6">
                {/* First Row */}
                <div>
                  <Label htmlFor="firstName">First name</Label>
                  <Input
                    id="firstName"
                    value={member.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    value={member.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="mt-1"
                  />
                </div>

                {/* Second Row */}
                <div>
                  <Label htmlFor="email">Email Id</Label>
                  <Input
                    id="email"
                    type="email"
                    value={member.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={member.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="mt-1"
                  />
                </div>

                {/* Third Row */}
                <div className="col-span-1">
                  <Label htmlFor="role">Select Role</Label>
                  <Select
                    value={member.role}
                    onValueChange={(value) => handleInputChange('role', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Moderator">Moderator</SelectItem>
                      <SelectItem value="User">User</SelectItem>
                      <SelectItem value="Viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end mt-8">
                <Button onClick={handleSave} className="px-8">
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="listings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Listing Access Management</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {/* Allow Listing Access Toggle */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <Label className="text-base font-medium">Allow Listing Access</Label>
                  <p className="text-sm text-muted-foreground">Enable or disable access to business listings</p>
                </div>
                <Switch
                  checked={permissions.allowListingAccess}
                  onCheckedChange={(checked) => 
                    setPermissions(prev => ({ ...prev, allowListingAccess: checked }))
                  }
                />
              </div>

              <Separator className="mb-6" />

              {permissions.allowListingAccess && (
                <>
                  {/* Account Filter */}
                  <div className="mb-6">
                    <Label className="text-sm font-medium mb-2 block">Filter by Account</Label>
                    <Select
                      value={permissions.selectedAccount}
                      onValueChange={(value) => 
                        setPermissions(prev => ({ ...prev, selectedAccount: value }))
                      }
                    >
                      <SelectTrigger className="w-full max-w-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50">
                        <SelectItem value="all">All Accounts</SelectItem>
                        {mockAccounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.name} ({account.listingsCount} listings)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Listings List */}
                  <div>
                    <Label className="text-sm font-medium mb-4 block">Business Listings</Label>
                    <div className="space-y-4">
                      {filteredListings.map((listing) => (
                        <div key={listing.listingId} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Building2 className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{listing.name}</p>
                              <p className="text-sm text-muted-foreground">{listing.account}</p>
                            </div>
                          </div>
                          <Switch
                            checked={listing.enabled}
                            onCheckedChange={() => handleListingToggle(listing.listingId)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Feature-Level Permissions</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {permissions.features.map((permission, index) => (
                  <div key={permission.feature} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label className="font-medium">{permission.feature}</Label>
                    </div>
                    <Select
                      value={permission.access}
                      onValueChange={(value: 'view' | 'edit' | 'hide') => 
                        handlePermissionChange(index, value)
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50">
                        <SelectItem value="view">View</SelectItem>
                        <SelectItem value="edit">Edit</SelectItem>
                        <SelectItem value="hide">Hide</SelectItem>
                      </SelectContent>
                    </Select>
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