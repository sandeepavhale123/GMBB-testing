import React, { useState, useEffect, useRef } from 'react';
import { X, Search, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
  const [replyType, setReplyType] = useState<'ai' | 'template'>('ai');

  // AI Settings
  const [aiTone, setAiTone] = useState('professional');
  const [aiResponseLength, setAiResponseLength] = useState('medium');
  const [aiIncludePromotions, setAiIncludePromotions] = useState(false);

  // Custom Settings
  const [customTemplate, setCustomTemplate] = useState('');

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

    if (replyType === 'template' && !customTemplate.trim()) {
      toast({
        title: "Error",
        description: "Please enter a custom template",
        variant: "destructive"
      });
      return;
    }

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
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create auto-reply project",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setProjectName('');
    setSelectedListings([]);
    setReplyType('ai');
    setAiTone('professional');
    setAiResponseLength('medium');
    setAiIncludePromotions(false);
    setCustomTemplate('');
    setListingSearch('');
  };

  return (
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
            <RadioGroup 
              value={replyType} 
              onValueChange={(value: 'ai' | 'template') => setReplyType(value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ai" id="ai" />
                <Label htmlFor="ai">AI Generated Replies</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="template" id="template" />
                <Label htmlFor="template">Custom Template</Label>
              </div>
            </RadioGroup>
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
  );
};