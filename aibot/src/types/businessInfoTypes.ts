
export interface BusinessInfoRequest {
  listingId: number;
}

export interface RefreshBusinessInfoRequest {
  listingId: number;
}

export interface RefreshBusinessInfoResponse {
  code: number;
  message: string;
  data: {
    locationId: number;
    updated: boolean;
  };
}

export interface BusinessInfo {
  id: string | null;
  name: string;
  address: string;
  phone: string;
  website: string;
  store_code: string;
  category: string;
  additional_category: string;
  labels: string;
  appointment_url: string;
  map_url: string;
  description: string;
  verification_status: string;
  profile_photo?: string;
  created_at: string;
  updated_at: string;
}

export interface BusinessStatistics {
  profile_views: number;
  position: number;
  visibility_score: number;
}

export interface WorkingHour {
  day: string;
  hours: string;
  is_open: boolean;
  open_time: string;
  close_time: string;
}

export interface EditLog {
  id: string;
  date: string;
  action: string;
  status: string;
  field_changed: string;
  old_value: string;
  new_value: string;
  reviewer_notes: string;
}

export interface BusinessInfoData {
  business_info: BusinessInfo;
  statistics: BusinessStatistics;
  working_hours: WorkingHour[];
  edit_logs: EditLog[];
}

export interface BusinessInfoResponse {
  code: number;
  message: string;
  data: BusinessInfoData;
}
