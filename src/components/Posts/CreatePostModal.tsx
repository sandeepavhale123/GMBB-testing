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
                  formData={{ postType: formData.postType }}
                  onFormDataChange={(updater) => {
                    const result = updater({ postType: formData.postType });
                    setFormData(prev => ({ ...prev, postType: result.postType }));
                  }}
                />

                <TitleField 
                  formData={{ title: formData.title, postType: formData.postType }}
                  onFormDataChange={(updater) => {
                    const result = updater({ title: formData.title, postType: formData.postType });
                    setFormData(prev => ({ ...prev, title: result.title }));
                  }}
                />

                <PostDescriptionSection 
                  description={formData.description}
                  onDescriptionChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                  onOpenAIDescription={() => setIsAIDescriptionOpen(true)}
                />

                <PostImageSection 
                  image={formData.image}
                  onImageChange={handleImageChange}
                  onOpenAIImage={() => setIsAIImageOpen(true)}
                />

                <CTAButtonSection 
                  showCTAButton={!!formData.ctaButton}
                  onShowCTAButtonChange={(show) => setFormData(prev => ({ ...prev, ctaButton: show ? 'LEARN_MORE' : '' }))}
                  ctaButton={formData.ctaButton}
                  onCTAButtonChange={(value) => setFormData(prev => ({ ...prev, ctaButton: value }))}
                  ctaUrl={formData.ctaUrl}
                  onCTAUrlChange={(value) => setFormData(prev => ({ ...prev, ctaUrl: value }))}
                />
              </div>

              <div className="space-y-4">
                <PublishOptionsSection 
                  formData={{
                    publishOption: formData.publishOption,
                    scheduleDate: formData.scheduleDate,
                    postTags: formData.postTags,
                    siloPost: formData.siloPost
                  }}
                  onFormDataChange={(updater) => {
                    const result = updater({
                      publishOption: formData.publishOption,
                      scheduleDate: formData.scheduleDate,
                      postTags: formData.postTags,
                      siloPost: formData.siloPost
                    });
                    setFormData(prev => ({ 
                      ...prev, 
                      publishOption: result.publishOption,
                      scheduleDate: result.scheduleDate,
                      postTags: result.postTags,
                      siloPost: result.siloPost
                    }));
                  }}
                />

                <EventFields 
                  formData={{
                    postType: formData.postType,
                    startDate: formData.startDate,
                    endDate: formData.endDate
                  }}
                  onFormDataChange={(updater) => {
                    const result = updater({
                      postType: formData.postType,
                      startDate: formData.startDate,
                      endDate: formData.endDate
                    });
                    setFormData(prev => ({ 
                      ...prev, 
                      startDate: result.startDate,
                      endDate: result.endDate
                    }));
                  }}
                />

                <OfferFields 
                  formData={{
                    postType: formData.postType,
                    startDate: formData.startDate,
                    endDate: formData.endDate,
                    couponCode: formData.couponCode,
                    redeemOnlineUrl: formData.redeemOnlineUrl,
                    termsConditions: formData.termsConditions
                  }}
                  onFormDataChange={(updater) => {
                    const result = updater({
                      postType: formData.postType,
                      startDate: formData.startDate,
                      endDate: formData.endDate,
                      couponCode: formData.couponCode,
                      redeemOnlineUrl: formData.redeemOnlineUrl,
                      termsConditions: formData.termsConditions
                    });
                    setFormData(prev => ({ 
                      ...prev, 
                      startDate: result.startDate,
                      endDate: result.endDate,
                      couponCode: result.couponCode,
                      redeemOnlineUrl: result.redeemOnlineUrl,
                      termsConditions: result.termsConditions
                    }));
                  }}
                />

                <AdvancedOptionsSection 
                  showAdvancedOptions={false}
                  onShowAdvancedOptionsChange={() => {}}
                  formData={formData}
                  onFormDataChange={(updater) => {
                    const result = updater(formData);
                    setFormData(result);
                  }}
                  listingsSearch=""
                  onListingsSearchChange={() => {}}
                  onListingToggle={() => {}}
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
        onSelect={handleAIImageGenerated}
      />

      <AIDescriptionModal 
        isOpen={isAIDescriptionOpen}
        onClose={() => setIsAIDescriptionOpen(false)}
        onSelect={handleAIDescriptionGenerated}
      />
    </>
  );
};
