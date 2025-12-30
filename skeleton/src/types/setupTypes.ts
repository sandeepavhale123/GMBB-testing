export interface ListingSetupData {
  gmbInfo: number;
  reviewData: number;
  insightData: number;
  qaData: number;
  postData: number;
  mediaData: number;
}

export interface ListingSetupResponse {
  code: number;
  message: string;
  data: ListingSetupData;
}

export interface SetupModule {
  key: keyof ListingSetupData;
  label: string;
  description: string;
  status: 'complete' | 'processing' | 'failed';
}

export interface SetupProgress {
  completed: number;
  total: number;
  percentage: number;
  isComplete: boolean;
}