import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from "lucide-react";

interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  profilePicture?: string;
  password?: string;
}

export const EditTeamMemberPage: React.FC = () => {
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
    navigate("/settings/team-members");
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
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
            <CardContent className="p-6">
              <p className="text-muted-foreground">Listings management content will go here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">Permissions management content will go here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};