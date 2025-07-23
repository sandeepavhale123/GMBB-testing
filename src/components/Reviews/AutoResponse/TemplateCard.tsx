
import React, { useState } from 'react';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Textarea } from '../../ui/textarea';
import { Star } from 'lucide-react';
import { ReplyTemplate } from '../../../store/slices/reviews/templateTypes';
interface TemplateCardProps {
  starRating: number;
  template?: ReplyTemplate;
  onCreateTemplate: (starRating: number) => void;
  onEditTemplate?: (template: ReplyTemplate) => void;
  onDeleteTemplate?: (templateId: string) => void;
  isRatingOnly?: boolean;
}
export const TemplateCard: React.FC<TemplateCardProps> = ({
  starRating,
  template,
  onCreateTemplate,
  onEditTemplate,
  onDeleteTemplate,
  isRatingOnly = false
}) => {
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [editContent, setEditContent] = useState('');
  const getDefaultContent = (rating: number): string => {
    if (isRatingOnly) {
      return `Hi {first_name}, thank you for taking the time to rate us! We truly appreciate your ${rating}-star rating. Your feedback helps us continue to improve our service. | Hi {first_name}, your ${rating}-star rating means a lot! Could you tell us more about your experience? | Hey {first_name}, thank you for the stars! A few words about your experience would really help us improve.`;
    }
    
    const templates = {
      5: `Thank you so much, {first_name}, for your amazing 5-star review! 🌟 It's truly wonderful to hear that you had a great experience with us. Your kind words mean the world to me and the team. | Hi {first_name}, we're absolutely thrilled with your 5-star review! 🌟 Your feedback brightens our day and motivates us to keep delivering excellent service. Thank you for choosing us! | Dear {first_name}, wow! Thank you for the fantastic 5-star review! 🌟 We're so grateful for customers like you who take the time to share their positive experiences.`,
      4: `Hi {first_name}, thank you for the 4-star review! We're thrilled you had a positive experience with us. We'd love to know how we can make it a 5-star experience next time! | Thank you, {first_name}, for your 4-star review! We appreciate your feedback and are always looking for ways to improve. What would make your next experience even better? | Hi {first_name}, we're grateful for your 4-star review! Your feedback helps us grow and improve our services. We'd love to earn that 5th star next time!`,
      3: `Hello {first_name}, thank you for taking the time to leave a 3-star review. We appreciate your feedback and would love to understand how we can improve your experience. | Hi {first_name}, thanks for your 3-star review. We value all feedback as it helps us improve. Could you share what we could do better next time? | Thank you, {first_name}, for your honest 3-star review. We're committed to improving and would appreciate any suggestions you might have.`,
      2: `Hi {first_name}, thank you for your 2-star review. We're sorry to hear that your experience wasn't up to our standards. We'd appreciate the opportunity to make this right. | Hello {first_name}, we're disappointed to see your 2-star review. Your experience matters to us, and we'd love to discuss how we can improve. | Thank you for your feedback, {first_name}. A 2-star review tells us we have work to do. Please let us know how we can make things better.`,
      1: `Hello {first_name}, we're very sorry to see your 1-star review. This is clearly not the experience we want for our customers. Please reach out to us directly so we can resolve this immediately. | Hi {first_name}, we sincerely apologize for the poor experience reflected in your 1-star review. We want to make this right - please contact us so we can address your concerns. | Dear {first_name}, your 1-star review concerns us greatly. We take full responsibility and would like to personally resolve this issue. Please give us a chance to make it right.`
    };
    return templates[rating as keyof typeof templates] || templates[5];
  };
  const handleManageClick = () => {
    setEditContent(template?.content || getDefaultContent(starRating));
    setIsManageOpen(true);
  };
  const handleSave = () => {
    // Here you would typically save the content
    console.log('Saving content:', editContent);
    setIsManageOpen(false);
  };
  const renderStars = (rating: number) => {
    return Array.from({
      length: 5
    }, (_, index) => <Star key={index} className={`w-5 h-5 ${index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />);
  };
  const displayContent = template?.content || getDefaultContent(starRating);
  return <>
      <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <CardContent className="p-6">
          {/* Star Rating */}
          <div className="flex items-center gap-1 mb-4">
            <span className="text-2xl font-bold text-gray-900 mr-2">{starRating}</span>
            <div className="flex">{renderStars(starRating)}</div>
          </div>

          {/* Template Content */}
          <div className="mb-6">
            <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
              {displayContent}
            </p>
          </div>

          {/* Action Button */}
          <div className="flex justify-end">
            {template || starRating ? <Button variant="outline" size="sm" onClick={handleManageClick} className="bg-gray-900 text-white hover:bg-gray-800 hover:text-white border-gray-900 ">
                Manage
              </Button> : <Button variant="outline" size="sm" onClick={() => onCreateTemplate(starRating)} className="bg-gray-900 text-white hover:bg-gray-800 border-gray-900">
                Create
              </Button>}
          </div>
        </CardContent>
      </Card>

      {/* Manage Modal */}
      <Dialog open={isManageOpen} onOpenChange={setIsManageOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>Manage {isRatingOnly ? 'Rating Only' : `${starRating}-Star`} Template</span>
              <div className="flex">{renderStars(starRating)}</div>
            </DialogTitle>
          </DialogHeader>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Panel - Variables Info */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Available Variables</h3>
                <div className="space-y-2 text-sm">
                  <div className="bg-gray-50 p-2 rounded font-mono">{'{full_name}'}</div>
                  <div className="bg-gray-50 p-2 rounded font-mono">{'{first_name}'}</div>
                  <div className="bg-gray-50 p-2 rounded font-mono">{'{last_name}'}</div>
                </div>
              </div>
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Multiple Responses</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Note: If you want to use multiple responses, use a pipe symbol after each response.
                </p>
                <div className="bg-gray-50 p-2 rounded text-sm font-mono">
                  {'{response 1 | response 2}'}
                </div>
              </div>
            </div>

            {/* Right Panel - Template Content */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Template Content
                </label>
                <Textarea 
                  value={editContent} 
                  onChange={e => setEditContent(e.target.value)} 
                  className="min-h-[300px] resize-y" 
                  placeholder="Enter your template response..." 
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsManageOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Template
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>;
};
