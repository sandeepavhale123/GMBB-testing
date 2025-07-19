import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import { useAppDispatch } from '../../hooks/useRedux';
import { fetchPosts } from '../../store/slices/postsSlice';
import { postsApi } from '../../api/postsApi';
import { useListingContext } from '../../context/ListingContext';
import { toast } from '@/hooks/use-toast';
import { PostPreviewModal } from './PostPreviewModal';
import { AIImageModal } from './AIImageModal';
import { AIDescriptionModal } from './AIDescriptionModal';
import { PostTypeSelector } from './CreatePostModal/PostTypeSelector';
import { TitleField } from './CreatePostModal/TitleField';
import { PostDescriptionSection } from './CreatePostModal/PostDescriptionSection';
import { PostImageSection } from './CreatePostModal/PostImageSection';
import { CTAButtonSection } from './CreatePostModal/CTAButtonSection';
import { PublishOptionsSection } from './CreatePostModal/PublishOptionsSection';
import { EventFields } from './CreatePostModal/EventFields';
import { OfferFields } from './CreatePostModal/OfferFields';
import { AdvancedOptionsSection } from './CreatePostModal/AdvancedOptionsSection';
import { CreatePostFormData } from '../../utils/postCloneUtils';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: CreatePostFormData | null;
  isCloning?: boolean;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  initialData,
  isCloning = false
}) => {
  const dispatch = useAppDispatch();
  const { listingId: urlListingId } = useParams<{ listingId?: string }>();
  const { selectedListing, listings } = useListingContext();
  
  const [formData, setFormData] = useState<CreatePostFormData>({
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

  const [isLoading, setIsLoading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isAIImageOpen, setIsAIImageOpen] = useState(false);
  const [isAIDescriptionOpen, setIsAIDescriptionOpen] = useState(false);

  // Get valid listing ID
  const getValidListingId = (): string | null => {
    if (selectedListing?.id) {
      return selectedListing.id;
    }
    
    if (urlListingId && urlListingId !== 'default') {
      const existsInListings = listings.some(listing => listing.id === urlListingId);
      if (existsInListings) {
        return urlListingId;
      }
    }
    
    return null;
  };

  const validListingId = getValidListingId();

  useEffect(() => {
    if (initialData && isCloning) {
      setFormData(initialData);
    } else if (!isCloning) {
      // Reset form for new post
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
    }
  }, [initialData, isCloning, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validListingId) {
      toast({
        title: 'Error',
        description: 'No valid business listing selected',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.title || !formData.description) {
      toast({
        title: 'Validation Error',
        description: 'Title and description are required',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const createPostData = {
        listingId: parseInt(validListingId),
        title: formData.title,
        postType: formData.postType,
        description: formData.description,
        userfile: formData.imageSource === 'local' && formData.image instanceof File ? formData.image : undefined,
        aiImageUrl: formData.imageSource === 'ai' && typeof formData.image === 'string' ? formData.image : undefined,
        ctaButton: formData.ctaButton,
        ctaUrl: formData.ctaUrl,
        publishOption: formData.publishOption,
        scheduleDate: formData.scheduleDate,
        platforms: formData.platforms,
        startDate: formData.startDate,
        endDate: formData.endDate,
        couponCode: formData.couponCode,
        redeemOnlineUrl: formData.redeemOnlineUrl,
        termsConditions: formData.termsConditions,
        postTags: formData.postTags,
        siloPost: formData.siloPost,
      };

      await postsApi.createPost(createPostData);

      toast({
        title: 'Success',
        description: isCloning ? 'Post cloned successfully!' : 'Post created successfully!',
      });

      // Refresh posts list
      dispatch(fetchPosts({
        listingId: parseInt(validListingId),
        filters: {
          status: 'all',
          search: '',
          dateRange: {
            startDate: '',
            endDate: '',
          },
        },
        pagination: {
          page: 1,
          limit: 12,
        },
      }));

      onClose();
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: 'Error',
        description: 'Failed to create post. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (image: File | string | null) => {
    setFormData(prev => ({
      ...prev,
      image,
      imageSource: image instanceof File ? 'local' : image ? 'ai' : null
    }));
  };

  const handleAIImageGenerated = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      image: imageUrl,
      imageSource: 'ai'
    }));
    setIsAIImageOpen(false);
  };

  const handleAIDescriptionGenerated = (description: string) => {
    setFormData(prev => ({
      ...prev,
      description
    }));
    setIsAIDescriptionOpen(false);
  };

  const previewData = {
    title: formData.title,
    description: formData.description,
    ctaButton: formData.ctaButton,
    ctaUrl: formData.ctaUrl,
    image: formData.image,
    platforms: formData.platforms,
    scheduledDate: formData.scheduleDate
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isCloning ? 'Clone Post' : 'Create New Post'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <PostTypeSelector 
                  formData={formData}
                  onFormDataChange={setFormData}
                />

                <TitleField 
                  formData={formData}
                  onFormDataChange={setFormData}
                />

                <PostDescriptionSection 
                  formData={formData}
                  onFormDataChange={setFormData}
                  onOpenAI={() => setIsAIDescriptionOpen(true)}
                />

                <PostImageSection 
                  image={formData.image}
                  onImageChange={handleImageChange}
                  onOpenAIImage={() => setIsAIImageOpen(true)}
                />

                <CTAButtonSection 
                  formData={formData}
                  onFormDataChange={setFormData}
                />
              </div>

              <div className="space-y-4">
                <PublishOptionsSection 
                  formData={formData}
                  onFormDataChange={setFormData}
                />

                <EventFields 
                  formData={formData}
                  onFormDataChange={setFormData}
                />

                <OfferFields 
                  formData={formData}
                  onFormDataChange={setFormData}
                />

                <AdvancedOptionsSection 
                  formData={formData}
                  onFormDataChange={setFormData}
                />
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t">
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsPreviewOpen(true)}
                  disabled={!formData.title && !formData.description}
                >
                  Preview
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading || !validListingId}>
                  {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {isCloning ? 'Clone Post' : 'Create Post'}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <PostPreviewModal 
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        data={previewData}
      />

      <AIImageModal 
        isOpen={isAIImageOpen}
        onClose={() => setIsAIImageOpen(false)}
        onImageGenerated={handleAIImageGenerated}
      />

      <AIDescriptionModal 
        isOpen={isAIDescriptionOpen}
        onClose={() => setIsAIDescriptionOpen(false)}
        onDescriptionGenerated={handleAIDescriptionGenerated}
        currentTitle={formData.title}
      />
    </>
  );
};
