export interface HeaderProps {
  onToggleSidebar: () => void;
  showFilters?: boolean;
  onShowFilters?: () => void;
}

export interface BusinessListing {
  isVerified: string;
  id: string;
  name: string;
  address: string;
  type: string;
  zipcode: string;
  active: string;
  status?: "Active" | "Pending"; // Computed field for backward compatibility
}

export interface BusinessListingsApiResponse {
  code: number;
  message: string;
  data: BusinessListing[];
}

// Transform API response to include computed status field
export const transformBusinessListing = (
  listing: BusinessListing
): BusinessListing => ({
  ...listing,
  status: listing.active === "1" ? "Active" : "Pending",
});
