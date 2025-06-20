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
import { useGetAllTimeZoneQuery } from "@/api/timeZoneApi";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  fetchBusinessDetails,
  saveBusinessDetails,
  setPrefilledState,
} from "@/store/slices/onboarding/onboardingSlice";

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
  const dispatch = useDispatch<AppDispatch>();

  // RTK Query for timezone data
  const { data: timeZoneData } = useGetAllTimeZoneQuery();

  const {
    businessDetails,
    businessDetailsLoading,
    businessDetailsError,
    saveInProgress,
    prefiiledState,
  } = useSelector((state: RootState) => state.onboarding);

  const [localData, setLocalData] = useState({
    businessName: formData.businessName || "",
    website: formData.website || "",
    email: formData.email || "",
    timezone: formData.timezone || "",
    businessType: formData.businessType || "",
    locationCount: formData.locationCount || "",
  });

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
      businessType: formData.businessType || "",
      locationCount: formData.locationCount || "",
    });
  }, [formData]);

  const mapAgencyTypeToBusinessType = (agencyType: string) => {
    switch (agencyType) {
      case "multi_owner":
        return "Multi-location Business Manager";
      case "agency_owner":
        return "Agency Owner / SEO Freelancer";
      case "local_business":
        return "Local Business Owner";
      default:
        return "";
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
      !localData.timezone &&
      !localData.businessType
    ) {
      const prefillData = {
        businessName: businessDetails.companyName || "",
        website: businessDetails.website || "",
        email: businessDetails.email || "",
        timezone: businessDetails.timezone || "",
        businessType:
          mapAgencyTypeToBusinessType(businessDetails.agencyType) || "",
        locationCount:
          mapManageListingToLocationCount(businessDetails.manageListing) || "",
      };
      console.log("Prefilling form with business details:", businessDetails);
      console.log("Mapped prefill data:", prefillData);
      setLocalData(prefillData);
      updateFormData(prefillData);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessDetails]);

  const businessTypes = [
    "Agency Owner / SEO Freelancer",
    "Local Business Owner",
    "Multi-location Business Manager",
  ];

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
    // Immediately update the Redux store for persistence
    updateFormData(newData);
  };

  const handleNext = async () => {
    updateFormData(localData);

    // Save business details to server before proceeding
    try {
      await dispatch(saveBusinessDetails()).unwrap();
      onNext();
    } catch (error) {
      console.error("Failed to save business details:", error);
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
          Tell us about your business
        </h2>
        <p className="text-base sm:text-lg lg:text-xl text-gray-600">
          We'll use this information to customize your experience
        </p>
      </div>

      <div className=" p-4 sm:p-6 lg:p-8 xl:p-10  space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Business/Agency Name - Full Width */}
        <div>
          <Label
            htmlFor="businessName"
            className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3 block"
          >
            Business/Agency Name *
          </Label>
          <Input
            id="businessName"
            value={localData.businessName}
            onChange={(e) => handleChange("businessName", e.target.value)}
            placeholder="Enter your business or agency name"
            className="h-10 text-sm sm:text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Website and Company Email - Same Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
          <div>
            <Label
              htmlFor="website"
              className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3 block"
            >
              Website
            </Label>
            <Input
              id="website"
              value={localData.website}
              onChange={(e) => handleChange("website", e.target.value)}
              placeholder="https://yourbusiness.com"
              className="h-10 text-sm sm:text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <Label
              htmlFor="email"
              className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3 block"
            >
              Company Email *
            </Label>
            <Input
              id="email"
              type="email"
              value={localData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="business@example.com"
              className="h-10 text-sm sm:text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Preferred Timezone and Business Type - Same Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
          <div>
            <Label
              htmlFor="timezone"
              className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3 block"
            >
              Preferred Timezone *
            </Label>
            <Select
              value={localData.timezone}
              onValueChange={(value) => handleChange("timezone", value)}
            >
              <SelectTrigger className="h-10 text-sm sm:text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Select your timezone" />
              </SelectTrigger>
              <SelectContent>
                {timeZoneData && Array.isArray(timeZoneData)
                  ? timeZoneData.map((timezone) => (
                      <SelectItem
                        key={timezone}
                        value={timezone}
                        className="text-sm sm:text-base py-2 sm:py-3"
                      >
                        {timezone}
                      </SelectItem>
                    ))
                  : timeZoneData && typeof timeZoneData === "object"
                  ? Object.entries(timeZoneData).map(([value, label]) => (
                      <SelectItem
                        key={value}
                        value={value}
                        className="text-sm sm:text-base py-2 sm:py-3"
                      >
                        {String(label)}
                      </SelectItem>
                    ))
                  : null}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label
              htmlFor="businessType"
              className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3 block"
            >
              What best describes you? *
            </Label>
            <Select
              value={localData.businessType}
              onValueChange={(value) => handleChange("businessType", value)}
            >
              <SelectTrigger className="h-10 text-sm sm:text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Select business type" />
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
          </div>
        </div>
        <div>
          <Label
            htmlFor="businessType"
            className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3 block"
          >
            How many locations do you want to manage?
          </Label>

          <Select
            value={localData.locationCount}
            onValueChange={(value) => handleChange("locationCount", value)}
          >
            <SelectTrigger className="h-10 text-sm sm:text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500">
              <SelectValue placeholder="Select listing range" />
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
            {saveInProgress ? "Saving..." : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BusinessInfoStep;
