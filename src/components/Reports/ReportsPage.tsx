import React, { useState } from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useListingContext } from "@/context/ListingContext";
import { useReports } from "@/hooks/useReports";
import { ReportsTable } from "./ReportsTable";
import { CreateReportModal } from "./CreateReportModal";

export const ReportsPage: React.FC = () => {
  const { selectedListing } = useListingContext();
  const {
    data: reports,
    isLoading,
    error,
  } = useReports(selectedListing?.id || "");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-32 mb-6"></div>
          <div className="h-10 bg-gray-200 rounded w-40 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-destructive">
            Error loading reports. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Reports</h1>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Report
        </Button>
      </div>

      {/* Reports Table */}
      <ReportsTable reports={reports || []} />

      {/* Create Report Modal */}
      <CreateReportModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </div>
  );
};
