import React, { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { Loader } from "../ui/loader";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "../ui/table";
import { Eye, EyeOff, Search, Plus, Grid3X3, List, Edit, Trash2, Copy, MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { AddTeamMemberModal } from "./AddTeamMemberModal";
import { EditTeamMemberModal } from "./EditTeamMemberModal";
import { DeleteTeamMemberModal } from "./DeleteTeamMemberModal";
import { TeamMemberPagination } from "./TeamMemberPagination";
import { toast } from "../../hooks/use-toast";
import { useTeam } from "../../hooks/useTeam";
import { TeamMember } from "../../api/teamApi";
import { useNavigate } from "react-router-dom";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

// Role color mapping
const roleColors = {
  Admin: "bg-red-100 text-red-800",
  Editor: "bg-blue-100 text-blue-800",
  Viewer: "bg-green-100 text-green-800",
  Staff: "bg-purple-100 text-purple-800",
  Client: "bg-orange-100 text-orange-800",
  Moderator: "bg-teal-100 text-teal-800",
};
const TeamMembersPage: React.FC = () => {
  const { t } = useI18nNamespace("Settings/teamMembersPage");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [passwordVisibility, setPasswordVisibility] = useState<{
    [key: string]: boolean;
  }>({});
  const navigate = useNavigate();
  const {
    members,
    pagination,
    summary,
    isLoading,
    error,
    searchTerm,
    roleFilter,
    updateSearchTerm,
    updateRoleFilter,
    updateCurrentPage,
    clearTeamError,
  } = useTeam();

  const handleEditMember = (member: TeamMember) => {
    if (location.pathname.startsWith("/main-dashboard")) {
      navigate(`/main-dashboard/settings/team-members/edit/${member.id}`);
    } else {
      navigate(`/settings/team-members/edit/${member.id}`);
    }
  };
  const handleDeleteMember = (member: TeamMember) => {
    setSelectedMember(member);
    setShowDeleteModal(true);
  };
  const togglePasswordVisibility = (memberId: string) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [memberId]: !prev[memberId],
    }));
  };
  const getRoleBadgeClass = (role: string) => {
    return roleColors[role as keyof typeof roleColors] || "bg-gray-100 text-gray-800";
  };
  const handleCopyEmail = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      toast({
        title: t("teamMembersPage.copy.successTitle"),
        description: t("teamMembersPage.copy.successDesc"),
      });
    } catch (err) {
      toast({
        title: t("teamMembersPage.copy.errorTitle"),
        description: err.message || err?.response?.data?.message || t("teamMembersPage.copy.errorDesc"),
        variant: "destructive",
      });
    }
  };
  const getDisplayName = (member: TeamMember) => {
    return `${member.firstName} ${member.lastName}`.trim() || member.username;
  };
  const getInitials = (member: TeamMember) => {
    if (member.firstName || member.lastName) {
      return `${member.firstName?.[0] || ""}${member.lastName?.[0] || ""}`.toUpperCase();
    }
    return member.username.slice(0, 2).toUpperCase();
  };

  // Helper function to construct profile picture URLs
  const getProfilePictureUrl = (profilePicture: string) => {
    if (!profilePicture) return "";
    return `https://member.gmbbriefcase.com/files/suninfo/profile/${profilePicture}`;
  };
  return (
    <div className="p-4 pb-[100px] sm:p-6 sm:pb-[100px]">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("teamMembersPage.title")}</h2>
            <p className="text-gray-600 text-sm sm:text-base">{t("teamMembersPage.description")}</p>
          </div>
          <Button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 w-fit">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline"> {t("teamMembersPage.addMember")}</span>
            <span className="sm:hidden"> {t("teamMembersPage.add")}</span>
          </Button>
        </div>

        {/* Top Controls Panel */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full lg:w-auto">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={t("teamMembersPage.searchPlaceholder")}
                  value={searchTerm}
                  onChange={(e) => updateSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Role Filter */}
              <Select value={roleFilter} onValueChange={updateRoleFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder={t("teamMembersPage.allRoles")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("teamMembersPage.allRoles")}</SelectItem>
                  <SelectItem value="Staff">{t("teamMembersPage.staff")}</SelectItem>
                  <SelectItem value="Client">{t("teamMembersPage.client")}</SelectItem>
                  <SelectItem value="Moderator">{t("teamMembersPage.moderator")}</SelectItem>
                </SelectContent>
              </Select>

              {/* Summary Badges */}
              {summary && (
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1 w-fit">
                    {t("teamMembersPage.totalMembers", {
                      count: summary.totalMembers,
                    })}
                    {/* Total: {summary.totalMembers} */}
                  </Badge>
                  {/* <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200 px-3 py-1 w-fit"
                   >
                    Active: {summary.activeMembers}
                   </Badge> */}
                </div>
              )}
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
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader />
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="p-8 text-center border-destructive">
            <div className="text-destructive mb-4">
              <h3 className="text-lg font-semibold mb-2">{t("teamMembersPage.error.title")}</h3>
              <p className="text-sm">{error}</p>
            </div>
            <Button onClick={clearTeamError} variant="outline">
              {t("teamMembersPage.error.tryAgain")}
            </Button>
          </Card>
        )}

        {/* Team Members Display */}
        {!isLoading && !error && members.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-muted-foreground mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">{t("teamMembersPage.empty.title")}</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || roleFilter ? t("teamMembersPage.empty.searchAdjust") : t("teamMembersPage.empty.addFirst")}
            </p>
            {!searchTerm && !roleFilter && (
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="w-4 h-4 mr-1" />
                {t("teamMembersPage.addMember")}
              </Button>
            )}
          </Card>
        ) : (
          !isLoading &&
          !error && (
            <>
              {/* List View */}
              {viewMode === "list" ? (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold text-gray-900">
                          {t("teamMembersPage.table.member")}
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900 text-center">
                          {t("teamMembersPage.table.email")}
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900 text-center">
                          {t("teamMembersPage.table.password")}
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900 text-center">
                          {t("teamMembersPage.table.listings")}
                        </TableHead>
                        {/* <TableHead className="font-semibold text-gray-900 text-center">
                          Status
                         </TableHead> */}
                        <TableHead className="font-semibold text-gray-900 text-center">
                          {t("teamMembersPage.table.actions")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {members.map((member) => (
                        <TableRow key={member.id} className="hover:bg-gray-50">
                          <TableCell className="p-4">
                            <div className="flex items-center space-x-3" onClick={() => handleEditMember(member)}>
                              <Avatar className="h-10 w-10">
                                <AvatarImage
                                  src={getProfilePictureUrl(member.profilePicture)}
                                  alt={getDisplayName(member)}
                                />
                                <AvatarFallback className="bg-gray-100 text-gray-600">
                                  {getInitials(member)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-gray-900">{getDisplayName(member)}</div>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge className={getRoleBadgeClass(member.role)} variant="secondary">
                                    {t(`teamMembersPage.roles.${member.role}`)}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <span className="text-sm text-gray-600">{member.username}</span>
                              <button
                                onClick={() => handleCopyEmail(member.username)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                title={t("teamMembersPage.copy.tooltip")}
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          </TableCell>
                          <TableCell className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded border">
                                {passwordVisibility[member.id] ? member.password : "••••••••"}
                              </span>
                              <button
                                onClick={() => togglePasswordVisibility(member.id)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                title={
                                  passwordVisibility[member.id]
                                    ? t("teamMembersPage.password.hide")
                                    : t("teamMembersPage.password.show")
                                }
                              >
                                {passwordVisibility[member.id] ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </TableCell>
                          <TableCell className="p-4 text-center">
                            <span className="text-sm font-medium text-gray-900">{member.listingsCount}</span>
                          </TableCell>
                          {/* <TableCell className="p-4 text-center">
                            <Badge
                              variant="default"
                              className="bg-green-100 text-green-800 border-green-200"
                            >
                              Active
                            </Badge>
                           </TableCell> */}
                          <TableCell className="p-4 text-center">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditMember(member)}>
                                  <Edit className="w-4 h-4 mr-1" />
                                  {t("teamMembersPage.dropdown.edit")}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteMember(member)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="w-4 h-4 mr-1" />
                                  {t("teamMembersPage.dropdown.delete")}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div> /* Grid View */
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {members.map((member) => (
                    <Card key={member.id} className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={getProfilePictureUrl(member.profilePicture)}
                              alt={getDisplayName(member)}
                            />
                            <AvatarFallback>{getInitials(member)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-foreground">{getDisplayName(member)}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-2 break-all">
                              {member.username}
                              <button
                                onClick={() => handleCopyEmail(member.username)}
                                className="text-muted-foreground hover:text-foreground"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditMember(member)}>
                              <Edit className="w-4 h-4 mr-1" />
                              {t("teamMembersPage.dropdown.edit")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteMember(member)} className="text-destructive">
                              <Trash2 className="w-4 h-4 mr-1" />
                              {t("teamMembersPage.dropdown.delete")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{t("teamMembersPage.grid.password")}</span>
                          <div className="flex items-center gap-2">
                            {/* <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded border">
                             {member.password}
                             </span> */}
                            <div className="flex items-center justify-center gap-2">
                              <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded border">
                                {passwordVisibility[member.id] ? member.password : "••••••••"}
                              </span>
                              <button
                                onClick={() => togglePasswordVisibility(member.id)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                title={
                                  passwordVisibility[member.id]
                                    ? t("teamMembersPage.password.hide")
                                    : t("teamMembersPage.password.show")
                                }
                              >
                                {passwordVisibility[member.id] ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{t("teamMembersPage.grid.role")}</span>
                          <Badge className={getRoleBadgeClass(member.role)}>{member.role}</Badge>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{t("teamMembersPage.grid.listings")}</span>
                          <span className="text-sm text-foreground">{member.listingsCount}</span>
                        </div>

                        {/* <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Status:
                          </span>
                          <Badge variant="default">Active</Badge>
                         </div> */}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )
        )}

        {/* Pagination */}
        {!isLoading && !error && pagination && (
          <TeamMemberPagination pagination={pagination} onPageChange={updateCurrentPage} />
        )}
      </div>

      {/* Modals */}
      <AddTeamMemberModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onSuccess={() => {
          // The team list will be automatically refreshed by the addTeamMember function
        }}
      />

      <EditTeamMemberModal open={showEditModal} onOpenChange={setShowEditModal} member={selectedMember} />

      <DeleteTeamMemberModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        member={selectedMember}
        onSuccess={() => {
          // The team list will be automatically refreshed by the deleteTeamMember function
        }}
      />
    </div>
  );
};
export default TeamMembersPage;
