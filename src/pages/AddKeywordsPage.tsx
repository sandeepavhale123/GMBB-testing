import React, { useState } from "react";
import { AddKeywordsPage as AddKeywords } from "../components/Keywords/AddKeywordsPage";
import { useListingContext } from "../context/ListingContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../hooks/use-toast";
import { addSearchKeyword } from "../api/geoRankingApi";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

const AddKeywordsPage = () => {
  const { t } = useI18nNamespace("pages/addKeywordsPage");
  const [isAddingKeywords, setIsAddingKeywords] = useState(false);
  const { selectedListing } = useListingContext();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAddKeywords = async (keywords: string[], settings: any) => {
    if (!selectedListing?.id) {
      toast({
        title: t("addKeywordsPage.toast.errorTitle"),
        description: t("addKeywordsPage.toast.noListing"),
        variant: "destructive",
      });
      return;
    }

    setIsAddingKeywords(true);
    try {
      const response = await addSearchKeyword({
        listingId: Number(selectedListing.id),
        keywords,
        language: settings.language,
        distanceValue: settings.distanceValue,
        gridSize: settings.gridSize,
      });

      if (response.code === 200) {
        toast({
          title: t("addKeywordsPage.toast.keywordsAddedTitle"),
          description:
            response.message ||
            t("addKeywordsPage.toast.keywordsAddedDescription", {
              count: keywords.length,
            }),
        });

        // Navigate to keywords page.
        navigate(`/keywords/${selectedListing.id}`);
      } else {
        throw new Error(response.message || t("addKeywordsPage.toast.keywordsAddFailed"));
      }
    } catch (error) {
      console.error("Error adding keywords:", error);
      toast({
        title: t("addKeywordsPage.toast.errorTitle"),
        description: error.response.data.message,
        variant: "destructive",
      });
    } finally {
      setIsAddingKeywords(false);
    }
  };

  return <AddKeywords onAddKeywords={handleAddKeywords} isLoading={isAddingKeywords} />;
};

export default AddKeywordsPage;
