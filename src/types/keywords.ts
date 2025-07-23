
export interface Keyword {
  id: string;
  keyword: string;
  rank: number | null;
  addedOn: string;
  listingId: string;
}

export interface KeywordFormData {
  keyword: string;
}

export interface KeywordsListResponse {
  code: number;
  message: string;
  data: {
    keywords: Keyword[];
    total: number;
  };
}

export interface AddKeywordRequest {
  listingId: string;
  keywords: string[];
}

export interface AddKeywordResponse {
  code: number;
  message: string;
  data: {
    keywordIds: string[];
  };
}

export interface CheckRankRequest {
  listingId: string;
  keywordIds: string[];
}

export interface ExportFormat {
  format: 'csv' | 'json';
  data: Keyword[];
}
