import React, { useState } from 'react';
import { Search, Filter, BarChart3, MapPin, TrendingUp, AlertTriangle, Star, Eye, Phone, ExternalLink, Grid3X3, List, FileText, ChevronLeft, ChevronRight, MessageSquare, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useTrendsData } from '@/api/trendsApi';
import { useDashboardData } from '@/api/dashboardApi';
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
  const itemsPerPage = 9;
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  const { data: trendsData, isLoading: trendsLoading, error: trendsError } = useTrendsData();
  
  // Fetch dashboard listings data
  const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError } = useDashboardData({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearchTerm,
    category: selectedCategory,
    city: selectedCity
  });

  const metricsCards = trendsData ? [{
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
  const listings = dashboardData?.data.listings || [];
  const pagination = dashboardData?.data.pagination;
  
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
  
  return <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {trendsLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="w-12 h-12 rounded-lg ml-4" />
              </div>
            </div>
          ))
        ) : trendsError ? (
          <div className="col-span-4 text-center py-8">
            <p className="text-gray-500">Failed to load metrics. Please try again.</p>
          </div>
        ) : (
          metricsCards.map((metric, index) => {
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
          })
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
          <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input 
                placeholder="Search listings by name, location, or category..." 
                className="w-full pl-10 pr-4 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={(value) => handleFilterChange('category', value)}>
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
              <Select value={selectedCity} onValueChange={(value) => handleFilterChange('city', value)}>
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
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="insight">Insight</SelectItem>
                  <SelectItem value="group">Group dashboard</SelectItem>
                  <SelectItem value="listing">Listing dashboard</SelectItem>
                  <SelectItem value="post">Post dashboard</SelectItem>
                  <SelectItem value="adv-posts">Adv.posts</SelectItem>
                </SelectContent>
              </Select>
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
          {dashboardLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: itemsPerPage }).map((_, index) => (
                <div key={index} className="bg-background border border-border rounded-lg p-4">
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
                </div>
              ))}
            </div>
          ) : dashboardError ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Failed to load listings. Please try again.</p>
            </div>
          ) : viewMode === 'grid' ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {listings.map(listing => <div key={listing.id} className="bg-background border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-foreground">{listing.listingName}</h4>
                      <p className="text-sm text-muted-foreground">{listing.id}</p>
                    </div>
                    <div className="flex gap-1">
                      <span className="px-2 py-1 bg-accent text-accent-foreground text-xs rounded">
                        {listing.storeCode || 'N/A'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Rating:</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span className={`font-semibold ${getStatusColor(listing.rating)}`}>
                          {listing.rating} {getStatusText(listing.rating)}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p><strong>Reviews:</strong> {listing.reviewReply}</p>
                      <p><strong>Q&A:</strong> {listing.qa}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                      <div><strong>Last Post:</strong> {listing.lastPost}</div>
                      <div><strong>Upcoming:</strong> {listing.upcomingPost}</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="h-8 bg-muted rounded flex items-center px-2">
                      <BarChart3 className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground ml-1">Trend</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => navigate(`/location-dashboard/${listing.id}`)}>
                      <span className="mr-2">View Details</span>
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>)}
            </div> : <div className="space-y-3">
              {listings.map(listing => <div key={listing.id} className="bg-background border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold text-foreground">{listing.listingName}</h4>
                          <span className="px-2 py-1 bg-accent text-accent-foreground text-xs rounded">
                            {listing.storeCode || 'N/A'}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{listing.id}</p>
                      <div className="text-sm text-muted-foreground">
                        <p><strong>Reviews:</strong> {listing.reviewReply} | <strong>Q&A:</strong> {listing.qa}</p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div><strong>Last Post:</strong> {listing.lastPost}</div>
                        <div><strong>Upcoming:</strong> {listing.upcomingPost}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span className={`font-semibold ${getStatusColor(listing.rating)}`}>
                          {listing.rating}
                        </span>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => navigate(`/location-dashboard/${listing.id}`)}>
                        View Details
                        <ExternalLink className="w-3 h-3 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>)}
            </div>}
            
            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-muted-foreground">
                  Showing {((pagination.currentPage - 1) * pagination.resultsPerPage) + 1} to {Math.min(pagination.currentPage * pagination.resultsPerPage, pagination.totalResults)} of {pagination.totalResults} listings
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1 || dashboardLoading}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-8 h-8 p-0"
                        disabled={dashboardLoading}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                    disabled={currentPage === pagination.totalPages || dashboardLoading}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>;
};