export interface MockListing {
  id: string;
  name: string;
  zipcode: string;
  address: string;
  type: string;
  active: string;
  status: "Active" | "Pending";
  isVerified: string;
}

export const mockListings: MockListing[] = [
  {
    id: "mock-1",
    name: "Bella Vista Restaurant",
    zipcode: "10001",
    address: "123 Main St, New York, NY 10001",
    type: "Restaurant",
    active: "1",
    status: "Active",
    isVerified: "1"
  },
  {
    id: "mock-2",
    name: "Sunrise Cafe",
    zipcode: "90210",
    address: "456 Beverly Dr, Beverly Hills, CA 90210",
    type: "Restaurant",
    active: "1",
    status: "Active",
    isVerified: "1"
  },
  {
    id: "mock-3",
    name: "Ocean View Hotel",
    zipcode: "60601",
    address: "789 Lake Shore Dr, Chicago, IL 60601",
    type: "Hotel",
    active: "1",
    status: "Active",
    isVerified: "1"
  },
  {
    id: "mock-4",
    name: "Downtown Fitness",
    zipcode: "10002",
    address: "321 Park Ave, New York, NY 10002",
    type: "Fitness",
    active: "1",
    status: "Active",
    isVerified: "1"
  },
  {
    id: "mock-5",
    name: "Green Garden Spa",
    zipcode: "33101",
    address: "555 Ocean Dr, Miami, FL 33101",
    type: "Spa",
    active: "1",
    status: "Active",
    isVerified: "1"
  },
  {
    id: "mock-6",
    name: "Tech Hub Coworking",
    zipcode: "94102",
    address: "987 Market St, San Francisco, CA 94102",
    type: "Coworking",
    active: "1",
    status: "Active",
    isVerified: "1"
  },
  {
    id: "mock-7",
    name: "Mountain Peak Lodge",
    zipcode: "80202",
    address: "777 Summit Blvd, Denver, CO 80202",
    type: "Hotel",
    active: "1",
    status: "Active",
    isVerified: "1"
  },
  {
    id: "mock-8",
    name: "City Lights Cinema",
    zipcode: "02101",
    address: "444 Theater Row, Boston, MA 02101",
    type: "Entertainment",
    active: "1",
    status: "Active",
    isVerified: "1"
  },
  {
    id: "mock-9",
    name: "Gourmet Bistro",
    zipcode: "98101",
    address: "222 Pike Pl, Seattle, WA 98101",
    type: "Restaurant",
    active: "1",
    status: "Active",
    isVerified: "1"
  },
  {
    id: "mock-10",
    name: "Luxury Auto Spa",
    zipcode: "75201",
    address: "888 Commerce St, Dallas, TX 75201",
    type: "Automotive",
    active: "1",
    status: "Active",
    isVerified: "1"
  },
  {
    id: "mock-11",
    name: "Riverside Dental Care",
    zipcode: "30301",
    address: "369 Peachtree St, Atlanta, GA 30301",
    type: "Healthcare",
    active: "1",
    status: "Active",
    isVerified: "1"
  },
  {
    id: "mock-12",
    name: "Urban Style Boutique",
    zipcode: "10003",
    address: "147 Broadway, New York, NY 10003",
    type: "Retail",
    active: "1",
    status: "Active",
    isVerified: "1"
  },
  {
    id: "mock-13",
    name: "Sunset Yoga Studio",
    zipcode: "92101",
    address: "258 Harbor Dr, San Diego, CA 92101",
    type: "Fitness",
    active: "1",
    status: "Active",
    isVerified: "1"
  },
  {
    id: "mock-14",
    name: "Prime Steakhouse",
    zipcode: "89101",
    address: "951 Las Vegas Blvd, Las Vegas, NV 89101",
    type: "Restaurant",
    active: "1",
    status: "Active",
    isVerified: "1"
  },
  {
    id: "mock-15",
    name: "Harbor View Marina",
    zipcode: "33139",
    address: "753 Collins Ave, Miami Beach, FL 33139",
    type: "Recreation",
    active: "1",
    status: "Active",
    isVerified: "1"
  },
  {
    id: "mock-16",
    name: "Artisan Coffee House",
    zipcode: "78701",
    address: "159 Congress Ave, Austin, TX 78701",
    type: "Restaurant",
    active: "1",
    status: "Active",
    isVerified: "1"
  },
  {
    id: "mock-17",
    name: "Evergreen Pet Clinic",
    zipcode: "97201",
    address: "357 SW Morrison St, Portland, OR 97201",
    type: "Healthcare",
    active: "1",
    status: "Active",
    isVerified: "1"
  },
  {
    id: "mock-18",
    name: "Metro Plaza Shopping",
    zipcode: "20001",
    address: "842 K St NW, Washington, DC 20001",
    type: "Retail",
    active: "1",
    status: "Active",
    isVerified: "1"
  }
];
