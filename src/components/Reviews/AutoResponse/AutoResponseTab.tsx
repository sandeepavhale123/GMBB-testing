
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
  const [activeTab, setActiveTab] = useState("review");

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
      // Always create new template, don't update existing ones
      dispatch(addTemplate({
        starRating,
        content,
        isRatingOnly: activeTab === "rating-only"
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

  const getTemplateForRating = (rating: number, isRatingOnly: boolean = false): ReplyTemplate | undefined => {
    return autoResponse.templates.find(template => 
      template.starRating === rating && 
      (template.isRatingOnly || false) === isRatingOnly
    );
  };

  return (
    <div className="space-y-6">
      {/* Auto Reply Toggle */}
      <AutoReplyToggle enabled={autoResponse.enabled} onToggle={handleToggleAutoResponse} />

      <div>
        {/* Header with Title, Tabs, and Create Button in single row */}
        <Tabs defaultValue="review" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-6 flex-1">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Reply Templates</h3>
                <p className="text-sm text-gray-600">
                  Create personalized templates for different star ratings
                </p>
              </div>
            </div>

             {/* Tabs Section */}
              <TabsList className="grid w-full grid-cols-2 w-auto mr-2" style={{marginRight:10}}>
                <TabsTrigger value="review">Reply for Review</TabsTrigger>
                <TabsTrigger value="rating-only">Reply for Rating Only</TabsTrigger>
              </TabsList>
            <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Template
            </Button>
          </div>

          {/* Reply for Review Tab Content */}
          <TabsContent value="review" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5].map(rating => (
                <TemplateCard 
                  key={rating}
                  starRating={rating} 
                  template={getTemplateForRating(rating, false)} 
                  onCreateTemplate={handleCreateTemplate} 
                  onEditTemplate={handleEditTemplate} 
                  onDeleteTemplate={handleDeleteTemplate} 
                />
              ))}
            </div>
          </TabsContent>

          {/* Reply for Rating Only Tab Content */}
          <TabsContent value="rating-only" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5].map(rating => (
                <TemplateCard 
                  key={`rating-only-${rating}`}
                  starRating={rating} 
                  template={getTemplateForRating(rating, true)} 
                  onCreateTemplate={handleCreateTemplate} 
                  onEditTemplate={handleEditTemplate} 
                  onDeleteTemplate={handleDeleteTemplate} 
                  isRatingOnly={true} 
                />
              ))}
            </div>
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
