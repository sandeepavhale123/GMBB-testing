import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Plus, Loader2 } from "lucide-react";
import { KeywordsTable } from "./KeywordsTable";
import { useNavigate } from "react-router-dom";
import { useListingContext } from "../../context/ListingContext";
import {
  getSearchKeywords,
  SearchKeywordData,
  deleteKeywords,
} from "../../api/geoRankingApi";
import { useToast } from "../../hooks/use-toast";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
export interface Keyword {
  id: string;
  keyword: string;
  date: string;
  solv: string;
  atrp: string;
  atr: string;
  status: string;
}
export const KeywordsPage: React.FC = () => {
  const { t } = useI18nNamespace("Keywords/keywordsPage");
  const navigate = useNavigate();
  const { selectedListing } = useListingContext();
  const { toast } = useToast();
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalKeywords, setTotalKeywords] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const fetchKeywords = async (page = 1) => {
    if (!selectedListing?.id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await getSearchKeywords({
        listingId: Number(selectedListing.id),
        page,
        limit: perPage,
      });
      if (response.code === 200) {
        setKeywords(response.data.keywords);
        setTotalPages(response.data.totalPages);
        setTotalKeywords(response.data.noOfKeyword);
        setCurrentPage(response.data.page);
        setPerPage(response.data.perPage);
      } else {
        throw new Error(response.message || t("keywords.errorFetch"));
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : t("keywords.errorFetch");
      setError(errorMessage);
      toast({
        title: t("keywords.errorTitle"),
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchKeywords();
  }, [selectedListing?.id]);
  const handlePageChange = (page: number) => {
    fetchKeywords(page);
  };
  const handleDeleteKeyword = async (ids: string[]) => {
    if (!selectedListing?.id) {
      toast({
        title: t("keywords.errorTitle"),
        description: t("keywords.errorNoListing"),
        variant: "destructive",
      });
      return;
    }
    setDeleteLoading(true);
    try {
      const keywordIds = ids.map((id) => parseInt(id, 10));
      await deleteKeywords({
        listingId: parseInt(selectedListing.id, 10),
        keywordIds,
        isDelete: "delete",
      });

      // Remove deleted keywords from local state
      setKeywords((prev) =>
        prev.filter((keyword) => !ids.includes(keyword.id))
      );

      // Update pagination if current page becomes empty
      const remainingKeywords = keywords.filter(
        (keyword) => !ids.includes(keyword.id)
      );
      if (remainingKeywords.length === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
        fetchKeywords(currentPage - 1);
      } else {
        // Refresh current page data
        fetchKeywords(currentPage);
      }
      toast({
        title: t("keywords.deletedTitle"),
        description: t("keywords.deletedMessage", {
          count: ids.length,
          plural: ids.length !== 1 ? "s" : "",
        }),
        // `${ids.length} keyword${
        //   ids.length !== 1 ? "s" : ""
        // } deleted successfully.`,
      });
    } catch (error) {
      // console.error("Error deleting keywords:", error);
      toast({
        title: t("keywords.errorTitle"),
        description: t("keywords.errorDelete"),
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {" "}
              {t("keywords.title")}
            </h1>
            <p className="text-gray-600 mt-1">
              {t("keywords.loadingSubtitle")}
            </p>
          </div>
          <Button disabled className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {t("keywords.addKeyword")}
          </Button>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t("keywords.title")}
          </h1>
          <p className="text-gray-600 mt-1">{t("keywords.subtitle")}</p>
        </div>
        <Button
          onClick={() => navigate(`/keywords/${selectedListing?.id}/add`)}
          className="flex items-center gap-2"
        >
          {t("keywords.searchKeyword")}
        </Button>
      </div>
      {/* Keywords Table */}
      <KeywordsTable
        keywords={keywords}
        onDeleteKeyword={handleDeleteKeyword}
        currentPage={currentPage}
        totalPages={totalPages}
        totalKeywords={totalKeywords}
        onPageChange={handlePageChange}
        loading={loading}
        error={error}
        perPage={perPage}
        onRefresh={() => fetchKeywords(currentPage)}
        listingId={selectedListing?.id || ""}
        deleteLoading={deleteLoading}
      />
    </div>
  );
};
