import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { SafeHtmlRenderer } from '@/components/ui/safe-html-renderer';
import { toast } from '@/hooks/use-toast';
import { useBulkPostDetails } from '@/hooks/useBulkPostDetails';
import { format } from 'date-fns';
import { PostImage } from '@/components/PublicReports/PostImage';

export const BulkPostDetails: React.FC = () => {
  const { bulkId } = useParams<{ bulkId: string }>();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const {
    bulkPost,
    posts,
    loading,
    error,
    deletePost,
    refresh
  } = useBulkPostDetails(bulkId || '');

  const handleBack = () => {
    navigate('/main-dashboard/bulk-post');
  };

  const getStatusVariant = (status: string | null | undefined) => {
    if (!status) return "secondary";
    
    switch (status.toLowerCase()) {
      case "published":
      case "live":
        return "default";
      case "draft":
        return "secondary";
      case "scheduled":
        return "outline";
      case "failed":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM dd, yyyy • hh:mm a');
    } catch (error) {
      return dateString;
    }
  };

  // Filter posts based on search term and status
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.listingName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.business?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.zipcode?.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleDeleteClick = (postId: string) => {
    setDeletingPostId(postId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deletingPostId) {
      try {
        await deletePost(deletingPostId);
        toast({
          title: "Success",
          description: "Post deleted successfully",
        });
        refresh();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete post",
          variant: "destructive",
        });
      }
    }
    setDeleteDialogOpen(false);
    setDeletingPostId(null);
  };

  const handleViewPost = (post: any) => {
    if (post.searchUrl) {
      window.open(post.searchUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-semibold text-foreground">View Details</h1>
                <p className="text-sm text-muted-foreground">View details of the selected bulk post</p>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-32 bg-muted rounded"></div>
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-64 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-semibold text-foreground">View Details</h1>
                <p className="text-sm text-muted-foreground">View details of the selected bulk post</p>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Error loading post details: {error}</p>
            <Button onClick={refresh} className="mt-4">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Custom Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">View Details</h1>
              <p className="text-sm text-muted-foreground">View details of the selected bulk post</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Post Preview */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {bulkPost?.media?.images && (
                    <div className="flex justify-center">
                      <PostImage src={bulkPost.media.images} />
                    </div>
                  )}
                  
                  {bulkPost?.title && (
                    <div className="text-center">
                      <h3 className="font-semibold text-xl text-foreground">{bulkPost.title}</h3>
                    </div>
                  )}
                  
                  {bulkPost?.content && (
                    <div className="text-center">
                      <SafeHtmlRenderer html={bulkPost.content} className="text-sm text-muted-foreground" />
                    </div>
                  )}

                  {bulkPost?.publishDate && (
                    <div className="text-center pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground">
                        Posted on: {format(new Date(bulkPost.publishDate), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Listings Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Listings</h2>
            </div>
            
            {/* Filters */}
            <div className="flex gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search listings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Listing Name</TableHead>
                      <TableHead>Zip Code</TableHead>
                      <TableHead>Store Code</TableHead>
                      <TableHead className="w-32">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPosts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          {searchTerm || statusFilter !== 'all' ? 'No listings match your filters.' : 'No posts found for this bulk post.'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPosts.map((post) => (
                        <TableRow key={post.id}>
                          <TableCell>
                            <div className="font-medium">{post.listingName || post.business || 'Unknown'}</div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">{post.zipcode || '-'}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">{post.storeCode || '-'}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm">
                              <button
                                onClick={() => handleViewPost(post)}
                                className="text-primary hover:underline"
                              >
                                View
                              </button>
                              <span className="text-muted-foreground">|</span>
                              <button
                                onClick={() => handleDeleteClick(post.id)}
                                className="text-destructive hover:underline"
                              >
                                Delete
                              </button>
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};