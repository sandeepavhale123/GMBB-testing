import React, { Suspense } from "react";

const ReportsComponent = React.lazy(() => import("../components/Reports/ReportsPage"));

const ReportsPage = () => {
  return (
    <Suspense fallback={<div>Loading Reports...</div>}>
      <ReportsComponent />
    </Suspense>
  );
};

export default ReportsPage;
