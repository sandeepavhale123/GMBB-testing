
export interface HeaderProps {
  onToggleSidebar: () => void;
  title: string;
  showFilters?: boolean;
  onShowFilters?: () => void;
}

export interface BusinessListing {
  id: string;
  name: string;
  address: string;
  type: string;
  status: 'Active' | 'Pending';
}

export const businessListings: BusinessListing[] = [
  {
    id: '1',
    name: 'Downtown Coffee Shop',
    address: '123 Main St, NYC',
    type: 'Restaurant',
    status: 'Active'
  },
  {
    id: '2',
    name: 'Uptown Bakery',
    address: '456 Park Ave, NYC',
    type: 'Bakery',
    status: 'Active'
  },
  {
    id: '3',
    name: 'Westside Restaurant',
    address: '789 West St, NYC',
    type: 'Restaurant',
    status: 'Pending'
  },
  {
    id: '4',
    name: 'East End Boutique',
    address: '321 East Ave, NYC',
    type: 'Retail',
    status: 'Active'
  },
  {
    id: '5',
    name: 'Central Gym & Fitness',
    address: '555 Central Blvd, NYC',
    type: 'Fitness',
    status: 'Active'
  }
];
