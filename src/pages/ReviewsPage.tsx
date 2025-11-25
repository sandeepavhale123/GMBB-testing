import React, { lazy, Suspense } from "react";

const ReviewsManagementPage = lazy(() =>
  import("../components/Reviews/ReviewsManagementPage").then((module) => ({
    default: module.ReviewsManagementPage,
  }))
);

const ReviewsPage = () => {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <ReviewsManagementPage />
    </Suspense>
  );
};

export default ReviewsPage;
