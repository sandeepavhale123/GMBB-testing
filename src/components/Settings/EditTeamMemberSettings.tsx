import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeamActivityLogs } from "@/components/TeamActivity";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Loader2,
  Search,
  ChevronDown,
} from "lucide-react";
import { useTeam } from "@/hooks/useTeam";
import { useToast } from "@/hooks/use-toast";

import { updateEditMember } from "@/store/slices/teamSlice";
import { useActiveAccounts } from "@/hooks/useActiveAccounts";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import { error } from "console";
interface EditFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}
export const EditTeamMemberSettings: React.FC = () => {
  const { t } = useI18nNamespace("Settings/editTeamMemberSettings");
  const { memberId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    currentEditMember,
    isLoadingEdit,
    isSavingEdit,
    editError,
    saveError: teamSaveError,
    fetchEditTeamMember,
    updateTeamMember,
    clearTeamEditError,
    clearTeamSaveError,
  } = useTeam();
  const [formData, setFormData] = useState<EditFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  // Tab state
  const [activeTab, setActiveTab] = useState("profile");

  // Listing management state
  const [selectedAccount, setSelectedAccount] = useState("All");
  const [accountSearchQuery, setAccountSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);

  // Get active accounts data
  const {
    accountsWithAll,
    listings,
    totalAssignListings,
    loading: listingsLoading,
    error: listingsError,
    toggleListingAssignment,
    isListingAssigned,
    pagination,
    refetch: refetchListings,
    searchByAccount,
    selectedAccountId,
    clearAccountSearch,
    saveAssignments,
    hasUnsavedChanges,
    saveLoading,
    saveError,
    getAssignedListingIds,
  } = useActiveAccounts({
    employeeId: parseInt(memberId || "0"),
    page: currentPage,
    limit: pageSize,
  });

  // Filter accounts based on search query
  const filteredAccounts = accountsWithAll.filter((account) =>
    account.accountName.toLowerCase().includes(accountSearchQuery.toLowerCase())
  );

  // Filter listings based on selected account (client-side filter)
  const displayListings =
    selectedAccount === "All"
      ? listings
      : listings.filter((listing) => listing.accountName === selectedAccount);

  // Use API pagination data
  const {
    page: currentApiPage,
    limit: currentApiLimit,
    hasMore,
    nextPageToken,
    prevPageToken,
  } = pagination;

  // Calculate total pages based on API data
  const totalApiPages = hasMore ? currentApiPage + 1 : currentApiPage;

  // Get assigned listings count for current filter
  const assignedCount =
    selectedAccount === "All"
      ? totalAssignListings
      : displayListings.filter((listing) => listing.allocated).length;

  // Track changes for save button
  const hasProfileChanges = Object.keys(formData).some((key) => {
    const formKey = key as keyof EditFormData;
    return (
      formData[formKey] !==
      (currentEditMember?.[formKey === "email" ? "username" : formKey] || "")
    );
  });
  const hasListingChanges = hasUnsavedChanges();
  const hasChanges =
    activeTab === "profile" ? hasProfileChanges : hasListingChanges;

  const fetchedMemberIdRef = useRef<number | null>(null);
  useEffect(() => {
    const memberIdNumber = parseInt(memberId || "0");
    if (
      memberId &&
      memberIdNumber &&
      fetchedMemberIdRef.current !== memberIdNumber
    ) {
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
        email: currentEditMember.username || "",
        // Map username to email
        password: currentEditMember.password || "",
        role: currentEditMember.role || "",
      });

      // Switch to profile tab if user was on listing tab but role is Moderator
      if (
        activeTab === "listing" &&
        currentEditMember.role?.toLowerCase() === "moderator"
      ) {
        setActiveTab("profile");
      }
    }
  }, [currentEditMember, activeTab]);

  // Clear errors and reset fetch ref when component unmounts
  useEffect(() => {
    return () => {
      clearTeamEditError();
      clearTeamSaveError();
      fetchedMemberIdRef.current = null;
    };
  }, [clearTeamEditError, clearTeamSaveError]);
  const handleInputChange = (field: keyof EditFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleSave = async () => {
    if (!memberId) return;
    setIsSaving(true);
    try {
      if (activeTab === "profile") {
        // Save profile changes
        const updateData = {
          Id: parseInt(memberId),
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.email,
          // Map email back to username
          role: formData.role,
          ...(formData.password && {
            password: formData.password,
          }), // Only include password if provided
        };
        const result = await updateTeamMember(updateData);
        if (updateEditMember.fulfilled.match(result)) {
          toast({
            title: t("editTeamMemberSettings.toasts.success.title"),
            description: t(
              "editTeamMemberSettings.toasts.success.profileUpdated"
            ),
          });
          if (location.pathname.startsWith("/main-dashboard")) {
            navigate("/main-dashboard/settings/team-members");
          } else {
            navigate("/settings/team-members");
          }
        }
      } else if (activeTab === "listing") {
        // Save listing assignments
        await saveAssignments();
        toast({
          title: t("editTeamMemberSettings.toasts.success.title"),
          description: t(
            "editTeamMemberSettings.toasts.success.listingsUpdated"
          ),
        });
      }
    } catch (error: any) {
      toast({
        title: t("editTeamMemberSettings.toasts.error.title"),
        description:
          error?.response?.data?.message ||
          error.message ||
          activeTab === "profile"
            ? t("editTeamMemberSettings.toasts.error.profileUpdate")
            : t("editTeamMemberSettings.toasts.error.listingsUpdate"),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  const handleBack = () => {
    if (location.pathname.startsWith("/main-dashboard")) {
      navigate("/main-dashboard/settings/team-members");
    } else {
      navigate("/settings/team-members");
    }
  };

  // Listing management handlers
  const handleListingToggle = async (listingId: string) => {
    // Get the new assigned IDs after toggle
    // Auto-save on toggle for listing tab
    const toggleResult = toggleListingAssignment(listingId);
    if (!toggleResult) return;
    try {
      // Add a small delay to ensure the toggle state is updated

      await saveAssignments(toggleResult);
      toast({
        title: t("editTeamMemberSettings.toasts.success.title"),
        description: t("editTeamMemberSettings.toasts.success.listingUpdated"),
      });
    } catch (error: any) {
      toast({
        title: t("editTeamMemberSettings.toasts.error.title"),
        description:
          error?.message ||
          t("editTeamMemberSettings.toasts.error.listingsUpdate"),
        variant: "destructive",
      });
      // Revert the toggle if save failed
      toggleListingAssignment(listingId);
    }
  };
  const handleAccountSelect = (accountName: string) => {
    setSelectedAccount(accountName);
    setCurrentPage(1); // Reset to first page when changing account
    setIsAccountDropdownOpen(false);
    setAccountSearchQuery(""); // Clear search when selecting

    if (accountName === "All") {
      // Clear account search and show all listings
      clearAccountSearch();
      refetchListings();
    } else {
      // Find the account and trigger search
      const account = accountsWithAll.find(
        (acc) => acc.accountName === accountName
      );
      if (account && account.accountId !== "All") {
        searchByAccount(parseInt(account.accountId));
      }
    }
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // The useActiveAccounts hook will automatically refetch when currentPage changes
  };
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
    // The useActiveAccounts hook will automatically refetch when pageSize changes
  };
  const getStatusBadgeVariant = (allocated: boolean) => {
    return allocated ? "default" : "outline";
  };

  // Show loading state
  if (isLoadingEdit) {
    return (
      <div className="p-4 sm:p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">
            {t("editTeamMemberSettings.loading.text")}
          </span>
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
                <ChevronLeft className="w-4 h-4 mr-1" />
                {t("editTeamMemberSettings.buttons.backToTeamMembers")}
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
              <p className="text-muted-foreground mb-4">
                {t("editTeamMemberSettings.errors.notFound")}
              </p>
              <Button onClick={handleBack} variant="outline">
                <ChevronLeft className="w-4 h-4 mr-1" />
                {t("editTeamMemberSettings.buttons.backToTeamMembers")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      {/* Tab Section with Back Button */}
      <div className="bg-white border-b border-gray-200 mb-6">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4 flex-wrap sm:gap-8">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg shadow hover:bg-gray-200"
            >
              {t("editTeamMemberSettings.buttons.back")}
            </Button>
            <div className="flex space-x-8 -mb-[1px]">
              <button
                onClick={() => setActiveTab("profile")}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "profile"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {t("editTeamMemberSettings.tabs.profile")}
              </button>
              {currentEditMember?.role?.toLowerCase() !== "moderator" && (
                <button
                  onClick={() => setActiveTab("listing")}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "listing"
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {t("editTeamMemberSettings.tabs.assignListings")}
                </button>
              )}
              <button
                onClick={() => setActiveTab("activity")}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "activity"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Activity
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "profile" && (
        <Card>
          <CardHeader>
            <CardTitle>{t("editTeamMemberSettings.profile.title")}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {teamSaveError && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-destructive text-sm">{teamSaveError}</p>
              </div>
            )}

            {/* Form Fields */}
            <div className="grid grid-cols-2 gap-6">
              {/* First Row */}
              <div>
                <Label htmlFor="firstName">
                  {t("editTeamMemberSettings.profile.firstName")}
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  className="mt-1"
                  disabled={isSavingEdit}
                />
              </div>
              <div>
                <Label htmlFor="lastName">
                  {t("editTeamMemberSettings.profile.lastName")}
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  className="mt-1"
                  disabled={isSavingEdit}
                />
              </div>

              {/* Second Row */}
              <div>
                <Label htmlFor="email">
                  {t("editTeamMemberSettings.profile.email")}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="mt-1"
                  disabled={isSavingEdit}
                />
              </div>
              <div>
                <Label htmlFor="password">
                  {t("editTeamMemberSettings.profile.password")}
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className="pr-10"
                    placeholder={t(
                      "editTeamMemberSettings.profile.passwordPlaceholder"
                    )}
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
                <Label htmlFor="role">
                  {t("editTeamMemberSettings.profile.role")}
                </Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleInputChange("role", value)}
                  disabled={isSavingEdit}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Moderator">
                      {" "}
                      {t("editTeamMemberSettings.profile.roles.moderator")}
                    </SelectItem>
                    <SelectItem value="Staff">
                      {t("editTeamMemberSettings.profile.roles.staff")}
                    </SelectItem>
                    <SelectItem value="Client">
                      {t("editTeamMemberSettings.profile.roles.client")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end mt-8">
              <Button
                onClick={handleSave}
                className="px-8"
                disabled={isSaving || !hasChanges}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    {t("editTeamMemberSettings.buttons.saving")}
                  </>
                ) : (
                  t("editTeamMemberSettings.buttons.saveChanges")
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "listing" &&
        currentEditMember?.role?.toLowerCase() !== "moderator" && (
          <Card>
            <CardHeader>
              <CardTitle>
                {t("editTeamMemberSettings.listings.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Filter Section */}
                <div className="flex gap-4 items-center flex-wrap">
                  {/* Account Dropdown (80% width) */}
                  <div className="flex-1 relative">
                    <Label className="text-sm font-medium">
                      {t(
                        "editTeamMemberSettings.listings.filter.googleAccount"
                      )}
                    </Label>
                    <div className="relative mt-1">
                      <Button
                        variant="outline"
                        className="w-full justify-between"
                        onClick={() =>
                          setIsAccountDropdownOpen(!isAccountDropdownOpen)
                        }
                      >
                        <span className="truncate">{selectedAccount}</span>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>

                      {isAccountDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover border rounded-md shadow-lg">
                          <div className="p-2 border-b">
                            <div className="relative">
                              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder={t(
                                  "editTeamMemberSettings.listings.filter.searchPlaceholder"
                                )}
                                value={accountSearchQuery}
                                onChange={(e) =>
                                  setAccountSearchQuery(e.target.value)
                                }
                                className="pl-8"
                              />
                            </div>
                          </div>
                          <div className="max-h-48 overflow-y-auto">
                            {filteredAccounts.map((account) => (
                              <button
                                key={account.accountId}
                                className="w-full text-left px-3 py-2 hover:bg-muted text-sm flex justify-between items-center"
                                onClick={() =>
                                  handleAccountSelect(account.accountName)
                                }
                              >
                                <span>{account.accountName}</span>
                                <span className="text-muted-foreground">
                                  ({account.totalListings || 0})
                                </span>
                              </button>
                            ))}
                            {filteredAccounts.length === 0 && (
                              <div className="px-3 py-2 text-sm text-muted-foreground">
                                {t(
                                  "editTeamMemberSettings.listings.filter.noAccounts"
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Assigned Listing Badge (20% width) */}
                  <div className="flex-shrink-0">
                    <Label className="text-sm font-medium">
                      {t(
                        "editTeamMemberSettings.listings.filter.assignedListings"
                      )}
                    </Label>
                    <div className="mt-1">
                      <Badge variant="secondary" className="text-sm px-3 py-1">
                        {t("editTeamMemberSettings.listings.badge.assigned", {
                          count: assignedCount,
                        })}
                        {/* {assignedCount} Assigned */}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Listings Table */}
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[40%]">
                          {t(
                            "editTeamMemberSettings.listings.table.businessName"
                          )}
                        </TableHead>
                        <TableHead className="w-[40%]">
                          {" "}
                          {t("editTeamMemberSettings.listings.table.account")}
                        </TableHead>
                        <TableHead className="w-[20%] text-center">
                          {t("editTeamMemberSettings.listings.table.assign")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {listingsLoading ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                            <p className="text-muted-foreground">
                              {t(
                                "editTeamMemberSettings.listings.table.loading"
                              )}
                            </p>
                          </TableCell>
                        </TableRow>
                      ) : listingsError ? (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center py-8 text-destructive"
                          >
                            {t("editTeamMemberSettings.errors.listingsError", {
                              error: listingsError,
                            })}
                            {/* Error loading listings: {listingsError} */}
                          </TableCell>
                        </TableRow>
                      ) : displayListings.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center py-8 text-muted-foreground"
                          >
                            {t(
                              "editTeamMemberSettings.listings.table.noListings"
                            )}
                          </TableCell>
                        </TableRow>
                      ) : (
                        displayListings.map((listing) => (
                          <TableRow
                            key={listing.id}
                            className="hover:bg-muted/50"
                          >
                            <TableCell className="font-medium">
                              {listing.name}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {listing.accountName}
                            </TableCell>
                            <TableCell className="text-center">
                              <Switch
                                checked={listing.allocated}
                                onCheckedChange={() =>
                                  handleListingToggle(listing.id)
                                }
                              />
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* API-driven Pagination */}
                {displayListings.length > 0 && !listingsLoading && (
                  <div className="flex items-center justify-between flex-col gap-4 sm:flex-row sm:gap-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {t(
                          "editTeamMemberSettings.listings.pagination.pageInfo",
                          {
                            current: currentApiPage,
                            total: totalApiPages,
                            count: displayListings.length,
                          }
                        )}
                        {/* Page {currentApiPage} of {totalApiPages} •{" "}
                        {displayListings.length} listings */}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 flex-col sm:flex-row">
                      {/* Page Size Selector */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {t("editTeamMemberSettings.listings.pagination.show")}
                        </span>
                        <Select
                          value={pageSize.toString()}
                          onValueChange={(value) =>
                            handlePageSizeChange(parseInt(value))
                          }
                        >
                          <SelectTrigger className="h-8 w-16">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Page Navigation */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentApiPage - 1)}
                          disabled={!prevPageToken || currentApiPage === 1}
                        >
                          {t("editTeamMemberSettings.buttons.previous")}
                        </Button>

                        <div className="flex items-center gap-1">
                          <span className="text-sm px-3 py-1 bg-primary text-primary-foreground rounded">
                            {currentApiPage}
                          </span>
                          {hasMore && (
                            <>
                              <span className="text-sm text-muted-foreground">
                                {t(
                                  "editTeamMemberSettings.listings.pagination.of"
                                )}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {totalApiPages}+
                              </span>
                            </>
                          )}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentApiPage + 1)}
                          disabled={!hasMore || !nextPageToken}
                        >
                          {t("editTeamMemberSettings.buttons.next")}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Save Button */}
              {/* <div className="flex justify-end mt-8 pt-6 border-t">
                <Button
                  onClick={handleSave}
                  className="px-8"
                  disabled={isSaving || saveLoading || !hasChanges}
                >
                  {isSaving || saveLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
               </div> */}
            </CardContent>
          </Card>
        )}

      {/* Activity Tab */}
      {activeTab === "activity" && (
        <ActivityTabContent memberId={memberId} t={t} />
      )}
    </div>
  );
};

// Activity Tab Content component with total count badge
interface PaginationData {
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

const ActivityTabContent: React.FC<{ memberId: string; t: (key: string) => string }> = ({ memberId, t }) => {
  const [paginationData, setPaginationData] = React.useState<PaginationData>({ total: 0, page: 1, totalPages: 1, limit: 20 });
  const [isLoadingData, setIsLoadingData] = React.useState(true);

  const handlePaginationChange = React.useCallback((pagination: PaginationData, isLoading: boolean) => {
    setPaginationData(pagination);
    setIsLoadingData(isLoading);
  }, []);
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-0">
        <CardTitle>Activity Logs</CardTitle>
        <div className="flex items-center gap-2 bg-blue-100 p-3 rounded-md mb-0">
          <p className="text-sm text-muted-foreground">{t("editTeamMemberSettings.totalReplies")}:</p>
          <p className="bg-blue-500 text-white rounded px-2 py-1 text-sm">{isLoadingData ? "..." : paginationData.total}</p>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <TeamActivityLogs subUserId={memberId} onPaginationChange={handlePaginationChange} />
      </CardContent>
    </Card>
  );
};
