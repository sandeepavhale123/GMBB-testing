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

export const BulkTemplateManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('review');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showManageModal, setShowManageModal] = useState(false);

  // Mock templates data
  const reviewTemplates: Template[] = [
    { id: '1', starRating: 1, content: 'We apologize for your poor experience...', enabled: true },
    { id: '2', starRating: 2, content: 'Thank you for your feedback. We will improve...', enabled: true },
    { id: '3', starRating: 3, content: 'Thank you for your review...', enabled: false },
    { id: '4', starRating: 4, content: 'Thank you for the great review!...', enabled: true },
    { id: '5', starRating: 5, content: 'Thank you so much for the amazing review!...', enabled: true },
  ];

  const ratingOnlyTemplates: Template[] = [
    { id: '6', starRating: 1, content: 'Thank you for your rating', enabled: true, isRatingOnly: true },
    { id: '7', starRating: 2, content: 'Thank you for your rating', enabled: false, isRatingOnly: true },
    { id: '8', starRating: 3, content: 'Thank you for your rating', enabled: true, isRatingOnly: true },
    { id: '9', starRating: 4, content: 'Thank you for your rating', enabled: true, isRatingOnly: true },
    { id: '10', starRating: 5, content: 'Thank you for your rating', enabled: true, isRatingOnly: true },
  ];

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
                  const template = reviewTemplates.find(t => t.starRating === starRating);
                  return (
                    <BulkTemplateCard
                      key={`review-${starRating}`}
                      starRating={starRating}
                      template={template}
                      onManage={handleManageTemplate}
                      onCreate={(rating) => handleCreateTemplate(rating, false)}
                    />
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="rating" className="space-y-4 mt-6">
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((starRating) => {
                  const template = ratingOnlyTemplates.find(t => t.starRating === starRating);
                  return (
                    <BulkTemplateCard
                      key={`rating-${starRating}`}
                      starRating={starRating}
                      template={template}
                      onManage={handleManageTemplate}
                      onCreate={(rating) => handleCreateTemplate(rating, true)}
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