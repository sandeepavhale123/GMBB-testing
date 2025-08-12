import React, { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BulkAutoReplyFilters } from '@/components/BulkAutoReply/BulkAutoReplyFilters';
import { BulkAutoReplyTable } from '@/components/BulkAutoReply/BulkAutoReplyTable';
import { CreateAutoReplyModal } from '@/components/BulkAutoReply/CreateAutoReplyModal';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { useDebounce } from '@/hooks/useDebounce';
import { 
  fetchAutoReplyProjects, 
  deleteAutoReplyProject, 
  setSearchQuery, 
  setCurrentPage,
  clearError 
} from '@/store/slices/autoReplySlice';
import { useToast } from '@/hooks/use-toast';

// Memoized Filter Section
const MemoizedFilters = React.memo<{
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onAddListing: () => void;
}>(({ searchQuery, onSearchChange, onAddListing }) => (
  <BulkAutoReplyFilters
    searchQuery={searchQuery}
    onSearchChange={onSearchChange}
    onAddListing={onAddListing}
  />
));

// Memoized Table Section
const MemoizedTable = React.memo<{
  projects: any[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onDeleteProject: (id: string) => void;
  onViewProject: (id: string) => void;
}>(({ projects, loading, error, currentPage, totalPages, totalItems, pageSize, onPageChange, onDeleteProject, onViewProject }) => (
  <BulkAutoReplyTable
    projects={projects}
    loading={loading}
    error={error}
    currentPage={currentPage}
    totalPages={totalPages}
    totalItems={totalItems}
    pageSize={pageSize}
    onPageChange={onPageChange}
    onDeleteProject={onDeleteProject}
    onViewProject={onViewProject}
  />
));

export const BulkAutoReply: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const {
    projects,
    loading,
    error,
    searchQuery,
    currentPage,
    pageSize,
    totalPages,
    totalItems
  } = useAppSelector(state => state.autoReply);

  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Debounce search query
  const debouncedSearch = useDebounce(localSearchQuery, 500);

  // Update Redux search query when debounced value changes
  useEffect(() => {
    dispatch(setSearchQuery(debouncedSearch));
  }, [debouncedSearch, dispatch]);

  // Load projects when search or pagination changes
  useEffect(() => {
    loadProjects();
  }, [searchQuery, currentPage]);

  // Load initial data
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = useCallback(() => {
    dispatch(fetchAutoReplyProjects({
      page: currentPage,
      limit: pageSize,
      search: searchQuery
    }));
  }, [dispatch, currentPage, pageSize, searchQuery]);

  const handleSearchChange = useCallback((value: string) => {
    setLocalSearchQuery(value);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    dispatch(setCurrentPage(page));
  }, [dispatch]);

  const handleDeleteProject = useCallback(async (projectId: string) => {
    try {
      await dispatch(deleteAutoReplyProject(projectId)).unwrap();
      toast({
        title: "Success",
        description: "Auto reply project deleted successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive"
      });
    }
  }, [dispatch, toast]);

  const handleCreateSuccess = useCallback(() => {
    setIsCreateModalOpen(false);
    loadProjects();
    toast({
      title: "Success",
      description: "Auto reply project created successfully"
    });
  }, [loadProjects, toast]);

  const handleAddListing = useCallback(() => {
    // Navigate to listings management or open listings modal
    console.log('Add listing clicked');
  }, []);

  const handleViewProject = useCallback((projectId: string) => {
    navigate(`/main-dashboard/bulk-auto-reply-project-details/${projectId}`);
  }, [navigate]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadProjects();
    setTimeout(() => setIsRefreshing(false), 1000);
  }, [loadProjects]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Bulk Auto Reply Management</h1>
          <p className="text-muted-foreground">Manage automated reply settings for your locations</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Create Auto Reply
        </Button>
      </div>

      {/* Main Content Card */}
      <div className="bg-card border border-border rounded-lg p-6">
        {/* Filters Section */}
        <MemoizedFilters
          searchQuery={localSearchQuery}
          onSearchChange={handleSearchChange}
          onAddListing={handleAddListing}
        />

        {/* Table Section */}
        <MemoizedTable
          projects={projects}
          loading={loading}
          error={error}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onDeleteProject={handleDeleteProject}
          onViewProject={handleViewProject}
        />
      </div>

      {/* Create Auto Reply Modal */}
      {isCreateModalOpen && (
        <CreateAutoReplyModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleCreateSuccess}
        />
      )}
    </div>
  );
};