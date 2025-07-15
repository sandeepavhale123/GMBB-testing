import React, { useState, useMemo } from "react";
import { Search, Plus, Grid3X3, List, Users, Eye, Edit, Trash2, Share2, EyeOff } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { AddTeamMemberModal } from "./AddTeamMemberModal";
import { EditTeamMemberModal } from "./EditTeamMemberModal";
import { DeleteTeamMemberModal } from "./DeleteTeamMemberModal";
import { ShareableLinkModal } from "./ShareableLinkModal";
import { TeamMemberCard } from "./TeamMemberCard";

// Mock data for team members
const mockTeamMembers = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    profilePicture: "",
    role: "Moderator",
    password: "••••••••",
    listingsCount: 25,
    isActive: true,
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    profilePicture: "",
    role: "Staff",
    password: "••••••••",
    listingsCount: 18,
    isActive: true,
  },
  {
    id: "3",
    firstName: "Mike",
    lastName: "Johnson",
    email: "mike.johnson@example.com",
    profilePicture: "",
    role: "Client",
    password: "••••••••",
    listingsCount: 12,
    isActive: false,
  },
];

const roleColors = {
  Moderator: "bg-purple-100 text-purple-700 border-purple-200",
  Staff: "bg-blue-100 text-blue-700 border-blue-200",
  Client: "bg-green-100 text-green-700 border-green-200",
  "Lead Generator": "bg-orange-100 text-orange-700 border-orange-200",
};

export const TeamMembersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  // Filter team members based on search and role
  const filteredMembers = useMemo(() => {
    return mockTeamMembers.filter((member) => {
      const matchesSearch = 
        member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = roleFilter === "all" || member.role === roleFilter;
      
      return matchesSearch && matchesRole;
    });
  }, [searchTerm, roleFilter]);

  const handleEditMember = (member: any) => {
    setSelectedMember(member);
    setShowEditModal(true);
  };

  const handleDeleteMember = (member: any) => {
    setSelectedMember(member);
    setShowDeleteModal(true);
  };

  const handleShareLink = (member: any) => {
    setSelectedMember(member);
    setShowShareModal(true);
  };

  const togglePasswordVisibility = (memberId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [memberId]: !prev[memberId]
    }));
  };

  const getRoleBadgeClass = (role: string) => {
    return roleColors[role as keyof typeof roleColors] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      {/* Page Title */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Manage Team Members
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Add, edit, and manage your team members with role-based permissions and access control.
        </p>
      </div>

      {/* Top Controls Panel */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full lg:w-auto">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Role Filter */}
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Moderator">Moderator</SelectItem>
                <SelectItem value="Staff">Staff</SelectItem>
                <SelectItem value="Client">Client</SelectItem>
                <SelectItem value="Lead Generator">Lead Generator</SelectItem>
              </SelectContent>
            </Select>

            {/* Total Members Badge */}
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1 w-fit"
            >
              Total Members: {filteredMembers.length}
            </Badge>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto justify-between">
            {/* View Switcher */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-8 w-8 p-0"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="h-8 w-8 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Add Team Member Button */}
            <Button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Team Member</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Team Members Display */}
      {filteredMembers.length > 0 ? (
        <>
          {viewMode === "list" ? (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-900">
                      Team Member
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900 text-center">
                      Role
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900 text-center">
                      Password
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900 text-center">
                      No. of Listings
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900 text-center">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.map((member) => (
                    <TableRow key={member.id} className="hover:bg-gray-50">
                      <TableCell className="p-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={member.profilePicture} />
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              {member.firstName[0]}{member.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-gray-900">
                              {member.firstName} {member.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {member.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="outline"
                          className={getRoleBadgeClass(member.role)}
                        >
                          {member.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-sm text-gray-600">
                            {showPasswords[member.id] ? "password123" : member.password}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => togglePasswordVisibility(member.id)}
                            className="h-6 w-6 p-0"
                          >
                            {showPasswords[member.id] ? (
                              <EyeOff className="h-3 w-3" />
                            ) : (
                              <Eye className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-sm font-medium">{member.listingsCount}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditMember(member)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteMember(member)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleShareLink(member)}
                            className="h-8 w-8 p-0"
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 mb-6">
              {filteredMembers.map((member) => (
                <TeamMemberCard
                  key={member.id}
                  member={member}
                  onEdit={handleEditMember}
                  onDelete={handleDeleteMember}
                  onShare={handleShareLink}
                  showPassword={showPasswords[member.id]}
                  onTogglePassword={() => togglePasswordVisibility(member.id)}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        /* Empty State */
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || roleFilter !== "all" ? "No team members found" : "No team members added"}
          </h3>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">
            {searchTerm || roleFilter !== "all"
              ? "No team members match your current filters. Try adjusting your search or filter criteria."
              : "Start building your team by adding new team members with specific roles and permissions."}
          </p>
          {!searchTerm && roleFilter === "all" && (
            <Button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 mx-auto"
            >
              <Plus className="h-4 w-4" />
              Add Team Member
            </Button>
          )}
        </div>
      )}

      {/* Modals */}
      <AddTeamMemberModal open={showAddModal} onOpenChange={setShowAddModal} />
      
      <EditTeamMemberModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        member={selectedMember}
      />
      
      <DeleteTeamMemberModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        member={selectedMember}
      />
      
      <ShareableLinkModal
        open={showShareModal}
        onOpenChange={setShowShareModal}
        member={selectedMember}
      />
    </div>
  );
};