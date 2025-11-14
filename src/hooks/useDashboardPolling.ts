import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface PollingConfig {
  dashboardType: "default" | "insight" | "location";
  pollingInterval?: number;
  enabled?: boolean;
}

interface DashboardListing {
  id?: string;
  listingId?: string;
  isSync: number;
}

interface UseDashboardPollingProps extends PollingConfig {
  refetch: () => Promise<any>;
  data: any;
  params: any;
}

export const useDashboardPolling = ({
  dashboardType,
  refetch,
  data,
  params,
  pollingInterval = 15000, // 15 seconds
  enabled = true,
}: UseDashboardPollingProps) => {
  const [syncingListings, setSyncingListings] = useState<string[]>([]);
  const [isPolling, setIsPolling] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [didFinalRefetch, setDidFinalRefetch] = useState(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);
  const wasEnabledRef = useRef(enabled);
  const ranInitialForSignatureRef = useRef<string | null>(null);

  // 🔐 a stable "signature" for current run (prevents re-running initial check)
  const signature = useMemo(
    () => `${dashboardType}:${JSON.stringify(params || {})}`,
    [dashboardType, params]
  );

  // Get the correct ID field based on dashboard type
  const getListingId = useCallback(
    (listing: DashboardListing): string => {
      switch (dashboardType) {
        case "location":
          return listing.listingId || "";
        case "default":
        case "insight":
        default:
          return listing.id || "";
      }
    },
    [dashboardType]
  );

  // Clear polling interval
  const clearPollingInterval = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  // Handle when no syncing listings are found
  const handleNoSyncingListings = useCallback(async () => {
    setIsPolling(false);
    setSyncingListings([]);
    setIsSyncing(false);
    clearPollingInterval();

    // Final refetch to ensure we have the latest data
    // await refetch();

    // ✅ one-time final refetch after sync completes
    if (!didFinalRefetch && isMountedRef.current && enabled) {
      setDidFinalRefetch(true);
      try {
        // tiny delay avoids racing the last server update
        await new Promise((r) => setTimeout(r, 400));
        if (isMountedRef.current) await refetch();
      } catch (err) {
        console.error(
          `[${dashboardType.toUpperCase()} DASHBOARD POLLING] Final refetch failed:`,
          err
        );
      }
    }
  }, [dashboardType, refetch, clearPollingInterval, didFinalRefetch, enabled]);

  // Check sync status and update state
  const checkSyncStatus = useCallback(async () => {
    if (!isMountedRef.current || !enabled) return;

    try {
      // Refetch data to get latest sync status
      const result = await refetch();

      if (!isMountedRef.current) return;

      // Debug: Log the actual API response structure

      // Try different possible response structures
      let listings = [];
      if (result?.data?.data?.listings) {
        listings = result.data.data.listings;
      } else if (result?.data?.listings) {
        listings = result.data.listings;
      } else if (result?.listings) {
        listings = result.listings;
      }

      const syncingIds = listings
        .filter((listing: DashboardListing) => listing.isSync === 1)
        .map((listing: DashboardListing) => getListingId(listing));

      if (syncingIds.length === 0) {
        await handleNoSyncingListings();
        return;
      }

      // Update syncing listings if different
      setSyncingListings((prev) => {
        const isDifferent =
          prev.length !== syncingIds.length ||
          !prev.every((id) => syncingIds.includes(id));
        return isDifferent ? syncingIds : prev;
      });

      setIsSyncing(true);
    } catch (error) {
      console.error(
        `[${dashboardType.toUpperCase()} DASHBOARD POLLING] Error checking sync status:`,
        error
      );
    }
  }, [dashboardType, enabled, refetch, getListingId, handleNoSyncingListings]);

  // Start polling
  const startPolling = useCallback(() => {
    if (!enabled || pollingIntervalRef.current) return;

    setIsPolling(true);
    // kick once immediately, then interval
    void checkSyncStatus();
    pollingIntervalRef.current = setInterval(checkSyncStatus, pollingInterval);
  }, [enabled, dashboardType, pollingInterval, checkSyncStatus]);

  // Check initial sync status
  const checkInitialSyncStatus = useCallback(async () => {
    if (!enabled || !data || !isMountedRef.current) return;

    try {
      // Debug: Log the initial data structure

      // Try different possible data structures
      let listings = [];
      if (data?.data?.listings) {
        listings = data.data.listings;
      } else if (data?.listings) {
        listings = data.listings;
      }

      if (!listings || listings.length === 0) {
        return;
      }

      const syncingIds = listings
        .filter((listing: DashboardListing) => listing.isSync === 1)
        .map((listing: DashboardListing) => getListingId(listing));

      if (syncingIds.length > 0) {
        setSyncingListings(syncingIds);
        setIsSyncing(true);
        setDidFinalRefetch(false); // allow final refetch for this run
        startPolling();
      } else {
        setSyncingListings([]);
        setIsSyncing(false);
        setIsPolling(false);
        setDidFinalRefetch(false);
      }
    } catch (error) {
      // console.error(
      //   `[${dashboardType.toUpperCase()} DASHBOARD POLLING] Error in initial sync check:`,
      //   error
      // );
    }
  }, [enabled, data, dashboardType, getListingId, startPolling]);

  // 🧷 run initial check ONCE per (dashboardType + params) signature
  useEffect(() => {
    isMountedRef.current = true;
    if (!enabled || !params || !data) return;

    if (ranInitialForSignatureRef.current !== signature) {
      ranInitialForSignatureRef.current = signature;
      const t = setTimeout(checkInitialSyncStatus, 50);
      return () => clearTimeout(t);
    }
  }, [enabled, data, params, signature, checkInitialSyncStatus]);

  // Stop polling
  const stopPolling = useCallback(() => {
    // Only log and execute if currently polling to avoid spam
    if (isPolling || pollingIntervalRef.current) {
      clearPollingInterval();
      setIsPolling(false);
      setSyncingListings([]);
      setIsSyncing(false);
    }
  }, [dashboardType, clearPollingInterval, isPolling]);

  // Effect to handle enabled state changes
  useEffect(() => {
    // If enabled state changed from true to false, stop polling
    if (wasEnabledRef.current && !enabled) {
      stopPolling();
    }
    wasEnabledRef.current = enabled;
  }, [enabled, stopPolling]);

  // Effect for initial sync check and cleanup
  // useEffect(() => {
  //   isMountedRef.current = true;

  //   if (enabled && params && data) {
  //     // Small delay to ensure data is loaded
  //     const timer = setTimeout(checkInitialSyncStatus, 100);
  //     return () => clearTimeout(timer);
  //   }

  //   return () => {
  //     isMountedRef.current = false;
  //   };
  // }, [enabled, params, data, checkInitialSyncStatus]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      clearPollingInterval();
    };
  }, [clearPollingInterval]);

  return {
    syncingListings,
    isPolling,
    isSyncing,
    startPolling,
    stopPolling,
    checkSyncStatus,
  };
};
