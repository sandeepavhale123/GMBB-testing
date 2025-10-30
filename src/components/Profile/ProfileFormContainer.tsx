import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useToast } from "../../hooks/use-toast";
import { useProfile } from "../../hooks/useProfile";
import { useAppSelector } from "../../hooks/useRedux";
import { ProfileBasicInfoForm } from "./ProfileBasicInfoForm";
import { ProfilePreferencesForm } from "./ProfilePreferencesForm";
import { useFormValidation } from "@/hooks/useFormValidation";
import i18n, { loadNamespace } from "@/i18n";
import { languageMap } from "@/lib/languageMap"; // optional mapping
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import { getLanguageName } from "@/services/languageService";
import { z } from "zod";

export const ProfileFormContainer: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useI18nNamespace([
    "Profile/profileFormContainer",
    "Validation/validation",
  ]);
  const {
    profileData,
    timezones,
    isUpdating,
    updateError,
    updateProfile,
    clearProfileErrors,
  } = useProfile();
  const { user } = useAppSelector((state) => state.auth); // Get user from auth state

  const profileSchema = z.object({
    firstName: z
      .string()
      .min(2, t("name.minLength"))
      .regex(/^[A-Za-z\s]+$/, t("name.lettersOnly"))
      .refine(
        (val) => (val.match(/[A-Za-z]/g) || []).length >= 3,
        t("name.minAlphabetic")
      ),
    lastName: z
      .string()
      .min(2, t("name.minLength"))
      .regex(/^[A-Za-z\s]+$/, t("name.lettersOnly"))
      .refine(
        (val) => (val.match(/[A-Za-z]/g) || []).length >= 3,
        t("name.minAlphabetic")
      ),
    email: z
      .string()
      .trim()
      .min(1, t("email.required"))
      .email(t("email.invalid")),
    timezone: z.string().min(1, t("timezone.required")),
    language: z.string().min(1, t("language.required")),
    dashboardType: z.string().min(1, t("dashboardType.required")),
  });

  type ProfileFormData = z.infer<typeof profileSchema>;

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

  // inside the component
  useEffect(() => {
    if (profileData?.language) {
      const lngCode = languageMap[profileData.language] ?? profileData.language;
      (async () => {
        // ensure english profile ns is loaded and then the user's language ns
        await loadNamespace("en", "Profile/profile");
        if (lngCode !== "en") await loadNamespace(lngCode, "Profile/profile");
        i18n.changeLanguage(lngCode);
      })();
    }
  }, [profileData]);

  // Update form language field when i18n language changes
  useEffect(() => {
    const handler = (lng: string) => {
      setFormData((prev) => ({ ...prev, language: getLanguageName(lng) }));
    };
    i18n.on("languageChanged", handler);
    return () => i18n.off("languageChanged", handler);
  }, []);

  useEffect(() => {
    if (updateError) {
      toast({
        title: t("updateFailedToastTitle"),
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
        title: t("validationError"),
        description: t("validationErrorText"),
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
      // 🔹 Update frontend language immediately after successful save
      const langCode = languageMap[formData.language] ?? formData.language;
      await loadNamespace("en", "Profile/profile");
      if (langCode !== "en") await loadNamespace(langCode, "Profile/profile");
      i18n.changeLanguage(langCode);

      toast({
        title: t("profileUpdated"),
        description: t("profileUpdatedtext"), // or a more general success message
      });

      // Only navigate if dashboard type actually changed
      const dashboardTypeChanged =
        initialDashboardType !== formData.dashboardType;

      if (dashboardTypeChanged) {
        // Redirect based on new dashboard type
        if (formData.dashboardType === "1") {
          navigate("/main-dashboard");
        } else {
          navigate("/location-dashboard");
        }
      }
      // If dashboard type didn't change, stay on current page
    } catch (error) {
      toast({
        title: t("updateFailed"),
        description:
          error?.response?.data?.message ||
          error.message ||
          t("updateErrorDesc"),
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
        key={formData.language}
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
          {isUpdating ? t("saving") : t("saveChanges")}
        </Button>
      </div>
    </form>
  );
};
