import React, { useState, useEffect } from 'react';
import { X, Search, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useAppDispatch } from '@/hooks/useRedux';
import { createAutoReplyProject } from '@/store/slices/autoReplySlice';
import { useToast } from '@/hooks/use-toast';
export interface CreateAutoReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}
interface ListingOption {
  id: string;
  name: string;
  address: string;
  isActive: boolean;
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

  // Mock listings data - replace with actual API call
  const mockListings: ListingOption[] = [{
    id: '1',
    name: 'Downtown Restaurant',
    address: '123 Main St, New York, NY',
    isActive: true
  }, {
    id: '2',
    name: 'Uptown Cafe',
    address: '456 Broadway, New York, NY',
    isActive: true
  }, {
    id: '3',
    name: 'Central Market',
    address: '789 Central Ave, New York, NY',
    isActive: true
  }, {
    id: '4',
    name: 'West Side Store',
    address: '321 West St, New York, NY',
    isActive: false
  }, {
    id: '5',
    name: 'East End Shop',
    address: '654 East Ave, New York, NY',
    isActive: true
  }];
  const filteredListings = mockListings.filter(listing => listing.name.toLowerCase().includes(listingSearch.toLowerCase()) || listing.address.toLowerCase().includes(listingSearch.toLowerCase()));
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
  const selectedListingNames = selectedListings.map(id => mockListings.find(l => l.id === id)?.name).filter(Boolean).join(', ');
  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Auto Reply Project</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Name */}
          <div className="space-y-2">
            <Label htmlFor="projectName">Project Name</Label>
            <Input id="projectName" value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="Enter project name" required />
          </div>

          {/* Multi-select Listing Dropdown */}
          <div className="space-y-2">
            <Label>Select Listings</Label>
            <div className="relative">
              <div className="border border-input rounded-md p-3 cursor-pointer min-h-[40px] flex items-center justify-between bg-background" onClick={() => setIsListingDropdownOpen(!isListingDropdownOpen)}>
                <span className={selectedListings.length === 0 ? 'text-muted-foreground' : 'text-foreground'}>
                  {selectedListings.length === 0 ? 'Select listings...' : `${selectedListings.length} listing(s) selected`}
                </span>
                <ChevronDown className="w-4 h-4" />
              </div>
              
              {isListingDropdownOpen && <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {/* Search box */}
                  <div className="p-3 border-b border-border">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input placeholder="Search listings..." value={listingSearch} onChange={e => setListingSearch(e.target.value)} className="pl-10" />
                    </div>
                  </div>
                  
                  {/* Listing options */}
                  <div className="p-2">
                    {filteredListings.length === 0 ? <div className="px-3 py-2 text-sm text-muted-foreground">
                        No listings found
                      </div> : filteredListings.map(listing => <div key={listing.id} className="flex items-start space-x-3 p-2 hover:bg-accent rounded-sm cursor-pointer" onClick={() => handleListingToggle(listing.id)}>
                          <Checkbox checked={selectedListings.includes(listing.id)} onChange={() => handleListingToggle(listing.id)} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{listing.name}</span>
                              {!listing.isActive && <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded">
                                  Inactive
                                </span>}
                            </div>
                            <p className="text-xs text-muted-foreground">{listing.address}</p>
                          </div>
                        </div>)}
                  </div>
                </div>}
            </div>
            
            {/* Selected listings display */}
            {selectedListings.length > 0 && <div className="mt-2 p-3 bg-muted/50 rounded-md">
                <p className="text-sm text-muted-foreground mb-1">Selected listings:</p>
                <p className="text-sm">{selectedListingNames}</p>
              </div>}
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