import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useToast } from "../../hooks/use-toast";
import { useProfile } from "../../hooks/useProfile";
import { useAppSelector } from "../../hooks/useRedux";
import { ProfileBasicInfoForm } from "./ProfileBasicInfoForm";
import { ProfilePreferencesForm } from "./ProfilePreferencesForm";
import { useFormValidation } from "@/hooks/useFormValidation";
import { profileSchema, ProfileFormData } from "../../schemas/authSchemas";

export const ProfileFormContainer: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const {
    profileData,
    timezones,
    isUpdating,
    updateError,
    updateProfile,
    clearProfileErrors,
  } = useProfile();
  const { user } = useAppSelector((state) => state.auth); // Get user from auth state

  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: "",
    lastName: "",
    email: "",
    timezone: "",
    language: "",
    dashboardType: "0",
  });

  const [initialDashboardType, setInitialDashboardType] = useState<string>("0");

  const {
    validate,
    getFieldError,
    hasFieldError,
    clearFieldError,
    clearErrors,
  } = useFormValidation(profileSchema);

  useEffect(() => {
    if (profileData) {
      const dashboardTypeValue = profileData.dashboardType?.toString() || "0";
      setFormData({
        firstName: profileData.first_name || "",
        lastName: profileData.last_name || "",
        email: profileData.username || "",
        timezone: profileData.timezone || "",
        language: profileData.language || "english",
        dashboardType: dashboardTypeValue,
      });
      setInitialDashboardType(dashboardTypeValue);
    }
  }, [profileData]);

  useEffect(() => {
    if (updateError) {
      toast({
        title: "Update Failed",
        description: updateError,
        variant: "destructive",
      });
      clearProfileErrors();
    }
  }, [updateError, toast, clearProfileErrors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate form data
    const validationResult = validate(formData);

    if (!validationResult.isValid) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }

    try {
      // Update profile WITHOUT password - password should only be updated via change password modal
      await updateProfile({
        first_name: formData.firstName,
        last_name: formData.lastName,
        timezone: formData.timezone,
        username: formData.email,
        dashboardType: parseInt(formData.dashboardType),
        language: formData.language,
        profilePic: profileData.profilePic || "",
        // Password is intentionally NEVER included in profile updates
      });

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });

      // Check if we need to redirect to multi-dashboard
      const shouldRedirect = 
        initialDashboardType === "0" && 
        formData.dashboardType === "1";

      if (shouldRedirect) {
        navigate("/main-dashboard");
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description:
          error?.response?.data?.message ||
          error.message ||
          "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
    clearErrors();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear field error when user starts typing
    if (hasFieldError(field)) {
      clearFieldError(field);
    }
  };

  if (!profileData) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info Section */}
      <ProfileBasicInfoForm
        formData={{
          firstName: formData.firstName || "",
          lastName: formData.lastName || "",
          email: formData.email || "",
          language: formData.language || "",
        }}
        onInputChange={handleInputChange}
        getFieldError={getFieldError}
        hasFieldError={hasFieldError}
      />

      <ProfilePreferencesForm
        formData={{
          timezone: formData.timezone || "",
          dashboardType: formData.dashboardType || "0",
        }}
        timezones={timezones}
        userRole={user?.role || profileData?.role}
        onInputChange={handleInputChange}
        getFieldError={getFieldError}
        hasFieldError={hasFieldError}
      />
      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          size="lg"
          disabled={isUpdating}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105"
        >
          {isUpdating ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};
