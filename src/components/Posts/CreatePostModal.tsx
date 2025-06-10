
import React, { useState } from 'react';
import { X, Upload, Wand2, Calendar, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { PostPreview } from './PostPreview';
import { AIDescriptionModal } from './AIDescriptionModal';
import { AIImageModal } from './AIImageModal';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    listings: [] as string[],
    title: '',
    postType: '',
    description: '',
    image: null as File | null,
    ctaButton: '',
    publishOption: 'now',
    scheduleDate: '',
    platforms: [] as string[]
  });

  const [isAIDescriptionOpen, setIsAIDescriptionOpen] = useState(false);
  const [isAIImageOpen, setIsAIImageOpen] = useState(false);

  const businessListings = [
    'Downtown Coffee Shop',
    'Uptown Bakery', 
    'Westside Restaurant',
    'East End Boutique'
  ];

  const socialPlatforms = [
    'Google Business Profile',
    'Facebook',
    'Instagram',
    'Twitter',
    'LinkedIn'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating post:', formData);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-xl font-semibold">Create Post</DialogTitle>
          </DialogHeader>

          <div className="flex h-[calc(90vh-120px)]">
            {/* Left Panel - Form */}
            <div className="flex-1 p-6 overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Select Listings */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Select Listing</Label>
                  <div className="space-y-2">
                    {businessListings.map((listing) => (
                      <div key={listing} className="flex items-center space-x-2">
                        <Checkbox
                          id={listing}
                          checked={formData.listings.includes(listing)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData(prev => ({
                                ...prev,
                                listings: [...prev.listings, listing]
                              }));
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                listings: prev.listings.filter(l => l !== listing)
                              }));
                            }
                          }}
                        />
                        <Label htmlFor={listing} className="text-sm">{listing}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Post Title */}
                <div>
                  <Label htmlFor="title" className="text-sm font-medium mb-2 block">Post Title (Optional)</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter post title..."
                  />
                </div>

                {/* Post Type */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Select Post Type</Label>
                  <Select value={formData.postType} onValueChange={(value) => setFormData(prev => ({ ...prev, postType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose post type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="offer">Offer</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Description */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium">Description</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsAIDescriptionOpen(true)}
                    >
                      <Wand2 className="w-4 h-4 mr-2" />
                      Write with AI
                    </Button>
                  </div>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Write your post description..."
                    rows={4}
                  />
                </div>

                {/* Upload Image */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium">Upload Image</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsAIImageOpen(true)}
                    >
                      <Wand2 className="w-4 h-4 mr-2" />
                      Generate with AI
                    </Button>
                  </div>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                  </div>
                </div>

                {/* CTA Button */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">CTA Button (Optional)</Label>
                  <Select value={formData.ctaButton} onValueChange={(value) => setFormData(prev => ({ ...prev, ctaButton: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose CTA button" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="learn-more">Learn More</SelectItem>
                      <SelectItem value="book-now">Book Now</SelectItem>
                      <SelectItem value="call-now">Call Now</SelectItem>
                      <SelectItem value="order-online">Order Online</SelectItem>
                      <SelectItem value="get-offer">Get Offer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Publish Options */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Publish Options</Label>
                  <RadioGroup value={formData.publishOption} onValueChange={(value) => setFormData(prev => ({ ...prev, publishOption: value }))}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="now" id="now" />
                      <Label htmlFor="now" className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        Publish Now
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="schedule" id="schedule" />
                      <Label htmlFor="schedule" className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule Post
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="auto" id="auto" />
                      <Label htmlFor="auto">Auto Reschedule</Label>
                    </div>
                  </RadioGroup>
                  
                  {formData.publishOption === 'schedule' && (
                    <div className="mt-3">
                      <Input
                        type="datetime-local"
                        value={formData.scheduleDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, scheduleDate: e.target.value }))}
                      />
                    </div>
                  )}
                </div>

                {/* Social Platforms */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Social Platforms</Label>
                  <div className="space-y-2">
                    {socialPlatforms.map((platform) => (
                      <div key={platform} className="flex items-center space-x-2">
                        <Checkbox
                          id={platform}
                          checked={formData.platforms.includes(platform)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData(prev => ({
                                ...prev,
                                platforms: [...prev.platforms, platform]
                              }));
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                platforms: prev.platforms.filter(p => p !== platform)
                              }));
                            }
                          }}
                        />
                        <Label htmlFor={platform} className="text-sm">{platform}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            </div>

            {/* Right Panel - Preview */}
            <div className="w-80 border-l bg-gray-50 p-6">
              <h3 className="font-medium mb-4">Post Preview</h3>
              <PostPreview data={formData} />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
              Create Post
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Modals */}
      <AIDescriptionModal
        isOpen={isAIDescriptionOpen}
        onClose={() => setIsAIDescriptionOpen(false)}
        onSelect={(description) => {
          setFormData(prev => ({ ...prev, description }));
          setIsAIDescriptionOpen(false);
        }}
      />

      <AIImageModal
        isOpen={isAIImageOpen}
        onClose={() => setIsAIImageOpen(false)}
        onSelect={(image) => {
          setFormData(prev => ({ ...prev, image }));
          setIsAIImageOpen(false);
        }}
      />
    </>
  );
};
