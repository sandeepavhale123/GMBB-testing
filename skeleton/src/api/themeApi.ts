import axiosInstance from "./axiosInstance";
import { v4 as uuidv4 } from "uuid";

export interface ThemeUpdateData {
  accent_color: string;
  selected_theme: string;
  bg_color: string;
  label_color: string;
  active_menu_bg_color: string;
  active_menu_label_color: string;
  sidebar_border_color?: string;
  sidebar_hover_text_color?: string;
  light_logo?: File | null;
  dark_logo?: File | null;
  favicon?: File | null;
}

export interface ThemeApiResponse {
  code: number;
  message: string;
  data: any[];
}

export interface GetThemeResponse {
  code: number;
  message: string;
  data: {
    accent_color: string;
    selected_theme: string;
    bg_color: string;
    label_color: string;
    active_menu_bg_color: string;
    active_menu_label_color: string;
    sidebar_border_color?: string;
    sidebar_hover_text_color?: string;
    light_logo: string;
    dark_logo: string;
    favicon: string;
    companyName?: string;
  };
}

export const getTheme = async (): Promise<GetThemeResponse> => {
  const domain = window.location.hostname;

  const response = await axiosInstance.post<GetThemeResponse>("/get-theme", {
    domain,
  });

  return response.data;
};

export const updateTheme = async (
  themeData: ThemeUpdateData
): Promise<ThemeApiResponse> => {
  const formData = new FormData();

  // Add text fields directly to FormData
  formData.append("accent_color", themeData.accent_color);
  formData.append("selected_theme", themeData.selected_theme);
  formData.append("bg_color", themeData.bg_color);
  formData.append("label_color", themeData.label_color);
  formData.append("active_menu_bg_color", themeData.active_menu_bg_color);
  formData.append("active_menu_label_color", themeData.active_menu_label_color);

  // Add file fields if they exist
  if (themeData.light_logo) {
    formData.append("light_logo", themeData.light_logo);
  }

  if (themeData.dark_logo) {
    formData.append("dark_logo", themeData.dark_logo);
  }

  if (themeData.favicon) {
    formData.append("favicon", themeData.favicon);
  }

  const response = await axiosInstance.post<ThemeApiResponse>(
    "/update-theme",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const deleteTheme = async () => {
  const response = await axiosInstance.post("/delete-theme", {
    isDelete: "delete",
  });
  return response.data;
};
