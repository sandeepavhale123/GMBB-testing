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
import { useAppDispatch } from '@/hooks/useRedux';
import { createAutoReplyProject } from '@/store/slices/autoReplySlice';
import { useToast } from '@/hooks/use-toast';
import { BulkReplyListingSelector } from './BulkReplyListingSelector';
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
  const dispatch = useAppDispatch();
  const {
    toast
  } = useToast();

  // Form state
  const [projectName, setProjectName] = useState('');
  const [selectedListings, setSelectedListings] = useState<string[]>([]);
  const [replyType, setReplyType] = useState<'AI' | 'Custom'>('AI');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleListingToggle = (listingId: string) => {
    setSelectedListings(prev => prev.includes(listingId) ? prev.filter(id => id !== listingId) : [...prev, listingId]);
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
    if (replyType === 'Custom' && !customTemplate.trim()) {
      toast({
        title: "Error",
        description: "Please enter a custom template",
        variant: "destructive"
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const requestData = {
        projectName: projectName.trim(),
        listings: selectedListings,
        replyType,
        ...(replyType === 'AI' && {
          aiSettings: {
            tone: aiTone,
            responseLength: aiResponseLength,
            includePromotions: aiIncludePromotions
          }
        }),
        ...(replyType === 'Custom' && {
          customSettings: {
            template: customTemplate.trim(),
            variables: [] // Extract variables from template if needed
          }
        })
      };
      await dispatch(createAutoReplyProject(requestData)).unwrap();
      onSuccess();
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create auto reply project",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const resetForm = () => {
    setProjectName('');
    setSelectedListings([]);
    setReplyType('AI');
    setAiTone('professional');
    setAiResponseLength('medium');
    setAiIncludePromotions(false);
    setCustomTemplate('');
    setListingSearch('');
  };
  const selectedListingNames = selectedListings.map(id => `Listing ${id}`).join(', ');
  return <Dialog open={isOpen} onOpenChange={onClose}>
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
            <Input id="projectName" value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="Enter project name" required />
          </div>

          

          {/* Reply Type Selection */}
          <div className="space-y-3">
            <Label>Reply Type</Label>
            <RadioGroup value={replyType} onValueChange={(value: 'AI' | 'Custom') => setReplyType(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="AI" id="ai" />
                <Label htmlFor="ai">AI Generated Replies</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Custom" id="custom" />
                <Label htmlFor="custom">Custom Template</Label>
              </div>
            </RadioGroup>
          </div>

          {/* AI Settings */}
          {replyType === 'AI'}

          {/* Custom Template Settings */}
          {replyType === 'Custom' && <div className="p-4 border border-border rounded-lg space-y-4">
              <h4 className="font-medium">Custom Auto Reply Settings</h4>
              
              <div className="space-y-2">
                <Label htmlFor="template">Reply Template</Label>
                <Textarea id="template" value={customTemplate} onChange={e => setCustomTemplate(e.target.value)} placeholder="Enter your custom reply template..." rows={4} required={replyType === 'Custom'} />
                <p className="text-sm text-muted-foreground">
                  Use variables like {'{customerName}'}, {'{businessName}'}, etc. in your template
                </p>
              </div>
            </div>}
        </form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Submit'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
};