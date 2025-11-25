import React, { Suspense } from "react";
import { lazyImport } from "@/utils/lazyImport";
import { ListingLoader } from "@/components/ui/listing-loader";

const GeoRanking = lazyImport(() =>
  import("../components/GeoRanking/GeoRankingPage").then((m) => ({
    default: m.GeoRankingPage,
  }))
);

const GeoRankingPage = () => {
  return (
    <Suspense fallback={<ListingLoader isLoading={true} children={""} />}>
      <GeoRanking />
    </Suspense>
  );
};

export default GeoRankingPage;
