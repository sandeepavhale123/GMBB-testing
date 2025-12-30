import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const ActivityLogCardSkeleton: React.FC = () => {
  return (
    <Card className="p-4">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Section */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-28" />
            </div>
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-16 w-full" />
        </div>

        {/* Right Section */}
        <div className="lg:w-64 lg:border-l lg:pl-4 border-t lg:border-t-0 pt-4 lg:pt-0">
          <div className="flex flex-col items-center lg:items-start gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
      </div>
    </Card>
  );
};
