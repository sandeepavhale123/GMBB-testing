import axiosInstance from "./axiosInstance";

export interface GenerateCSVRequest {
  fileType: string;
  listingIds: string[];
}

export interface GenerateCSVResponse {
  code: number;
  message: string;
  data: {
    fileUrl: string;
    fileName: string;
  };
}

export interface ValidationRow {
  row: number;
  data: Record<string, any>;
  errors: string[];
}

export interface UploadBulkSheetResponse {
  code: number;
  message: string;
  data: {
    fileName: string;
    fileUrl: string;
    totalRows: number;
    errorCount: number;
    rows: ValidationRow[];
  };
}

export interface SaveBulkSheetRequest {
  fileType: string;
  fileName: string;
  note: string;
}

export interface SaveBulkSheetResponse {
  code: number;
  message: string;
  data: {
    insertedCount: number;
    insertedIds: number[];
    historyId: number;
  };
}

// Bulk Import Details APIs
export interface GetBulkCSVListingRequest {
  historyId: number;
  page: number;
  limit: number;
  search: string;
}

export interface BulkListing {
  id: string;
  listing_name: string;
  zipcode: string;
}

export interface GetBulkCSVListingResponse {
  code: number;
  message: string;
  data: {
    listings: BulkListing[];
    pagination: {
      page: number;
      limit: number;
      total: number;
    };
  };
}

export interface GetListingPostDetailsRequest {
  historyId: number;
  listingId: string;
  page: number;
  limit: number;
  search: string;
}

export interface BulkImportPost {
  id: string;
  search_url: string | null;
  text: string;
  image: string;
  action_type: string;
  url: string;
  state: string;
  event_title: string | null;
  posttype: string;
  tags: string;
  publishDate: string;
}

export interface GetListingPostDetailsResponse {
  code: number;
  message: string;
  data: {
    posts: BulkImportPost[];
    pagination: {
      page: number;
      limit: number;
      total: number;
    };
  };
}

// Bulk CSV History APIs
export interface GetBulkCSVHistoryRequest {
  page: number;
  limit: number;
  search: string;
}

export interface BulkCSVHistoryRecord {
  id: string;
  filename: string;
  note: string;
  date: string;
  total_posts: string;
  listing_count: string;
  status: string;
}

export interface GetBulkCSVHistoryResponse {
  code: number;
  message: string;
  data: {
    history: BulkCSVHistoryRecord[];
    pagination: {
      page: number;
      limit: number;
      total: number;
    };
  };
}

// Delete Bulk CSV History APIs
export interface DeleteBulkCSVHistoryRequest {
  historyId: number;
  isDelete: string;
}

export interface DeleteBulkCSVHistoryResponse {
  code: number;
  message: string;
  data: {
    historyId: number;
    updatedPostsCount: number;
  };
}

// Delete Bulk Listing Posts APIs
export interface DeleteBulkListingPostsRequest {
  historyId: number;
  postIds: number[];
  isDelete: string;
}

export interface DeleteBulkListingPostsResponse {
  code: number;
  message: string;
  data: {
    historyId: number;
    deletedPostIds: number[];
  };
}

export const csvApi = {
  generateMultiCSVFile: async (request: GenerateCSVRequest): Promise<GenerateCSVResponse> => {
    console.log('🌐 Making API request to /generate-multicsv-file with:', request);
    
    try {
      const response = await axiosInstance.post('/generate-multicsv-file', request);
      console.log('✅ API response received:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ API request failed:', {
        url: '/generate-multicsv-file',
        request,
        error: error?.message,
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        responseData: error?.response?.data
      });
      throw error;
    }
  },

  uploadBulkSheet: async (fileType: string, userFile: File): Promise<UploadBulkSheetResponse> => {
    console.log('🌐 Making API request to /upload-bulk-sheet with:', { fileType, fileName: userFile.name });
    
    const formData = new FormData();
    formData.append('fileType', fileType);
    formData.append('userFile', userFile);
    
    try {
      const response = await axiosInstance.post('/upload-bulk-sheet', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        // @ts-ignore - Custom property for skipping global error toast
        skipGlobalErrorToast: true
      });
      console.log('✅ Upload API response received:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Upload API request failed:', {
        url: '/upload-bulk-sheet',
        fileType,
        fileName: userFile.name,
        error: error?.message,
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        responseData: error?.response?.data
      });
      throw error;
    }
  },

  saveBulkSheet: async (request: SaveBulkSheetRequest): Promise<SaveBulkSheetResponse> => {
    console.log('🌐 Making API request to /save-bulk-sheet with:', request);
    
    try {
      const response = await axiosInstance.post('/save-bulk-sheet', request);
      console.log('✅ Save API response received:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Save API request failed:', {
        url: '/save-bulk-sheet',
        request,
        error: error?.message,
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        responseData: error?.response?.data
      });
      throw error;
    }
  },

  getBulkCSVListing: async (request: GetBulkCSVListingRequest): Promise<GetBulkCSVListingResponse> => {
    console.log('🌐 Making API request to /get-bulkcsv-listing with:', request);
    
    try {
      const response = await axiosInstance.post('/get-bulkcsv-listing', request);
      console.log('✅ Bulk CSV Listing API response received:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Bulk CSV Listing API request failed:', {
        url: '/get-bulkcsv-listing',
        request,
        error: error?.message,
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        responseData: error?.response?.data
      });
      throw error;
    }
  },

  getListingPostDetails: async (request: GetListingPostDetailsRequest): Promise<GetListingPostDetailsResponse> => {
    console.log('🌐 Making API request to /get-listingpost-details with:', request);
    
    try {
      const response = await axiosInstance.post('/get-listingpost-details', request);
      console.log('✅ Listing Post Details API response received:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Listing Post Details API request failed:', {
        url: '/get-listingpost-details',
        request,
        error: error?.message,
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        responseData: error?.response?.data
      });
      throw error;
    }
  },

  getBulkCSVHistory: async (request: GetBulkCSVHistoryRequest): Promise<GetBulkCSVHistoryResponse> => {
    console.log('🌐 Making API request to /get-bulkcsv-history with:', request);
    
    try {
      const response = await axiosInstance.post('/get-bulkcsv-history', request);
      console.log('✅ Bulk CSV History API response received:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Bulk CSV History API request failed:', {
        url: '/get-bulkcsv-history',
        request,
        error: error?.message,
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        responseData: error?.response?.data
      });
      throw error;
    }
  },

  deleteBulkCSVHistory: async (request: DeleteBulkCSVHistoryRequest): Promise<DeleteBulkCSVHistoryResponse> => {
    console.log('🌐 Making API request to /delete-bulkcsv-history with:', request);
    
    try {
      const response = await axiosInstance.post('/delete-bulkcsv-history', request);
      console.log('✅ Delete Bulk CSV History API response received:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Delete Bulk CSV History API request failed:', {
        url: '/delete-bulkcsv-history',
        request,
        error: error?.message,
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        responseData: error?.response?.data
      });
      throw error;
    }
  },

  deleteBulkListingPosts: async (request: DeleteBulkListingPostsRequest): Promise<DeleteBulkListingPostsResponse> => {
    console.log('🌐 Making API request to /delete-bulklisting-posts with:', request);
    
    try {
      const response = await axiosInstance.post('/delete-bulklisting-posts', request);
      console.log('✅ Delete Bulk Listing Posts API response received:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Delete Bulk Listing Posts API request failed:', {
        url: '/delete-bulklisting-posts',
        request,
        error: error?.message,
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        responseData: error?.response?.data
      });
      throw error;
    }
  }
};