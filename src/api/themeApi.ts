import axiosInstance from './axiosInstance';
import { v4 as uuidv4 } from 'uuid';

export interface ThemeUpdateData {
  accent_color: string;
  selected_theme: string;
  bg_color: string;
  label_color: string;
  active_menu_bg_color: string;
  active_menu_label_color: string;
  light_logo?: File | null;
  dark_logo?: File | null;
  favicon?: File | null;
}

export interface ThemeApiResponse {
  code: number;
  message: string;
  data: any[];
}

export const updateTheme = async (themeData: ThemeUpdateData): Promise<ThemeApiResponse> => {
  const formData = new FormData();
  
  // Create the form data structure as specified
  const formDataArray = [
    {
      key: 'accent_color',
      value: themeData.accent_color,
      type: 'text',
      uuid: uuidv4()
    },
    {
      key: 'selected_theme',
      value: themeData.selected_theme,
      type: 'text',
      uuid: uuidv4()
    },
    {
      key: 'bg_color',
      value: themeData.bg_color,
      type: 'text',
      uuid: uuidv4()
    },
    {
      key: 'label_color',
      value: themeData.label_color,
      type: 'text',
      uuid: uuidv4()
    },
    {
      key: 'active_menu_bg_color',
      value: themeData.active_menu_bg_color,
      type: 'text',
      uuid: uuidv4()
    },
    {
      key: 'active_menu_label_color',
      value: themeData.active_menu_label_color,
      type: 'text',
      uuid: uuidv4()
    }
  ];

  // Add file fields if they exist
  if (themeData.light_logo) {
    formDataArray.push({
      key: 'light_logo',
      type: 'file',
      uuid: uuidv4(),
      value: [themeData.light_logo.name]
    } as any);
    formData.append('light_logo', themeData.light_logo);
  }

  if (themeData.dark_logo) {
    formDataArray.push({
      key: 'dark_logo',
      type: 'file',
      uuid: uuidv4(),
      value: [themeData.dark_logo.name]
    } as any);
    formData.append('dark_logo', themeData.dark_logo);
  }

  if (themeData.favicon) {
    formDataArray.push({
      key: 'favicon',
      type: 'file',
      uuid: uuidv4(),
      value: [themeData.favicon.name]
    } as any);
    formData.append('favicon', themeData.favicon);
  }

  // Append the form data structure
  formData.append('form_data', JSON.stringify(formDataArray));

  const response = await axiosInstance.post<ThemeApiResponse>('/update-theme', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};