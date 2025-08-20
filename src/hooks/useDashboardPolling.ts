import { useCallback, useEffect, useRef, useState } from 'react';

interface PollingConfig {
  dashboardType: 'default' | 'insight' | 'location';
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
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  // Get the correct ID field based on dashboard type
  const getListingId = useCallback((listing: DashboardListing): string => {
    switch (dashboardType) {
      case 'location':
        return listing.listingId || '';
      case 'default':
      case 'insight':
      default:
        return listing.id || '';
    }
  }, [dashboardType]);

  // Clear polling interval
  const clearPollingInterval = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  // Handle when no syncing listings are found
  const handleNoSyncingListings = useCallback(async () => {
    console.log(`[${dashboardType.toUpperCase()} DASHBOARD POLLING] All listings synced, stopping polling`);
    setIsPolling(false);
    setSyncingListings([]);
    setIsSyncing(false);
    clearPollingInterval();
    
    // Final refetch to ensure we have the latest data
    await refetch();
  }, [dashboardType, refetch, clearPollingInterval]);

  // Check sync status and update state
  const checkSyncStatus = useCallback(async () => {
    if (!isMountedRef.current || !enabled) return;

    try {
      console.log(`[${dashboardType.toUpperCase()} DASHBOARD POLLING] Checking sync status...`);
      
      // Refetch data to get latest sync status
      const result = await refetch();
      
      if (!isMountedRef.current) return;

      // Debug: Log the actual API response structure
      console.log(`[${dashboardType.toUpperCase()} DASHBOARD POLLING] API Response:`, result);

      // Try different possible response structures
      let listings = [];
      if (result?.data?.data?.listings) {
        listings = result.data.data.listings;
      } else if (result?.data?.listings) {
        listings = result.data.listings;
      } else if (result?.listings) {
        listings = result.listings;
      }

      console.log(`[${dashboardType.toUpperCase()} DASHBOARD POLLING] Extracted listings:`, listings);

      const syncingIds = listings
        .filter((listing: DashboardListing) => listing.isSync === 1)
        .map((listing: DashboardListing) => getListingId(listing));

      if (syncingIds.length === 0) {
        await handleNoSyncingListings();
        return;
      }

      // Update syncing listings if different
      setSyncingListings(prev => {
        const isDifferent = prev.length !== syncingIds.length || 
          !prev.every(id => syncingIds.includes(id));
        return isDifferent ? syncingIds : prev;
      });

      setIsSyncing(true);

      console.log(`[${dashboardType.toUpperCase()} DASHBOARD POLLING] Found ${syncingIds.length} syncing listings:`, syncingIds);
    } catch (error) {
      console.error(`[${dashboardType.toUpperCase()} DASHBOARD POLLING] Error checking sync status:`, error);
    }
  }, [dashboardType, enabled, refetch, getListingId, handleNoSyncingListings]);

  // Start polling
  const startPolling = useCallback(() => {
    if (!enabled || pollingIntervalRef.current) return;

    console.log(`[${dashboardType.toUpperCase()} DASHBOARD POLLING] Starting polling every ${pollingInterval}ms`);
    setIsPolling(true);
    
    pollingIntervalRef.current = setInterval(checkSyncStatus, pollingInterval);
  }, [enabled, dashboardType, pollingInterval, checkSyncStatus]);

  // Check initial sync status
  const checkInitialSyncStatus = useCallback(async () => {
    if (!enabled || !data || !isMountedRef.current) return;

    try {
      // Debug: Log the initial data structure
      console.log(`[${dashboardType.toUpperCase()} DASHBOARD POLLING] Initial data:`, data);

      // Try different possible data structures
      let listings = [];
      if (data?.data?.listings) {
        listings = data.data.listings;
      } else if (data?.listings) {
        listings = data.listings;
      }

      console.log(`[${dashboardType.toUpperCase()} DASHBOARD POLLING] Initial extracted listings:`, listings);

      if (!listings || listings.length === 0) {
        console.log(`[${dashboardType.toUpperCase()} DASHBOARD POLLING] No listings found in initial data`);
        return;
      }

      const syncingIds = listings
        .filter((listing: DashboardListing) => listing.isSync === 1)
        .map((listing: DashboardListing) => getListingId(listing));

      if (syncingIds.length > 0) {
        console.log(`[${dashboardType.toUpperCase()} DASHBOARD POLLING] Initial check found ${syncingIds.length} syncing listings, starting polling`);
        setSyncingListings(syncingIds);
        setIsSyncing(true);
        startPolling();
      } else {
        console.log(`[${dashboardType.toUpperCase()} DASHBOARD POLLING] No syncing listings found`);
        setSyncingListings([]);
        setIsSyncing(false);
        setIsPolling(false);
      }
    } catch (error) {
      console.error(`[${dashboardType.toUpperCase()} DASHBOARD POLLING] Error in initial sync check:`, error);
    }
  }, [enabled, data, dashboardType, getListingId, startPolling]);

  // Stop polling
  const stopPolling = useCallback(() => {
    console.log(`[${dashboardType.toUpperCase()} DASHBOARD POLLING] Stopping polling`);
    clearPollingInterval();
    setIsPolling(false);
    setSyncingListings([]);
    setIsSyncing(false);
  }, [dashboardType, clearPollingInterval]);

  // Effect for initial sync check and cleanup
  useEffect(() => {
    isMountedRef.current = true;
    
    if (enabled && params && data) {
      // Small delay to ensure data is loaded
      const timer = setTimeout(checkInitialSyncStatus, 100);
      return () => clearTimeout(timer);
    } else {
      stopPolling();
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [enabled, params, data, checkInitialSyncStatus, stopPolling]);

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