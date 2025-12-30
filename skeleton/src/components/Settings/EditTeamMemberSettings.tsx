import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamActivityLogs } from "@/components/TeamActivity";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { useTeam } from "@/hooks/useTeam";
import { useToast } from "@/hooks/use-toast";
import { updateEditMember } from "@/store/slices/teamSlice";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

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
  const [activeTab, setActiveTab] = useState("profile");

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

  useEffect(() => {
    if (currentEditMember) {
      setFormData({
        firstName: currentEditMember.firstName || "",
        lastName: currentEditMember.lastName || "",
        email: currentEditMember.username || "",
        password: currentEditMember.password || "",
        role: currentEditMember.role || "",
      });
    }
  }, [currentEditMember]);

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
      const updateData = {
        Id: parseInt(memberId),
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.email,
        role: formData.role,
        ...(formData.password && {
          password: formData.password,
        }),
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
    } catch (error: any) {
      toast({
        title: t("editTeamMemberSettings.toasts.error.title"),
        description:
          error?.response?.data?.message ||
          error.message ||
          t("editTeamMemberSettings.toasts.error.profileUpdate"),
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
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Third Row */}
              <div>
                <Label htmlFor="role">
                  {t("editTeamMemberSettings.profile.role")}
                </Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleInputChange("role", value)}
                  disabled={isSavingEdit}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue
                      placeholder={t(
                        "editTeamMemberSettings.profile.rolePlaceholder"
                      )}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Moderator">
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
            <div className="flex justify-end mt-6">
              <Button
                onClick={handleSave}
                disabled={isSaving || isSavingEdit}
              >
                {isSaving || isSavingEdit ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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

      {activeTab === "activity" && (
        <Card>
          <CardHeader>
            <CardTitle>Activity Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <TeamActivityLogs subUserId={memberId} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};