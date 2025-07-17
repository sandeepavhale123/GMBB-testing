import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { useTeam } from "@/hooks/useTeam";
import { useToast } from "@/hooks/use-toast";
import { updateEditMember } from "@/store/slices/teamSlice";

interface EditFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

export const EditTeamMemberSettings: React.FC = () => {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const {
    currentEditMember,
    isLoadingEdit,
    isSavingEdit,
    editError,
    saveError,
    fetchEditTeamMember,
    updateTeamMember,
    clearTeamEditError,
    clearTeamSaveError
  } = useTeam();

  const [formData, setFormData] = useState<EditFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const fetchedMemberIdRef = useRef<number | null>(null);

  // Fetch member data on component mount
  useEffect(() => {
    const memberIdNumber = parseInt(memberId || '0');
    if (memberId && memberIdNumber && fetchedMemberIdRef.current !== memberIdNumber) {
      fetchedMemberIdRef.current = memberIdNumber;
      fetchEditTeamMember(memberIdNumber);
    }
  }, [memberId, fetchEditTeamMember]);

  // Update form data when member data is loaded
  useEffect(() => {
    if (currentEditMember) {
      setFormData({
        firstName: currentEditMember.firstName || "",
        lastName: currentEditMember.lastName || "",
        email: currentEditMember.username || "", // Map username to email
        password: currentEditMember.password || "",
        role: currentEditMember.role || ""
      });
    }
  }, [currentEditMember]);

  // Clear errors and reset fetch ref when component unmounts
  useEffect(() => {
    return () => {
      clearTeamEditError();
      clearTeamSaveError();
      fetchedMemberIdRef.current = null;
    };
  }, [clearTeamEditError, clearTeamSaveError]);

  const handleInputChange = (field: keyof EditFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!memberId || !currentEditMember) return;

    try {
      const updateData = {
        Id: parseInt(memberId),
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.email, // Map email back to username
        role: formData.role,
        ...(formData.password && { password: formData.password }) // Only include password if provided
      };

      const result = await updateTeamMember(updateData);
      
      if (updateEditMember.fulfilled.match(result)) {
        toast({
          title: "Success",
          description: "Team member updated successfully",
        });
        setHasChanges(false);
        navigate("/settings/team-members");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update team member",
        variant: "destructive",
      });
    }
  };

  const handleBack = () => {
    navigate("/settings/team-members");
  };

  // Show loading state
  if (isLoadingEdit) {
    return (
      <div className="p-4 sm:p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading team member...</span>
        </div>
      </div>
    );
  }

  // Show error state
  if (editError) {
    return (
      <div className="p-4 sm:p-6 max-w-6xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-destructive mb-4">{editError}</p>
              <Button onClick={handleBack} variant="outline">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Team Members
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentEditMember) {
    return (
      <div className="p-4 sm:p-6 max-w-6xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">Team member not found</p>
              <Button onClick={handleBack} variant="outline">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Team Members
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      {/* Back Button */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-4"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Team Members
        </Button>
      </div>

      {/* Header Card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            {/* Name and Role */}
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                {formData.firstName} {formData.lastName}
              </h1>
              <Badge variant="secondary" className="mt-1">
                {formData.role}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Tab Only */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="listing">Listing</TabsTrigger>
          <TabsTrigger value="permission">Permission</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Edit Team Member</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {saveError && (
                <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <p className="text-destructive text-sm">{saveError}</p>
                </div>
              )}

              {/* Form Fields */}
              <div className="grid grid-cols-2 gap-6">
                {/* First Row */}
                <div>
                  <Label htmlFor="firstName">First name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="mt-1"
                    disabled={isSavingEdit}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="mt-1"
                    disabled={isSavingEdit}
                  />
                </div>

                {/* Second Row */}
                <div>
                  <Label htmlFor="email">Email Id</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="mt-1"
                    disabled={isSavingEdit}
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
                      className="pr-10"
                      placeholder="Leave empty to keep current password"
                      disabled={isSavingEdit}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isSavingEdit}
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
                  <Label htmlFor="role">Select Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => handleInputChange('role', value)}
                    disabled={isSavingEdit}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
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
              <div className="flex justify-end mt-8">
                <Button 
                  onClick={handleSave} 
                  className="px-8"
                  disabled={isSavingEdit || !hasChanges}
                >
                  {isSavingEdit ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="listing" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Listing Management</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground">Listing management functionality will be implemented here using your existing APIs.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permission" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Permission Management</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground">Permission management functionality will be implemented here using your existing APIs.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};