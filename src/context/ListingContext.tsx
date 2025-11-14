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
  refetchListings: () => Promise<void>; // ADD THIS LINE
}

const ListingContext = createContext<ListingContextType>({
  selectedListing: null,
  isLoading: false,
  isInitialLoading: false,
  listings: [],
  switchListing: () => {},
  setSelectedListing: () => {},
  initializeSelectedListing(id) {},
  refetchListings: async () => {}, // ADD THIS LINE
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
    refetch,
  } = useBusinessListingsWithRedux();

  const { selectedBusinessId } = useAppSelector(
    (state) => state.businessListings
  );
  const { user, isInitialized, isAuthenticated } = useAuthRedux();

  const [selectedListing, setSelectedListing] =
    useState<BusinessListing | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { listingId } = useParams<{ listingId?: string }>();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const baseRoute = useMemo(() => {
    const pathParts = location.pathname.split("/");
    const firstSegment = pathParts[1] || "location-dashboard";

    // Don't interfere with profile, settings, or other non-listing routes
    const excludedRoutes = [
      "profile",
      "settings",
      "team",
      "ai-chatbot",
      "view-bulk-report-details",
    ];
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
        dispatch(updateUserSession(user.userId));
        localStorage.setItem("current_user_session", user.userId);
        // setHasInitialized(false); // Force re-initialization
      }
    }
  }, [user?.userId, isInitialized, dispatch]);

  const initializeSelectedListing = useCallback(() => {
    if (
      listingsLoading ||
      // hasInitialized ||
      !isInitialized ||
      !isAuthenticated
    ) {
      return;
    }

    // Set a timeout to force initialization even if no listings are found
    // if (!initTimeout) {
    //   const timeout = setTimeout(() => {

    //     if (!hasInitialized && listings.length === 0) {

    //       setHasInitialized(true);
    //     }
    //   }, 5000); // 5 second timeout
    //   setInitTimeout(timeout);
    // }

    if (listings.length === 0) {
      setSelectedListing(null);
      dispatch(setSelectedBusiness(null));
      return;
    }

    // Clear timeout if we have listings
    // if (initTimeout) {
    //   clearTimeout(initTimeout);
    //   setInitTimeout(null);
    // }

    let targetListing: BusinessListing | null = null;

    // 1. Try to use listing from URL if valid
    if (listingId && listingId !== "default") {
      targetListing = listings.find((l) => l.id === listingId) || null;
    }

    // 2. Try to use stored selectedBusinessId if URL doesn't have valid listing
    if (!targetListing && selectedBusinessId) {
      targetListing = listings.find((l) => l.id === selectedBusinessId) || null;
    }

    // 3. Default to first available listing if nothing else works
    if (!targetListing && listings.length > 0) {
      targetListing = listings[0];
      const firstSegment = location.pathname.split("/")[1];
    }

    if (targetListing) {
      setSelectedListing(targetListing);
      dispatch(setSelectedBusiness(targetListing.id));

      const isSettingsPath = location.pathname.includes("/settings/listings");

      //   // Redirect if necessary and baseRoute is valid (not excluded)
      // const shouldRedirect =
      //   baseRoute &&
      //   (!listingId ||
      //     listingId === "default" ||
      //     !listings.find((l) => l.id === listingId));

      // if (shouldRedirect) {

      //   navigate(`/${baseRoute}/${targetListing.id}`, { replace: true });
      // }
      if (!isSettingsPath && baseRoute) {
        // only redirect if NOT on settings
        const shouldRedirect =
          !listingId ||
          listingId === "default" ||
          !listings.find((l) => l.id === listingId);

        if (shouldRedirect) {
          navigate(`/${baseRoute}/${targetListing.id}`, { replace: true });
        }
      }
    }
  }, [
    listings,
    listingsLoading,
    listingId,
    selectedBusinessId,
    // hasInitialized,
    isInitialized,
    isAuthenticated,
    navigate,
    baseRoute,
    dispatch,
    location.pathname,
    // initTimeout,
  ]);

  useEffect(() => {
    initializeSelectedListing();

    // Cleanup timeout on unmount
    // return () => {
    //   if (initTimeout) {
    //     clearTimeout(initTimeout);
    //   }
    // };
  }, [initializeSelectedListing]);

  const switchListing = useCallback(
    async (listing: BusinessListing) => {
      if (listing.id === selectedListing?.id) return;

      setIsLoading(true);

      const existsInListings = listings.some((l) => l.id === listing.id);

      if (!existsInListings) {
        addNewListing(listing);
      } else {
        // const isInUserListings = listings
        //   .slice(0, listings.length)
        //   .some((l) => l.id === listing.id);
        // if (isInUserListings) {

        dispatch(moveListingToTop(listing.id));
        // }
      }

      setSelectedListing(listing);
      dispatch(setSelectedBusiness(listing.id));

      // Handle navigation based on current route
      if (baseRoute === null) {
        // For settings, profile, and other excluded routes, stay on current page structure
        const pathParts = location.pathname.split("/");
        if (
          pathParts[1] === "settings" ||
          pathParts[1] === "profile" ||
          pathParts[1] === "view-bulk-report-details"
        ) {
          // Stay on settings or profile, just update the listing context
          // No navigation needed as these pages don't use listing IDs in URL
        } else {
          // For other excluded routes, navigate to location dashboard
          navigate(`/location-dashboard/${listing.id}`);
        }
      } else {
        // For regular routes, use the existing baseRoute logic
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

  const refetchListings = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const contextValue = useMemo(
    () => ({
      selectedListing,
      isLoading,
      isInitialLoading: listingsLoading,
      listings,
      switchListing,
      setSelectedListing,
      initializeSelectedListing,
      refetchListings,
    }),
    [
      selectedListing,
      isLoading,
      listingsLoading,
      listings,
      switchListing,
      initializeSelectedListing,
      refetchListings,
    ]
  );

  return (
    <ListingContext.Provider value={contextValue}>
      {children}
    </ListingContext.Provider>
  );
};

export { ListingContext };
