import React, { useState, useRef } from "react";
import { Lock, Pencil, Settings } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { useToast } from "../../hooks/use-toast";
import { useProfile } from "../../hooks/useProfile";
import { useNavigate } from "react-router-dom";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface ProfileHeaderProps {
  activeTab: "edit" | "password";
  onTabChange: (tab: "edit" | "password") => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  activeTab,
  onTabChange,
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { profileData, isLoading, updateProfile, isUpdating } = useProfile();
  const [isUploading, setIsUploading] = useState(false);
  const { t } = useI18nNamespace("Profile/profileHeader");

  // Helper function to check if subscription info should be hidden
  const shouldHideSubscriptionInfo = () => {
    const userRole = profileData?.role?.toLowerCase();
    return userRole === "staff" || userRole === "client";
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: t("invalidFileType"),
        description: t("invalidFileTypeDesc"),
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: t("fileTooLarge"),
        description: t("fileTooLargeDesc"),
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    // Convert to base64
    const reader = new FileReader();
    reader.onload = async (e) => {
      const result = e.target?.result as string;

      try {
        if (profileData) {
          await updateProfile({
            first_name: profileData.first_name,
            last_name: profileData.last_name,
            timezone: profileData.timezone,
            username: profileData.username,
            dashboardType: 1, // Default to advanced
            language: profileData.language,
            profilePic: result,
          });

          toast({
            title: t("profilePicUpdated"),
            description: t("profileUpdated"),
          });
        }
      } catch (error) {
        toast({
          title: t("uploadFailed"),
          description:
            error?.response?.data?.message || error.message || t("uploadDesc"),
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePencilClick = () => {
    fileInputRef.current?.click();
  };

  if (isLoading) {
    return (
      <Card className="shadow-lg border-0">
        <CardContent className="p-6">
          <div className="animate-pulse flex items-center gap-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-3">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="flex gap-2">
                <div className="h-8 bg-gray-200 rounded w-24"></div>
                <div className="h-8 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const defaultImage =
    "/lovable-uploads/e82c6af8-dd5a-48b6-bc12-9663e5ab24eb.png";
  const profileImage =
    profileData?.profilePic && profileData.profilePic.trim() !== ""
      ? profileData.profilePic
      : defaultImage;
  const fullName = profileData
    ? `${profileData.first_name} ${profileData.last_name}`
    : "User";

  const handleManageSubscription = () => {
    if (location.pathname.startsWith("/main")) {
      navigate(`/main-dashboard/settings/subscription`);
    } else {
      navigate("/settings/subscription");
    }
  };

  // Format plan expiry date
  const formatPlanDate = (planExpDate: string) => {
    return new Date(planExpDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="shadow-lg border-0">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Profile Picture */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full shadow-md flex items-center justify-center overflow-hidden border-4 border-gray-100">
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  if (e.currentTarget.src !== defaultImage) {
                    e.currentTarget.src = defaultImage;
                  }
                }}
              />
            </div>
            <button
              onClick={handlePencilClick}
              disabled={isUploading || isUpdating}
              className="absolute bottom-0 right-0 w-6 h-6 sm:w-7 sm:h-7 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Pencil className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* User Info */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
              {fullName}
            </h1>
            <div className="mb-4">
              <p className="text-sm sm:text-base text-gray-600">
                {profileData?.role}
              </p>
              {/* Conditionally show plan information */}
              {!shouldHideSubscriptionInfo() && profileData?.planName && (
                <p className="text-sm text-primary font-medium">
                  {profileData.planName} Plan
                  {profileData.planExpDate && (
                    <span className="text-gray-500 font-normal">
                      {" "}
                      • Expires {formatPlanDate(profileData.planExpDate)}
                    </span>
                  )}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onTabChange("password")}
                className="px-4 py-2 rounded-lg font-medium border-primary/20 text-primary hover:bg-primary/5 transition-all"
              >
                <Lock className="w-4 h-4 mr-1" />
                {t("changePassword")}
              </Button>
              {/* Conditionally show manage subscription button */}
              {!shouldHideSubscriptionInfo() && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleManageSubscription}
                  className="px-4 py-2 rounded-lg font-medium border-primary/20 text-primary hover:bg-primary/5 transition-all"
                >
                  <Settings className="w-4 h-4 mr-1" />
                  {t("manageSubscription")}
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
