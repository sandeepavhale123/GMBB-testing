import React, { useState } from 'react';
import { Search, Filter, BarChart3, MapPin, TrendingUp, AlertTriangle, Star, Eye, Phone, ExternalLink, Grid3X3, List, FileText, ChevronLeft, ChevronRight, MessageSquare, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTrendsData } from '@/api/trendsApi';
import { useDashboardData, useInsightsDashboardData, useReviewDashboardData, useListingDashboardData } from '@/api/dashboardApi';
import { useDebounce } from '@/hooks/useDebounce';
import { Skeleton } from '@/components/ui/skeleton';
export const MultiDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [dashboardType, setDashboardType] = useState('default');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [reviewFilter, setReviewFilter] = useState<"1" | "2" | "3" | "4" | "5" | "6">('1');
  const itemsPerPage = 9;
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const {
    data: trendsData,
    isLoading: trendsLoading,
    error: trendsError
  } = useTrendsData();


  // Fetch dashboard listings data based on dashboard type
  const defaultDashboardQuery = useDashboardData({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearchTerm,
    category: selectedCategory,
    city: selectedCity
  });

  const insightsDashboardQuery = useInsightsDashboardData({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearchTerm,
    category: selectedCategory,
    city: selectedCity
  });

  const reviewDashboardQuery = useReviewDashboardData({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearchTerm,
    category: selectedCategory,
    city: selectedCity,
    review: reviewFilter
  });

  const listingDashboardQuery = useListingDashboardData({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearchTerm,
    category: selectedCategory,
    city: selectedCity
  });

  // Use appropriate query based on dashboard type
  const getDashboardQuery = () => {
    switch (dashboardType) {
      case 'insight':
        return insightsDashboardQuery;
      case 'review':
        return reviewDashboardQuery;
      case 'listing':
        return listingDashboardQuery;
      default:
        return defaultDashboardQuery;
    }
  };

  const currentQuery = getDashboardQuery();
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
  const listings = dashboardResponse?.data?.listings || [];
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
  const handleFilterChange = (type: 'category' | 'city', value: string) => {
    if (type === 'category') {
      setSelectedCategory(value === 'all' ? '' : value);
    } else {
      setSelectedCity(value === 'all' ? '' : value);
    }
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleReviewFilterChange = (value: "1" | "2" | "3" | "4" | "5" | "6") => {
    setReviewFilter(value);
    setCurrentPage(1); // Reset to first page on filter change
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
              <Select value={selectedCategory} onValueChange={value => handleFilterChange('category', value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="restaurant">Restaurant</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="automotive">Automotive</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedCity} onValueChange={value => handleFilterChange('city', value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Cities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  <SelectItem value="new york">New York</SelectItem>
                  <SelectItem value="brooklyn">Brooklyn</SelectItem>
                  <SelectItem value="queens">Queens</SelectItem>
                  <SelectItem value="manhattan">Manhattan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
        </div>

        {/* GMB Listings */}
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <h3 className="text-lg font-semibold">GMB Listings</h3>
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <Select value={dashboardType} onValueChange={setDashboardType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Dashboard Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default dashboard</SelectItem>
                  <SelectItem value="insight">Insight</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="listing">Listing dashboard</SelectItem>
                  {/* <SelectItem value="group">Group dashboard</SelectItem>
                  <SelectItem value="post">Post dashboard</SelectItem>
                  <SelectItem value="adv-posts">Adv.posts</SelectItem> */}
                </SelectContent>
              </Select>
              
              {/* Review Filter Dropdown - Only show for review dashboard */}
              {dashboardType === 'review' && (
                <Select value={reviewFilter} onValueChange={handleReviewFilterChange}>
                  <SelectTrigger className="w-52">
                    <SelectValue placeholder="Review Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Un - Responded Review</SelectItem>
                    <SelectItem value="2">Un - Responded ARE</SelectItem>
                    <SelectItem value="3">Un - Responded DNR</SelectItem>
                    <SelectItem value="4">Exclude ARE Review</SelectItem>
                    <SelectItem value="5">Exclude DNR Review</SelectItem>
                    <SelectItem value="6">Exclude ARE/DNR Review</SelectItem>
                  </SelectContent>
                </Select>
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
              <p className="text-gray-500">Failed to load listings. Please try again.</p>
            </div> : viewMode === 'grid' ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      {(dashboardType === 'insight' || dashboardType === 'review') && listing.zipCode && (
                        <p className="text-xs text-muted-foreground">Zip: {listing.zipCode}</p>
                      )}
                      {(dashboardType === 'insight' || dashboardType === 'review') && listing.city && (
                        <p className="text-xs text-muted-foreground">City: {listing.city}</p>
                      )}
                      {dashboardType === 'insight' && listing.category && (
                        <p className="text-xs text-muted-foreground">{listing.category}</p>
                      )}
                    </div>
                    {listing.storeCode && <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md font-medium">
                        {listing.storeCode}
                      </span>}
                  </div>
                  
                  {dashboardType === 'insight' ? (
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
                    </>
                  ) : dashboardType === 'review' ? (
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
                            <span className="text-muted-foreground font-medium">Status:</span>
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
                    </>
                  ) : dashboardType === 'listing' ? (
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
                    </>
                  ) : (
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
                    </>
                  )}

                  {/* Action Button */}
                  <div className="flex justify-end">
                    <Button variant="default" size="sm" onClick={() => navigate(`/location-dashboard/${listing.listingId || listing.id}`)} className="w-full gap-2">
                      View Details
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>)}
            </div> : <div className="space-y-3">
              {listings.map(listing => <div key={listing.id} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-primary/20">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>

                      <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden border border-primary/20">
                            {listing.profilePhoto ? <img src={listing.profilePhoto} alt={listing.listingName} className="w-full h-full object-cover" /> : <Building2 className="w-5 h-5 text-primary" />}
                          </div>
                    
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          
                          <h4 className="font-semibold text-foreground">{listing.locationName || listing.listingName}</h4>
                          
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{listing.id}</p>
                      <div className="text-sm text-muted-foreground">
                        {dashboardType === 'insight' ? (
                          <p><strong>Category:</strong> {listing.category} | <strong>State:</strong> {listing.state}</p>
                        ) : (
                          <p><strong>Reviews:</strong> {listing.reviewReply} | <strong>Q&A:</strong> {listing.qa}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      {dashboardType === 'insight' ? (
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <div><strong>Views:</strong> {listing.visibility?.total_views || 0}</div>
                          <div><strong>Calls:</strong> {listing.customer_actions?.phone_calls || 0}</div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <div><strong>Last Post:</strong> {listing.lastPost}</div>
                          <div><strong>Upcoming:</strong> {listing.upcomingPost}</div>
                        </div>
                      )}
                      {!dashboardType.includes('insight') && (
                        <div className="flex items-center gap-2">
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span className={`font-semibold ${getStatusColor(listing.rating)}`}>
                            {listing.rating}
                          </span>
                        </div>
                      )}
                      <Button variant="outline" size="sm" onClick={() => navigate(`/location-dashboard/${listing.id}`)}>
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
                  Showing {(pagination.currentPage - 1) * pagination.resultsPerPage + 1} to {Math.min(pagination.currentPage * pagination.resultsPerPage, pagination.totalResults)} of {pagination.totalResults} listings
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