
import React from 'react';
import { format } from 'date-fns';

interface ExportHeaderProps {
  listingName?: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
}

export const ExportHeader: React.FC<ExportHeaderProps> = ({
  listingName = "Listing Name",
  dateRange
}) => {
  const getDateRangeText = () => {
    if (dateRange?.from && dateRange?.to) {
      const fromDate = format(dateRange.from, 'dd MMM yyyy');
      const toDate = format(dateRange.to, 'dd MMM yyyy');
      return `From : ${fromDate} - To : ${toDate}`;
    }
    return "From : 30 Jun 2025 - To : 01 May 2025";
  };

  return (
    <div className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-purple-700 text-white relative overflow-hidden print-only">
      {/* Logo Section */}
      <div className="absolute top-0 left-0 bg-black px-6 py-4 rounded-br-2xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">A9</span>
          </div>
          <span className="text-white font-semibold text-lg">GMBBriefcase</span>
        </div>
      </div>

      {/* Date Range */}
      <div className="absolute top-4 right-6 text-white text-sm font-medium">
        {getDateRangeText()}
      </div>

      {/* Main Content */}
      <div className="pt-20 pb-8 px-6">
        <h1 className="text-4xl font-bold text-white mb-2">
          {listingName}
        </h1>
        <h2 className="text-xl font-semibold text-white/90 mb-1">
          GMB Insights Report
        </h2>
        <p className="text-white/80 text-sm">
          This Reports display Google My Business Insights
        </p>
      </div>
    </div>
  );
};
