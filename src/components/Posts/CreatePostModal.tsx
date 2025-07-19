
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
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
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { createPost, fetchPosts, clearCreateError } from '../../store/slices/postsSlice';
import { useListingContext } from '../../context/ListingContext';
import { toast } from '@/hooks/use-toast';
import { transformPostForCloning, CreatePostFormData } from '../../utils/postCloneUtils';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: CreatePostFormData | null;
  isCloning?: boolean;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  initialData = null,
  isCloning = false
}) => {
  const dispatch = useAppDispatch();
  const { listingId: urlListingId } = useParams<{ listingId?: string }>();
  const { selectedListing, listings } = useListingContext();
  const { createLoading, createError } = useAppSelector(state => state.posts);
  
  // Resolve listing ID with proper validation
  const getValidListingId = (): string | null => {
    // Priority 1: Selected listing from context
    if (selectedListing?.id) {
      return selectedListing.id;
    }
    
    // Priority 2: URL parameter if it exists in user's listings
    if (urlListingId && urlListingId !== 'default') {
      const existsInListings = listings.some(listing => listing.id === urlListingId);
      if (existsInListings) {
        return urlListingId;
      }
    }
    
    return null;
  };

  const getInitialFormData = () => {
    if (initialData) {
      return initialData;
    }
    return {
      listings: [] as string[],
      title: '',
      postType: '',
      description: '',
      image: null as File | string | null,
      imageSource: null as 'local' | 'ai' | null,
      ctaButton: '',
      ctaUrl: '',
      publishOption: 'now',
      scheduleDate: '',
      platforms: [] as string[],
      startDate: '',
      endDate: '',
      couponCode: '',
      redeemOnlineUrl: '',
      termsConditions: '',
      postTags: '',
      siloPost: false
    };
  };

  const [formData, setFormData] = useState(getInitialFormData());

  // Reset form data when modal opens/closes or initialData changes
  React.useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormData());
    }
  }, [isOpen, initialData]);

  const [showCTAButton, setShowCTAButton] = useState(false);
  const [isAIDescriptionOpen, setIsAIDescriptionOpen] = useState(false);
  const [isAIImageOpen, setIsAIImageOpen] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [listingsSearch, setListingsSearch] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  const handleListingToggle = (listing: string) => {
    setFormData(prev => ({
      ...prev,
      listings: prev.listings.includes(listing) 
        ? prev.listings.filter(l => l !== listing) 
        : [...prev.listings, listing]
    }));
  };

  // Updated image change handler to track source
  const handleImageChange = (image: File | string | null, source: 'local' | 'ai' | null = null) => {
    setFormData(prev => ({
      ...prev,
      image,
      imageSource: source
    }));
  };

  // Updated AI image selection handler
  const handleAIImageSelect = (imageUrl: string) => {
    handleImageChange(imageUrl, 'ai');
    setIsAIImageOpen(false);
  };

  // Validation function
  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    // Title validation for event and offer post types
    if ((formData.postType === 'event' || formData.postType === 'offer') && !formData.title.trim()) {
      errors.title = 'Title is required for event and offer posts';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the validation errors before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    // Get valid listing ID
    const validListingId = getValidListingId();
    
    if (!validListingId) {
      toast({
        title: "Error",
        description: "No business listing selected. Please select a listing first.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Clear any previous errors
      dispatch(clearCreateError());

      const createPostData = {
        listingId: parseInt(validListingId),
        title: formData.title,
        postType: formData.postType,
        description: formData.description,
        ctaButton: showCTAButton ? formData.ctaButton : undefined,
        ctaUrl: showCTAButton ? formData.ctaUrl : undefined,
        publishOption: formData.publishOption,
        scheduleDate: formData.publishOption === 'schedule' && formData.scheduleDate ? 
          formData.scheduleDate : undefined,
        platforms: formData.platforms,
        startDate: (formData.postType === 'event' || formData.postType === 'offer') && formData.startDate ? 
          formData.startDate : undefined,
        endDate: (formData.postType === 'event' || formData.postType === 'offer') && formData.endDate ? 
          formData.endDate : undefined,
        couponCode: formData.postType === 'offer' ? formData.couponCode : undefined,
        redeemOnlineUrl: formData.postType === 'offer' ? formData.redeemOnlineUrl : undefined,
        termsConditions: formData.postType === 'offer' ? formData.termsConditions : undefined,
        postTags: formData.postTags,
        siloPost: formData.siloPost,
        // Handle image based on source
        selectedImage: formData.imageSource, // Set to "local" or "ai"
        userfile: formData.imageSource === 'local' && formData.image instanceof File ? formData.image : undefined,
        aiImageUrl: formData.imageSource === 'ai' && typeof formData.image === 'string' ? formData.image : undefined,
      };

      const response = await dispatch(createPost(createPostData)).unwrap();
      
      // Show success message
      toast({
        title: isCloning ? "Post Cloned Successfully" : "Post Created Successfully",
        description: `Post ${isCloning ? 'cloned' : 'created'} with ID: ${response.data.postId}`,
      });

      // Refresh posts list
      dispatch(fetchPosts({
        listingId: parseInt(validListingId),
        filters: { status: 'all', search: '' },
        pagination: { page: 1, limit: 12 },
      }));

      // Reset form and close modal
      setFormData({
        listings: [],
        title: '',
        postType: '',
        description: '',
        image: null,
        imageSource: null,
        ctaButton: '',
        ctaUrl: '',
        publishOption: 'now',
        scheduleDate: '',
        platforms: [],
        startDate: '',
        endDate: '',
        couponCode: '',
        redeemOnlineUrl: '',
        termsConditions: '',
        postTags: '',
        siloPost: false
      });
      setValidationErrors({});
      setShowCTAButton(false);
      setShowAdvancedOptions(false);
      onClose();
      
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: isCloning ? "Failed to Clone Post" : "Failed to Create Post",
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Check if Create Post button should be enabled
  const isCreatePostEnabled = formData.description.trim().length > 0 && !createLoading;

  // Show error toast if there's a create error
  React.useEffect(() => {
    if (createError) {
      toast({
        title: "Error",
        description: createError,
        variant: "destructive",
      });
    }
  }, [createError]);

  // Clear validation errors when form data changes
  React.useEffect(() => {
    if (Object.keys(validationErrors).length > 0) {
      validateForm();
    }
  }, [formData.title, formData.postType]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden p-0 flex flex-col">
          <DialogHeader className="p-4 sm:p-6 pb-4 border-b shrink-0">
            <DialogTitle className="text-xl sm:text-2xl font-semibold">
              {isCloning ? 'Clone Post' : 'Create Post'}
            </DialogTitle>
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
                  onImageChange={(image) => handleImageChange(image, image instanceof File ? 'local' : null)}
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
                  validationErrors={validationErrors}
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
                type="submit"
                onClick={handleSubmit} 
                disabled={!isCreatePostEnabled}
                className="bg-primary hover:bg-primary/90 px-6 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createLoading ? (isCloning ? "Cloning..." : "Creating...") : (isCloning ? "Clone Post" : "Create Post")}
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
        onSelect={handleAIImageSelect}
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
