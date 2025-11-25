import React, { Suspense } from "react";
import { lazyImport } from "@/utils/lazyImport";

const Media = lazyImport(() =>
  import("../components/Media/MediaPage").then((m) => ({
    default: m.MediaPage,
  }))
);

const MediaErrorBoundary = lazyImport(() =>
  import("../components/Media/MediaErrorBoundary").then((m) => ({
    default: m.default,
  }))
);

const MediaPage = () => {
  return (
    <Suspense fallback={<div>Loading Media...</div>}>
      <MediaErrorBoundary>
        <Media />
      </MediaErrorBoundary>
    </Suspense>
  );
};

export default MediaPage;
