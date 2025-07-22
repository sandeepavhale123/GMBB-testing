
import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../ui/tabs';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../../ui/carousel';
import { Plus } from 'lucide-react';
import { AutoReplyToggle } from './AutoReplyToggle';
import { TemplateCard } from './TemplateCard';
import { CreateTemplateModal } from './CreateTemplateModal';
import { useAppSelector, useAppDispatch } from '../../../hooks/useRedux';
import { toggleAutoResponse, addTemplate, updateTemplate, deleteTemplate } from '../../../store/slices/reviews';
import { ReplyTemplate } from '../../../store/slices/reviews/templateTypes';

export const AutoResponseTab: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    autoResponse,
    templateLoading
  } = useAppSelector(state => state.reviews);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ReplyTemplate | null>(null);

  const handleToggleAutoResponse = () => {
    dispatch(toggleAutoResponse());
  };

  const handleCreateTemplate = (starRating: number) => {
    setIsModalOpen(true);
  };

  const handleEditTemplate = (template: ReplyTemplate) => {
    setEditingTemplate(template);
    setIsModalOpen(true);
  };

  const handleSaveTemplate = (starRating: number, content: string) => {
    if (editingTemplate) {
      dispatch(updateTemplate({
        id: editingTemplate.id,
        content,
        enabled: true
      }));
      setEditingTemplate(null);
    } else {
      dispatch(addTemplate({
        starRating,
        content
      }));
    }
    setIsModalOpen(false);
  };

  const handleDeleteTemplate = (templateId: string) => {
    dispatch(deleteTemplate(templateId));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTemplate(null);
  };

  const getTemplateForRating = (rating: number): ReplyTemplate | undefined => {
    if (rating === 0) {
      // For rating-only template, use a special identifier
      return autoResponse.templates.find(template => template.starRating === 0);
    }
    return autoResponse.templates.find(template => template.starRating === rating);
  };

  return (
    <div className="space-y-6">
      {/* Auto Reply Toggle */}
      <AutoReplyToggle enabled={autoResponse.enabled} onToggle={handleToggleAutoResponse} />

      <div>
        {/* Header with Title, Tabs, and Create Button in single row */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Reply Templates</h3>
              <p className="text-sm text-gray-600">
                Create personalized templates for different star ratings
              </p>
            </div>
            
            {/* Tabs Section */}
            <Tabs defaultValue="review" className="w-auto">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="review">Reply for Review</TabsTrigger>
                <TabsTrigger value="rating-only">Reply for Rating Only</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Template
          </Button>
        </div>

        {/* Tabs Content Section */}
        <Tabs defaultValue="review" className="w-full">
          {/* Reply for Review Tab Content */}
          <TabsContent value="review" className="space-y-4">
            <Carousel className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {[1, 2, 3, 4, 5].map(rating => (
                  <CarouselItem key={rating} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                    <TemplateCard 
                      starRating={rating} 
                      template={getTemplateForRating(rating)} 
                      onCreateTemplate={handleCreateTemplate} 
                      onEditTemplate={handleEditTemplate} 
                      onDeleteTemplate={handleDeleteTemplate} 
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </TabsContent>

          {/* Reply for Rating Only Tab Content */}
          <TabsContent value="rating-only" className="space-y-4">
            <Carousel className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {[1, 2, 3, 4, 5].map(rating => (
                  <CarouselItem key={`rating-only-${rating}`} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                    <TemplateCard 
                      starRating={rating} 
                      template={getTemplateForRating(rating)} 
                      onCreateTemplate={handleCreateTemplate} 
                      onEditTemplate={handleEditTemplate} 
                      onDeleteTemplate={handleDeleteTemplate} 
                      isRatingOnly={true} 
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create/Edit Template Modal */}
      <CreateTemplateModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSave={handleSaveTemplate} 
        isLoading={templateLoading} 
      />
    </div>
  );
};
