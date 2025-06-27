
import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { PostPreview } from './PostPreview';
import { PostPreviewModal } from './PostPreviewModal';
import { AIDescriptionModal } from './AIDescriptionModal';
import { AIImageModal } from './AIImageModal';
import { PostDescriptionSection } from './CreatePostModal/PostDescriptionSection';
import { PostImageSection } from './CreatePostModal/PostImageSection';
import { CTAButtonSection } from './CreatePostModal/CTAButtonSection';
import { AdvancedOptionsSection } from './CreatePostModal/AdvancedOptionsSection';

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
    image: null as File | string | null,
    ctaButton: '',
    ctaUrl: '',
    publishOption: 'now',
    scheduleDate: '',
    platforms: [] as string[],
    // Event fields
    eventStartDate: '',
    eventEndDate: '',
    // Offer fields
    offerStartDate: '',
    offerEndDate: '',
    couponCode: '',
    redeemOnlineUrl: '',
    termsConditions: '',
    // New fields
    postTags: '',
    siloPost: false
  });
  const [showCTAButton, setShowCTAButton] = useState(false);
  const [isAIDescriptionOpen, setIsAIDescriptionOpen] = useState(false);
  const [isAIImageOpen, setIsAIImageOpen] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [listingsSearch, setListingsSearch] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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

  // Check if Create Post button should be enabled
  const isCreatePostEnabled = formData.description.trim().length > 0;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden p-0 flex flex-col">
          <DialogHeader className="p-4 sm:p-6 pb-4 border-b shrink-0">
            <DialogTitle className="text-xl sm:text-2xl font-semibold">Create Post</DialogTitle>
          </DialogHeader>

          <div className="flex flex-1 min-h-0">
            {/* Main Panel - Form (full width on mobile/tablet, 8 columns on desktop) */}
            <div className="flex-1 lg:flex-[8] p-4 sm:p-6 overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                
                {/* Post Description Field */}
                <PostDescriptionSection
                  description={formData.description}
                  onDescriptionChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                  onOpenAIDescription={() => setIsAIDescriptionOpen(true)}
                />

                {/* Post Image Upload */}
                <PostImageSection
                  image={formData.image}
                  onImageChange={(image) => setFormData(prev => ({ ...prev, image }))}
                  onOpenAIImage={() => setIsAIImageOpen(true)}
                />

                {/* CTA Button Section */}
                <CTAButtonSection
                  showCTAButton={showCTAButton}
                  onShowCTAButtonChange={setShowCTAButton}
                  ctaButton={formData.ctaButton}
                  onCTAButtonChange={(value) => setFormData(prev => ({ ...prev, ctaButton: value }))}
                  ctaUrl={formData.ctaUrl}
                  onCTAUrlChange={(value) => setFormData(prev => ({ ...prev, ctaUrl: value }))}
                />

                {/* Advanced Post Options */}
                <AdvancedOptionsSection
                  showAdvancedOptions={showAdvancedOptions}
                  onShowAdvancedOptionsChange={setShowAdvancedOptions}
                  formData={formData}
                  onFormDataChange={setFormData}
                  listingsSearch={listingsSearch}
                  onListingsSearchChange={setListingsSearch}
                  onListingToggle={handleListingToggle}
                />
              </form>
            </div>

            {/* Right Panel - Preview (hidden on mobile/tablet, visible on large screens) */}
            <div className="hidden lg:flex lg:flex-[4] border-l bg-gray-50/50 p-6">
              <ScrollArea className="w-full h-full">
                <div className="space-y-4 w-full">
                  <h3 className="font-semibold text-lg">Live Preview</h3>
                  <PostPreview data={formData} />
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 p-4 sm:p-6 border-t bg-white shrink-0">
            <div className="order-2 sm:order-1">
              {/* Preview button - only visible on mobile/tablet */}
              <Button 
                variant="outline" 
                onClick={() => setIsPreviewOpen(true)}
                className="lg:hidden w-full sm:w-auto"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 order-1 sm:order-2">
              <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={!isCreatePostEnabled}
                className="bg-blue-600 hover:bg-blue-700 px-6 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
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
          setFormData(prev => ({ ...prev, description }));
          setIsAIDescriptionOpen(false);
        }} 
      />

      <AIImageModal 
        isOpen={isAIImageOpen} 
        onClose={() => setIsAIImageOpen(false)} 
        onSelect={imageUrl => {
          setFormData(prev => ({ ...prev, image: imageUrl }));
          setIsAIImageOpen(false);
        }} 
      />

      {/* Preview Modal - only for mobile/tablet */}
      <PostPreviewModal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        data={formData} 
      />
    </>
  );
};
