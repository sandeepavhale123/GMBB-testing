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
      return `Hi {first_name}, thank you for taking the time to rate us! We truly appreciate your {star_rating}-star rating. Your feedback helps us continue to improve our service.

~ {owner_name}`;
    }
    
    const templates = {
      5: `Thank you so much, {first_name}, for your amazing 5-star review! 🌟 It's truly wonderful to hear that you had a great experience with us. Your kind words mean the world to me and the team.

~ {owner_name}`,
      4: `Hi {first_name}, thank you for the 4-star review! We're thrilled you had a positive experience with us. We'd love to know how we can make it a 5-star experience next time!

~ {owner_name}`,
      3: `Hello {first_name}, thank you for taking the time to leave a 3-star review. We appreciate your feedback and would love to understand how we can improve your experience.

~ {owner_name}`,
      2: `Hi {first_name}, thank you for your 2-star review. We're sorry to hear that your experience wasn't up to our standards. We'd appreciate the opportunity to make this right.

~ {owner_name}`,
      1: `Hello {first_name}, we're very sorry to see your 1-star review. This is clearly not the experience we want for our customers. Please reach out to us directly so we can resolve this immediately.

~ {owner_name}`
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
            {isRatingOnly ? (
              <span className="text-2xl font-bold text-gray-900">Rating Only</span>
            ) : (
              <>
                <span className="text-2xl font-bold text-gray-900 mr-2">{starRating}</span>
                <div className="flex">{renderStars(starRating)}</div>
              </>
            )}
          </div>

          {/* Template Content */}
          <div className="mb-6">
            <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-4">
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>Manage {isRatingOnly ? 'Rating Only' : `${starRating}-Star`} Template</span>
              {!isRatingOnly && <div className="flex">{renderStars(starRating)}</div>}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Template Content
              </label>
              <Textarea value={editContent} onChange={e => setEditContent(e.target.value)} className="min-h-[200px] resize-none" placeholder="Enter your template response..." />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsManageOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Template
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>;
};