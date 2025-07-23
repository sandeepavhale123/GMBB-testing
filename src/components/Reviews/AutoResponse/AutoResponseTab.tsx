
import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../ui/tabs';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../../ui/carousel';
import { Separator } from '../../ui/separator';
import { Checkbox } from '../../ui/checkbox';
import { Card } from '../../ui/card';
import { Switch } from '../../ui/switch';
import { Label } from '../../ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip';
import { Plus, Info, Ban } from 'lucide-react';
import { AutoReplyToggle } from './AutoReplyToggle';
import { AIAutoResponseToggle } from './AIAutoResponseToggle';
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
  const [aiAutoResponseEnabled, setAiAutoResponseEnabled] = useState(false);
  const [replyToExistingReviews, setReplyToExistingReviews] = useState(false);
  const [noResponseMode, setNoResponseMode] = useState(false);

  const handleToggleAutoResponse = () => {
    if (!autoResponse.enabled) {
      // Enabling auto response, disable AI auto response
      setAiAutoResponseEnabled(false);
    }
    dispatch(toggleAutoResponse());
  };

  const handleToggleAIAutoResponse = () => {
    if (!aiAutoResponseEnabled) {
      // Enabling AI auto response, disable auto response if it's enabled
      if (autoResponse.enabled) {
        dispatch(toggleAutoResponse());
      }
    }
    setAiAutoResponseEnabled(!aiAutoResponseEnabled);
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

       {autoResponse.enabled && (
      <Card className="bg-white p-6">
        {/* Header with Title, Tabs, and Create Button in single row */}
        <Tabs defaultValue="review" value={activeTab} onValueChange={setActiveTab} className="w-full">
         <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
          {/* ✨ Changed to flex-col on small screens and row on lg+ */}
        
          {/* Left Section */}
          <div className="flex-1">
            {/* ✨ Removed unnecessary nested flex containers */}
            <h3 className="text-lg font-semibold text-gray-900">Reply Templates</h3>
            <p className="text-sm text-gray-600">
              Create personalized templates for different star ratings
            </p>
          </div>
        
          {/* Right Section */}
          <div className="w-full sm:w-auto">
            {/* ✨ Ensures full width on mobile, auto on sm and up */}
            <TabsList className="grid grid-cols-2 gap-2 sm:gap-4">
              {/* ✨ Removed conflicting w-full and w-auto, added gap for spacing */}
              <TabsTrigger value="review">Reply for Review</TabsTrigger>
              <TabsTrigger value="rating-only">Reply for Rating Only</TabsTrigger>
            </TabsList>
          </div>
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
        
        {/* Divider */}
        <Separator className="my-6" />
        
        {/* Reply to Existing Reviews Option */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Checkbox 
              id="reply-existing" 
              checked={replyToExistingReviews}
              onCheckedChange={(checked) => setReplyToExistingReviews(checked === true)}
            />
            <label 
              htmlFor="reply-existing" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Reply to existing reviews (old review)
            </label>
          </div>
          <Button variant="default" size="sm">
            Save Changes
          </Button>
        </div>
      </Card>
      )}
      
      {/* AI Auto Response Toggle */}
      <AIAutoResponseToggle enabled={aiAutoResponseEnabled} onToggle={handleToggleAIAutoResponse} />

      {/* No Response Mode Toggle */}
      <TooltipProvider>
        <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Ban className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-base font-medium text-gray-900">
                Do not respond to review in manual or automated way
              </Label>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Sometimes your clients don't allow marketing agencies to respond to reviews. 
                    In that case this label helps you to identify such listings.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <Switch 
            checked={noResponseMode} 
            onCheckedChange={setNoResponseMode} 
            className="data-[state=checked]:bg-red-600" 
          />
        </div>
      </TooltipProvider>

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
