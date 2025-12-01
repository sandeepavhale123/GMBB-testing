import { useState, useMemo } from "react";
import { useGetLeadGeoKeywords, useGetLeadKeywordDetails } from "@/api/leadApi";

export interface LeadGeoKeyword {
  id: string;
  keyword: string;
  date: string;
  visibility?: number;
}

export interface LeadBusinessInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  category: string;
  mapUrl: string;
}

export interface LeadRankingData {
  atr: number;
  atrp: number;
  solvability: number;
  rankDetails: Array<{
    positionId: string;
    rank: number;
    coordinates: string;
  }>;
}

export const useLeadGeoRanking = (reportId: string, language?: string) => {
  const [selectedKeyword, setSelectedKeyword] = useState<string>("");

  // Fetch keywords and business info
  const {
    data: keywordsData,
    isLoading: keywordsLoading,
    error: keywordsError,
  } = useGetLeadGeoKeywords(reportId, language);

  // Fetch keyword details for selected keyword
  const {
    data: keywordDetailsData,
    isLoading: detailsLoading,
    error: detailsError,
  } = useGetLeadKeywordDetails(reportId, selectedKeyword, language);

  // Transform keywords data
  const keywords = useMemo<LeadGeoKeyword[]>(() => {
    if (!keywordsData?.data?.keywordDetails) return [];

    return keywordsData.data.keywordDetails.map((keyword) => ({
      id: keyword.keywordId,
      keyword: keyword.keyword,
      date: keyword.date,
      visibility: Math.floor(Math.random() * 40) + 60, // Temporary mock visibility
    }));
  }, [keywordsData]);

  // Transform business info
  const businessInfo = useMemo<LeadBusinessInfo | null>(() => {
    if (!keywordsData?.data?.reportDetails) return null;

    const details = keywordsData.data.reportDetails;
    return {
      name: details.bname,
      address: details.address,
      phone: details.phone,
      email: details.email,
      website: details.website,
      category: details.category,
      mapUrl: details.mapurl,
    };
  }, [keywordsData]);

  // Transform ranking data
  const rankingData = useMemo<LeadRankingData | null>(() => {
    if (!keywordDetailsData?.data) return null;

    const data = keywordDetailsData.data;
    return {
      atr: parseFloat(data.rankStats.atr),
      atrp: parseFloat(data.rankStats.atrp),
      solvability: parseFloat(data.rankStats.solvability),
      rankDetails: data.rankDetails.map((detail) => ({
        positionId: detail.positionId,
        rank: parseInt(detail.rank),
        coordinates: detail.coordinate,
      })),
    };
  }, [keywordDetailsData]);

  // Transform project details for map section
  const projectDetails = useMemo(() => {
    if (!keywordDetailsData?.data?.projectDetails) return null;

    const details = keywordDetailsData.data.projectDetails;
    return {
      id: details.id,
      keyword: details.keyword,
      distance: details.distance,
      grid: details.grid,
      date: details.date,
      sab: details.sab,
      schedule: details.schedule,
      mappoint: details.mappoint,
      coordinate: details.coordinate,
    };
  }, [keywordDetailsData]);

  // Available dates from keywords
  const availableDates = useMemo(() => {
    const uniqueDates = [...new Set(keywords.map((k) => k.date))];
    return uniqueDates.map((date, index) => ({
      id: (index + 1).toString(),
      prev_id: index.toString(),
      date,
    }));
  }, [keywords]);

  const handleKeywordChange = (keywordId: string) => {
    setSelectedKeyword(keywordId);
  };

  const handleDateChange = (dateId: string) => {
    // Date change logic can be implemented here if needed
  };

  const isLoading = keywordsLoading || detailsLoading;
  const error = keywordsError || detailsError;

  return {
    keywords,
    businessInfo,
    rankingData,
    projectDetails,
    availableDates,
    selectedKeyword,
    isLoading,
    error,
    handleKeywordChange,
    handleDateChange,
    setSelectedKeyword,
  };
};
