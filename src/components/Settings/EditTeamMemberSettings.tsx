import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import { useTeam } from "@/hooks/useTeam";
import { toast } from "sonner";
import { Loader } from "@/components/ui/loader";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

export const EditTeamMemberSettings: React.FC = () => {
  const { memberId } = useParams();
  const navigate = useNavigate();
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

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch member data on component mount
  useEffect(() => {
    if (memberId) {
      getEditMember({ id: parseInt(memberId) });
    }
  }, [memberId, getEditMember]);

  // Update form data when currentEditMember changes
  useEffect(() => {
    if (currentEditMember) {
      setFormData({
        firstName: currentEditMember.firstName || "",
        lastName: currentEditMember.lastName || "",
        email: currentEditMember.username || "", // Map username to email
        password: "", // Don't prefill password
        role: currentEditMember.role || ""
      });
    }
  }, [currentEditMember]);

  // Handle errors
  useEffect(() => {
    if (editError) {
      toast.error(editError);
      clearTeamEditError();
    }
    if (updateError) {
      toast.error(updateError);
      clearTeamUpdateError();
    }
  }, [editError, updateError, clearTeamEditError, clearTeamUpdateError]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!memberId || !formData.firstName || !formData.lastName || !formData.email || !formData.role) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const updateData = {
        id: parseInt(memberId),
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.email, // Map email back to username
        role: formData.role,
        ...(formData.password && { password: formData.password }) // Only include password if provided
      };

      const result = await updateTeamMember(updateData);
      
      if (result.meta.requestStatus === 'fulfilled') {
        toast.success("Team member updated successfully");
        navigate("/settings/team-members");
      }
    } catch (error) {
      toast.error("Failed to update team member");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (isLoadingEdit) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  if (editError && !currentEditMember) {
    return (
      <div className="p-6 text-center">
        <p className="text-destructive">Error loading team member details</p>
        <Button 
          variant="outline" 
          onClick={() => navigate("/settings/team-members")}
          className="mt-4"
        >
          Back to Team Members
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/settings/team-members")}
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Team Members
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Edit Team Member
          </h1>
          {currentEditMember && (
            <p className="text-muted-foreground">
              {currentEditMember.firstName} {currentEditMember.lastName}
            </p>
          )}
        </div>
      </div>

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-6">
            {/* First Row */}
            <div>
              <Label htmlFor="firstName">First name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="mt-1"
                required
              />
            </div>

            {/* Second Row */}
            <div>
              <Label htmlFor="email">Email Id *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Leave blank to keep current password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Third Row */}
            <div className="col-span-1">
              <Label htmlFor="role">Select Role *</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleInputChange('role', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Moderator">Moderator</SelectItem>
                  <SelectItem value="Staff">Staff</SelectItem>
                  <SelectItem value="Client">Client</SelectItem>
                  <SelectItem value="Lead Generator">Lead Generator</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-4 mt-8">
            <Button 
              variant="outline" 
              onClick={() => navigate("/settings/team-members")}
              disabled={isLoading || isUpdating}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isLoading || isUpdating}
              className="px-8"
            >
              {(isLoading || isUpdating) ? (
                <>
                  <Loader className="w-4 h-4 mr-2" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

    </div>
  );
};