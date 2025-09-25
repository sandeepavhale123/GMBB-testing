import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Eye, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBulkImportDetails } from '@/hooks/useBulkImportDetails';
import type { BulkListing } from '@/api/csvApi';
import { PostPreviewModal } from '@/components/Posts/PostPreviewModal';

// Helper function to get status variant
const getStatusVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case 'live':
    case 'published':
      return 'default';
    case 'scheduled':
      return 'secondary';
    case 'draft':
      return 'outline';
    default:
      return 'outline';
  }
};

// Helper function to format date
const formatDate = (dateString: string) => {
  if (!dateString || dateString === '01/01/1970 12:00 AM') {
    return 'Not scheduled';
  }
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
};
const ListingSidebar = ({
  listings,
  loading,
  error,
  selectedListingId,
  onSearch,
  onListingSelect
}: {
  listings: BulkListing[];
  loading: boolean;
  error: string | null;
  selectedListingId: string | null;
  onSearch: (query: string) => void;
  onListingSelect: (id: string) => void;
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };
  
  
  if (error) {
    return (
      <Card className="h-fit">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-medium text-destructive">
            Error loading listings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="h-fit">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-medium">
          {listings.length} Selected listings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search by listing name or zip code" 
            value={searchQuery} 
            onChange={e => handleSearchChange(e.target.value)} 
            className="pl-10 text-sm" 
          />
        </div>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {listings.map(listing => (
            <div 
              key={listing.id} 
              onClick={() => onListingSelect(listing.id)} 
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedListingId === listing.id 
                  ? 'bg-success/10 border-success text-success' 
                  : 'border-border hover:bg-muted/50'
              }`}
            >
              <div className="font-medium text-sm break-words">{listing.listing_name}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Zip code: {listing.zipcode}
              </div>
            </div>
          ))}
          {listings.length === 0 && !loading && (
            <div className="text-center py-4 text-muted-foreground text-sm">
              No listings found
            </div>
          )}
          {loading && (
            <div className="text-center py-4 text-muted-foreground text-sm flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
export const BulkImportDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState('all');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedPostForPreview, setSelectedPostForPreview] = useState<any>(null);
  
  const historyId = parseInt(id || '0', 10);
  
  const {
    listings,
    listingsLoading,
    listingsError,
    posts,
    postsLoading,
    postsError,
    selectedListingId,
    postSearch,
    setListingSearch,
    setPostSearch,
    setSelectedListingId
  } = useBulkImportDetails(historyId);

  const handleBack = () => {
    navigate('/main-dashboard/import-post-csv');
  };

  const handleViewPost = (postId: string) => {
    const post = filteredPosts.find(p => p.id === postId);
    if (post) {
      // If search_url exists, open in new tab
      if (post.search_url) {
        window.open(post.search_url, '_blank');
      } else {
        // Otherwise show modal preview
        const transformedData = {
          title: post.event_title || post.text?.split(' ').slice(0, 8).join(' ') || 'Post Preview',
          description: post.text || '',
          ctaButton: post.action_type || 'Learn More',
          ctaUrl: post.url || '#',
          image: post.image || null,
          platforms: post.posttype ? [post.posttype] : []
        };
        setSelectedPostForPreview(transformedData);
        setIsPreviewModalOpen(true);
      }
    }
  };

  const handleClosePreview = () => {
    setIsPreviewModalOpen(false);
    setSelectedPostForPreview(null);
  };

  const handleDeletePost = (postId: string) => {
    console.log('Delete post:', postId);
  };

  // Filter posts based on search and status
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.text.toLowerCase().includes(postSearch.toLowerCase()) || 
                         (post.tags && post.tags.toLowerCase().includes(postSearch.toLowerCase()));
    const matchesFilter = filterValue === 'all' || post.state.toLowerCase() === filterValue.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Bulk import Details</h1>
      
      {/* Main Content */}
      <div className="flex gap-6"> 
        {/* Left Sidebar - Hidden on mobile */}
        <div className="w-80 hidden lg:block">
          <ListingSidebar 
            listings={listings}
            loading={listingsLoading}
            error={listingsError} 
            selectedListingId={selectedListingId}
            onSearch={setListingSearch}
            onListingSelect={setSelectedListingId}
          />
        </div>

        {/* Mobile Sidebar Summary - Visible only on mobile */}
        <div className="lg:hidden w-full mb-4">
          <ListingSidebar 
            listings={listings}
            loading={listingsLoading}
            error={listingsError} 
            selectedListingId={selectedListingId}
            onSearch={setListingSearch}
            onListingSelect={setSelectedListingId}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 space-y-6">
          {!selectedListingId ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-muted-foreground">
                  {listingsLoading ? 'Loading listings...' : 'Select a listing to view posts'}
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Search and Filter */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input 
                    placeholder="Search by post content or tags" 
                    value={postSearch} 
                    onChange={e => setPostSearch(e.target.value)} 
                    className="w-full" 
                  />
                </div>
                <Select value={filterValue} onValueChange={setFilterValue}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="live">Live</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Posts Table */}
              <Card>
                <CardContent className="p-0">
                  {postsLoading ? (
                    <div className="p-8 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                      <div className="text-muted-foreground">Loading posts...</div>
                    </div>
                  ) : postsError ? (
                    <div className="p-8 text-center">
                      <div className="text-destructive font-medium mb-2">Error loading posts</div>
                      <div className="text-muted-foreground text-sm">{postsError}</div>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border">
                          <TableHead className="w-12 text-muted-foreground">#</TableHead>
                          <TableHead className="w-16 text-muted-foreground">Image</TableHead>
                          <TableHead className="text-muted-foreground">Post Content</TableHead>
                          <TableHead className="w-32 text-muted-foreground">Date</TableHead>
                          <TableHead className="w-20 text-muted-foreground">Status</TableHead>
                          <TableHead className="w-24 text-muted-foreground">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPosts.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                              No posts found matching your search criteria.
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredPosts.map((post, index) => (
                            <TableRow key={post.id} className="border-border">
                              <TableCell className="text-muted-foreground">
                                {index + 1}
                              </TableCell>
                              <TableCell>
                                {post.image ? (
                                  <img 
                                    src={post.image} 
                                    alt="Post" 
                                    className="w-12 h-12 rounded-lg object-cover border border-border" 
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded-lg bg-muted border border-border flex items-center justify-center">
                                    <span className="text-muted-foreground text-xs">No image</span>
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="font-medium text-foreground text-sm line-clamp-2">
                                    {post.text || 'No content'}
                                  </div>
                                  {post.tags && (
                                    <div className="text-xs text-muted-foreground">
                                      Tags: {post.tags}
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-sm text-foreground">
                                {formatDate(post.publishDate)}
                              </TableCell>
                              <TableCell>
                                <Badge variant={getStatusVariant(post.state)}>
                                  {post.state.charAt(0).toUpperCase() + post.state.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => handleViewPost(post.id)} 
                                    className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => handleDeletePost(post.id)} 
                                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>

      {/* Post Preview Modal */}
      {selectedPostForPreview && (
        <PostPreviewModal
          isOpen={isPreviewModalOpen}
          onClose={handleClosePreview}
          data={selectedPostForPreview}
        />
      )}
    </div>
  );
};