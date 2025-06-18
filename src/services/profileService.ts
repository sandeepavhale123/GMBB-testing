
import axiosInstance from '../api/axiosInstance';

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
    const response = await axiosInstance.get('/v1/get-user-profile');
    return response.data.data.profileDetails;
  },

  getTimezones: async (): Promise<TimezoneOption> => {
    const response = await axiosInstance.get('/v1/get-timezone');
    return response.data.data.timezones;
  },

  updateProfile: async (profileData: UpdateProfileData): Promise<void> => {
    await axiosInstance.post('/v1/update-profile', profileData);
  },

  // Fix password verification to actually call a backend endpoint
  verifyCurrentPassword: async (data: VerifyPasswordData): Promise<boolean> => {
    try {
      const response = await axiosInstance.post('/v1/verify-password', {
        currentPassword: data.currentPassword
      });
      return response.data.success || response.data.valid;
    } catch (error) {
      console.error('Password verification failed:', error);
      return false;
    }
  }
};
