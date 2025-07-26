import React, { useState } from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useListingContext } from "@/context/ListingContext";
import { useReports } from "@/hooks/useReports";
import { ReportsTable } from "./ReportsTable";
import { CreateReportModal } from "./CreateReportModal";
export const ReportsPage: React.FC = () => {
  const {
    selectedListing
  } = useListingContext();
  const {
    data: reports,
    isLoading,
    error
  } = useReports(selectedListing?.id || "");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  if (isLoading) {
    return <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-500">Loading reports...</p>
      </div>;
  }
  if (error) {
    return <div className="p-6">
        <div className="text-center py-12">
          <p className="text-destructive">
            Error loading reports. Please try again.
          </p>
        </div>
      </div>;
  }
  return <div className="p-0 ">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-foreground">Reports</h1>
        <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Report
        </Button>
      </div>

      {/* Reports Table */}
      <ReportsTable listingId={selectedListing?.id || ""} />

      {/* Create Report Modal */}
      <CreateReportModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />
    </div>;
};