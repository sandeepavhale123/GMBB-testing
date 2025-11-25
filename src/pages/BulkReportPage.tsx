import React, { Suspense } from "react";

const Reports = React.lazy(() => import('@/multiDashboardLayout/pages/Reports'));

const BulkReportPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Reports isSingleListingDashboard={true} />
    </Suspense>
  );
};

export default BulkReportPage;
