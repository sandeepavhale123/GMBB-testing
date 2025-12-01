import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface BulkMediaSkeletonProps {
  count?: number;
}

export const BulkMediaSkeleton: React.FC<BulkMediaSkeletonProps> = React.memo(
  ({ count = 3 }) => {
    return (
      <>
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 border border-border rounded-lg"
          >
            <div className="flex items-center gap-4">
              <Skeleton className="w-12 h-12 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-8 w-12" />
            </div>
          </div>
        ))}
      </>
    );
  }
);

BulkMediaSkeleton.displayName = "BulkMediaSkeleton";
