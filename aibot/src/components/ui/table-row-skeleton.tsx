import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface TableRowSkeletonProps {
  columns: number;
}

export const TableRowSkeleton: React.FC<TableRowSkeletonProps> = ({ columns }) => {
  return (
    <TableRow className="border-border">
      {Array.from({ length: columns }).map((_, index) => (
        <TableCell key={index} className="h-16">
          <Skeleton className="h-4 w-full" />
        </TableCell>
      ))}
    </TableRow>
  );
};