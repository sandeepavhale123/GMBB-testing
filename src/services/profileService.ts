import { languageMap } from "@/lib/languageMap";
import axiosInstance from "../api/axiosInstance";

export interface ProfileData {
  userId: string;
  first_name: string; // Keep this as it matches the API response
  last_name: string;
  username: string;
  profilePic: string;
  language: string;
  timezone: string;
  planExpDate: string;
  planName: string;
  password: string; // Add password field
  role?: string; // Add role field for admin checks
  planId?: string; // Add planId field for trial plan check
  dashboardType: number; // Add dashboardType field for routing
  dashboardFilterType: string; // Add dashboardFilterType field for saved dashboard preference
}

export interface UpdateProfileData {
  first_name: string;
  last_name: string;
  timezone: string;
  username: string;
  dashboardType: number;
  language: string;
  profilePic: string;
  password?: string; // Optional - only include when changing password
}

export interface TimezoneOption {
  [key: string]: string;
}

export interface VerifyPasswordData {
  currentPassword: string;
}

let cachedProfile: any | null = null; // 👈 cache variable
let inProgressRequest: Promise<any> | null = null; // 👈 handle race conditions
let cachedTimezones: any | null = null;
let inProgressTimezonesRequest: Promise<any> | null = null;

export const profileService = {
  // getUserProfile: async (): Promise<ProfileData> => {
  //   const response = await axiosInstance.get("/get-user-profile");
  //   return response.data.data.profileDetails;
  // },

  getUserProfile: async () => {
    // ✅ Return cached profile if available
    if (cachedProfile) {
      return cachedProfile;
    }

    // ✅ If a request is already in progress, wait for it instead of firing another
    if (inProgressRequest) {
      return inProgressRequest;
    }

    // ✅ Otherwise, make the API request
    inProgressRequest = axiosInstance
      .get("/get-user-profile")
      .then((res) => {
        cachedProfile = res.data?.data?.profileDetails || res.data; // store result
        inProgressRequest = null; // reset after completion

        const lang = languageMap[res.data?.data?.profileDetails.language];
        localStorage.setItem("i18nextLng", lang);
        return cachedProfile;
      })
      .catch((err) => {
        inProgressRequest = null; // reset on error too
        throw err;
      });

    return inProgressRequest;
  },

  // Optional: if you need to force refresh later
  refreshUserProfile: async () => {
    cachedProfile = null;
    return await profileService.getUserProfile();
  },

  // getTimezones: async (): Promise<TimezoneOption> => {
  //   const response = await axiosInstance.get("/get-timezone");
  //   return response.data.data.timezones;
  // },

  getTimezones: async (): Promise<TimezoneOption> => {
    // ✅ Return cached if available
    if (cachedTimezones) return cachedTimezones;

    // ✅ If already fetching, reuse that promise
    if (inProgressTimezonesRequest) return inProgressTimezonesRequest;

    // Otherwise fetch
    inProgressTimezonesRequest = axiosInstance
      .get("/get-timezone")
      .then((res) => {
        cachedTimezones = res.data.data.timezones;
        inProgressTimezonesRequest = null;
        return cachedTimezones;
      })
      .catch((err) => {
        inProgressTimezonesRequest = null;
        throw err;
      });

    return inProgressTimezonesRequest;
  },

  refreshTimezones: async () => {
    cachedTimezones = null;
    return await profileService.getTimezones();
  },

  updateProfile: async (profileData: UpdateProfileData): Promise<void> => {
    await axiosInstance.post("/update-profile", profileData);
    cachedProfile = null;
    return await profileService.getUserProfile();
  },

  verifyCurrentPassword: async (
    data: VerifyPasswordData,
    storedPassword: string
  ): Promise<boolean> => {
    // Compare the entered password with the stored password from profile data
    return data.currentPassword === storedPassword;
  },
};
