import axios from 'axios';

export interface BulkReplyGroup {
  id: string;
  labelName: string;
  google_locid: string;
  locCount: number;
}

export interface BulkReplyLocation {
  id: string;
  locationName: string;
  zipCode: string;
  google_account_id: string;
  name: string;
  setting: string;
  setting_type: string;
}

export interface BulkReplyDetailsResponse {
  code: number;
  message: string;
  data: {
    groupsLists: BulkReplyGroup[];
    locationLists: BulkReplyLocation[];
  };
}

export const bulkAutoReplyApi = {
  getBulkReplyDetails: async (): Promise<BulkReplyDetailsResponse> => {
    const response = await axios.post('/get-bulk-reply-details');
    return response.data;
  },
};