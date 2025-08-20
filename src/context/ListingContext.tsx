import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { BusinessListing } from "@/components/Header/types";
import { useBusinessListingsWithRedux } from "@/hooks/useBusinessListingsWithRedux";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import {
  moveListingToTop,
  setSelectedBusiness,
  updateUserSession,
} from "@/store/slices/businessListingsSlice";
import { useAuthRedux } from "@/store/slices/auth/useAuthRedux";

interface ListingContextType {
  selectedListing: BusinessListing | null;
  isLoading: boolean;
  isInitialLoading: boolean;
  listings: BusinessListing[];
  switchListing: (listing: BusinessListing) => void;
  setSelectedListing: (listing: BusinessListing | null) => void;
  initializeSelectedListing: (id?: string) => void;
}

const ListingContext = createContext<ListingContextType>({
  selectedListing: null,
  isLoading: false,
  isInitialLoading: false,
  listings: [],
  switchListing: () => {},
  setSelectedListing: () => {},
  initializeSelectedListing(id) {},
});

export const useListingContext = () => {
  const context = useContext(ListingContext);
  if (!context) {
    throw new Error("useListingContext must be used within a ListingProvider");
  }
  return context;
};

interface ListingProviderProps {
  children: React.ReactNode;
}

export const ListingProvider: React.FC<ListingProviderProps> = ({
  children,
}) => {
  const {
    listings,
    loading: listingsLoading,
    addNewListing,
  } = useBusinessListingsWithRedux();
  const { selectedBusinessId } = useAppSelector(
    (state) => state.businessListings
  );
  const { user, isInitialized, isAuthenticated } = useAuthRedux();
  const [selectedListing, setSelectedListing] =
    useState<BusinessListing | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [initTimeout, setInitTimeout] = useState<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const { listingId } = useParams<{ listingId?: string }>();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const baseRoute = useMemo(() => {
    const pathParts = location.pathname.split("/");
    const firstSegment = pathParts[1] || "location-dashboard";

    // Don't interfere with profile, settings, or other non-listing routes
    const excludedRoutes = ["profile", "settings", "team", "ai-chatbot"];
    if (excludedRoutes.includes(firstSegment)) {
      return null; // No automatic redirection for these routes
    }

    return firstSegment;
  }, [location.pathname]);

  // Update user session when user changes
  useEffect(() => {
    if (user?.userId && isInitialized) {
      const currentSession = localStorage.getItem("current_user_session");
      if (currentSession !== user.userId) {
        // console.log("🔄 ListingContext: User session change detected");
        dispatch(updateUserSession(user.userId));
        localStorage.setItem("current_user_session", user.userId);
        setHasInitialized(false); // Force re-initialization
      }
    }
  }, [user?.userId, isInitialized, dispatch]);

  const initializeSelectedListing = useCallback((forceListingId?: string) => {
    const targetListingId = forceListingId || listingId;
    
    console.log("🔄 ListingContext: initializeSelectedListing called", {
      listingsLoading,
      listingsCount: listings.length,
      hasInitialized,
      isInitialized,
      isAuthenticated,
      selectedBusinessId,
      listingId,
      targetListingId,
      forceListingId
    });

    if (!isInitialized || !isAuthenticated) {
      console.log("🔄 ListingContext: Skipping - not authenticated or initialized");
      return;
    }

    // If we have a specific listing ID from URL and listings are loaded, prioritize URL over everything
    if (targetListingId && targetListingId !== "default" && listings.length > 0) {
      const urlListing = listings.find((l) => l.id === targetListingId);
      if (urlListing) {
        console.log("🔄 ListingContext: Found URL listing immediately:", urlListing.name);
        setSelectedListing(urlListing);
        dispatch(setSelectedBusiness(urlListing.id));
        dispatch(moveListingToTop(urlListing.id)); // Move to top for easier access
        setHasInitialized(true);
        return;
      }
      
      // If URL listing not found in current listings, wait a bit longer for listings to load
      if (!listingsLoading && !hasInitialized) {
        console.log("🔄 ListingContext: URL listing not found, waiting for more listings...");
        // Set a shorter timeout specifically for URL-based navigation
        if (!initTimeout) {
          const timeout = setTimeout(() => {
            console.log("🔄 ListingContext: URL listing timeout - proceeding with fallback");
            const fallbackListing = listings.length > 0 ? listings[0] : null;
            if (fallbackListing) {
              setSelectedListing(fallbackListing);
              dispatch(setSelectedBusiness(fallbackListing.id));
              // Redirect to the available listing
              if (baseRoute) {
                navigate(`/${baseRoute}/${fallbackListing.id}`, { replace: true });
              }
            }
            setHasInitialized(true);
          }, 2000); // Shorter timeout for URL navigation
          setInitTimeout(timeout);
        }
        return;
      }
    }

    // Standard initialization logic for cases without specific URL listing
    if (listingsLoading || hasInitialized) {
      console.log("🔄 ListingContext: Skipping - loading or already initialized");
      return;
    }

    // Set a timeout to force initialization even if no listings are found
    if (!initTimeout && listings.length === 0) {
      const timeout = setTimeout(() => {
        console.log("🔄 ListingContext: General initialization timeout reached");
        if (!hasInitialized) {
          setHasInitialized(true);
        }
      }, 5000); // 5 second timeout
      setInitTimeout(timeout);
    }

    if (listings.length === 0) {
      console.log("🔄 ListingContext: No listings available yet, waiting...");
      return;
    }

    // Clear timeout if we have listings
    if (initTimeout) {
      clearTimeout(initTimeout);
      setInitTimeout(null);
    }

    console.log("🔄 ListingContext: Initializing with listings:", listings.length);
    console.log("🔄 ListingContext: Current selectedBusinessId:", selectedBusinessId);

    let targetListing: BusinessListing | null = null;

    // 1. Try to use listing from stored selectedBusinessId first
    if (selectedBusinessId) {
      targetListing = listings.find((l) => l.id === selectedBusinessId) || null;
      console.log("🔄 ListingContext: Found listing from stored ID:", targetListing?.name);
    }

    // 2. Default to first available listing if nothing else works
    if (!targetListing && listings.length > 0) {
      targetListing = listings[0];
      console.log("🔄 ListingContext: Using first available listing:", targetListing?.name);
    }

    if (targetListing) {
      console.log("🔄 ListingContext: Setting selected listing:", targetListing.name);
      setSelectedListing(targetListing);
      dispatch(setSelectedBusiness(targetListing.id));

      // Redirect if necessary and baseRoute is valid (not excluded)
      const shouldRedirect = baseRoute && (!targetListingId || targetListingId === "default");

      if (shouldRedirect) {
        console.log("🔄 ListingContext: Redirecting to:", `/${baseRoute}/${targetListing.id}`);
        navigate(`/${baseRoute}/${targetListing.id}`, { replace: true });
      }
    } else {
      console.log("🔄 ListingContext: No listings available");
    }

    setHasInitialized(true);
  }, [
    listings,
    listingsLoading,
    listingId,
    selectedBusinessId,
    hasInitialized,
    isInitialized,
    isAuthenticated,
    navigate,
    baseRoute,
    dispatch,
    initTimeout,
  ]);

  useEffect(() => {
    initializeSelectedListing();

    // Cleanup timeout on unmount
    return () => {
      if (initTimeout) {
        clearTimeout(initTimeout);
      }
    };
  }, [initializeSelectedListing]);

  // Re-initialize when URL listingId changes (crucial for pagination navigation)
  useEffect(() => {
    if (listingId && listingId !== "default" && isInitialized && isAuthenticated) {
      console.log("🔄 ListingContext: URL listingId changed, re-initializing:", listingId);
      setHasInitialized(false); // Force re-initialization
      initializeSelectedListing(listingId);
    }
  }, [listingId, isInitialized, isAuthenticated, initializeSelectedListing]);

  const switchListing = useCallback(
    async (listing: BusinessListing) => {
      if (listing.id === selectedListing?.id) return;

      console.log("🔄 switchListing called:", {
        listingId: listing.id,
        listingName: listing.name,
        currentPath: location.pathname,
        baseRoute,
      });

      setIsLoading(true);

      const existsInListings = listings.some((l) => l.id === listing.id);

      if (!existsInListings) {
        // console.log(
        //   "🔄 ListingContext: Auto-storing new listing:",
        //   listing.name
        // );
        addNewListing(listing);
      } else {
        const isInUserListings = listings
          .slice(0, listings.length)
          .some((l) => l.id === listing.id);
        if (isInUserListings) {
          // console.log(
          //   "🔝 ListingContext: Moving existing listing to top:",
          //   listing.name
          // );
          dispatch(moveListingToTop(listing.id));
        }
      }

      setSelectedListing(listing);
      dispatch(setSelectedBusiness(listing.id));

      // Handle navigation based on current route
      console.log("🔄 Navigation logic:", { baseRoute, currentPath: location.pathname });
      
      if (baseRoute === null) {
        // For settings, profile, and other excluded routes, stay on current page structure
        const pathParts = location.pathname.split("/");
        if (pathParts[1] === "settings" || pathParts[1] === "profile") {
          // Stay on settings or profile, just update the listing context
          // No navigation needed as these pages don't use listing IDs in URL
          console.log("🔄 Staying on settings/profile page");
        } else {
          // For other excluded routes, navigate to location dashboard
          console.log("🔄 Navigating to location dashboard from excluded route");
          navigate(`/location-dashboard/${listing.id}`);
        }
      } else if (baseRoute === "main-dashboard") {
        // Special case: when on main-dashboard, always redirect to single location dashboard
        console.log("🔄 Navigating from main-dashboard to location-dashboard");
        navigate(`/location-dashboard/${listing.id}`);
      } else {
        // For regular routes, use the existing baseRoute logic
        console.log("🔄 Using baseRoute logic:", `/${baseRoute}/${listing.id}`);
        navigate(`/${baseRoute}/${listing.id}`);
      }

      setTimeout(() => {
        setIsLoading(false);
      }, 200);
    },
    [
      selectedListing?.id,
      listings,
      addNewListing,
      dispatch,
      baseRoute,
      navigate,
      location,
    ]
  );

  const contextValue = useMemo(
    () => ({
      selectedListing,
      isLoading,
      isInitialLoading: listingsLoading,
      listings,
      switchListing,
      setSelectedListing,
      initializeSelectedListing,
    }),
    [
      selectedListing,
      isLoading,
      listingsLoading,
      listings,
      switchListing,
      initializeSelectedListing,
    ]
  );

  return (
    <ListingContext.Provider value={contextValue}>
      {children}
    </ListingContext.Provider>
  );
};

export { ListingContext };
