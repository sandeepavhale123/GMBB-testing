
import React, { useState, useCallback } from 'react';
import { X, Upload, Wand2, Calendar, Clock, Link, Plus, ChevronDown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { PostPreview } from './PostPreview';
import { AIDescriptionModal } from './AIDescriptionModal';
import { AIImageModal } from './AIImageModal';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose
}) => {
  const [formData, setFormData] = useState({
    listings: [] as string[],
    title: '',
    postType: '',
    description: '',
    image: null as File | null,
    ctaButton: '',
    ctaUrl: '',
    publishOption: 'now',
    scheduleDate: '',
    platforms: [] as string[],
    offerStartDate: '',
    offerEndDate: ''
  });
  
  const [showCTAButton, setShowCTAButton] = useState(false);
  const [isAIDescriptionOpen, setIsAIDescriptionOpen] = useState(false);
  const [isAIImageOpen, setIsAIImageOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [listingsSearch, setListingsSearch] = useState('');

  const businessListings = ['Downtown Coffee Shop', 'Uptown Bakery', 'Westside Restaurant', 'East End Boutique', 'Central Park Gym', 'Sunset Spa & Wellness'];
  
  const postTypes = [{
    value: 'image',
    label: 'Image Post'
  }, {
    value: 'video',
    label: 'Video Post'
  }, {
    value: 'text',
    label: 'Text Only'
  }, {
    value: 'offer',
    label: 'Special Offer'
  }, {
    value: 'event',
    label: 'Event'
  }];
  
  const publishOptions = [{
    value: 'now',
    label: 'Publish Now',
    icon: Clock
  }, {
    value: 'schedule',
    label: 'Schedule Post',
    icon: Calendar
  }, {
    value: 'auto',
    label: 'Auto Reschedule',
    icon: Wand2
  }];
  
  const ctaOptions = [{
    value: 'learn-more',
    label: 'Learn More'
  }, {
    value: 'book-now',
    label: 'Book Now'
  }, {
    value: 'call-now',
    label: 'Call Now'
  }, {
    value: 'order-online',
    label: 'Order Online'
  }, {
    value: 'get-offer',
    label: 'Get Offer'
  }, {
    value: 'sign-up',
    label: 'Sign Up'
  }, {
    value: 'download',
    label: 'Download'
  }];

  const filteredListings = businessListings.filter(listing => 
    listing.toLowerCase().includes(listingsSearch.toLowerCase())
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setFormData(prev => ({
          ...prev,
          image: file
        }));
      }
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        image: e.target.files![0]
      }));
    }
  };

  const handleListingToggle = (listing: string) => {
    setFormData(prev => ({
      ...prev,
      listings: prev.listings.includes(listing) 
        ? prev.listings.filter(l => l !== listing) 
        : [...prev.listings, listing]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating post:', formData);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden p-0 flex flex-col">
          <DialogHeader className="p-6 pb-4 border-b shrink-0">
            <DialogTitle className="text-2xl font-semibold">Create Post</DialogTitle>
          </DialogHeader>

          <div className="flex flex-1 min-h-0">
            {/* Left Panel - Form */}
            <div className="flex-1 p-6 overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Row 1: Post Description Field */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Post Description</Label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setIsAIDescriptionOpen(true)} 
                      className="text-xs bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                    >
                      <Wand2 className="w-3 h-3 mr-1" />
                      Use GMB Genie to Write
                    </Button>
                  </div>
                  <Textarea 
                    value={formData.description} 
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      description: e.target.value
                    }))} 
                    placeholder="Write your post description..." 
                    rows={4} 
                    className="resize-none" 
                  />
                </div>

                {/* Row 2: Post Image Upload */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Post Image</Label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setIsAIImageOpen(true)} 
                      className="text-xs bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
                    >
                      <Wand2 className="w-3 h-3 mr-1" />
                      Use GMB Genie to Generate
                    </Button>
                  </div>

                  <div 
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
                      dragActive 
                        ? 'border-blue-400 bg-blue-50' 
                        : formData.image 
                          ? 'border-green-400 bg-green-50' 
                          : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      className="hidden" 
                      id="image-upload" 
                    />
                    {formData.image ? (
                      <div className="space-y-2">
                        <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                          <Upload className="w-6 h-6 text-green-600" />
                        </div>
                        <p className="text-sm font-medium text-green-700">{formData.image.name}</p>
                        <p className="text-xs text-gray-500">
                          {(formData.image.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            image: null
                          }))} 
                          className="text-xs"
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-8 h-8 mx-auto text-gray-400" />
                        <div>
                          <label htmlFor="image-upload" className="cursor-pointer">
                            <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
                              Click to upload
                            </span>
                            <span className="text-sm text-gray-600"> or drag and drop</span>
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Row 3: Publish Options */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Publish Options</Label>
                  <Select 
                    value={formData.publishOption} 
                    onValueChange={value => setFormData(prev => ({
                      ...prev,
                      publishOption: value
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose publish option" />
                    </SelectTrigger>
                    <SelectContent>
                      {publishOptions.map(option => {
                        const IconComponent = option.icon;
                        return (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center space-x-2">
                              <IconComponent className="w-4 h-4" />
                              <span>{option.label}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  
                  {formData.publishOption === 'schedule' && (
                    <div className="space-y-2">
                      <Label className="text-sm text-gray-600">Schedule Date & Time</Label>
                      <Input 
                        type="datetime-local" 
                        value={formData.scheduleDate} 
                        onChange={e => setFormData(prev => ({
                          ...prev,
                          scheduleDate: e.target.value
                        }))} 
                        className="w-full" 
                      />
                    </div>
                  )}
                </div>

                {/* Row 4: Advanced Post Options (Collapsible) */}
                <Collapsible open={showAdvancedOptions} onOpenChange={setShowAdvancedOptions}>
                  <CollapsibleTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full justify-between h-12 text-sm font-medium"
                      type="button"
                    >
                      <span>Advanced Post Options</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${showAdvancedOptions ? 'rotate-180' : ''}`} />
                    </Button>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="space-y-6 mt-4 p-4 border rounded-lg bg-gray-50">
                    {/* Select Listings */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Select Business Listings</Label>
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue 
                            placeholder={
                              formData.listings.length > 0 
                                ? `${formData.listings.length} selected` 
                                : "Choose listings"
                            } 
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <div className="p-2">
                            <Input 
                              placeholder="Search listings..." 
                              value={listingsSearch} 
                              onChange={e => setListingsSearch(e.target.value)} 
                              className="mb-2" 
                            />
                          </div>
                          {filteredListings.map(listing => (
                            <SelectItem 
                              key={listing} 
                              value={listing} 
                              onClick={() => handleListingToggle(listing)}
                            >
                              <div className="flex items-center space-x-2">
                                <input 
                                  type="checkbox" 
                                  checked={formData.listings.includes(listing)} 
                                  onChange={() => handleListingToggle(listing)} 
                                  className="rounded" 
                                />
                                <span>{listing}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Post Title */}
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-sm font-medium">Post Title (Optional)</Label>
                      <Input 
                        id="title" 
                        value={formData.title} 
                        onChange={e => setFormData(prev => ({
                          ...prev,
                          title: e.target.value
                        }))} 
                        placeholder="Enter an engaging post title..." 
                        className="transition-all focus:ring-2" 
                      />
                    </div>

                    {/* Post Type */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Post Type</Label>
                      <Select 
                        value={formData.postType} 
                        onValueChange={value => setFormData(prev => ({
                          ...prev,
                          postType: value
                        }))}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Choose post type" />
                        </SelectTrigger>
                        <SelectContent>
                          {postTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Special Offer Date Range */}
                    {formData.postType === 'offer' && (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Offer Start Date</Label>
                          <Input 
                            type="date" 
                            value={formData.offerStartDate} 
                            onChange={e => setFormData(prev => ({
                              ...prev,
                              offerStartDate: e.target.value
                            }))} 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Offer End Date</Label>
                          <Input 
                            type="date" 
                            value={formData.offerEndDate} 
                            onChange={e => setFormData(prev => ({
                              ...prev,
                              offerEndDate: e.target.value
                            }))} 
                          />
                        </div>
                      </div>
                    )}

                    {/* CTA Button Section */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Switch 
                          id="include-cta" 
                          checked={showCTAButton} 
                          onCheckedChange={setShowCTAButton} 
                        />
                        <Label htmlFor="include-cta" className="text-sm font-medium">Include CTA Button</Label>
                      </div>

                      {showCTAButton && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pl-4 border-l-2 border-blue-200">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Button Type</Label>
                            <Select 
                              value={formData.ctaButton} 
                              onValueChange={value => setFormData(prev => ({
                                ...prev,
                                ctaButton: value
                              }))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Choose CTA button type" />
                              </SelectTrigger>
                              <SelectContent>
                                {ctaOptions.map(option => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Button URL</Label>
                            <div className="relative">
                              <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <Input 
                                value={formData.ctaUrl} 
                                onChange={e => setFormData(prev => ({
                                  ...prev,
                                  ctaUrl: e.target.value
                                }))} 
                                placeholder="https://example.com" 
                                className="pl-10" 
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </form>
            </div>

            {/* Right Panel - Preview */}
            <div className="w-80 border-l bg-gray-50/50 p-6 overflow-y-auto">
              <div className="sticky top-0 space-y-4">
                <h3 className="font-semibold text-lg">Live Preview</h3>
                <PostPreview data={formData} />
              </div>
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="flex justify-between items-center gap-3 p-6 border-t bg-white shrink-0">
            <div className="text-sm text-gray-500">
              {formData.platforms.length} platforms • {formData.listings.length} listings
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 px-6">
                Create Post
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Modals */}
      <AIDescriptionModal 
        isOpen={isAIDescriptionOpen} 
        onClose={() => setIsAIDescriptionOpen(false)} 
        onSelect={description => {
          setFormData(prev => ({
            ...prev,
            description
          }));
          setIsAIDescriptionOpen(false);
        }} 
      />

      <AIImageModal 
        isOpen={isAIImageOpen} 
        onClose={() => setIsAIImageOpen(false)} 
        onSelect={image => {
          setFormData(prev => ({
            ...prev,
            image
          }));
          setIsAIImageOpen(false);
        }} 
      />
    </>
  );
};
