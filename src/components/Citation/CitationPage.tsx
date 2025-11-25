// src/components/Citation/CitationPage.tsx
import React, {
  Suspense,
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { useLocation } from "react-router-dom";
import { Loader } from "../ui/loader";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import { lazyImport } from "@/routes/lazyImport";
import { useListingContext } from "@/context/ListingContext";
import {
  useCreateCitationReport,
  useGetCitationReport,
  usePossibleCitationList,
  useRefreshCitationReport,
} from "@/hooks/useCitation";

// components we created
import { CitationTrackerCard } from "./CitationTrackerCard";
import { LocalPagesCard } from "./LocalPagesCard";
import { CitationSearchForm } from "./CitationSearchForm";
import { CitationManagement } from "./CitationManagement";

const GooglePlacesInput = lazyImport(() =>
  import("../ui/google-places-input").then((m) => ({
    default: m.GooglePlacesInput,
  }))
);

const PlaceOrderModal = lazyImport(() =>
  import("./PlaceOrderModal").then((m) => ({ default: m.PlaceOrderModal }))
);

const ReportProgressModal = lazyImport(() =>
  import("@/components/Dashboard/ReportProgressModal").then((m) => ({
    default: m.ReportProgressModal,
  }))
);

const CopyUrlModal = lazyImport(() =>
  import("@/components/Dashboard/CopyUrlModal").then((m) => ({
    default: m.CopyUrlModal,
  }))
);

export const CitationPage: React.FC = () => {
  const { t } = useI18nNamespace("Citation/citationPage");
  const location = useLocation();

  // UI states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [citationTab, setCitationTab] = useState<"existing" | "possible">(
    "existing"
  );
  const [reportProgressOpen, setReportProgressOpen] = useState(false);
  const [reportStatus, setReportStatus] = useState<
    "loading" | "success" | "error" | null
  >(null);
  const [reportUrl, setReportUrl] = useState<string>("");
  const [copyUrlModalOpen, setCopyUrlModalOpen] = useState(false);
  const [shouldShowCopyModal, setShouldShowCopyModal] = useState(false);

  const [searchData, setSearchData] = useState({
    businessName: "",
    phone: "",
    city: "",
  });

  const cityInputRef = useRef<any>(null);
  const { selectedListing } = useListingContext();

  const { mutate: createCitationReport, isPending: isCreating } =
    useCreateCitationReport();
  const { data: citationReportData, refetch } = useGetCitationReport(
    selectedListing?.id,
    hasSearched
  );
  const { mutate: refreshReport, isPending } = useRefreshCitationReport();

  const citationData = citationReportData?.data ?? null;
  const trackerData = citationData?.summary ?? null;
  const existingCitationCount = citationData?.existingCitation ?? 0;

  // Ensure page loading stops as soon as we have listing or citation data (instead of fixed 5s)
  useEffect(() => {
    // If we already have citation data or selected listing, hide loader quickly
    if (citationData || selectedListing) {
      const id = setTimeout(() => setIsPageLoading(false), 300);
      return () => clearTimeout(id);
    }
    // fallback timeout (very small)
    const id = setTimeout(() => setIsPageLoading(false), 1000);
    return () => clearTimeout(id);
  }, [citationData, selectedListing]);

  useEffect(() => {
    if (selectedListing?.name) {
      setSearchData((prev) => ({
        ...prev,
        businessName: selectedListing.name,
      }));
      // keep refetch behavior as original
      refetch();
    }
  }, [selectedListing, refetch]);

  const handlePlaceSelect = useCallback((formattedAddress: string) => {
    setSearchData((prev) => ({ ...prev, city: formattedAddress }));
  }, []);

  const handleRefresh = useCallback(() => {
    refreshReport({ listingId: selectedListing?.id, isRefresh: "refresh" });
  }, [refreshReport, selectedListing?.id]);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const cityValue = cityInputRef.current?.getValue() || searchData.city;
      const payload = {
        listingId: selectedListing?.id || 0,
        businessName: searchData.businessName,
        phone: searchData.phone,
        address: cityValue,
      };

      setReportUrl("");
      setReportProgressOpen(true);
      setReportStatus("loading");

      createCitationReport(payload, {
        onSuccess: (data: any) => {
          setReportStatus("success");

          const reportId = data.data.report_id;
          const shareableUrl = reportId
            ? `${window.location.origin}/lead/citation/${reportId}`
            : "";
          setReportUrl(shareableUrl);

          const isCitationViewRoute = /^\/citation\/\d+/.test(
            location.pathname
          );
          setShouldShowCopyModal(!isCitationViewRoute);

          setHasSearched(true);
          refetch();
        },
        onError: () => {
          setReportStatus("error");
        },
      });
    },
    [
      createCitationReport,
      location.pathname,
      refetch,
      searchData,
      selectedListing?.id,
    ]
  );

  const handleInputChange = useCallback((field: string, value: string) => {
    setSearchData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleCityInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleInputChange("city", e.target.value);
    },
    [handleInputChange]
  );

  const handleReportProgressSuccess = useCallback(() => {
    setReportProgressOpen(false);
    setReportStatus(null);
    if (shouldShowCopyModal) setCopyUrlModalOpen(true);
  }, [shouldShowCopyModal]);

  const handleReportProgressClose = useCallback((open: boolean) => {
    setReportProgressOpen(open);
    if (!open) {
      setReportStatus(null);
      setReportUrl("");
    }
  }, []);

  // Get possible citations - Disabled by default
  const {
    data: possibleCitationResponse,
    refetch: refetchPossibleCitations,
    isFetching: loadingPossible,
  } = usePossibleCitationList(selectedListing?.id, false);

  // Memoize derived arrays to avoid re-renders when parent updates unrelated state
  const existingCitationData = useMemo(
    () => citationData?.existingCitations || [],
    [citationData]
  );
  const possibleCitationData = useMemo(
    () => citationData?.possibleCitations || [],
    [citationData]
  );

  if (isPageLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Loader size="lg" text={t("citationPage.loading")} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {!hasSearched && !citationData?.report_id ? (
          <CitationSearchForm
            searchData={searchData}
            cityInputRef={cityInputRef}
            onInputChange={handleInputChange}
            onCityInputChange={handleCityInputChange}
            onPlaceSelect={handlePlaceSelect}
            onSubmit={handleSearch}
            isCreating={isCreating}
            t={t}
          />
        ) : (
          <CitationManagement
            citationData={citationData}
            trackerData={trackerData}
            citationTab={citationTab}
            setCitationTab={setCitationTab}
            onRefresh={handleRefresh}
            t={t}
            isPending={isPending}
          />
        )}
      </div>

      <Suspense fallback={null}>
        <PlaceOrderModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </Suspense>

      {reportStatus && (
        <Suspense fallback={null}>
          <ReportProgressModal
            open={reportProgressOpen}
            onOpenChange={handleReportProgressClose}
            reportType="citation-audit"
            status={reportStatus}
            onSuccess={handleReportProgressSuccess}
          />
        </Suspense>
      )}

      <Suspense fallback={null}>
        <CopyUrlModal
          open={copyUrlModalOpen}
          onOpenChange={setCopyUrlModalOpen}
          reportUrl={reportUrl}
        />
      </Suspense>
    </div>
  );
};
