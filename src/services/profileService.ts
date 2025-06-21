
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

export const profileService = {
  getUserProfile: async (): Promise<ProfileData> => {
    const response = await axiosInstance.get("/get-user-profile");
    return response.data.data.profileDetails;
  },

  getTimezones: async (): Promise<TimezoneOption> => {
    const response = await axiosInstance.get("/get-timezone");
    return response.data.data.timezones;
  },

  updateProfile: async (profileData: UpdateProfileData): Promise<void> => {
    await axiosInstance.post("/update-profile", profileData);
  },

  verifyCurrentPassword: async (
    data: VerifyPasswordData,
    storedPassword: string
  ): Promise<boolean> => {
    // Compare the entered password with the stored password from profile data
    return data.currentPassword === storedPassword;
  },
};
