import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import {
  setCurrentStep,
  updateFormData,
  nextStep,
  previousStep,
  completeOnboarding,
  resetOnboarding,
  saveBusinessDetails,
  fetchGoals,
  saveGoals,
  clearGoalsError,
  setOauthParams,
  clearOauthParams,
  OnboardingState,
  markOauthProcessed,
  setGoogleBusinessData,
  clearGoogleBusinessData,
  GoogleOAuthResponseData,
  toggleListingActive,
  setAllListingsActive,
} from "./onboardingSlice";

export const useOnboarding = () => {
  const dispatch: AppDispatch = useDispatch();
  const onboardingState = useSelector((state: RootState) => state.onboarding);

  const goToStep = (step: number) => {
    dispatch(setCurrentStep(step));
  };

  const updateData = (data: Partial<OnboardingState["formData"]>) => {
    dispatch(updateFormData(data));
  };

  const handleNext = () => {
    // Save business details when moving from step 1
    if (onboardingState.currentStep === 1) {
      dispatch(saveBusinessDetails());
    }
    // Save goals when moving from step 2
    if (onboardingState.currentStep === 2) {
      const goalIds = onboardingState.formData.goals.map((id) =>
        parseInt(id, 10)
      );
      dispatch(saveGoals(goalIds));
    }

    dispatch(nextStep());
  };

  const handleBack = () => {
    dispatch(previousStep());
  };

  const complete = () => {
    dispatch(completeOnboarding());
  };

  const reset = () => {
    dispatch(resetOnboarding());
  };

  const saveBusinessInfo = () => {
    dispatch(saveBusinessDetails());
  };

  // const loadGoals = () => {
  //   dispatch(fetchGoals());
  // };

  const saveUserGoals = (goalIds: number[]) => {
    return dispatch(saveGoals(goalIds));
  };

  const clearGoalsErrors = () => {
    dispatch(clearGoalsError());
  };
  const setOauthParameters = (
    code: string,
    searchParams: URLSearchParams,
    processed: boolean
  ) => {
    const searchParamsObject: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      searchParamsObject[key] = value;
    });

    dispatch(
      setOauthParams({ code, searchParams: searchParamsObject, processed })
    );
  };
  const handleMarkOauthProcessed = () => {
    dispatch(markOauthProcessed());
  };
  const clearOauthParameters = () => {
    dispatch(clearOauthParams());
  };
  const setGoogleBusinessListings = (data: GoogleOAuthResponseData) => {
    dispatch(setGoogleBusinessData(data));
  };

  const clearGoogleBusinessListings = () => {
    dispatch(clearGoogleBusinessData());
  };

  const toggleListingSelection = (listingId: string) => {
    dispatch(toggleListingActive(listingId));
  };

  const setAllListingsSelection = (isActive: boolean) => {
    dispatch(setAllListingsActive(isActive));
  };

  return {
    ...onboardingState,
    goToStep,
    updateData,
    handleNext,
    handleBack,
    complete,
    reset,
    saveBusinessInfo,
    saveUserGoals,
    clearGoalsErrors,
    setOauthParameters,
    markOauthProcessed: handleMarkOauthProcessed,
    clearOauthParameters,
    setGoogleBusinessListings,
    clearGoogleBusinessListings,
    toggleListingSelection,
    setAllListingsSelection,
  };
};
