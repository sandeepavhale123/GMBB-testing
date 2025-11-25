import React, { Suspense } from "react";

const BusinessManagement = React.lazy(() =>
  import("@/components/BusinessManagement/BusinessManagement")
);

export default function BusinessesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BusinessManagement />
    </Suspense>
  );
}
