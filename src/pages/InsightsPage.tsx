import React, { Suspense } from "react";

const Insights = React.lazy(() =>
  import("../components/Insights/InsightsPage").then((module) => ({
    default: module.default,
  }))
);

const InsightsPage = () => {
  return (
    <Suspense fallback={<div>Loading Insights...</div>}>
      <Insights />
    </Suspense>
  );
};

export default InsightsPage;
