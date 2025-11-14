/**
 * Utility functions for managing application storage
 */

// Keys that should be preserved during logout (e.g., theme preferences)
const PRESERVED_KEYS = ["theme"];

export const clearAllStorage = () => {
  // Clear sessionStorage completely
  sessionStorage.clear();

  // Clear localStorage but preserve certain keys
  const preservedData: Record<string, string> = {};

  // Save preserved keys
  PRESERVED_KEYS.forEach((key) => {
    const value = localStorage.getItem(key);
    if (value) {
      preservedData[key] = value;
    }
  });

  // Clear all localStorage
  localStorage.clear();

  // Restore preserved keys
  Object.entries(preservedData).forEach(([key, value]) => {
    localStorage.setItem(key, value);
  });
};

export const clearAuthStorage = () => {
  // Store onboarding step before clearing
  const onboardingStep = localStorage.getItem("onboarding_current_step");

  // Clear auth-related sessionStorage items
  const authSessionKeys = ["post_refresh_path", "scrollY"];

  authSessionKeys.forEach((key) => {
    sessionStorage.removeItem(key);
  });

  // Clear auth-related localStorage items
  const authLocalKeys = [
    "access_token",
    "refresh_token",
    "user",
    "userId",
    "userBusinessListings",
    "selectedBusinessId",
  ];

  authLocalKeys.forEach((key) => {
    localStorage.removeItem(key);
  });

  // Restore onboarding step if it existed
  if (onboardingStep !== null) {
    localStorage.setItem("onboarding_current_step", onboardingStep);
  }
};

export const isStorageAvailable = (
  type: "localStorage" | "sessionStorage"
): boolean => {
  try {
    const storage = window[type];
    const testKey = "__storage_test__";
    storage.setItem(testKey, "test");
    storage.removeItem(testKey);
    return true;
  } catch (e) {
    console.warn(`${type} is not available:`, e);
    return false;
  }
};
