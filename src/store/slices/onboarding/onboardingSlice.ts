import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  getBusinessDetails,
  updateBusinessDetails,
  BusinessDetails,
  UpdateBusinessDetailsPayload,
} from "@/api/businessApi";

import {
  getGoalList,
  updateGoalList,
  GoalListResponse,
  UpdateGoalListPayload,
} from "@/api/goalApi";

// Interface for Google Business Profile listings
export interface GoogleBusinessListing {
  id: string;
  locationName: string;
  address: string;
  country: string;
  category?: string;
  isActive: number;
  isVerified: number;
  state: string;
  zipcode: number;
}

// Interface for Google OAuth response data
export interface GoogleOAuthResponseData {
  profileEmail: string;
  accountId: string;
  locations: GoogleBusinessListing[];
  totalListing: number;
  allowedListing: number;
}
export interface OnboardingState {
  currentStep: number;
  formData: {
    businessName: string;
    website: string;
    email: string;
    timezone: string;
    businessType: string;
    dashboardType: string;
    locationCount: string;
    goals: string[];
    googleConnected: boolean;
    selectedListings: string[];
  };
  businessDetails: BusinessDetails | null;
  businessDetailsLoading: boolean;
  businessDetailsError: string | null;
  goalsData: GoalListResponse | null;
  goalsLoading: boolean;
  goalsError: string | null;
  goalsSaveLoading: boolean;
  goalsSaveError: string | null;
  isCompleted: boolean;
  saveInProgress: boolean;
  saveError: string | null;
  oauthParams: {
    code: string | null;
    searchParams: Record<string, string> | null;
    processed: boolean;
  };
  googleBusinessData: GoogleOAuthResponseData | null;
}

// Load current step from localStorage
const loadCurrentStepFromStorage = (): number => {
  try {
    const savedStep = localStorage.getItem("onboarding_current_step");
    return savedStep ? parseInt(savedStep, 10) : 1;
  } catch (error) {
    console.error("Error loading step from localStorage:", error);
    return 1;
  }
};

// Save current step to localStorage
const saveCurrentStepToStorage = (step: number) => {
  try {
    localStorage.setItem("onboarding_current_step", step.toString());
  } catch (error) {
    console.error("Error saving step to localStorage:", error);
  }
};

const initialState: OnboardingState = {
  currentStep: loadCurrentStepFromStorage(),
  formData: {
    businessName: "",
    website: "",
    email: "",
    timezone: "",
    businessType: "",
    dashboardType: "",
    locationCount: "",
    goals: [],
    googleConnected: false,
    selectedListings: [],
  },
  businessDetails: null,
  businessDetailsLoading: false,
  businessDetailsError: null,
  goalsData: null,
  goalsLoading: false,
  goalsError: null,
  goalsSaveLoading: false,
  goalsSaveError: null,
  isCompleted: false,
  saveInProgress: false,
  saveError: null,
  oauthParams: {
    code: null,
    searchParams: null,
    processed: false,
  },
  googleBusinessData: null,
};

//  Helper function to map form data to API payload
const mapFormDataToBusinessPayload = (
  formData: OnboardingState["formData"]
): UpdateBusinessDetailsPayload => {
  // Map business type back to agency type
  const mapBusinessTypeToAgencyType = (businessType: string) => {
    switch (businessType) {
      case "Multi listing Dashboard":
        return "multi_owner";
      case "Single listing Dashboard":
        return "local_business";
      default:
        return "local_business";
    }
  };

  // Map location count to manage listing number
  const mapLocationCountToManageListing = (locationCount: string) => {
    switch (locationCount) {
      case "1-10":
        return 10;
      case "11-20":
        return 20;
      case "21-40":
        return 40;
      case "41-100":
        return 100;
      case "101-200":
        return 200;
      case "201+":
        return 500;
      default:
        return 10;
    }
  };

  return {
    company_name: formData.businessName,
    timezone: formData.timezone,
    website: formData.website,
    email: formData.email,
    agencyType: mapBusinessTypeToAgencyType(formData.businessType),
    manageListing: mapLocationCountToManageListing(formData.locationCount),
  };
};

// Async thunk for fetching business details
export const fetchBusinessDetails = createAsyncThunk(
  "onboarding/fetchBusinessDetails",
  async () => {
    const businessDetails = await getBusinessDetails();
    return businessDetails;
  }
);

// Async thunk for saving business details
export const saveBusinessDetails = createAsyncThunk(
  "onboarding/saveBusinessDetails",
  async (_, { getState }) => {
    const state = getState() as { onboarding: OnboardingState };
    const payload = mapFormDataToBusinessPayload(state.onboarding.formData);
    const result = await updateBusinessDetails(payload);
    return result;
  }
);

// Async thunk for fetching goals
export const fetchGoals = createAsyncThunk(
  "onboarding/fetchGoals",
  async () => {
    const response = await getGoalList();
    return response;
  }
);

// Async thunk for saving goals
export const saveGoals = createAsyncThunk(
  "onboarding/saveGoals",
  async (goalIds: number[]) => {
    const payload = { listIds: goalIds };
    const response = await updateGoalList(payload);
    return response;
  }
);

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
      saveCurrentStepToStorage(action.payload);
    },
    updateFormData: (
      state,
      action: PayloadAction<Partial<OnboardingState["formData"]>>
    ) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    nextStep: (state) => {
      if (state.currentStep < 5) {
        state.currentStep += 1;
        saveCurrentStepToStorage(state.currentStep);
      }
    },
    previousStep: (state) => {
      if (state.currentStep > 1) {
        state.currentStep -= 1;
        saveCurrentStepToStorage(state.currentStep);
      }
    },
    completeOnboarding: (state) => {
      state.isCompleted = true;
      localStorage.setItem("onboarding", "0");
      localStorage.setItem("onboarding_current_step", "6");
    },
    resetOnboarding: (state) => {
      localStorage.removeItem("onboarding_current_step");
      return { ...initialState, currentStep: 1 };
    },
    clearSaveError: (state) => {
      state.saveError = null;
    },
    clearGoalsError: (state) => {
      state.goalsError = null;
      state.goalsSaveError = null;
    },
    setOauthParams: (
      state,
      action: PayloadAction<{
        code: string;
        searchParams: Record<string, string>;
        processed: boolean;
      }>
    ) => {
      state.oauthParams = action.payload;
    },
    clearOauthParams: (state) => {
      state.oauthParams = {
        code: null,
        searchParams: null,
        processed: false,
      };
    },
    markOauthProcessed: (state) => {
      state.oauthParams.processed = true;
    },
    setGoogleBusinessData: (
      state,
      action: PayloadAction<GoogleOAuthResponseData>
    ) => {
      state.googleBusinessData = action.payload;
      state.formData.googleConnected = true;
    },
    clearGoogleBusinessData: (state) => {
      state.googleBusinessData = null;
      state.formData.googleConnected = false;
    },
    toggleListingActive: (state, action: PayloadAction<string>) => {
      if (state.googleBusinessData?.locations) {
        const listingId = action.payload;
        const listing = state.googleBusinessData.locations.find(
          (loc) => loc.id === listingId
        );
        if (listing) {
          listing.isActive = listing.isActive ? 0 : 1;
        }
      }
    },
    setAllListingsActive: (state, action: PayloadAction<boolean>) => {
      if (state.googleBusinessData?.locations) {
        state.googleBusinessData.locations.forEach((listing) => {
          listing.isActive = action.payload ? 1 : 0;
        });
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch business details
      .addCase(fetchBusinessDetails.pending, (state) => {
        state.businessDetailsLoading = true;
        state.businessDetailsError = null;
      })
      .addCase(fetchBusinessDetails.fulfilled, (state, action) => {
        state.businessDetailsLoading = false;
        state.businessDetails = action.payload;
      })
      .addCase(fetchBusinessDetails.rejected, (state, action) => {
        state.businessDetailsLoading = false;
        state.businessDetailsError =
          action.error.message || "Failed to fetch business details";
      })
      // Save business details
      .addCase(saveBusinessDetails.pending, (state) => {
        state.saveInProgress = true;
        state.saveError = null;
      })
      .addCase(saveBusinessDetails.fulfilled, (state) => {
        state.saveInProgress = false;
      })
      .addCase(saveBusinessDetails.rejected, (state, action) => {
        state.saveInProgress = false;
        state.saveError =
          action.error.message || "Failed to save business details";
      })
      // Fetch goals
      .addCase(fetchGoals.pending, (state) => {
        state.goalsLoading = true;
        state.goalsError = null;
      })
      .addCase(fetchGoals.fulfilled, (state, action) => {
        state.goalsLoading = false;
        state.goalsData = action.payload;

        // If there are active goals, update the form data
        if (action.payload.data && action.payload.data.activeList) {
          const selectedGoals = action.payload.data.activeList.map(
            (goal: any) => (typeof goal === "string" ? goal : goal.id)
          );
          if (selectedGoals.length > 0) {
            state.formData.goals = selectedGoals;
          }
        }
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.goalsLoading = false;
        state.goalsError = action.error.message || "Failed to fetch goals";
      })
      // Save goals
      .addCase(saveGoals.pending, (state) => {
        state.goalsSaveLoading = true;
        state.goalsSaveError = null;
      })
      .addCase(saveGoals.fulfilled, (state) => {
        state.goalsSaveLoading = false;
      })
      .addCase(saveGoals.rejected, (state, action) => {
        state.goalsSaveLoading = false;
        state.goalsSaveError = action.error.message || "Failed to save goals";
      });
  },
});

export const {
  setCurrentStep,
  updateFormData,
  nextStep,
  previousStep,
  completeOnboarding,
  resetOnboarding,
  clearSaveError,
  clearGoalsError,
  setOauthParams,
  clearOauthParams,
  markOauthProcessed,
  setGoogleBusinessData,
  clearGoogleBusinessData,
  toggleListingActive,
  setAllListingsActive,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;
