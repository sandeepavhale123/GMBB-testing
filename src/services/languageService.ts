import axiosInstance from "@/api/axiosInstance";

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
    const response = await axiosInstance.post("/update-language", { language });
    return response.data;
  },
};
