import React, { Suspense } from "react";
import { Layout } from "@/components/layout/layout";
const BusinessManagement = React.lazy(() =>
  import("@/components/BusinessManagement/BusinessManagement")
);

export default function BusinessesPage() {
  return (
    <Layout activeTab="business-info">
      <Suspense fallback={<div>Loading...</div>}>
        <BusinessManagement />
      </Suspense>
    </Layout>
  );
}
