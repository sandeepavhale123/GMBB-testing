import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetAllTimeZoneQuery } from "@/api/timeZoneApi";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  fetchBusinessDetails,
  saveBusinessDetails,
} from "@/store/slices/onboarding/onboardingSlice";
import { useFormValidation } from "@/hooks/useFormValidation";
import { businessInfoSchema } from "@/schemas/authSchemas";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import { z } from "zod";

interface BusinessInfoStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  onNext: () => void;
}

const BusinessInfoStep = ({
  formData,
  updateFormData,
  onNext,
}: BusinessInfoStepProps) => {
  const { t } = useI18nNamespace([
    "Onboarding/businessInfoStep",
    "Validation/validation",
  ]);
  const dispatch = useDispatch<AppDispatch>();
  const businessInfoSchema = z.object({
    businessName: z
      .string()
      .min(1, t("business.nameRequired"))
      .min(2, t("business.nameMin")),
    website: z
      .string()
      .optional()
      .refine(
        (val: string) =>
          !val ||
          val.trim() === "" ||
          /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/\S*)?$/.test(val),

        t("business.urlInvalid")
      ),
    email: z
      .string()
      .trim()
      .min(1, t("email.required"))
      .email(t("email.invalid")),
    timezone: z.string().min(1, t("business.timezoneRequired")),
    businessType: z.string().min(1, t("business.typeRequired")),
    locationCount: z.string().optional(),
  });

  type BusinessInfoFormData = z.infer<typeof businessInfoSchema>;
  // Initialize form validation
  const { validate, getFieldError, hasFieldError, clearFieldError } =
    useFormValidation(businessInfoSchema);

  // RTK Query for timezone data
  const { data: timeZoneData } = useGetAllTimeZoneQuery();

  const {
    businessDetails,
    businessDetailsLoading,
    businessDetailsError,
    saveInProgress,
  } = useSelector((state: RootState) => state.onboarding);

  const [localData, setLocalData] = useState({
    businessName: formData.businessName || "",
    website: formData.website || "",
    email: formData.email || "",
    timezone: formData.timezone || "",
    businessType: formData.businessType || "Multi listing Dashboard",
    locationCount: formData.locationCount || "",
  });

  const [timezoneOpen, setTimezoneOpen] = useState(false);

  // Fetch business details on mount
  useEffect(() => {
    dispatch(fetchBusinessDetails());
  }, [dispatch]);

  // Update local data when formData changes (from persistence)
  useEffect(() => {
    setLocalData({
      businessName: formData.businessName || "",
      website: formData.website || "",
      email: formData.email || "",
      timezone: formData.timezone || "",
      businessType: formData.businessType || "Multi listing Dashboard",
      locationCount: formData.locationCount || "",
    });
  }, [formData]);

  const mapAgencyTypeToBusinessType = (agencyType: string) => {
    switch (agencyType) {
      case "multi_owner":
        return "Multi listing Dashboard";
      case "local_business":
        return "Single listing Dashboard";
      default:
        return "Multi listing Dashboard";
    }
  };

  // Map API manage listing count to form location count
  const mapManageListingToLocationCount = (manageListing: string) => {
    const count = parseInt(manageListing);
    if (count <= 10) return "1-10";
    if (count <= 20) return "11-20";
    if (count <= 40) return "21-40";
    if (count <= 100) return "41-100";
    if (count <= 200) return "101-200";
    return "201+";
  };

  useEffect(() => {
    // Only prefill when businessDetails exist and localData is still in its initial state
    if (
      businessDetails &&
      !formData.businessName && // no existing user input
      !localData.businessName && // only prefill if local state is also untouched
      !localData.email &&
      !localData.timezone
    ) {
      const prefillData = {
        businessName: businessDetails.companyName ?? "",
        website: businessDetails.website ?? "",
        email: businessDetails.email ?? "",
        timezone: businessDetails.timezone ?? "",
        businessType:
          mapAgencyTypeToBusinessType(businessDetails.agencyType) ??
          "Multi listing Dashboard",
        locationCount:
          mapManageListingToLocationCount(businessDetails.manageListing) ?? "",
      };
      setLocalData(prefillData);
      updateFormData(prefillData);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessDetails]);

  const businessTypes = ["Single listing Dashboard", "Multi listing Dashboard"];

  const locationRanges = [
    "1-10",
    "11-20",
    "21-40",
    "41-100",
    "101-200",
    "201+",
  ];

  const handleChange = (field: string, value: string) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    // Clear field error when user starts editing
    clearFieldError(field);
    // Immediately update the Redux store for persistence
    updateFormData(newData);
  };

  const handleNext = async () => {
    // Validate form data before proceeding
    const validationResult = validate(localData);

    if (!validationResult.isValid) {
      return;
    }

    updateFormData(localData);

    // Save business details to server before proceeding
    try {
      await dispatch(saveBusinessDetails()).unwrap();
      onNext();
    } catch (error) {
      // console.error("Failed to save business details:", error);
    }
  };

  const isValid =
    localData.businessName &&
    localData.email &&
    localData.timezone &&
    localData.businessType;

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
      <div className="text-center mb-6 sm:mb-8 lg:mb-10 xl:mb-12">
        <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
          {t("businessInfoStep.title")}
        </h2>
        <p className="text-base sm:text-lg lg:text-xl text-gray-600">
          {t("businessInfoStep.description")}
        </p>
      </div>

      <div className=" p-4 sm:p-6 lg:p-8 xl:p-10  space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Business/Agency Name - Full Width */}
        <div>
          <Label
            htmlFor="businessName"
            className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3 block"
          >
            {t("businessInfoStep.businessNameLabel")}
          </Label>
          <Input
            id="businessName"
            value={localData.businessName}
            onChange={(e) => handleChange("businessName", e.target.value)}
            placeholder={t("businessInfoStep.businessNamePlaceholder")}
            className={cn(
              "h-10 text-sm sm:text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500",
              hasFieldError("businessName") &&
                "border-red-500 focus:border-red-500 focus:ring-red-500"
            )}
          />
          {hasFieldError("businessName") && (
            <p className="text-red-500 text-sm mt-1">
              {getFieldError("businessName")}
            </p>
          )}
        </div>

        {/* Website and Company Email - Same Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
          <div>
            <Label
              htmlFor="website"
              className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3 block"
            >
              {t("businessInfoStep.websiteLabel")}
            </Label>
            <Input
              id="website"
              value={localData.website}
              onChange={(e) => handleChange("website", e.target.value)}
              placeholder={t("businessInfoStep.websitePlaceholder")}
              className={cn(
                "h-10 text-sm sm:text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500",
                hasFieldError("website") &&
                  "border-red-500 focus:border-red-500 focus:ring-red-500"
              )}
            />
            {hasFieldError("website") && (
              <p className="text-red-500 text-sm mt-1">
                {getFieldError("website")}
              </p>
            )}
          </div>

          <div>
            <Label
              htmlFor="email"
              className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3 block"
            >
              {t("businessInfoStep.emailLabel")}
            </Label>
            <Input
              id="email"
              type="email"
              value={localData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder={t("businessInfoStep.emailPlaceholder")}
              className={cn(
                "h-10 text-sm sm:text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500",
                hasFieldError("email") &&
                  "border-red-500 focus:border-red-500 focus:ring-red-500"
              )}
            />
            {hasFieldError("email") && (
              <p className="text-red-500 text-sm mt-1">
                {getFieldError("email")}
              </p>
            )}
          </div>
        </div>

        {/* Preferred Timezone and Business Type - Same Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
          <div>
            <Label
              htmlFor="timezone"
              className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3 block"
            >
              {t("businessInfoStep.timezoneLabel")}
            </Label>
            <Popover open={timezoneOpen} onOpenChange={setTimezoneOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={timezoneOpen}
                  className={cn(
                    "h-10 w-full justify-between text-sm sm:text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500",
                    hasFieldError("timezone") &&
                      "border-red-500 focus:border-red-500 focus:ring-red-500"
                  )}
                >
                  {localData.timezone ||
                    t("businessInfoStep.timezonePlaceholder")}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput
                    placeholder={t("businessInfoStep.timezoneSearch")}
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty>
                      {t("businessInfoStep.noTimezone")}
                    </CommandEmpty>
                    <CommandGroup>
                      {timeZoneData && Array.isArray(timeZoneData)
                        ? timeZoneData.map((timezone) => (
                            <CommandItem
                              key={timezone}
                              value={timezone}
                              onSelect={(currentValue) => {
                                handleChange("timezone", currentValue);
                                setTimezoneOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  localData.timezone === timezone
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {timezone}
                            </CommandItem>
                          ))
                        : timeZoneData && typeof timeZoneData === "object"
                        ? Object.entries(timeZoneData).map(([value, label]) => (
                            <CommandItem
                              key={value}
                              value={value}
                              onSelect={(currentValue) => {
                                handleChange("timezone", currentValue);
                                setTimezoneOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  localData.timezone === value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {String(label)}
                            </CommandItem>
                          ))
                        : null}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {hasFieldError("timezone") && (
              <p className="text-red-500 text-sm mt-1">
                {getFieldError("timezone")}
              </p>
            )}
          </div>

          <div>
            <Label
              htmlFor="businessType"
              className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3 block"
            >
              {t("businessInfoStep.dashboardTypeLabel")}
            </Label>
            <Select
              value={localData.businessType}
              onValueChange={(value) => handleChange("businessType", value)}
            >
              <SelectTrigger
                className={cn(
                  "h-10 text-sm sm:text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500",
                  hasFieldError("businessType") &&
                    "border-red-500 focus:border-red-500 focus:ring-red-500"
                )}
              >
                <SelectValue
                  placeholder={t("businessInfoStep.dashboardTypePlaceholder")}
                />
              </SelectTrigger>
              <SelectContent>
                {businessTypes.map((type) => (
                  <SelectItem
                    key={type}
                    value={type}
                    className="text-sm sm:text-base py-2 sm:py-3"
                  >
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasFieldError("businessType") && (
              <p className="text-red-500 text-sm mt-1">
                {getFieldError("businessType")}
              </p>
            )}
          </div>
        </div>
        <div>
          <Label
            htmlFor="locationCount"
            className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3 block"
          >
            {t("businessInfoStep.locationCountLabel")}
          </Label>

          <Select
            value={localData.locationCount}
            onValueChange={(value) => handleChange("locationCount", value)}
          >
            <SelectTrigger className="h-10 text-sm sm:text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500">
              <SelectValue
                placeholder={t("businessInfoStep.locationCountPlaceholder")}
              />
            </SelectTrigger>

            <SelectContent>
              {locationRanges.map((range) => (
                <SelectItem
                  key={range}
                  value={range}
                  className="text-sm sm:text-base py-2 sm:py-3"
                >
                  {range}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="pt-3 sm:pt-4 lg:pt-6">
          <Button
            onClick={handleNext}
            disabled={!isValid || saveInProgress}
            className="w-full h-10 text-sm sm:text-base font-semibold bg-blue-600 hover:bg-blue-700"
          >
            {saveInProgress
              ? t("businessInfoStep.savingButton")
              : t("businessInfoStep.continueButton")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BusinessInfoStep;
