import React, { useState, useMemo } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { BulkReplyListingSelector } from "@/components/BulkAutoReply/BulkReplyListingSelector";
import { updateCustomEmailSetting, CustomEmailSettingPayload, CustomEmailNotification } from "@/api/integrationApi";
import { useToast } from "@/hooks/use-toast";
import { useCustomEmailSettings } from "@/hooks/useCustomEmailSettings";
import { useQueryClient } from "@tanstack/react-query";

// Interface definitions
interface FormData {
  selectedListings: string[];
  reportType: string;
  frequency: string;
  recipients: string;
}

const REPORT_TYPES = [
  "GMB Posts",
  "GMB Reviews", 
  "Geo Ranking",
  "All Reports"
];

export const CustomNotificationsTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState<CustomEmailNotification | null>(null);
  const [isAddingNotification, setIsAddingNotification] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<FormData>({
    selectedListings: [],
    reportType: "",
    frequency: "",
    recipients: "",
  });

  const limit = 10;

  // Fetch custom email settings
  const { data, isLoading, error, refetch } = useCustomEmailSettings({
    page: currentPage,
    limit,
    search: searchTerm,
  });

  const notifications = data?.data?.results || [];
  const pagination = data?.data?.pagination;

  // Helper functions
  const transformSelectedListingsToLocationIds = (selectedListings: string[]): number[] => {
    return selectedListings
      .map(id => parseInt(id.replace('listing-', ''), 10))
      .filter(id => !isNaN(id));
  };

  const formatEmailsForApi = (emailString: string): string => {
    return emailString
      .split(',')
      .map(email => email.trim())
      .filter(email => email.length > 0)
      .join(',');
  };

  const handleAddNotification = async () => {
    if (!formData.selectedListings.length || !formData.recipients) {
      toast({
        title: "Validation Error",
        description: "Please select at least one listing and provide email recipients.",
        variant: "destructive",
      });
      return;
    }

    setIsAddingNotification(true);
    
    try {
      const payload: CustomEmailSettingPayload = {
        locationIds: transformSelectedListingsToLocationIds(formData.selectedListings),
        email: formatEmailsForApi(formData.recipients),
      };

      const response = await updateCustomEmailSetting(payload);
      
      if (response.code === 200) {
        toast({
          title: "Success",
          description: "Custom notification added successfully!",
        });
        
        setFormData({
          selectedListings: [],
          reportType: "",
          frequency: "",
          recipients: "",
        });
        setIsAddModalOpen(false);
        
        // Refetch data to update the table
        queryClient.invalidateQueries({ queryKey: ["customEmailSettings"] });
      } else {
        throw new Error(response.message || "Failed to add notification");
      }
    } catch (error) {
      console.error("Error adding notification:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add custom notification. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingNotification(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Failed to load custom notifications.</p>
          <Button onClick={() => refetch()} className="mt-2">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Add Button */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by location name or email..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button disabled={isAddingNotification}>
              {isAddingNotification && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Custom Recipient
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Custom Notification</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Select Listings/Groups</label>
                <BulkReplyListingSelector
                  selectedListings={formData.selectedListings}
                  onListingsChange={(selected) => 
                    setFormData(prev => ({ ...prev, selectedListings: selected }))
                  }
                  hideStatusBadges={true}
                  hideGroups={true}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Email Recipients</label>
                <Textarea
                  placeholder="Enter email addresses separated by commas"
                  value={formData.recipients}
                  onChange={(e) => 
                    setFormData(prev => ({ ...prev, recipients: e.target.value }))
                  }
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddNotification}
                  disabled={!formData.selectedListings.length || !formData.recipients || isAddingNotification}
                >
                  {isAddingNotification && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add Notification
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Location Name</TableHead>
              <TableHead>Email Recipients</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  <p className="text-muted-foreground mt-2">Loading notifications...</p>
                </TableCell>
              </TableRow>
            ) : notifications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                  No custom notifications found
                </TableCell>
              </TableRow>
            ) : (
              notifications.map((notification) => (
                <TableRow key={notification.id}>
                  <TableCell>
                    <div className="font-medium">
                      {notification.locationName}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="text-sm">
                      {notification.cc_email}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditingNotification(notification)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, pagination.total)} of {pagination.total} results
          </div>
          <Pagination>
            <PaginationContent>
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
                </PaginationItem>
              )}
              
              {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                .filter(page => 
                  page === 1 || 
                  page === pagination.pages || 
                  Math.abs(page - currentPage) <= 1
                )
                .map((page, index, array) => (
                  <React.Fragment key={page}>
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <PaginationItem>
                        <span className="px-2">...</span>
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  </React.Fragment>
                ))}
              
              {currentPage < pagination.pages && (
                <PaginationItem>
                  <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};