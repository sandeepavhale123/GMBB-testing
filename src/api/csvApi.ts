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
  generateMultiCSVFile: async (
    request: GenerateCSVRequest
  ): Promise<GenerateCSVResponse> => {
    try {
      const response = await axiosInstance.post(
        "/generate-multicsv-file",
        request
      );
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  uploadBulkSheet: async (
    fileType: string,
    userFile: File
  ): Promise<UploadBulkSheetResponse> => {
    const formData = new FormData();
    formData.append("fileType", fileType);
    formData.append("userFile", userFile);

    try {
      const response = await axiosInstance.post(
        "/upload-bulk-sheet",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          // @ts-ignore - Custom property for skipping global error toast
          skipGlobalErrorToast: true,
        }
      );
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  saveBulkSheet: async (
    request: SaveBulkSheetRequest
  ): Promise<SaveBulkSheetResponse> => {
    try {
      const response = await axiosInstance.post("/save-bulk-sheet", request);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  getBulkCSVListing: async (
    request: GetBulkCSVListingRequest
  ): Promise<GetBulkCSVListingResponse> => {
    try {
      const response = await axiosInstance.post(
        "/get-bulkcsv-listing",
        request
      );
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  getListingPostDetails: async (
    request: GetListingPostDetailsRequest
  ): Promise<GetListingPostDetailsResponse> => {
    try {
      const response = await axiosInstance.post(
        "/get-listingpost-details",
        request
      );
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  getBulkCSVHistory: async (
    request: GetBulkCSVHistoryRequest
  ): Promise<GetBulkCSVHistoryResponse> => {
    try {
      const response = await axiosInstance.post(
        "/get-bulkcsv-history",
        request
      );
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  deleteBulkCSVHistory: async (
    request: DeleteBulkCSVHistoryRequest
  ): Promise<DeleteBulkCSVHistoryResponse> => {
    try {
      const response = await axiosInstance.post(
        "/delete-bulkcsv-history",
        request
      );
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  deleteBulkListingPosts: async (
    request: DeleteBulkListingPostsRequest
  ): Promise<DeleteBulkListingPostsResponse> => {
    try {
      const response = await axiosInstance.post(
        "/delete-bulklisting-posts",
        request
      );
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
};
