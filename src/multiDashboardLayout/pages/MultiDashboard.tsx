import React, { useState, useEffect } from 'react';
import { Search, Filter, BarChart3, MapPin, TrendingUp, AlertTriangle, Star, Eye, Phone, ExternalLink, Grid3X3, List, FileText, ChevronLeft, ChevronRight, MessageSquare, Building2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { PostCard } from '@/components/Posts/PostCard';
import { transformPostDashboardPost } from '@/types/postTypes';
import type { DateRange } from 'react-day-picker';
import { useTrendsData } from '@/api/trendsApi';
import { useDashboardData, useInsightsDashboardData, useReviewDashboardData, useListingDashboardData, useLocationDashboardData, usePostsDashboardData, useCategoryAndStateData, setDashboard } from '@/api/dashboardApi';
import { useDebounce } from '@/hooks/useDebounce';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useProfile } from '@/hooks/useProfile';

// Dashboard type mapping for API
const DASHBOARD_TYPE_MAPPING = {
  'default': '1',
  'insight': '3', 
  'review': '4',
  'location': '8',
  'post': '9'
} as const;

// Reverse mapping to convert API numeric IDs to frontend string keys
const DASHBOARD_ID_TO_TYPE_MAPPING = {
  '1': 'default',
  '3': 'insight', 
  '4': 'review',
  '8': 'location',
  '9': 'post'
} as const;

export const MultiDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profileData, isLoading: profileLoading } = useProfile();
  const [dashboardType, setDashboardType] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [reviewFilter, setReviewFilter] = useState<"0" | "1" | "2" | "3" | "4" | "5" | "6">("0");
  const [postStatus, setPostStatus] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isUpdatingDashboard, setIsUpdatingDashboard] = useState(false);
  const itemsPerPage = 9;
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Initialize dashboard type from profile data
  useEffect(() => {
    console.log('Profile data loaded:', profileData);
    console.log('Dashboard filter type:', profileData?.dashboardFilterType);
    
    if (profileData?.dashboardFilterType) {
      const savedType = DASHBOARD_ID_TO_TYPE_MAPPING[profileData.dashboardFilterType as keyof typeof DASHBOARD_ID_TO_TYPE_MAPPING];
      console.log('Mapped dashboard type:', savedType);
      
      if (savedType) {
        setDashboardType(savedType);
        console.log('Set dashboard type to:', savedType);
      } else {
        console.log('Invalid dashboardFilterType, falling back to default');
        setDashboardType('default');
      }
    } else if (profileData && !profileData.dashboardFilterType) {
      console.log('No dashboardFilterType in profile, using default');
      setDashboardType('default');
    }
  }, [profileData]);
  
  // Fetch trends data
  const {
    data: trendsData,
    isLoading: trendsLoading,
    error: trendsError
  } = useTrendsData();

  // Fetch category and state data
  const {
    data: categoryAndStateData,
    isLoading: categoryStateLoading,
    error: categoryStateError
  } = useCategoryAndStateData();

  // Conditionally call the appropriate hook based on dashboard type
  const defaultDashboardQuery = useDashboardData({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearchTerm,
    category: selectedCategory,
    state: selectedState
  }, dashboardType === 'default');

  const insightsDashboardQuery = useInsightsDashboardData({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearchTerm,
    category: selectedCategory,
    state: selectedState
  }, dashboardType === 'insight');

  const reviewDashboardQuery = useReviewDashboardData({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearchTerm,
    category: selectedCategory,
    state: selectedState,
    review: reviewFilter
  }, dashboardType === 'review');

  const listingDashboardQuery = useListingDashboardData({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearchTerm,
    category: selectedCategory,
    state: selectedState
  }, dashboardType === 'listing');

  const locationDashboardQuery = useLocationDashboardData({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearchTerm,
    category: selectedCategory,
    state: selectedState
  }, dashboardType === 'location');

  const postDashboardQuery = usePostsDashboardData({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearchTerm,
    category: selectedCategory,
    city: selectedState,
    dateRange: {
      startDate: dateRange?.from ? dateRange.from.toISOString().split('T')[0] : "",
      endDate: dateRange?.to ? dateRange.to.toISOString().split('T')[0] : "",
    },
    postStatus: postStatus === 'all' ? '' : postStatus,
  }, dashboardType === 'post');

  // Get the current active query
  const getCurrentQuery = () => {
    if (!dashboardType) return null; // Don't query if dashboard type not set yet
    
    switch (dashboardType) {
      case 'insight':
        return insightsDashboardQuery;
      case 'review':
        return reviewDashboardQuery;
      case 'listing':
        return listingDashboardQuery;
      case 'location':
        return locationDashboardQuery;
      case 'post':
        return postDashboardQuery;
      default:
        return defaultDashboardQuery;
    }
  };
  
  const currentQuery = getCurrentQuery();
  
  // Show loading while profile or dashboard type is not ready
  if (profileLoading || !dashboardType) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  const isDashboardLoading = currentQuery.isLoading;
  const isDashboardError = currentQuery.error;
  const dashboardResponse = currentQuery.data;
  const metricsCards = trendsData?.data?.stats ? [{
    title: 'Total Listings',
    value: trendsData.data.stats.totalListings.toLocaleString(),
    subtitle: 'Active locations',
    trend: '+2 this month',
    icon: Building2,
    bgColor: 'bg-blue-100',
    iconBgColor: 'bg-blue-500',
    textColor: 'text-gray-900'
  }, {
    title: 'Avg. Rating',
    value: trendsData.data.stats.avgRating,
    subtitle: 'Across all listings',
    trend: '↑ 0.3 points',
    icon: Star,
    bgColor: 'bg-yellow-100',
    iconBgColor: 'bg-yellow-500',
    textColor: 'text-gray-900'
  }, {
    title: 'Total Review',
    value: trendsData.data.stats.totalReviews.toLocaleString(),
    subtitle: 'Customer feedback',
    trend: 'Improving',
    icon: MessageSquare,
    bgColor: 'bg-green-100',
    iconBgColor: 'bg-green-500',
    textColor: 'text-gray-900'
  }, {
    title: 'Total Posts',
    value: trendsData.data.stats.totalPosts.toLocaleString(),
    subtitle: 'Published this month',
    trend: '+12 this week',
    icon: FileText,
    bgColor: 'bg-purple-100',
    iconBgColor: 'bg-purple-500',
    textColor: 'text-gray-900'
  }] : [];
  
  // Transform API data to display format
  const listings = dashboardType === 'post' ? [] : (dashboardResponse?.data as any)?.listings || [];
  const posts = dashboardType === 'post' ? (dashboardResponse?.data as any)?.posts || [] : [];
  const pagination = dashboardResponse?.data?.pagination;

  // Helper function to get status color based on rating
  const getStatusColor = (rating: string) => {
    const numRating = parseFloat(rating);
    if (numRating >= 4.0) return 'text-green-600';
    if (numRating >= 3.0) return 'text-blue-600';
    return 'text-red-600';
  };

  // Helper function to get status text based on rating
  const getStatusText = (rating: string) => {
    const numRating = parseFloat(rating);
    if (numRating >= 4.0) return 'Excellent';
    if (numRating >= 3.0) return 'Good';
    return 'Poor';
  };
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page on search
  };
  const handleFilterChange = (type: 'category' | 'state', value: string) => {
    if (type === 'category') {
      setSelectedCategory(value === 'all' ? '' : value);
    } else {
      setSelectedState(value === 'all' ? '' : value);
    }
    setCurrentPage(1); // Reset to first page on filter change
  };
  const handleReviewFilterChange = (value: "0" | "1" | "2" | "3" | "4" | "5" | "6") => {
    console.log('Review filter changed to:', value);
    setReviewFilter(value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handlePostStatusChange = (value: string) => {
    setPostStatus(value);
    setCurrentPage(1);
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    setCurrentPage(1);
  };

  const handleDashboardTypeChange = async (newType: string) => {
    try {
      setIsUpdatingDashboard(true);
      const numericId = DASHBOARD_TYPE_MAPPING[newType as keyof typeof DASHBOARD_TYPE_MAPPING];
      await setDashboard(numericId);
      setDashboardType(newType);
      setCurrentPage(1); // Reset pagination when changing dashboard type
    } catch (error) {
      console.error('Dashboard save error:', error);
    } finally {
      setIsUpdatingDashboard(false);
    }
  };

  return <TooltipProvider>
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {trendsLoading ? Array.from({
          length: 4
        }).map((_, index) => <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="w-12 h-12 rounded-lg ml-4" />
              </div>
            </div>) : trendsError ? <div className="col-span-4 text-center py-8">
            <p className="text-gray-500">Failed to load metrics. Please try again.</p>
          </div> : metricsCards.map((metric, index) => {
          const Icon = metric.icon;
          return <div key={index} className={`bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1 space-y-1">
                      <h3 className="text-sm font-medium text-gray-600">{metric.title}</h3>
                      <div className="text-3xl font-bold text-gray-900">{metric.value}</div>
                    </div>
                    <div className={`${metric.iconBgColor} rounded-lg p-3 flex items-center justify-center ml-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>;
        })}
      </div>

      {/* Search and Filters */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
          <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input placeholder="Search listings by name, location, or category..." className="w-full pl-10 pr-4 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring" value={searchTerm} onChange={e => handleSearchChange(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={value => handleFilterChange('category', value)} disabled={categoryStateLoading}>
                <SelectTrigger className="w-40 bg-background">
                  <SelectValue placeholder={categoryStateLoading ? "Loading..." : "All Categories"} />
                </SelectTrigger>
                <SelectContent className="z-50 bg-background">
                  <SelectItem value="all">All Categories</SelectItem>
                  {!categoryStateLoading && !categoryStateError && categoryAndStateData?.data?.categories?.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedState} onValueChange={value => handleFilterChange('state', value)} disabled={categoryStateLoading}>
                <SelectTrigger className="w-40 bg-background">
                  <SelectValue placeholder={categoryStateLoading ? "Loading..." : "All States"} />
                </SelectTrigger>
                <SelectContent className="z-50 bg-background">
                  <SelectItem value="all">All States</SelectItem>
                  {!categoryStateLoading && !categoryStateError && categoryAndStateData?.data?.states?.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
        </div>

        {/* GMB Listings */}
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <h3 className="text-lg font-semibold">{dashboardType === 'post' ? 'Posts' : 'GMB Listings'}</h3>
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="flex items-center gap-2">
                <Select value={dashboardType} onValueChange={handleDashboardTypeChange} disabled={isUpdatingDashboard}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Dashboard Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default Dashboard</SelectItem>
                    <SelectItem value="insight">Insight Dashboard</SelectItem>
                    <SelectItem value="review">Review Dashboard</SelectItem>
                    <SelectItem value="location">Location Dashboard</SelectItem>
                    <SelectItem value="post">Post Dashboard</SelectItem>
                  </SelectContent>
                </Select>
                {isUpdatingDashboard && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
              </div>
              
              {/* Review Filter Dropdown - Only show for review dashboard */}
              {dashboardType === 'review' && <Select value={reviewFilter} onValueChange={handleReviewFilterChange}>
                  <SelectTrigger className="w-52">
                    <SelectValue placeholder="Review Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Un - Responded Review</SelectItem>
                    <SelectItem value="1">Un - Responded ARE</SelectItem>
                    <SelectItem value="2">Un - Responded DNR</SelectItem>
                    <SelectItem value="3">Exclude ARE Review</SelectItem>
                    <SelectItem value="4">Exclude DNR Review</SelectItem>
                    <SelectItem value="5">Exclude ARE/DNR Review</SelectItem>
                  </SelectContent>
                </Select>}

              {/* Post Filters - Only show for post dashboard */}
              {dashboardType === 'post' && (
                <>
                  <Select value={postStatus} onValueChange={handlePostStatusChange}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Post status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Posts</SelectItem>
                      <SelectItem value="scheduled">Scheduled Post</SelectItem>
                      <SelectItem value="published">Live Post</SelectItem>
                      <SelectItem value="failed">Failed Post</SelectItem>
                    </SelectContent>
                  </Select>
                  <DateRangePicker
                    date={dateRange}
                    onDateChange={handleDateRangeChange}
                  />
                </>
              )}

              <ToggleGroup type="single" value={viewMode} onValueChange={value => value && setViewMode(value)}>
                <ToggleGroupItem value="grid" aria-label="Grid view">
                  <Grid3X3 className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="list" aria-label="List view">
                  <List className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>

          {/* Display counts */}
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              {isDashboardLoading ? "Loading..." : 
                isDashboardError ? "Error loading data" : 
                dashboardType === 'post' ? 
                  `Showing ${posts.length} of ${(pagination as any)?.totalPosts || 0} posts` :
                  `Showing ${listings.length} of ${(pagination as any)?.totalResults || 0} listings`
              }
            </p>
          </div>

          {isDashboardLoading ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({
              length: itemsPerPage
            }).map((_, index) => <div key={index} className="bg-background border border-border rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <Skeleton className="h-6 w-16 rounded" />
                    </div>
                    <Skeleton className="h-4 w-24" />
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-8 w-16 rounded" />
                      <Skeleton className="h-8 w-24 rounded" />
                    </div>
                  </div>
                </div>)}
            </div> : isDashboardError ? <div className="text-center py-8">
              <p className="text-gray-500">Failed to load {dashboardType === 'post' ? 'posts' : 'listings'}. Please try again.</p>
            </div> : dashboardType === 'post' ? (
              // Post Dashboard Layout
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={transformPostDashboardPost(post)}
                    />
                  ))}
                </div>
            ) : (
                <div className="space-y-4">
                  {posts.map((post) => {
                    const transformedPost = transformPostDashboardPost(post);
                    return (
                      <div key={post.id} className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-primary/20">
                        <div className="flex items-center gap-4">
                          {/* Post Image */}
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {transformedPost.media?.images ? (
                              <img src={transformedPost.media.images} alt="Post" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-white text-xs font-medium">No Image</span>
                            )}
                          </div>

                          {/* Post Content */}
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold text-foreground text-sm truncate">{transformedPost.title || "Untitled Post"}</h4>
                            {transformedPost.listingName && (
                              <p className="text-xs text-muted-foreground">{transformedPost.listingName}</p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{transformedPost.content}</p>
                          </div>

                          {/* Post Details */}
                          <div className="flex items-center gap-6 text-xs">
                            <div className="text-center">
                              <div className={`font-semibold px-2 py-1 rounded text-xs ${
                                transformedPost.status === 'published' ? 'bg-green-100 text-green-700' :
                                transformedPost.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                                transformedPost.status === 'failed' ? 'bg-red-100 text-red-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {transformedPost.status === 'published' ? 'Live' :
                                 transformedPost.status === 'scheduled' ? 'Scheduled' :
                                 transformedPost.status === 'failed' ? 'Failed' : 'Draft'}
                              </div>
                            </div>
                            <div className="text-center min-w-0">
                              <div className="font-semibold text-foreground truncate">{transformedPost.publishDate}</div>
                              <div className="text-muted-foreground">Publish Date</div>
                            </div>
                            {transformedPost.tags && (
                              <div className="text-center min-w-0">
                                <div className="font-semibold text-foreground truncate">{transformedPost.tags}</div>
                                <div className="text-muted-foreground">Tags</div>
                              </div>
                            )}
                          </div>

                           {/* Action Buttons */}
                           <div className="flex-shrink-0 flex items-center gap-2">
                             {transformedPost.searchUrl && (
                               <Button variant="outline" size="sm" onClick={() => window.open(transformedPost.searchUrl, "_blank")}>
                                 <ExternalLink className="w-3 h-3" />
                               </Button>
                             )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            ) : viewMode === 'grid' ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map(listing => <div key={listing.id} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-primary/20">
                  {/* Header with Logo and Title */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden border border-primary/20">
                      {listing.profilePhoto ? <img src={listing.profilePhoto} alt={listing.locationName || listing.listingName} className="w-full h-full object-cover" /> : <Building2 className="w-6 h-6 text-primary" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <h4 className="font-bold text-foreground text-lg leading-tight mb-1 truncate">{listing.locationName || listing.listingName}</h4>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{listing.locationName || listing.listingName}</p>
                        </TooltipContent>
                      </Tooltip>
                      <p className="text-xs text-muted-foreground">ID: {listing.listingId || listing.id}</p>
                      {(dashboardType === 'insight' || dashboardType === 'review') && listing.zipCode && <p className="text-xs text-muted-foreground">Zip: {listing.zipCode}</p>}
                      {(dashboardType === 'insight' || dashboardType === 'review') && listing.city && <p className="text-xs text-muted-foreground">City: {listing.city}</p>}
                      {dashboardType === 'insight' && listing.category && <p className="text-xs text-muted-foreground">{listing.category}</p>}
                    </div>
                    {listing.storeCode && <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md font-medium">
                        {listing.storeCode}
                      </span>}
                  </div>
                  
                  {dashboardType === 'insight' ?
              // Insights Dashboard Content
              <>
                      {/* Visibility Stats */}
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-muted-foreground mb-2">Visibility</h5>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-center p-2 bg-blue-50 rounded">
                            <div className="font-semibold text-blue-600">{listing.visibility?.search_views || 0}</div>
                            <div className="text-gray-500">Search</div>
                          </div>
                          <div className="text-center p-2 bg-green-50 rounded">
                            <div className="font-semibold text-green-600">{listing.visibility?.maps_views || 0}</div>
                            <div className="text-gray-500">Maps</div>
                          </div>
                          <div className="text-center p-2 bg-purple-50 rounded">
                            <div className="font-semibold text-purple-600">{listing.visibility?.total_views || 0}</div>
                            <div className="text-gray-500">Total</div>
                          </div>
                        </div>
                      </div>

                      {/* Customer Actions */}
                      <div className="mb-5">
                        <h5 className="text-sm font-medium text-muted-foreground mb-2">Customer Actions</h5>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                            <ExternalLink className="w-3 h-3 text-blue-500" />
                            <span>{listing.customer_actions?.website_clicks || 0} Clicks</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                            <MapPin className="w-3 h-3 text-green-500" />
                            <span>{listing.customer_actions?.direction_requests || 0} Directions</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                            <Phone className="w-3 h-3 text-orange-500" />
                            <span>{listing.customer_actions?.phone_calls || 0} Calls</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                            <MessageSquare className="w-3 h-3 text-purple-500" />
                            <span>{listing.customer_actions?.messages || 0} Messages</span>
                          </div>
                        </div>
                      </div>
                    </> : dashboardType === 'review' ?
              // Review Dashboard Content
              <>
                      {/* Rating Section */}
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-muted-foreground mb-2">Review Stats</h5>
                        <div className="flex items-center gap-2 mb-3">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className={`font-bold text-sm ${getStatusColor(listing.avgRating || listing.rating)}`}>
                            {listing.avgRating || listing.rating}
                          </span>
                        </div>
                      </div>

                      {/* Review Stats */}
                      <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-muted-foreground font-medium">Total:</span>
                            <p className="font-semibold text-foreground">{listing.reviewCount || 0}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground font-medium">Auto Reply Status:</span>
                            <p className="font-semibold text-foreground">{listing.autoReplyStatus || '-'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Auto Reply Status */}
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-muted-foreground mb-2">Auto Reply Settings</h5>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-center p-2 bg-blue-50 rounded">
                            <div className={`font-semibold ${listing.dnrActive ? 'text-blue-600' : 'text-gray-400'}`}>
                              {listing.dnrActive ? 'Active' : 'Inactive'}
                            </div>
                            <div className="text-gray-500">DNR</div>
                          </div>
                          <div className="text-center p-2 bg-green-50 rounded">
                            <div className={`font-semibold ${listing.arActive ? 'text-green-600' : 'text-gray-400'}`}>
                              {listing.arActive ? 'Active' : 'Inactive'}
                            </div>
                            <div className="text-gray-500">AR</div>
                          </div>
                          <div className="text-center p-2 bg-purple-50 rounded">
                            <div className={`font-semibold ${listing.arAiActive ? 'text-purple-600' : 'text-gray-400'}`}>
                              {listing.arAiActive ? 'Active' : 'Inactive'}
                            </div>
                            <div className="text-gray-500">AI AR</div>
                          </div>
                        </div>
                      </div>
                    </> : dashboardType === 'listing' ?
              // Listing Dashboard Content
              <>
                      {/* Status Section */}
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-muted-foreground mb-2">Listing Status</h5>
                        <div className="flex items-center gap-2 mb-3">
                          <div className={`w-2 h-2 rounded-full ${listing.status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                          <span className="font-bold text-sm text-foreground">
                            {listing.status || 'Active'}
                          </span>
                        </div>
                      </div>

                      {/* Listing Info */}
                      <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-muted-foreground font-medium">Visibility:</span>
                            <p className="font-semibold text-foreground">{listing.visibility || 'Public'}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground font-medium">Complete:</span>
                            <p className="font-semibold text-foreground">{listing.completeness || 100}%</p>
                          </div>
                        </div>
                      </div>

                      {/* Last Updated */}
                      <div className="mb-5 space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground font-medium">Last Updated:</span>
                          <span className="text-foreground font-medium">{listing.lastUpdated || 'Recently'}</span>
                        </div>
                      </div>
                    </> : dashboardType === 'location' ?
              // Location Dashboard Content
              <>
                      {/* Location Card Header */}
                      

                      {/* Address & Contact */}
                      <div className="mb-4 space-y-3">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground font-medium truncate">{listing.address}</p>
                            <p className="text-xs text-muted-foreground">{listing.state} {listing.zipCode}</p>
                          </div>
                        </div>
                        {listing.phone && <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                              <span className="text-sm text-foreground font-medium">{listing.phone}</span>
                            </div>
                            <span className="text-xs text-muted-foreground font-medium bg-muted/50 px-2 py-1 rounded">{listing.category}</span>
                          </div>}
                      </div>

                      {/* Stats Grid */}
                      <div className="mb-4 grid grid-cols-2 gap-3">
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-lg p-3 text-center">
                          <div className="text-lg font-bold text-blue-700 dark:text-blue-300">{listing.photoCount || 0}</div>
                          <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Photos</div>
                        </div>
                        <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-lg p-3 text-center">
                          <div className="text-lg font-bold text-green-700 dark:text-green-300">{listing.rating}</div>
                          <div className="text-xs text-green-600 dark:text-green-400 font-medium">Rating</div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex gap-2 mb-4">
                        {listing.website && <button onClick={() => {
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = listing.website;
                    const link = tempDiv.querySelector('a');
                    if (link) window.open(link.href, '_blank');
                  }} className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors text-sm font-medium">
                            <ExternalLink className="w-3 h-3" />
                            Website
                          </button>}
                        {listing.map && <button onClick={() => {
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = listing.map;
                    const link = tempDiv.querySelector('a');
                    if (link) window.open(link.href, '_blank');
                  }} className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-secondary/50 hover:bg-secondary text-secondary-foreground rounded-lg transition-colors text-sm font-medium">
                            <MapPin className="w-3 h-3" />
                            Maps
                          </button>}
                      </div>
                    </> :
              // Default Dashboard Content
              <>
                      {/* Rating Section */}
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-muted-foreground mb-2">Avg. Rating</h5>
                        <div className="flex items-center gap-2 mb-3">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className={`font-bold text-sm ${getStatusColor(listing.rating)}`}>
                            {listing.rating} {getStatusText(listing.rating)}
                          </span>
                        </div>
                      </div>

                      {/* Engagement Stats */}
                      <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                        <div className="text-sm">
                          <div>
                            <span className="text-muted-foreground font-medium">Reviews:</span>
                            <p className="font-semibold text-foreground">{listing.reviewReply}</p>
                          </div>
                        </div>
                      </div>

                      {/* Scheduled Posts */}
                      <div className="mb-5 space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground font-medium">Last Post:</span>
                          <span className="text-foreground font-medium">{listing.lastPost}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground font-medium">Upcoming:</span>
                          <span className="text-foreground font-medium">{listing.upcomingPost}</span>
                        </div>
                      </div>
                    </>}

                  {/* Action Button */}
                  <div className="flex justify-end">
                    <Button variant="default" size="sm" onClick={() => navigate(`/location-dashboard/${listing.listingId || listing.id}`)} className="w-full gap-2">
                      View Details
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>)}
            </div> : <div className="space-y-2">
              {listings.map(listing => <div key={listing.listingId || listing.id} className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-primary/20">
                  <div className="flex items-center gap-4">
                    {/* Logo */}
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden border border-primary/20">
                      {listing.profilePhoto ? <img src={listing.profilePhoto} alt={listing.locationName || listing.listingName} className="w-full h-full object-cover" /> : <Building2 className="w-5 h-5 text-primary" />}
                    </div>

                    {/* Basic Info */}
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-foreground text-sm truncate">{listing.locationName || listing.listingName}</h4>
                      <p className="text-xs text-muted-foreground">ID: {listing.listingId || listing.id}</p>
                      {listing.storeCode && <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md font-medium">
                        {listing.storeCode}
                      </span>}
                    </div>

                    {/* Dashboard Type Specific Data */}
                    <div className="flex items-center gap-6 text-xs">
                      {dashboardType === 'insight' ? (
                        <>
                          <div className="text-center">
                            <div className="font-semibold text-blue-600">{listing.visibility?.search_views || 0}</div>
                            <div className="text-muted-foreground">Search</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-green-600">{listing.visibility?.maps_views || 0}</div>
                            <div className="text-muted-foreground">Maps</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-orange-600">{listing.customer_actions?.phone_calls || 0}</div>
                            <div className="text-muted-foreground">Calls</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-purple-600">{listing.customer_actions?.website_clicks || 0}</div>
                            <div className="text-muted-foreground">Clicks</div>
                          </div>
                        </>
                      ) : dashboardType === 'review' ? (
                        <>
                          <div className="flex items-center gap-2">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span className={`font-semibold ${getStatusColor(listing.avgRating || listing.rating)}`}>
                              {listing.avgRating || listing.rating}
                            </span>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-foreground">{listing.reviewCount || 0}</div>
                            <div className="text-muted-foreground">Reviews</div>
                          </div>
                          <div className="text-center">
                            <div className={`font-semibold ${listing.dnrActive ? 'text-blue-600' : 'text-gray-400'}`}>
                              {listing.dnrActive ? 'Active' : 'Inactive'}
                            </div>
                            <div className="text-muted-foreground">DNR</div>
                          </div>
                          <div className="text-center">
                            <div className={`font-semibold ${listing.arActive ? 'text-green-600' : 'text-gray-400'}`}>
                              {listing.arActive ? 'Active' : 'Inactive'}
                            </div>
                            <div className="text-muted-foreground">AR</div>
                          </div>
                          <div className="text-center">
                            <div className={`font-semibold ${listing.arAiActive ? 'text-purple-600' : 'text-gray-400'}`}>
                              {listing.arAiActive ? 'Active' : 'Inactive'}
                            </div>
                            <div className="text-muted-foreground">AI AR</div>
                          </div>
                        </>
                      ) : dashboardType === 'location' ? (
                        <>
                          <div className="text-center">
                            <div className="font-semibold text-blue-600">{listing.photoCount || 0}</div>
                            <div className="text-muted-foreground">Photos</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span className={`font-semibold ${getStatusColor(listing.rating)}`}>
                              {listing.rating}
                            </span>
                          </div>
                          <div className="text-center min-w-0">
                            <div className="font-semibold text-foreground truncate">{listing.phone || 'N/A'}</div>
                            <div className="text-muted-foreground">Phone</div>
                          </div>
                          <div className="text-center min-w-0">
                            <div className="font-semibold text-foreground truncate">{listing.state || 'N/A'}</div>
                            <div className="text-muted-foreground">State</div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-2">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span className={`font-semibold ${getStatusColor(listing.rating)}`}>
                              {listing.rating}
                            </span>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-foreground">{listing.reviewReply}</div>
                            <div className="text-muted-foreground">Reviews</div>
                          </div>
                          <div className="text-center min-w-0">
                            <div className="font-semibold text-foreground truncate">{listing.lastPost}</div>
                            <div className="text-muted-foreground">Last Post</div>
                          </div>
                          <div className="text-center min-w-0">
                            <div className="font-semibold text-foreground truncate">{listing.upcomingPost}</div>
                            <div className="text-muted-foreground">Upcoming</div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="flex-shrink-0">
                      <Button variant="outline" size="sm" onClick={() => navigate(`/location-dashboard/${listing.listingId || listing.id}`)}>
                        View Details
                        <ExternalLink className="w-3 h-3 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>)}
            </div>}
            
            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-muted-foreground">
                  {dashboardType === 'post' ? 
                    `Showing ${(pagination.currentPage - 1) * itemsPerPage + 1} to ${Math.min(pagination.currentPage * itemsPerPage, (pagination as any).totalPosts)} of ${(pagination as any).totalPosts} posts` :
                    `Showing ${(pagination.currentPage - 1) * (pagination as any).resultsPerPage + 1} to ${Math.min(pagination.currentPage * (pagination as any).resultsPerPage, (pagination as any).totalResults)} of ${(pagination as any).totalResults} listings`
                  }
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1 || isDashboardLoading}>
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({
                  length: pagination.totalPages
                }, (_, i) => i + 1).map(page => <Button key={page} variant={currentPage === page ? "default" : "outline"} size="sm" onClick={() => setCurrentPage(page)} className="w-8 h-8 p-0" disabled={isDashboardLoading}>
                        {page}
                      </Button>)}
                  </div>
                  
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))} disabled={currentPage === pagination.totalPages || isDashboardLoading}>
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>}
        </div>
      </div>
    </div>
  </TooltipProvider>;
};