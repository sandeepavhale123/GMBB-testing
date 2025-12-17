// src/components/Citation/CitationManagement.tsx
import React, { useMemo, useCallback, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { CitationTrackerCard } from "./CitationTrackerCard";
import { LocalPagesCard } from "./LocalPagesCard";
import { usePossibleCitationList } from "@/hooks/useCitation";
import { useListingContext } from "@/context/ListingContext";
import { usePlaceOrderSetting } from "@/hooks/usePlaceOrderSetting";
import { PlaceOrderModal } from "./PlaceOrderModal";
import { Pencil } from "lucide-react";

type Props = {
  citationData: any;
  trackerData: any;
  citationTab: "existing" | "possible";
  setCitationTab: (s: "existing" | "possible") => void;
  onRefresh: () => void;
  t: (key: string) => string;
  isPending: boolean;
};

export const CitationManagement: React.FC<Props> = ({
  citationData,
  trackerData,
  citationTab,
  setCitationTab,
  onRefresh,
  t,
  isPending,
}) => {
  // ✅ MUST COME FIRST → otherwise selectedListing is undefined
  const { selectedListing } = useListingContext();
  const { settings: placeOrderSettings } = usePlaceOrderSetting();
  const [isPlaceOrderModalOpen, setIsPlaceOrderModalOpen] = useState(false);

  const existingCitationData = useMemo(
    () => citationData?.existingCitations || [],
    [citationData]
  );
  const possibleCitationData = useMemo(
    () => citationData?.possibleCitations || [],
    [citationData]
  );
  const totalChecked = trackerData?.totalChecked || 0;

  // Possible Citation List (disabled by default)
  const {
    data: possibleCitationList,
    refetch: refetchPossibleCitations,
    isFetching: loadingPossible,
  } = usePossibleCitationList(selectedListing?.id, false);

  const possibleRows = possibleCitationList?.data?.possibleCitations || [];

  const openWebsite = useCallback((website?: string) => {
    if (!website) return;
    const url =
      website.startsWith("http://") || website.startsWith("https://")
        ? website
        : `https://${website}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);


  const isDisabled = placeOrderSettings?.place_status !== 1;
  
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t("citationPage.management.title")}
          </h1>
          <p className="text-muted-foreground">
            {t("citationPage.management.description")}
          </p>
        </div>
        <div>
          <Button
            variant="outline"
            onClick={onRefresh}
            className="me-4"
            disabled={isPending}
          >
            {isPending
              ? t("citationPage.management.refreshing")
              : t("citationPage.management.refresh")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <CitationTrackerCard trackerData={trackerData} t={t} />
        <LocalPagesCard t={t} />
      </div>

      <Card className="mt-6">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg sm:text-xl">
              {t("citationPage.auditCard.title")}
            </CardTitle>
          </div>
          <div className="relative w-full sm:w-auto">
            {/* Pencil edit button - positioned top-right */}
            <Button
              variant="outline"
              size="icon"
              className="absolute -top-[12px] -right-[12px] z-10 rounded-full h-7 w-7 bg-background shadow-md border"
              onClick={() => setIsPlaceOrderModalOpen(true)}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>

            {/* Conditionally render Place Order button based on place_status */}
            {/* {placeOrderSettings?.place_status === 1 && (
              <Button
                asChild
                variant="default"
                className="w-full sm:w-auto text-sm disabled:opacity-75"
              >
                <a
                  href={
                    placeOrderSettings?.order_url ||
                    "https://orders.citationbuilderpro.com/store/43/local-citation-service"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {placeOrderSettings?.order_btn ||
                    t("citationPage.auditCard.orderButton")}
                </a>
              </Button>
            )} */}

             
            <Button
              variant="default"
              disabled={isDisabled}
              className="w-full sm:w-auto text-sm disabled:opacity-75"
            >
              {isDisabled ? (
                <span>
                  {placeOrderSettings?.order_btn ||
                    t("citationPage.auditCard.orderButton")}
                </span>
              ) : (
                <a
                  href={placeOrderSettings?.order_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {placeOrderSettings?.order_btn ||
                    t("citationPage.auditCard.orderButton")}
                </a>
              )}
            </Button>

          </div>
        </CardHeader>

        <CardContent>
          <div className="w-full">
            <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-6">
              <button
                onClick={() => setCitationTab("existing")}
                className={`px-3 py-2 sm:px-4 font-medium text-xs sm:text-sm rounded-md transition-colors whitespace-nowrap ${citationTab === "existing"
                    ? "bg-primary text-primary-foreground"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
              >
                {t("citationPage.auditCard.existingTab")}(
                {citationData?.existingCitation})
              </button>
              <button
                onClick={() => {
                  setCitationTab("possible");
                  if (selectedListing.id) refetchPossibleCitations(); // ✅ FIXED: API is now called
                }}
                className={`px-3 py-2 sm:px-4 font-medium text-xs sm:text-sm rounded-md transition-colors ${citationTab === "possible"
                    ? "bg-primary text-primary-foreground"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
              >
                {t("citationPage.auditCard.possibleTab")}({totalChecked})
              </button>
            </div>

            {citationTab === "existing" && (
              <div className="overflow-x-auto rounded-md border -mx-4 sm:mx-0">
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs sm:text-sm">
                        {t("citationPage.auditCard.table.website")}
                      </TableHead>
                      <TableHead className="text-xs sm:text-sm hidden sm:table-cell">
                        {t("citationPage.auditCard.table.businessName")}
                      </TableHead>
                      <TableHead className="text-xs sm:text-sm hidden md:table-cell">
                        {t("citationPage.auditCard.table.phone")}
                      </TableHead>
                      <TableHead className="text-xs sm:text-sm">
                        {t("citationPage.auditCard.table.action")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {existingCitationData.map((row: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2 sm:gap-4">
                            <img
                              src={`https://www.google.com/s2/favicons?sz=16&domain_url=${row.website}`}
                              alt="favicon"
                              className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                              onError={(e) =>
                                (e.currentTarget.src = "/default-icon.png")
                              }
                            />
                            <span className="text-xs sm:text-sm truncate">
                              {row.website}
                            </span>
                          </div>
                          <div className="sm:hidden text-xs text-muted-foreground mt-1">
                            {row.businessName} •{" "}
                            {row.phone && /^[\d+\-().\s]+$/.test(row.phone)
                              ? row.phone
                              : t("citationPage.noPhoneProvided")}
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-xs sm:text-sm">
                          {row.businessName}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-xs sm:text-sm">
                          {row.phone && /^[\d+\-().\s]+$/.test(row.phone)
                            ? row.phone
                            : t("citationPage.noPhoneProvided")}
                        </TableCell>
                        <TableCell>
                          <a
                            href={
                              row.website?.startsWith("http://") ||
                                row.website?.startsWith("https://")
                                ? row.website
                                : `https://${row.website}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-2 py-1 sm:px-3 sm:py-2 bg-primary text-primary-foreground rounded text-xs sm:text-sm hover:bg-primary/80 transition-colors w-full sm:w-auto"
                          >
                            {t("citationPage.auditCard.table.view")}
                          </a>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {citationTab === "possible" && (
              <div className="w-full overflow-x-auto rounded-md border">
                {/* Loader */}
                {loadingPossible && (
                  <div className="flex justify-center items-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                )}

                {/* No Data */}
                {!loadingPossible && possibleRows.length === 0 && (
                  <div className="text-center py-6 text-muted-foreground text-sm">
                    {t("citationPage.noPossibleCitations")}
                  </div>
                )}

                {/* Table */}
                {!loadingPossible && possibleRows.length > 0 && (
                  <Table className="min-w-max table-auto">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm">
                          {t("citationPage.auditCard.table.siteName")}
                        </TableHead>
                        <TableHead className="text-xs sm:text-sm text-right">
                          {t("citationPage.auditCard.table.action")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {possibleRows.map((row: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <img
                                src={`https://www.google.com/s2/favicons?sz=16&domain_url=${row.website}`}
                                className="w-4 h-4"
                                onError={(e) =>
                                  (e.currentTarget.src = "/default-icon.png")
                                }
                              />
                              {row.site}
                            </div>
                          </TableCell>

                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openWebsite(row.website)}
                            >
                              {t("citationPage.auditCard.table.fixNow")}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <PlaceOrderModal
        isOpen={isPlaceOrderModalOpen}
        onClose={() => setIsPlaceOrderModalOpen(false)}
      />
    </>
  );
};
