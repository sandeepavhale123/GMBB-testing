import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BulkTemplateCard } from './BulkTemplateCard';
import { BulkManageTemplateModal } from './BulkManageTemplateModal';

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
  const [activeTab, setActiveTab] = useState('review');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showManageModal, setShowManageModal] = useState(false);
  const [templates, setTemplates] = useState<{ review: Template[], ratingOnly: Template[] }>({ review: [], ratingOnly: [] });

  // Create templates from API data and update state when autoSettings change
  React.useEffect(() => {
    if (autoSettings) {
      const reviewTemplates: Template[] = [
        { id: '1', starRating: 1, content: autoSettings.starone_reply, enabled: !!autoSettings.oneTextStatus },
        { id: '2', starRating: 2, content: autoSettings.startwo_reply, enabled: !!autoSettings.twoTextStatus },
        { id: '3', starRating: 3, content: autoSettings.starthree_reply, enabled: !!autoSettings.threeTextStatus },
        { id: '4', starRating: 4, content: autoSettings.starfour_reply, enabled: !!autoSettings.fourTextStatus },
        { id: '5', starRating: 5, content: autoSettings.starfive_reply, enabled: !!autoSettings.fiveTextStatus },
      ];

      const ratingOnlyTemplates: Template[] = [
        { id: '6', starRating: 1, content: autoSettings.starone_wreply, enabled: !!autoSettings.oneStarStatus, isRatingOnly: true },
        { id: '7', starRating: 2, content: autoSettings.startwo_wreply, enabled: !!autoSettings.twoStarStatus, isRatingOnly: true },
        { id: '8', starRating: 3, content: autoSettings.starthree_wreply, enabled: !!autoSettings.threeStarStatus, isRatingOnly: true },
        { id: '9', starRating: 4, content: autoSettings.starfour_wreply, enabled: !!autoSettings.fourStarStatus, isRatingOnly: true },
        { id: '10', starRating: 5, content: autoSettings.starfive_wreply, enabled: !!autoSettings.fiveStarStatus, isRatingOnly: true },
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

  const handleToggleTemplate = (template: Template, enabled: boolean) => {
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
    
    // Here you would typically make an API call to save the change
    console.log(`${enabled ? 'Enabled' : 'Disabled'} template for ${template.starRating} stars (${template.isRatingOnly ? 'rating-only' : 'review'})`);
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