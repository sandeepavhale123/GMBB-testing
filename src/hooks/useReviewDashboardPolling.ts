import { useState, useEffect, useCallback, useRef } from "react";
import type { ReviewDashboardRequest } from "../api/dashboardApi";

export const useReviewDashboardPolling = (
  params: ReviewDashboardRequest,
  refetch: () => Promise<any>,
  enabled: boolean = true
) => {
  const [syncingListings, setSyncingListings] = useState<string[]>([]);
  const [isPolling, setIsPolling] = useState(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  // Clear polling interval
  const clearPollingInterval = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  // Handle when no listings are syncing - stop polling and refresh data
  const handleNoSyncingListings = useCallback(async () => {
    console.log(
      `🔄 [${new Date().toISOString()}] handleNoSyncingListings - All listings synced, stopping polling`
    );

    // Stop polling first
    setIsPolling(false);
    clearPollingInterval();

    // Clear syncing listings
    setSyncingListings([]);

    try {
      // Final refresh to ensure we have the latest data
      await refetch();
      console.log(
        `✅ [${new Date().toISOString()}] Final data refresh completed after all listings synced`
      );
    } catch (error) {
      console.error(
        `❌ [${new Date().toISOString()}] Failed to refresh data after sync completion:`,
        error
      );
    }
  }, [refetch, clearPollingInterval]);

  // Check sync status by calling refetch and analyzing response
  const checkSyncStatus = useCallback(async () => {
    if (!enabled || !mountedRef.current) return;

    try {
      console.log(
        `🔄 [${new Date().toISOString()}] checkSyncStatus - Checking review dashboard sync status`
      );
      
      const response = await refetch();

      if (!mountedRef.current) return;

      // Extract listings from the response
      const listings = response?.data?.data?.listings || [];
      
      // Find listings that are syncing (isSync = 1)
      const syncingListingIds = listings
        .filter((listing: any) => listing.isSync === 1)
        .map((listing: any) => listing.listingId);

      console.log(
        `📊 [${new Date().toISOString()}] checkSyncStatus - Found ${syncingListingIds.length} syncing listings:`,
        syncingListingIds
      );

      if (syncingListingIds.length === 0) {
        console.log(
          `✅ [${new Date().toISOString()}] No syncing listings found - calling handleNoSyncingListings`
        );
        await handleNoSyncingListings();
      } else {
        console.log(
          `🔄 [${new Date().toISOString()}] Found syncing listings - updating state and continuing polling`
        );
        setSyncingListings(syncingListingIds);

        // Continue polling if we have syncing listings
        if (!isPolling) {
          startPolling();
        }
      }
    } catch (error) {
      console.error(
        `❌ [${new Date().toISOString()}] checkSyncStatus - Error checking sync status:`,
        error
      );
    }
  }, [enabled, refetch, handleNoSyncingListings, isPolling]);

  // Initial check for syncing listings
  const checkInitialSyncStatus = useCallback(async () => {
    if (!enabled) return;

    console.log(
      `🚀 [${new Date().toISOString()}] checkInitialSyncStatus - Making initial sync status check`
    );

    try {
      const response = await refetch();

      if (!mountedRef.current) return;

      const listings = response?.data?.data?.listings || [];
      const syncingListingIds = listings
        .filter((listing: any) => listing.isSync === 1)
        .map((listing: any) => listing.listingId);

      console.log(
        `📊 [${new Date().toISOString()}] checkInitialSyncStatus - Initial check found ${syncingListingIds.length} syncing listings`
      );

      if (syncingListingIds.length === 0) {
        console.log(
          `✅ [${new Date().toISOString()}] Initial check: No syncing listings - polling not needed`
        );
        setSyncingListings([]);
        setIsPolling(false);
      } else {
        console.log(
          `🔄 [${new Date().toISOString()}] Initial check: Found syncing listings - starting polling`
        );
        setSyncingListings(syncingListingIds);
        startPolling();
      }
    } catch (error) {
      console.error(
        `❌ [${new Date().toISOString()}] checkInitialSyncStatus - Error during initial check:`,
        error
      );
    }
  }, [enabled, refetch]);

  // Start polling
  const startPolling = useCallback(() => {
    if (pollingIntervalRef.current) return; // Already polling

    console.log(
      `🔄 [${new Date().toISOString()}] startPolling - Starting 5-second polling interval for review dashboard`
    );
    setIsPolling(true);

    pollingIntervalRef.current = setInterval(async () => {
      console.log(
        `⏰ [${new Date().toISOString()}] Polling interval - checking review dashboard sync status`
      );
      await checkSyncStatus();
    }, 5000);
  }, [checkSyncStatus]);

  // Stop polling
  const stopPolling = useCallback(() => {
    console.log(
      `🛑 [${new Date().toISOString()}] stopPolling - Stopping review dashboard polling`
    );
    setIsPolling(false);
    clearPollingInterval();
  }, [clearPollingInterval]);

  // Initial check when enabled or params change
  useEffect(() => {
    if (enabled) {
      checkInitialSyncStatus();
    } else {
      stopPolling();
      setSyncingListings([]);
    }
  }, [enabled, JSON.stringify(params)]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      clearPollingInterval();
    };
  }, [clearPollingInterval]);

  return {
    syncingListings,
    isPolling,
    isSyncing: syncingListings.length > 0,
    startPolling,
    stopPolling,
    checkSyncStatus,
  };
};