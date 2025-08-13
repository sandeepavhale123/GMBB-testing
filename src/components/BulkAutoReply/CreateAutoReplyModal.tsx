import React, { useState, useEffect, useRef } from 'react';
import { X, Search, ChevronDown, Bot, FileText, Ban, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { BulkReplyListingSelector } from './BulkReplyListingSelector';
import { useCreateBulkTemplateProjectMutation } from '@/api/bulkAutoReplyApi';
import { useNavigate } from 'react-router-dom';

export interface CreateAutoReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateAutoReplyModal: React.FC<CreateAutoReplyModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [createBulkTemplateProject, { isLoading }] = useCreateBulkTemplateProjectMutation();

  // Form state
  const [projectName, setProjectName] = useState('');
  const [selectedListings, setSelectedListings] = useState<string[]>([]);
  const [replyType, setReplyType] = useState<'ai' | 'template' | 'dnr'>('ai');

  // AI Settings
  const [aiTone, setAiTone] = useState('professional');
  const [aiResponseLength, setAiResponseLength] = useState('medium');
  const [aiIncludePromotions, setAiIncludePromotions] = useState(false);

  // Conflict detection state
  const [showConflictDialog, setShowConflictDialog] = useState(false);
  const [conflictingListings, setConflictingListings] = useState<{name: string, setting_type: string}[]>([]);
  const [listingOptions, setListingOptions] = useState<any[]>([]);

  // Listing selection state
  const [listingSearch, setListingSearch] = useState('');
  const [isListingDropdownOpen, setIsListingDropdownOpen] = useState(false);
  const collapsibleRef = useRef<HTMLDivElement>(null);

  // Handle outside click to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (collapsibleRef.current && !collapsibleRef.current.contains(event.target as Node)) {
        setIsListingDropdownOpen(false);
      }
    };

    if (isListingDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isListingDropdownOpen]);

  const checkForConflicts = () => {
    const conflicts: {name: string, setting_type: string}[] = [];
    
    selectedListings.forEach(listingId => {
      const listing = listingOptions.find(opt => opt.id === listingId);
      if (listing && listing.setting_type && listing.setting_type !== '') {
        conflicts.push({
          name: listing.name,
          setting_type: listing.setting_type
        });
      }
    });
    
    return conflicts;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a project name",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedListings.length === 0) {
      toast({
        title: "Error", 
        description: "Please select at least one listing",
        variant: "destructive"
      });
      return;
    }

    // Check for conflicts
    const conflicts = checkForConflicts();
    if (conflicts.length > 0) {
      setConflictingListings(conflicts);
      setShowConflictDialog(true);
      return;
    }

    await createProject();
  };

  const createProject = async () => {

    try {
      const response = await createBulkTemplateProject({
        listingIds: selectedListings,
        project_name: projectName,
        type: replyType
      }).unwrap();

      toast({
        title: "Success",
        description: "Auto-reply project created successfully",
        variant: "default"
      });

      // Redirect to project details page
      navigate(`/main-dashboard/bulk-auto-reply-project-details/${response.data.projectId}`);
      
      onSuccess();
      resetForm();
    } catch (error: any) {
      console.error('Error creating project:', error);
      
      // Extract the error message from the API response
      const errorMessage = error?.data?.message || error?.message || "Failed to create auto-reply project";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const handleConflictContinue = async () => {
    setShowConflictDialog(false);
    await createProject();
  };

  const resetForm = () => {
    setProjectName('');
    setSelectedListings([]);
    setReplyType('ai');
    setAiTone('professional');
    setAiResponseLength('medium');
    setAiIncludePromotions(false);
    setListingSearch('');
    setConflictingListings([]);
    setShowConflictDialog(false);
  };

  return (
    <>
      {/* Conflict Warning Dialog */}
      <AlertDialog open={showConflictDialog} onOpenChange={setShowConflictDialog}>
        <AlertDialogContent className="border-destructive bg-destructive/5">
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <AlertDialogTitle className="text-destructive">Auto-Reply Settings Conflict</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-foreground">
              <p className="mb-3">
                The following locations already have auto-reply settings configured:
              </p>
              <div className="bg-background rounded-md border border-destructive/20 p-3 max-h-32 overflow-y-auto">
                {conflictingListings.map((listing, index) => (
                  <div key={index} className="flex justify-between items-center py-1">
                    <span className="font-medium">{listing.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {listing.setting_type.toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-sm">
                <strong>Creating this project will override the existing auto-reply settings.</strong> Do you want to continue?
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowConflictDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConflictContinue}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Override & Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Main Dialog */}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Auto Reply Project</DialogTitle>
            <DialogDescription>
              Set up automated replies for your listings by configuring templates and settings.
            </DialogDescription>
          </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Multi-select Listing Component */}
          <BulkReplyListingSelector
            selectedListings={selectedListings}
            onListingsChange={setSelectedListings}
            onOptionsChange={setListingOptions}
            error={selectedListings.length === 0 ? "Please select at least one listing" : undefined}
          />
          
          {/* Project Name */}
          <div className="space-y-2">
            <Label htmlFor="projectName">Project Name</Label>
            <Input 
              id="projectName" 
              value={projectName} 
              onChange={e => setProjectName(e.target.value)} 
              placeholder="Enter project name" 
              required 
            />
          </div>

          {/* Reply Type Selection */}
          <div className="space-y-3">
            <Label>Reply Type</Label>
            <div className="grid grid-cols-3 gap-2">
              <div 
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-primary/50 ${
                  replyType === 'ai' ? 'border-primary bg-primary/5' : 'border-border'
                }`}
                onClick={() => setReplyType('ai')}
              >
                <div className="text-center space-y-2">
                  <Bot className="h-8 w-8 mx-auto text-primary" />
                  <h3 className="text-sm font-medium">AI Generated Replies</h3>
                  <p className="text-sm text-muted-foreground hidden md:block">Smart responses powered by AI</p>
                </div>
              </div>
              
              <div 
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-primary/50 ${
                  replyType === 'template' ? 'border-primary bg-primary/5' : 'border-border'
                }`}
                onClick={() => setReplyType('template')}
              >
                <div className="text-center space-y-2">
                  <FileText className="h-8 w-8 mx-auto text-primary" />
                  <h3 className="text-sm font-medium">Custom Template</h3>
                  <p className="text-sm text-muted-foreground hidden md:block">Use your own reply template</p>
                </div>
              </div>
              
              <div 
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-primary/50 ${
                  replyType === 'dnr' ? 'border-primary bg-primary/5' : 'border-border'
                }`}
                onClick={() => setReplyType('dnr')}
              >
                <div className="text-center space-y-2">
                  <Ban className="h-8 w-8 mx-auto text-primary" />
                  <h3 className="text-sm font-medium">DNR (Do Not Respond)</h3>
                  <p className="text-sm text-muted-foreground hidden md:block">Skip auto-replies for these listings</p>
                </div>
              </div>
            </div>
          </div>

        </form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button 
            type="submit" 
            onClick={handleSubmit} 
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Project'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
};