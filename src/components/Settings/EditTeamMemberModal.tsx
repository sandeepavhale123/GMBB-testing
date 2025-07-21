import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Switch } from "../ui/switch";
import { Upload, Eye, EyeOff } from "lucide-react";

interface EditTeamMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: any;
}

const permissions = [
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
  "GEO Ranking",
];

const mockListings = [
  { id: "1", name: "Restaurant ABC", account: "Account 1", enabled: true },
  { id: "2", name: "Coffee Shop XYZ", account: "Account 1", enabled: false },
  { id: "3", name: "Bakery 123", account: "Account 2", enabled: true },
];

export const EditTeamMemberModal: React.FC<EditTeamMemberModalProps> = ({
  open,
  onOpenChange,
  member,
}) => {
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
  const [allowListingAccess, setAllowListingAccess] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState("all");
  const [listingToggles, setListingToggles] = useState<Record<string, boolean>>(
    {}
  );
  const [permissionSettings, setPermissionSettings] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    if (member) {
      setFormData({
        firstName: member.firstName || "",
        lastName: member.lastName || "",
        email: member.email || "",
        password: member.password || "",
        role: member.role || "",
        profilePicture: member.profilePicture || "",
      });
      setProfilePreview(member.profilePicture || "");

      // Initialize listing toggles
      const initialToggles: Record<string, boolean> = {};
      mockListings.forEach((listing) => {
        initialToggles[listing.id] = listing.enabled;
      });
      setListingToggles(initialToggles);

      // Initialize permissions (default to "View")
      const initialPermissions: Record<string, string> = {};
      permissions.forEach((permission) => {
        initialPermissions[permission] = "View";
      });
      setPermissionSettings(initialPermissions);
    }
  }, [member]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProfileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfilePreview(result);
        setFormData((prev) => ({ ...prev, profilePicture: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleListingToggle = (listingId: string) => {
    setListingToggles((prev) => ({
      ...prev,
      [listingId]: !prev[listingId],
    }));
  };

  const handlePermissionChange = (permission: string, level: string) => {
    setPermissionSettings((prev) => ({
      ...prev,
      [permission]: level,
    }));
  };

  const filteredListings =
    selectedAccount === "all"
      ? mockListings
      : mockListings.filter((listing) => listing.account === selectedAccount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // console.log("Updating team member:", {
    //   ...formData,
    //   allowListingAccess,
    //   listingToggles,
    //   permissionSettings
    // });
    onOpenChange(false);
  };

  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Team Member</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Edit Profile</TabsTrigger>
            <TabsTrigger value="listings">Listings</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Profile Picture Upload */}
              <div className="flex flex-col items-center space-y-2">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profilePreview} />
                  <AvatarFallback className="bg-gray-100 text-gray-400">
                    {formData.firstName && formData.lastName ? (
                      `${formData.firstName[0]}${formData.lastName[0]}`
                    ) : (
                      <Upload className="h-8 w-8" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <Label htmlFor="profile-upload" className="cursor-pointer">
                  <Input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleProfileUpload}
                    className="hidden"
                  />
                  <Button type="button" variant="outline" size="sm">
                    Change Photo
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
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    placeholder="Enter first name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    placeholder="Enter last name"
                    required
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
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    placeholder="Enter new password"
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
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleInputChange("role", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Moderator">Moderator</SelectItem>
                    <SelectItem value="Staff">Staff</SelectItem>
                    <SelectItem value="Client">Client</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Save Changes
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="listings" className="space-y-4">
            {/* Allow Listing Access Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium">Allow Listing Access</h3>
                <p className="text-sm text-gray-600">
                  Enable or disable access to listings
                </p>
              </div>
              <Switch
                checked={allowListingAccess}
                onCheckedChange={setAllowListingAccess}
              />
            </div>

            {allowListingAccess && (
              <>
                {/* Account Filter */}
                <div className="space-y-2">
                  <Label>Filter by Account</Label>
                  <Select
                    value={selectedAccount}
                    onValueChange={setSelectedAccount}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Accounts</SelectItem>
                      <SelectItem value="Account 1">Account 1</SelectItem>
                      <SelectItem value="Account 2">Account 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Listings List */}
                <div className="space-y-3">
                  <h3 className="font-medium">Listings</h3>
                  {filteredListings.map((listing) => (
                    <div
                      key={listing.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{listing.name}</div>
                        <div className="text-sm text-gray-500">
                          {listing.account}
                        </div>
                      </div>
                      <Switch
                        checked={listingToggles[listing.id] || false}
                        onCheckedChange={() => handleListingToggle(listing.id)}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="permissions" className="space-y-4">
            <div className="space-y-3">
              <h3 className="font-medium">Feature Permissions</h3>
              <p className="text-sm text-gray-600">
                Control access levels for each feature: View, Edit, or Hide
              </p>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {permissions.map((permission) => (
                  <div
                    key={permission}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <span className="font-medium text-sm">{permission}</span>
                    <Select
                      value={permissionSettings[permission] || "View"}
                      onValueChange={(value) =>
                        handlePermissionChange(permission, value)
                      }
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
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
