import axiosInstance from "@/api/axiosInstance";
import { profileService } from "./profileService";
import { store } from "@/store/store";
import { fetchUserProfile } from "@/store/slices/profileSlice";

export interface UpdateLanguageRequest {
  language: string;
}

export interface UpdateLanguageResponse {
  code: number;
  message: string;
  data: any[];
}

// Map i18n language codes to API expected language names
const languageCodeToName: Record<string, string> = {
  en: "english",
  es: "spanish",
  de: "german",
  it: "italian",
  fr: "french",
};

export const getLanguageName = (code: string): string => {
  return languageCodeToName[code] || "english";
};

export const languageService = {
  updateLanguage: async (language: string): Promise<UpdateLanguageResponse> => {
    // 1. Update language on backend
    const response = await axiosInstance.post("/update-language", { language });
    
    // 2. Refresh profile cache and Redux state
    try {
      await profileService.refreshUserProfile();
      await store.dispatch(fetchUserProfile());
    } catch (error) {
      // Log but don't fail - language was already updated successfully
      console.error("Failed to refresh profile after language update:", error);
    }
    
    return response.data;
  },
};
