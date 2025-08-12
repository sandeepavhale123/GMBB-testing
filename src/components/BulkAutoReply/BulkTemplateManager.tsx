import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BulkTemplateCard } from './BulkTemplateCard';
import { BulkManageTemplateModal } from './BulkManageTemplateModal';
import { useUpdateBulkTemplateAutoReplyMutation } from '@/api/bulkAutoReplyApi';
import { useToast } from '@/hooks/use-toast';

interface Template {
  id: string;
  starRating: number;
  content: string;
  enabled: boolean;
  isRatingOnly?: boolean;
}

interface AutoSettings {
  starone_reply: string;
  startwo_reply: string;
  starthree_reply: string;
  starfour_reply: string;
  starfive_reply: string;
  starone_wreply: string;
  startwo_wreply: string;
  starthree_wreply: string;
  starfour_wreply: string;
  starfive_wreply: string;
  oneTextStatus: number;
  twoTextStatus: number;
  threeTextStatus: number;
  fourTextStatus: number;
  fiveTextStatus: number;
  oneStarStatus: number;
  twoStarStatus: number;
  threeStarStatus: number;
  fourStarStatus: number;
  fiveStarStatus: number;
}

interface BulkTemplateManagerProps {
  autoSettings?: AutoSettings;
}

export const BulkTemplateManager: React.FC<BulkTemplateManagerProps> = ({ autoSettings }) => {
  const { projectId } = useParams<{ projectId: string }>();
  const { toast } = useToast();
  const [updateBulkTemplateAutoReply] = useUpdateBulkTemplateAutoReplyMutation();
  
  const [activeTab, setActiveTab] = useState('review');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showManageModal, setShowManageModal] = useState(false);
  const [templates, setTemplates] = useState<{ review: Template[], ratingOnly: Template[] }>({ review: [], ratingOnly: [] });

  // Create templates from API data and update state when autoSettings change
  React.useEffect(() => {
    if (autoSettings) {
      const reviewTemplates: Template[] = [
        { id: '1', starRating: 1, content: autoSettings.starone_reply, enabled: autoSettings.oneTextStatus === 1 },
        { id: '2', starRating: 2, content: autoSettings.startwo_reply, enabled: autoSettings.twoTextStatus === 1 },
        { id: '3', starRating: 3, content: autoSettings.starthree_reply, enabled: autoSettings.threeTextStatus === 1 },
        { id: '4', starRating: 4, content: autoSettings.starfour_reply, enabled: autoSettings.fourTextStatus === 1 },
        { id: '5', starRating: 5, content: autoSettings.starfive_reply, enabled: autoSettings.fiveTextStatus === 1 },
      ];

      const ratingOnlyTemplates: Template[] = [
        { id: '6', starRating: 1, content: autoSettings.starone_wreply, enabled: autoSettings.oneStarStatus === 1, isRatingOnly: true },
        { id: '7', starRating: 2, content: autoSettings.startwo_wreply, enabled: autoSettings.twoStarStatus === 1, isRatingOnly: true },
        { id: '8', starRating: 3, content: autoSettings.starthree_wreply, enabled: autoSettings.threeStarStatus === 1, isRatingOnly: true },
        { id: '9', starRating: 4, content: autoSettings.starfour_wreply, enabled: autoSettings.fourStarStatus === 1, isRatingOnly: true },
        { id: '10', starRating: 5, content: autoSettings.starfive_wreply, enabled: autoSettings.fiveStarStatus === 1, isRatingOnly: true },
      ];

      setTemplates({ review: reviewTemplates, ratingOnly: ratingOnlyTemplates });
    }
  }, [autoSettings]);

  const handleManageTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setShowManageModal(true);
  };

  const handleCreateTemplate = (starRating: number, isRatingOnly = false) => {
    const newTemplate: Template = {
      id: '',
      starRating,
      content: '',
      enabled: false,
      isRatingOnly
    };
    setSelectedTemplate(newTemplate);
    setShowManageModal(true);
  };

  const handleToggleTemplate = async (template: Template, enabled: boolean) => {
    if (!projectId) {
      toast({
        title: "Error",
        description: "Project ID not found",
        variant: "destructive",
      });
      return;
    }

    try {
      // Call API to update the template status
      await updateBulkTemplateAutoReply({
        projectId: parseInt(projectId),
        type: template.isRatingOnly ? "star" : "text",
        status: enabled ? 1 : 0,
        text: template.content,
        rating: template.starRating,
      }).unwrap();

      // Update local state only after successful API call
      const updatedTemplate = { ...template, enabled };
      
      if (template.isRatingOnly) {
        const updatedTemplates = templates.ratingOnly.map(t => 
          t.id === template.id ? updatedTemplate : t
        );
        setTemplates(prev => ({ ...prev, ratingOnly: updatedTemplates }));
      } else {
        const updatedTemplates = templates.review.map(t => 
          t.id === template.id ? updatedTemplate : t
        );
        setTemplates(prev => ({ ...prev, review: updatedTemplates }));
      }

      toast({
        title: "Success",
        description: `Template ${enabled ? 'enabled' : 'disabled'} successfully`,
      });
    } catch (error) {
      console.error('Error updating template:', error);
      toast({
        title: "Error",
        description: "Failed to update template status",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Reply Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="review">Reply for Review</TabsTrigger>
              <TabsTrigger value="rating">Reply for Rating Only</TabsTrigger>
            </TabsList>

            <TabsContent value="review" className="space-y-4 mt-6">
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((starRating) => {
                  const template = templates.review.find(t => t.starRating === starRating);
                  return (
                    <BulkTemplateCard
                      key={`review-${starRating}`}
                      starRating={starRating}
                      template={template}
                      onManage={handleManageTemplate}
                      onCreate={(rating) => handleCreateTemplate(rating, false)}
                      onToggle={handleToggleTemplate}
                    />
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="rating" className="space-y-4 mt-6">
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((starRating) => {
                  const template = templates.ratingOnly.find(t => t.starRating === starRating);
                  return (
                    <BulkTemplateCard
                      key={`rating-${starRating}`}
                      starRating={starRating}
                      template={template}
                      onManage={handleManageTemplate}
                      onCreate={(rating) => handleCreateTemplate(rating, true)}
                      onToggle={handleToggleTemplate}
                      isRatingOnly
                    />
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <BulkManageTemplateModal
        open={showManageModal}
        onOpenChange={setShowManageModal}
        template={selectedTemplate}
        onSave={(template) => {
          // Handle save logic here
          console.log('Saving template:', template);
          setShowManageModal(false);
        }}
      />
    </>
  );
};