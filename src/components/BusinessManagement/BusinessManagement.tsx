import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { useListingContext } from "@/context/ListingContext";
import {
  fetchBusinessInfo,
  refreshAndFetchBusinessInfo,
} from "../../store/slices/businessInfoSlice";
import { BusinessProfileCard } from "./BusinessProfileCard";
import { EditableBusinessHours } from "./EditableBusinessHours";
import {
  transformBusinessInfo,
  transformWorkingHours,
} from "../../utils/businessDataTransform";
import { EditLogTab } from "../EditLog/EditLogTab";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertTriangle, ExternalLink } from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import { NoListingSelected } from "../ui/no-listing-selected";
type TabType = "business-info" | "opening-hours" | "edit-log";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

const BusinessManagement: React.FC = () => {
  const { t } = useI18nNamespace("BusinessManagement/businessManagement");
  const { listingId } = useParams();
  const { selectedListing, isInitialLoading } = useListingContext();
  const dispatch = useAppDispatch();
  const { data, isLoading, error, isRefreshing, refreshError } = useAppSelector(
    (state) => state.businessInfo
  );
  const [activeTab, setActiveTab] = useState<TabType>("business-info");
  const [editMode, setEditMode] = useState(false);
  const { toast } = useToast();
  useEffect(() => {
    if (listingId) {
      dispatch(
        fetchBusinessInfo({
          listingId: parseInt(listingId),
        })
      );
    }
  }, [dispatch, listingId]);
  const handleRefresh = async () => {
    if (listingId) {
      try {
        await dispatch(
          refreshAndFetchBusinessInfo({
            listingId: parseInt(listingId),
          })
        ).unwrap();
        toast({
          title: t("businessManagement.toast.refreshSuccessTitle"),
          description: t("businessManagement.toast.refreshSuccessDesc"),
          variant: "success",
        });
      } catch (error) {
        toast({
          title: t("businessManagement.toast.refreshErrorTitle"),
          description: t("businessManagement.toast.refreshErrorDesc"),
          variant: "error",
        });
      }
    }
  };
  const businessInfo = data?.business_info || null;
  const statistics = data?.statistics || null;
  const workingHours = data?.working_hours || [];
  const transformedBusinessInfo = businessInfo
    ? transformBusinessInfo(businessInfo)
    : null;
  const transformedWorkingHours = transformWorkingHours(workingHours);
  const handleWorkingHoursSave = (hours: any) => {
    setEditMode(false);
  };
  const handleWorkingHoursCancel = () => {
    setEditMode(false);
  };
  const handleWorkingHoursEdit = () => {
    setEditMode(true);
  };
  const formatFieldValue = (value: string | null | undefined): string => {
    return value && value.trim() !== "" ? value : "-";
  };

  // Show no listing state
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
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Business Profile Card with integrated tabs */}
      <BusinessProfileCard
        businessInfo={businessInfo}
        statistics={statistics}
        isLoading={isLoading}
        isRefreshing={isRefreshing}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onRefresh={handleRefresh}
      />

      {/* Tab Content */}
      <div className="bg-white rounded-lg border border-gray-200">
        {activeTab === "business-info" && (
          <div className="p-8">
            {isLoading ? (
              <div className="space-y-6">
                <div className="animate-pulse">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center py-4 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : transformedBusinessInfo ? (
              <div className="space-y-6">
                {/* Business Details */}
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 border-b border-gray-100 gap-1 sm:gap-0">
                    <span className="text-sm font-medium text-gray-700 sm:w-1/3">
                      {t("businessManagement.fields.name")}
                    </span>
                    <span className="text-sm text-gray-900 sm:w-2/3">
                      {formatFieldValue(transformedBusinessInfo.name)}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 border-b border-gray-100 gap-1 sm:gap-0">
                    <span className="text-sm font-medium text-gray-700 sm:w-1/3">
                      {t("businessManagement.fields.address")}
                    </span>
                    <span className="text-sm text-gray-900 sm:w-2/3">
                      {formatFieldValue(transformedBusinessInfo.address)}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 border-b border-gray-100 gap-1 sm:gap-0">
                    <span className="text-sm font-medium text-gray-700 sm:w-1/3">
                      {t("businessManagement.fields.phone")}
                    </span>
                    <span className="text-sm text-gray-900 sm:w-2/3">
                      {formatFieldValue(transformedBusinessInfo.phone)}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 border-b border-gray-100 gap-1 sm:gap-0">
                    <span className="text-sm font-medium text-gray-700 sm:w-1/3">
                      {t("businessManagement.fields.website")}
                    </span>
                    <span className="text-sm text-gray-900 sm:w-2/3 break-all">
                      {formatFieldValue(transformedBusinessInfo.website)}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 border-b border-gray-100 gap-1 sm:gap-0">
                    <span className="text-sm font-medium text-gray-700 sm:w-1/3">
                      {t("businessManagement.fields.storeCode")}
                    </span>
                    <span className="text-sm text-gray-900 sm:w-2/3">
                      {formatFieldValue(transformedBusinessInfo.storeCode)}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 border-b border-gray-100 gap-1 sm:gap-0">
                    <span className="text-sm font-medium text-gray-700 sm:w-1/3">
                      {t("businessManagement.fields.category")}
                    </span>
                    <span className="text-sm text-gray-900 sm:w-2/3">
                      {formatFieldValue(transformedBusinessInfo.category)}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 border-b border-gray-100 gap-1 sm:gap-0">
                    <span className="text-sm font-medium text-gray-700 sm:w-1/3">
                      {t("businessManagement.fields.additionalCategory")}
                    </span>
                    <span className="text-sm text-gray-900 sm:w-2/3">
                      {formatFieldValue(
                        transformedBusinessInfo.additionalCategory
                      )}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 border-b border-gray-100 gap-1 sm:gap-0">
                    <span className="text-sm font-medium text-gray-700 sm:w-1/3">
                      {t("businessManagement.fields.labels")}
                    </span>
                    <span className="text-sm text-gray-900 sm:w-2/3">
                      {formatFieldValue(transformedBusinessInfo.labels)}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 border-b border-gray-100 gap-1 sm:gap-0">
                    <span className="text-sm font-medium text-gray-700 sm:w-1/3">
                      {t("businessManagement.fields.appointmentUrl")}
                    </span>
                    <span className="text-sm text-gray-900 sm:w-2/3 break-all">
                      {formatFieldValue(transformedBusinessInfo.appointmentUrl)}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 border-b border-gray-100 gap-1 sm:gap-0">
                    <span className="text-sm font-medium text-gray-700 sm:w-1/3">
                      {t("businessManagement.fields.mapUrl")}
                    </span>
                    <span className="text-sm text-gray-900 sm:w-2/3 break-all">
                      {formatFieldValue(transformedBusinessInfo.mapUrl)}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start py-4 gap-1 sm:gap-0">
                    <span className="text-sm font-medium text-gray-700 sm:w-1/3">
                      {t("businessManagement.fields.description")}
                    </span>
                    <span className="text-sm text-gray-900 sm:w-2/3">
                      {formatFieldValue(transformedBusinessInfo.description)}
                    </span>
                  </div>
                </div>

                {/* Yellow Warning Banner */}
                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    <div className="flex items-center justify-between">
                      <span>{t("businessManagement.warnings.fakeInfo")}</span>
                    </div>
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {t("businessManagement.emptyState.businessInfo")}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "opening-hours" && (
          <div className="p-6">
            <EditableBusinessHours
              initialWorkingHours={transformedWorkingHours}
              editMode={editMode}
              onSave={handleWorkingHoursSave}
              onCancel={handleWorkingHoursCancel}
              onEdit={handleWorkingHoursEdit}
            />
          </div>
        )}

        {activeTab === "edit-log" && (
          <div className="p-6">
            {listingId && <EditLogTab listingId={parseInt(listingId)} />}
          </div>
        )}
      </div>
    </div>
  );
};


export default BusinessManagement;
