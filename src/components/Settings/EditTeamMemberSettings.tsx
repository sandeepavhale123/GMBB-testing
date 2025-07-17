import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, Eye, EyeOff, Loader2, Search, ChevronDown } from "lucide-react";
import { useTeam } from "@/hooks/useTeam";
import { useToast } from "@/hooks/use-toast";
import { updateEditMember } from "@/store/slices/teamSlice";

interface EditFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

interface MockListing {
  id: string;
  businessName: string;
  address: string;
  category: string;
  status: 'Verified' | 'Pending' | 'Unverified';
  accountEmail: string;
}

// Mock data for Google accounts
const MOCK_GOOGLE_ACCOUNTS = [
  'All',
  'business1@gmail.com',
  'marketing@company.com',
  'sales@company.com',
  'support@business.com'
];

// Mock data for GMB listings (47 listings across different accounts)
const MOCK_GMB_LISTINGS: MockListing[] = [
  { id: '1', businessName: 'Tony\'s Italian Restaurant', address: '123 Main St, New York, NY 10001', category: 'Restaurant', status: 'Verified', accountEmail: 'business1@gmail.com' },
  { id: '2', businessName: 'Downtown Dental Clinic', address: '456 Oak Ave, Los Angeles, CA 90210', category: 'Dental Clinic', status: 'Verified', accountEmail: 'marketing@company.com' },
  { id: '3', businessName: 'Mike\'s Auto Repair', address: '789 Pine St, Chicago, IL 60601', category: 'Auto Repair', status: 'Pending', accountEmail: 'sales@company.com' },
  { id: '4', businessName: 'Sunny Side Coffee Shop', address: '321 Elm St, Miami, FL 33101', category: 'Coffee Shop', status: 'Verified', accountEmail: 'business1@gmail.com' },
  { id: '5', businessName: 'Green Valley Pharmacy', address: '654 Maple Dr, Seattle, WA 98101', category: 'Pharmacy', status: 'Verified', accountEmail: 'support@business.com' },
  { id: '6', businessName: 'Fresh Market Grocery', address: '987 Cedar Ln, Boston, MA 02101', category: 'Grocery Store', status: 'Unverified', accountEmail: 'marketing@company.com' },
  { id: '7', businessName: 'City Fitness Center', address: '147 Birch Way, Denver, CO 80201', category: 'Gym', status: 'Verified', accountEmail: 'sales@company.com' },
  { id: '8', businessName: 'Bella Beauty Salon', address: '258 Willow St, Phoenix, AZ 85001', category: 'Beauty Salon', status: 'Pending', accountEmail: 'business1@gmail.com' },
  { id: '9', businessName: 'Quick Clean Laundromat', address: '369 Spruce Ave, Portland, OR 97201', category: 'Laundromat', status: 'Verified', accountEmail: 'support@business.com' },
  { id: '10', businessName: 'Pete\'s Pizza Palace', address: '741 Poplar St, Austin, TX 78701', category: 'Pizza Restaurant', status: 'Verified', accountEmail: 'marketing@company.com' },
  { id: '11', businessName: 'Elite Legal Services', address: '852 Cypress Dr, San Francisco, CA 94101', category: 'Law Firm', status: 'Verified', accountEmail: 'sales@company.com' },
  { id: '12', businessName: 'Happy Pets Veterinary', address: '963 Redwood Blvd, Las Vegas, NV 89101', category: 'Veterinary', status: 'Pending', accountEmail: 'business1@gmail.com' },
  { id: '13', businessName: 'Corner Bookstore', address: '159 Hickory Ln, Nashville, TN 37201', category: 'Bookstore', status: 'Verified', accountEmail: 'support@business.com' },
  { id: '14', businessName: 'Modern Hair Studio', address: '357 Chestnut St, Orlando, FL 32801', category: 'Hair Salon', status: 'Unverified', accountEmail: 'marketing@company.com' },
  { id: '15', businessName: 'Hometown Hardware Store', address: '486 Walnut Ave, Salt Lake City, UT 84101', category: 'Hardware Store', status: 'Verified', accountEmail: 'sales@company.com' },
  { id: '16', businessName: 'Sunrise Diner', address: '572 Ash St, Minneapolis, MN 55401', category: 'Diner', status: 'Verified', accountEmail: 'business1@gmail.com' },
  { id: '17', businessName: 'Tech Solutions Inc', address: '694 Beech Dr, Atlanta, GA 30301', category: 'IT Services', status: 'Pending', accountEmail: 'support@business.com' },
  { id: '18', businessName: 'Family Medical Center', address: '815 Sycamore Way, San Diego, CA 92101', category: 'Medical Center', status: 'Verified', accountEmail: 'marketing@company.com' },
  { id: '19', businessName: 'Golden Gate Cleaners', address: '927 Magnolia St, Kansas City, MO 64101', category: 'Dry Cleaner', status: 'Verified', accountEmail: 'sales@company.com' },
  { id: '20', businessName: 'Ocean View Restaurant', address: '183 Palm Ave, Virginia Beach, VA 23451', category: 'Seafood Restaurant', status: 'Unverified', accountEmail: 'business1@gmail.com' },
  { id: '21', businessName: 'Mountain Peak Outdoor Gear', address: '294 Pine Ridge Dr, Colorado Springs, CO 80901', category: 'Sporting Goods', status: 'Verified', accountEmail: 'support@business.com' },
  { id: '22', businessName: 'Sweet Dreams Bakery', address: '416 Rose St, Richmond, VA 23219', category: 'Bakery', status: 'Verified', accountEmail: 'marketing@company.com' },
  { id: '23', businessName: 'Rapid Oil Change', address: '538 Tulip Lane, Memphis, TN 38101', category: 'Auto Service', status: 'Pending', accountEmail: 'sales@company.com' },
  { id: '24', businessName: 'Crystal Clear Car Wash', address: '672 Daisy Dr, Louisville, KY 40201', category: 'Car Wash', status: 'Verified', accountEmail: 'business1@gmail.com' },
  { id: '25', businessName: 'Neighborhood Florist', address: '785 Violet Way, New Orleans, LA 70112', category: 'Florist', status: 'Verified', accountEmail: 'support@business.com' },
  { id: '26', businessName: 'Prime Time Sports Bar', address: '891 Lily St, Milwaukee, WI 53201', category: 'Sports Bar', status: 'Unverified', accountEmail: 'marketing@company.com' },
  { id: '27', businessName: 'Digital Print Shop', address: '147 Orchid Ave, Cleveland, OH 44101', category: 'Print Shop', status: 'Verified', accountEmail: 'sales@company.com' },
  { id: '28', businessName: 'Cozy Corner Cafe', address: '258 Jasmine Dr, Tampa, FL 33601', category: 'Cafe', status: 'Pending', accountEmail: 'business1@gmail.com' },
  { id: '29', businessName: 'Premier Insurance Agency', address: '369 Iris Ln, Pittsburgh, PA 15201', category: 'Insurance', status: 'Verified', accountEmail: 'support@business.com' },
  { id: '30', businessName: 'Artisan Jewelry Store', address: '472 Peony St, Cincinnati, OH 45201', category: 'Jewelry Store', status: 'Verified', accountEmail: 'marketing@company.com' },
  { id: '31', businessName: 'Express Mobile Repair', address: '583 Carnation Way, Jacksonville, FL 32099', category: 'Phone Repair', status: 'Verified', accountEmail: 'sales@company.com' },
  { id: '32', businessName: 'Grandma\'s Home Cooking', address: '694 Sunflower Dr, Columbus, OH 43215', category: 'Family Restaurant', status: 'Pending', accountEmail: 'business1@gmail.com' },
  { id: '33', businessName: 'Urban Yoga Studio', address: '715 Lavender St, Indianapolis, IN 46201', category: 'Yoga Studio', status: 'Verified', accountEmail: 'support@business.com' },
  { id: '34', businessName: 'Reliable Plumbing Services', address: '826 Rosemary Ave, Charlotte, NC 28201', category: 'Plumbing', status: 'Unverified', accountEmail: 'marketing@company.com' },
  { id: '35', businessName: 'Fashion Forward Boutique', address: '937 Mint Dr, San Antonio, TX 78201', category: 'Clothing Store', status: 'Verified', accountEmail: 'sales@company.com' },
  { id: '36', businessName: 'Bright Smile Orthodontics', address: '148 Sage Way, Detroit, MI 48201', category: 'Orthodontist', status: 'Verified', accountEmail: 'business1@gmail.com' },
  { id: '37', businessName: 'Quality Tire & Auto', address: '259 Thyme St, El Paso, TX 79901', category: 'Tire Shop', status: 'Pending', accountEmail: 'support@business.com' },
  { id: '38', businessName: 'Gourmet Food Truck', address: '361 Basil Lane, Washington, DC 20001', category: 'Food Truck', status: 'Verified', accountEmail: 'marketing@company.com' },
  { id: '39', businessName: 'Complete Home Services', address: '482 Parsley Dr, Baltimore, MD 21201', category: 'Home Services', status: 'Verified', accountEmail: 'sales@company.com' },
  { id: '40', businessName: 'Kids Fun Zone', address: '573 Cilantro Ave, Boston, MA 02108', category: 'Entertainment', status: 'Unverified', accountEmail: 'business1@gmail.com' },
  { id: '41', businessName: 'Midnight Security Services', address: '684 Oregano St, Tucson, AZ 85701', category: 'Security', status: 'Verified', accountEmail: 'support@business.com' },
  { id: '42', businessName: 'Fresh Garden Market', address: '795 Dill Way, Fresno, CA 93701', category: 'Farmers Market', status: 'Pending', accountEmail: 'marketing@company.com' },
  { id: '43', businessName: 'Elite Personal Training', address: '816 Cumin Dr, Sacramento, CA 95814', category: 'Personal Trainer', status: 'Verified', accountEmail: 'sales@company.com' },
  { id: '44', businessName: 'Classic Car Restoration', address: '927 Paprika Lane, Long Beach, CA 90802', category: 'Auto Restoration', status: 'Verified', accountEmail: 'business1@gmail.com' },
  { id: '45', businessName: 'Peaceful Massage Therapy', address: '138 Turmeric St, Oakland, CA 94601', category: 'Massage Therapy', status: 'Unverified', accountEmail: 'support@business.com' },
  { id: '46', businessName: 'Budget Phone Repair', address: '249 Ginger Ave, Raleigh, NC 27601', category: 'Electronics Repair', status: 'Verified', accountEmail: 'marketing@company.com' },
  { id: '47', businessName: 'Luxury Wedding Venue', address: '357 Cinnamon Dr, Honolulu, HI 96813', category: 'Event Venue', status: 'Pending', accountEmail: 'sales@company.com' }
];

export const EditTeamMemberSettings: React.FC = () => {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const {
    currentEditMember,
    isLoadingEdit,
    isSavingEdit,
    editError,
    saveError,
    fetchEditTeamMember,
    updateTeamMember,
    clearTeamEditError,
    clearTeamSaveError
  } = useTeam();

  const [formData, setFormData] = useState<EditFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const fetchedMemberIdRef = useRef<number | null>(null);

  // Listing management state
  const [allowListingAccess, setAllowListingAccess] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState('All');
  const [accountSearchQuery, setAccountSearchQuery] = useState('');
  const [assignedListings, setAssignedListings] = useState<Set<string>>(new Set(['1', '4', '8', '12', '16', '20', '24', '28', '32', '36', '40', '44'])); // Mock pre-assigned listings
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);

  // Filter accounts based on search query
  const filteredAccounts = MOCK_GOOGLE_ACCOUNTS.filter(account =>
    account.toLowerCase().includes(accountSearchQuery.toLowerCase())
  );

  // Filter listings based on selected account
  const filteredListings = MOCK_GMB_LISTINGS.filter(listing => {
    if (selectedAccount === 'All') return true;
    return listing.accountEmail === selectedAccount;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredListings.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedListings = filteredListings.slice(startIndex, startIndex + pageSize);

  // Get assigned listings count
  const assignedCount = Array.from(assignedListings).filter(listingId => {
    const listing = MOCK_GMB_LISTINGS.find(l => l.id === listingId);
    if (!listing) return false;
    if (selectedAccount === 'All') return true;
    return listing.accountEmail === selectedAccount;
  }).length;

  // Fetch member data on component mount
  useEffect(() => {
    const memberIdNumber = parseInt(memberId || '0');
    if (memberId && memberIdNumber && fetchedMemberIdRef.current !== memberIdNumber) {
      fetchedMemberIdRef.current = memberIdNumber;
      fetchEditTeamMember(memberIdNumber);
    }
  }, [memberId, fetchEditTeamMember]);

  // Update form data when member data is loaded
  useEffect(() => {
    if (currentEditMember) {
      setFormData({
        firstName: currentEditMember.firstName || "",
        lastName: currentEditMember.lastName || "",
        email: currentEditMember.username || "", // Map username to email
        password: currentEditMember.password || "",
        role: currentEditMember.role || ""
      });
    }
  }, [currentEditMember]);

  // Clear errors and reset fetch ref when component unmounts
  useEffect(() => {
    return () => {
      clearTeamEditError();
      clearTeamSaveError();
      fetchedMemberIdRef.current = null;
    };
  }, [clearTeamEditError, clearTeamSaveError]);

  const handleInputChange = (field: keyof EditFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!memberId || !currentEditMember) return;

    try {
      const updateData = {
        Id: parseInt(memberId),
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.email, // Map email back to username
        role: formData.role,
        ...(formData.password && { password: formData.password }) // Only include password if provided
      };

      const result = await updateTeamMember(updateData);
      
      if (updateEditMember.fulfilled.match(result)) {
        toast({
          title: "Success",
          description: "Team member updated successfully",
        });
        setHasChanges(false);
        navigate("/settings/team-members");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update team member",
        variant: "destructive",
      });
    }
  };

  const handleBack = () => {
    navigate("/settings/team-members");
  };

  // Listing management handlers
  const handleListingToggle = (listingId: string) => {
    const newAssignedListings = new Set(assignedListings);
    if (newAssignedListings.has(listingId)) {
      newAssignedListings.delete(listingId);
    } else {
      newAssignedListings.add(listingId);
    }
    setAssignedListings(newAssignedListings);
    setHasChanges(true);
  };

  const handleAccountSelect = (account: string) => {
    setSelectedAccount(account);
    setCurrentPage(1); // Reset to first page when changing account
    setIsAccountDropdownOpen(false);
    setAccountSearchQuery(''); // Clear search when selecting
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const getStatusBadgeVariant = (status: MockListing['status']) => {
    switch (status) {
      case 'Verified': return 'default';
      case 'Pending': return 'secondary';
      case 'Unverified': return 'outline';
      default: return 'outline';
    }
  };

  // Show loading state
  if (isLoadingEdit) {
    return (
      <div className="p-4 sm:p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading team member...</span>
        </div>
      </div>
    );
  }

  // Show error state
  if (editError) {
    return (
      <div className="p-4 sm:p-6 max-w-6xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-destructive mb-4">{editError}</p>
              <Button onClick={handleBack} variant="outline">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Team Members
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentEditMember) {
    return (
      <div className="p-4 sm:p-6 max-w-6xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">Team member not found</p>
              <Button onClick={handleBack} variant="outline">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Team Members
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      {/* Back Button */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-4"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Team Members
        </Button>
      </div>

      {/* Header Card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            {/* Name and Role */}
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                {formData.firstName} {formData.lastName}
              </h1>
              <Badge variant="secondary" className="mt-1">
                {formData.role}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Tab Only */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="listing">Listing</TabsTrigger>
          <TabsTrigger value="permission">Permission</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Edit Team Member</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {saveError && (
                <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <p className="text-destructive text-sm">{saveError}</p>
                </div>
              )}

              {/* Form Fields */}
              <div className="grid grid-cols-2 gap-6">
                {/* First Row */}
                <div>
                  <Label htmlFor="firstName">First name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="mt-1"
                    disabled={isSavingEdit}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="mt-1"
                    disabled={isSavingEdit}
                  />
                </div>

                {/* Second Row */}
                <div>
                  <Label htmlFor="email">Email Id</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="mt-1"
                    disabled={isSavingEdit}
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="pr-10"
                      placeholder="Leave empty to keep current password"
                      disabled={isSavingEdit}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isSavingEdit}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Third Row */}
                <div className="col-span-1">
                  <Label htmlFor="role">Select Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => handleInputChange('role', value)}
                    disabled={isSavingEdit}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Moderator">Moderator</SelectItem>
                      <SelectItem value="Staff">Staff</SelectItem>
                      <SelectItem value="Client">Client</SelectItem>
                      <SelectItem value="Lead Generator">Lead Generator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end mt-8">
                <Button 
                  onClick={handleSave} 
                  className="px-8"
                  disabled={isSavingEdit || !hasChanges}
                >
                  {isSavingEdit ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="listing" className="mt-6">
          <Card>
            <CardHeader className="paddingBottom:0px">
              <CardTitle>Listing Management</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {/* Master Toggle for Listing Access */}
              <div className="mb-6 p-4 border rounded-lg bg-muted/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Allow Listing Access</h3>
                    <p className="text-sm text-muted-foreground">Enable this team member to access and manage listings</p>
                  </div>
                  <Switch
                    checked={allowListingAccess}
                    onCheckedChange={(checked) => {
                      setAllowListingAccess(checked);
                      setHasChanges(true);
                    }}
                  />
                </div>
              </div>

              {!allowListingAccess ? (
                <div className="text-center py-12">
                  <div className="text-muted-foreground">
                    <p className="text-lg mb-2">Listing access is disabled</p>
                    <p className="text-sm">Enable listing access to allow this team member to manage listings</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Filter Section */}
                  <div className="flex gap-4 items-center">
                    {/* Account Dropdown (80% width) */}
                    <div className="flex-1 relative">
                      <Label className="text-sm font-medium">Google Account</Label>
                      <div className="relative mt-1">
                        <Button
                          variant="outline"
                          className="w-full justify-between"
                          onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                        >
                          <span className="truncate">{selectedAccount}</span>
                          <ChevronDown className="h-4 w-4 opacity-50" />
                        </Button>
                        
                        {isAccountDropdownOpen && (
                          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover border rounded-md shadow-lg">
                            <div className="p-2 border-b">
                              <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                  placeholder="Search accounts..."
                                  value={accountSearchQuery}
                                  onChange={(e) => setAccountSearchQuery(e.target.value)}
                                  className="pl-8"
                                />
                              </div>
                            </div>
                            <div className="max-h-48 overflow-y-auto">
                              {filteredAccounts.map((account) => (
                                <button
                                  key={account}
                                  className="w-full text-left px-3 py-2 hover:bg-muted text-sm"
                                  onClick={() => handleAccountSelect(account)}
                                >
                                  {account}
                                </button>
                              ))}
                              {filteredAccounts.length === 0 && (
                                <div className="px-3 py-2 text-sm text-muted-foreground">
                                  No accounts found
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Assigned Listing Badge (20% width) */}
                    <div className="flex-shrink-0">
                      <Label className="text-sm font-medium">Assigned Listings</Label>
                      <div className="mt-1">
                        <Badge variant="secondary" className="text-sm px-3 py-1">
                          {assignedCount} Assigned
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* GMB Listings Table */}
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Business Name</TableHead>
                          <TableHead>Address</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-center">Access</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedListings.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                              No listings found for the selected account
                            </TableCell>
                          </TableRow>
                        ) : (
                          paginatedListings.map((listing) => (
                            <TableRow key={listing.id} className="hover:bg-muted/50">
                              <TableCell className="font-medium">
                                {listing.businessName}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {listing.address}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-xs">
                                  {listing.category}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant={getStatusBadgeVariant(listing.status)} className="text-xs">
                                  {listing.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-center">
                                <Switch
                                  checked={assignedListings.has(listing.id)}
                                  onCheckedChange={() => handleListingToggle(listing.id)}
                                />
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {filteredListings.length > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          Showing {startIndex + 1}-{Math.min(startIndex + pageSize, filteredListings.length)} of {filteredListings.length} listings
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {/* Page Size Selector */}
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Show:</span>
                          <Select value={pageSize.toString()} onValueChange={(value) => handlePageSizeChange(parseInt(value))}>
                            <SelectTrigger className="h-8 w-16">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="10">10</SelectItem>
                              <SelectItem value="25">25</SelectItem>
                              <SelectItem value="50">50</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Page Navigation */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            Previous
                          </Button>
                          
                          <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                              const pageNum = i + 1;
                              if (totalPages <= 5) {
                                return (
                                  <Button
                                    key={pageNum}
                                    variant={currentPage === pageNum ? "default" : "outline"}
                                    size="sm"
                                    className="w-8 h-8 p-0"
                                    onClick={() => handlePageChange(pageNum)}
                                  >
                                    {pageNum}
                                  </Button>
                                );
                              }
                              return null;
                            })}
                            {totalPages > 5 && currentPage < totalPages - 2 && (
                              <>
                                <span className="px-2 text-muted-foreground">...</span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-8 h-8 p-0"
                                  onClick={() => handlePageChange(totalPages)}
                                >
                                  {totalPages}
                                </Button>
                              </>
                            )}
                          </div>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Save Button */}
              <div className="flex justify-end mt-8 pt-6 border-t">
                <Button 
                  onClick={handleSave} 
                  className="px-8"
                  disabled={isSavingEdit || !hasChanges}
                >
                  {isSavingEdit ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permission" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Permission Management</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground">Permission management functionality will be implemented here using your existing APIs.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};