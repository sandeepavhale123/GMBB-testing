import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
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
import { Switch } from "../ui/switch";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useTeam } from "../../hooks/useTeam";
import { useToast } from "../../hooks/use-toast";
import { updateEditMember } from "../../store/slices/teamSlice";

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
  const { memberId } = useParams<{ memberId: string }>();
  const { toast } = useToast();
  const {
    currentEditMember,
    isLoadingEdit,
    isUpdating,
    editError,
    updateError,
    getEditMember,
    updateTeamMember,
    clearTeamEditError,
    clearTeamUpdateError
  } = useTeam();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [allowListingAccess, setAllowListingAccess] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState("all");
  const [listingToggles, setListingToggles] = useState<Record<string, boolean>>({});
  const [permissionSettings, setPermissionSettings] = useState<Record<string, string>>({});

  // Load member data when modal opens or memberId changes
  useEffect(() => {
    if (open && memberId) {
      getEditMember({ id: parseInt(memberId) });
    }
  }, [open, memberId, getEditMember]);

  // Update form data when currentEditMember changes
  useEffect(() => {
    if (currentEditMember) {
      setFormData({
        firstName: currentEditMember.firstName || "",
        lastName: currentEditMember.lastName || "",
        email: currentEditMember.username || "", // Map username to email
        password: "",
        role: currentEditMember.role || "",
      });
      
      // Initialize listing toggles
      const initialToggles: Record<string, boolean> = {};
      mockListings.forEach(listing => {
        initialToggles[listing.id] = listing.enabled;
      });
      setListingToggles(initialToggles);

      // Initialize permissions (default to "View")
      const initialPermissions: Record<string, string> = {};
      permissions.forEach(permission => {
        initialPermissions[permission] = "View";
      });
      setPermissionSettings(initialPermissions);
    }
  }, [currentEditMember]);

  // Handle errors
  useEffect(() => {
    if (editError) {
      toast({
        title: "Error",
        description: editError,
        variant: "destructive",
      });
      clearTeamEditError();
    }
  }, [editError, toast, clearTeamEditError]);

  useEffect(() => {
    if (updateError) {
      toast({
        title: "Error",
        description: updateError,
        variant: "destructive",
      });
      clearTeamUpdateError();
    }
  }, [updateError, toast, clearTeamUpdateError]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleListingToggle = (listingId: string) => {
    setListingToggles(prev => ({
      ...prev,
      [listingId]: !prev[listingId]
    }));
  };

  const handlePermissionChange = (permission: string, level: string) => {
    setPermissionSettings(prev => ({
      ...prev,
      [permission]: level
    }));
  };

  const filteredListings = selectedAccount === "all" 
    ? mockListings 
    : mockListings.filter(listing => listing.account === selectedAccount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentEditMember) return;

    try {
      const updateData = {
        id: parseInt(currentEditMember.id),
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.email, // Map email back to username
        role: formData.role,
        ...(formData.password && { password: formData.password }), // Only include password if provided
      };

      const result = await updateTeamMember(updateData);
      
      if (updateEditMember.fulfilled.match(result)) {
        toast({
          title: "Success",
          description: "Team member updated successfully",
        });
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Failed to update team member:", error);
    }
  };

  if (!member && !memberId) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Team Member</DialogTitle>
        </DialogHeader>

        {isLoadingEdit ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading member details...</span>
          </div>
        ) : (
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Edit Profile</TabsTrigger>
              <TabsTrigger value="listings">Listings</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      placeholder="Enter first name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      placeholder="Enter last name"
                      required
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email ID</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter email address"
                    required
                  />
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
                      placeholder="Enter new password (leave empty to keep current)"
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
                    disabled={isUpdating}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isUpdating}>
                    {isUpdating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="listings" className="space-y-4">
              {/* Allow Listing Access Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">Allow Listing Access</h3>
                  <p className="text-sm text-gray-600">Enable or disable access to listings</p>
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
                    <Select value={selectedAccount} onValueChange={setSelectedAccount}>
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
                      <div key={listing.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{listing.name}</div>
                          <div className="text-sm text-gray-500">{listing.account}</div>
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
                    <div key={permission} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="font-medium text-sm">{permission}</span>
                      <Select
                        value={permissionSettings[permission] || "View"}
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
              </div>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};