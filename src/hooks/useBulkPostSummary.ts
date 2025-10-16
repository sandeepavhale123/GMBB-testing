import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "./useRedux";
import { fetchBulkPostSummary } from "../store/slices/postsSlice";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export const useBulkPostSummary = (bulkId: string) => {
  const { t } = useI18nNamespace("hooks/useBulkPostSummary");
  const dispatch = useAppDispatch();
  const { bulkPostSummary, bulkPostSummaryLoading, bulkPostSummaryError } =
    useAppSelector((state) => state.posts);

  useEffect(() => {
    if (bulkId) {
      dispatch(fetchBulkPostSummary({ bulkId: parseInt(bulkId) }));
    }
  }, [dispatch, bulkId]);

  const transformedBulkPost = useMemo(() => {
    if (!bulkPostSummary || bulkPostSummary.length === 0) return null;

    const summaryItem = bulkPostSummary[0]; // Get first item from summary

    return {
      title: summaryItem.event_title || t("bulkPostSummary.defaultTitle"),
      content: summaryItem.posttext,
      media: {
        images: summaryItem.image,
      },
      actionType: summaryItem.action_type,
      ctaUrl: summaryItem.CTA_url,
      publishDate: summaryItem.publishDate,
      status:
        summaryItem.state?.toLowerCase() === "live"
          ? "published"
          : summaryItem.state?.toLowerCase(),
      tags: summaryItem.tags,
    };
  }, [bulkPostSummary]);

  return {
    bulkPost: transformedBulkPost,
    loading: bulkPostSummaryLoading,
    error: bulkPostSummaryError,
  };
};
