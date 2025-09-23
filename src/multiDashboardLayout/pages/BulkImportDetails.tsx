import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Mock data interfaces
interface Listing {
  id: string;
  name: string;
  zipCode: string;
}

interface ImportPost {
  id: number;
  image: string;
  title: string;
  description: string;
  date: string;
  status: 'Live' | 'Draft' | 'Scheduled';
}

// Mock data
const mockListings: Listing[] = [
  { id: '1', name: 'Webmart software solution...', zipCode: '431105' },
  { id: '2', name: 'Webmart software solution...', zipCode: '431100' },
  { id: '3', name: 'Webmart software solution...', zipCode: '420515' },
  { id: '4', name: 'Citation Builder Pro', zipCode: '431105' },
  { id: '5', name: 'GMB briefcase', zipCode: '431105' },
];

const mockPosts: ImportPost[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=100&h=100&fit=crop',
    title: 'Boost your website....',
    description: 'Boost your website ranking with proven SEO...',
    date: '01-08-2025',
    status: 'Live'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop',
    title: 'Boost your website....',
    description: 'Boost your website ranking with proven SEO...',
    date: '01-08-2025',
    status: 'Live'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=100&h=100&fit=crop',
    title: 'Boost your website....',
    description: 'Boost your website ranking with proven SEO...',
    date: '01-08-2025',
    status: 'Live'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1553484771-cc0d9b8c2b33?w=100&h=100&fit=crop',
    title: 'Boost your website....',
    description: 'Boost your website ranking with proven SEO...',
    date: '01-08-2025',
    status: 'Live'
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=100&h=100&fit=crop',
    title: 'Boost your website....',
    description: 'Boost your website ranking with proven SEO...',
    date: '01-08-2025',
    status: 'Live'
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=100&h=100&fit=crop',
    title: 'Boost your website....',
    description: 'Boost your website ranking with proven SEO...',
    date: '01-08-2025',
    status: 'Live'
  },
];

const ListingSidebar = ({ listings, onSearch }: { listings: Listing[], onSearch: (query: string) => void }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedListing, setSelectedListing] = useState<string | null>('1');

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const filteredListings = listings.filter(listing =>
    listing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.zipCode.includes(searchQuery)
  );

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
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 text-sm"
          />
        </div>
        <div className="space-y-2">
          {filteredListings.map((listing) => (
            <div
              key={listing.id}
              onClick={() => setSelectedListing(listing.id)}
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedListing === listing.id
                  ? 'bg-success/10 border-success text-success-foreground'
                  : 'border-border hover:bg-muted/50'
              }`}
            >
              <div className="font-medium text-sm">{listing.name}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Zip code : {listing.zipCode}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const BulkImportDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterValue, setFilterValue] = useState('all');

  const handleBack = () => {
    navigate('/main-dashboard/import-post-csv');
  };

  const handleListingSearch = (query: string) => {
    // Handle listing search if needed
    console.log('Listing search:', query);
  };

  const handleViewPost = (postId: number) => {
    console.log('View post:', postId);
  };

  const handleDeletePost = (postId: number) => {
    console.log('Delete post:', postId);
  };

  const filteredPosts = mockPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterValue === 'all' || post.status.toLowerCase() === filterValue.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background">

      {/* Main Content */}
      <div className="flex gap-6 p-6">
        {/* Left Sidebar - Hidden on mobile */}
        <div className="w-80 hidden lg:block">
          <ListingSidebar listings={mockListings} onSearch={handleListingSearch} />
        </div>

        {/* Mobile Sidebar Summary - Visible only on mobile */}
        <div className="lg:hidden w-full mb-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm font-medium text-center">
                {mockListings.length} listings selected
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 space-y-6">
          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by post title"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                      <TableCell 
                        colSpan={6} 
                        className="h-24 text-center text-muted-foreground"
                      >
                        No posts found matching your search criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPosts.map((post) => (
                      <TableRow key={post.id} className="border-border">
                        <TableCell className="text-muted-foreground">
                          {post.id}
                        </TableCell>
                        <TableCell>
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-12 h-12 rounded-lg object-cover border border-border"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium text-foreground text-sm">
                              {post.title}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {post.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-foreground">
                          {post.date}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="default" 
                            className="bg-success text-success-foreground hover:bg-success/90"
                          >
                            {post.status}
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};