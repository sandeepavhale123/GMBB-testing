import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { useListingContext } from "@/context/ListingContext";
import {
  fetchBusinessInfo,
  refreshAndFetchBusinessInfo,
} from "../../store/slices/businessInfoSlice";

import { BusinessProfileCard } from "./BusinessProfileCard";
import { EditableBusinessHours } from "./EditableBusinessHours";
import { EditLogTab } from "../EditLog/EditLogTab";

import {
  transformBusinessInfo,
  transformWorkingHours,
} from "../../utils/businessDataTransform";

import { Alert, AlertDescription } from "../ui/alert";
import { AlertTriangle } from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import { NoListingSelected } from "../ui/no-listing-selected";

import { useI18nNamespace } from "@/hooks/useI18nNamespace";

type TabType = "business-info" | "opening-hours" | "edit-log";

/* -------------------------- REUSABLE COMPONENT ------------------------- */
const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 border-b border-gray-100">
    <span className="text-sm font-medium text-gray-700 sm:w-1/3">{label}</span>
    <span className="text-sm text-gray-900 sm:w-2/3 break-all">
      {value?.trim() || "-"}
    </span>
  </div>
);

/* ------------------------------ MAIN PAGE ------------------------------ */
const BusinessManagement: React.FC = () => {
  const { t } = useI18nNamespace("BusinessManagement/businessManagement");
  const { listingId } = useParams();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const { selectedListing, isInitialLoading } = useListingContext();
  const { data, isLoading, error, isRefreshing } = useAppSelector(
    (state) => state.businessInfo
  );

  const [activeTab, setActiveTab] = useState<TabType>("business-info");
  const [editMode, setEditMode] = useState(false);

  /* --------------------------- FETCH ON LOAD --------------------------- */
  useEffect(() => {
    if (listingId) {
      dispatch(fetchBusinessInfo({ listingId: Number(listingId) }));
    }
  }, [listingId, dispatch]);

  /* ------------------------------ REFRESH ------------------------------ */
  const handleRefresh = async () => {
    if (!listingId) return;

    try {
      await dispatch(
        refreshAndFetchBusinessInfo({ listingId: Number(listingId) })
      ).unwrap();

      toast({
        title: t("businessManagement.toast.refreshSuccessTitle"),
        description: t("businessManagement.toast.refreshSuccessDesc"),
        variant: "success",
      });
    } catch {
      toast({
        title: t("businessManagement.toast.refreshErrorTitle"),
        description: t("businessManagement.toast.refreshErrorDesc"),
        variant: "error",
      });
    }
  };

  /* --------------------------- MEMOIZED DATA --------------------------- */
  const businessInfo = data?.business_info || null;
  const statistics = data?.statistics || null;

  const transformedBusinessInfo = useMemo(
    () => (businessInfo ? transformBusinessInfo(businessInfo) : null),
    [businessInfo]
  );

  const transformedWorkingHours = useMemo(
    () => transformWorkingHours(data?.working_hours || []),
    [data?.working_hours]
  );

  /* --------------------------- EARLY RETURNS --------------------------- */
  if (!selectedListing && !isInitialLoading) {
    return <NoListingSelected pageType="Business Management" />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t("businessManagement.errorState.title")}
          </h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  /* --------------------------- FIELD LIST --------------------------- */
  const fields = transformedBusinessInfo
    ? [
        ["name", transformedBusinessInfo.name],
        ["address", transformedBusinessInfo.address],
        ["phone", transformedBusinessInfo.phone],
        ["website", transformedBusinessInfo.website],
        ["storeCode", transformedBusinessInfo.storeCode],
        ["category", transformedBusinessInfo.category],
        ["additionalCategory", transformedBusinessInfo.additionalCategory],
        ["labels", transformedBusinessInfo.labels],
        ["appointmentUrl", transformedBusinessInfo.appointmentUrl],
        ["mapUrl", transformedBusinessInfo.mapUrl],
        ["description", transformedBusinessInfo.description],
      ]
    : [];

  /* --------------------------- RENDER BUSINESS INFO --------------------------- */
  const renderBusinessInfo = () => {
    if (isLoading) {
      return (
        <div className="space-y-6 animate-pulse">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex justify-between py-4 border-b">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      );
    }

    if (!transformedBusinessInfo) {
      return (
        <div className="text-center py-8 text-gray-500">
          {t("businessManagement.emptyState.businessInfo")}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="space-y-5">
          {fields.map(([key, value]) => (
            <InfoRow
              key={key}
              label={t(`businessManagement.fields.${key}`)}
              value={value}
            />
          ))}
        </div>

        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            {t("businessManagement.warnings.fakeInfo")}
          </AlertDescription>
        </Alert>
      </div>
    );
  };

  /* ------------------------------ MAIN JSX ------------------------------ */
  return (
    <div className="space-y-6 mx-auto">
      <BusinessProfileCard
        businessInfo={businessInfo}
        statistics={statistics}
        isLoading={isLoading}
        isRefreshing={isRefreshing}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onRefresh={handleRefresh}
      />

      <div className="bg-white rounded-lg border">
        {activeTab === "business-info" && <div className="p-8">{renderBusinessInfo()}</div>}

        {activeTab === "opening-hours" && (
          <div className="p-6">
            <EditableBusinessHours
              initialWorkingHours={transformedWorkingHours}
              editMode={editMode}
              onSave={() => setEditMode(false)}
              onCancel={() => setEditMode(false)}
              onEdit={() => setEditMode(true)}
            />
          </div>
        )}

        {activeTab === "edit-log" && (
          <div className="p-6">
            {listingId && <EditLogTab listingId={Number(listingId)} />}
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessManagement;
