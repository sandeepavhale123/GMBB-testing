import React, { useState, Suspense } from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useListingContext } from "@/context/ListingContext";
import { useReports } from "@/hooks/useReports";
// import { ReportsTable } from "./ReportsTable";
import { CreateReportModal } from "./CreateReportModal";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

const ReportsTable = React.lazy(() =>import("./ReportsTable"));

const ReportsPage: React.FC = () => {
  const { t } = useI18nNamespace("Reports/reportsPage");
  const { selectedListing } = useListingContext();
  const {
    data: reports,
    isLoading,
    error,
  } = useReports(selectedListing?.id || "");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  if (isLoading) {
    return (
      <LoadingComponent />
    );
  }
  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-destructive">{t("reportsPage.error")}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="p-0 ">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-foreground">
          {t("reportsPage.pageTitle")}
        </h1>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {t("reportsPage.createReportButton")}
        </Button>
      </div>
      {/* Reports Table */}
      <Suspense fallback={<LoadingComponent />}>
        <ReportsTable listingId={selectedListing?.id || ""} />
      </Suspense>
      {/* Create Report Modal */}
      <CreateReportModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </div>
  );
};


export default ReportsPage;



const LoadingComponent = () => {
  return (<div className="p-6">
    <div className="text-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
    </div>
  </div>)
}