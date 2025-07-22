import React, { useState } from 'react';
import { Switch } from '../../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Textarea } from '../../ui/textarea';
import { Checkbox } from '../../ui/checkbox';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Sparkles, Star } from 'lucide-react';
interface AIAutoResponseToggleProps {
  enabled: boolean;
  onToggle: () => void;
}
export const AIAutoResponseToggle: React.FC<AIAutoResponseToggleProps> = ({
  enabled,
  onToggle
}) => {
  const [responseStyle, setResponseStyle] = useState('');
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [settings, setSettings] = useState({
    useReviewerName: true,
    adaptTone: true,
    referenceSpecificPoints: false,
    requireApproval: true
  });
  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  const handleGenerateAIResponse = async () => {
    setIsGenerating(true);
    // Simulate AI response generation
    setTimeout(() => {
      setAiResponse("Thank you so much for your wonderful review, John! We're thrilled to hear that you enjoyed our pizza and that Sarah provided you with fantastic service. Your kind words mean the world to our team. We look forward to welcoming you back soon!");
      setIsGenerating(false);
    }, 2000);
  };
  return <div className="space-y-4">
      {/* Toggle Header */}
      <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg">
            <Sparkles className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-gray-900">AI Auto Response</h3>
              <Badge variant="secondary" className="bg-purple-600 text-white">
                AI Powered
              </Badge>
            </div>
            <p className="text-sm text-gray-500">
              Let AI generate personalized, contextual responses based on review content and sentiment.
            </p>
          </div>
        </div>
        <Switch checked={enabled} onCheckedChange={onToggle} className="data-[state=checked]:bg-purple-600" />
      </div>

      {/* Configuration Panel */}
      {enabled && <div className="space-y-6 p-4 bg-white border border-gray-200 rounded-lg">
          {/* AI Response Style */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">AI Response Style</label>
            <Select value={responseStyle} onValueChange={setResponseStyle}>
              <SelectTrigger>
                <SelectValue placeholder="Choose your response style..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="empathetic">Empathetic</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              AI will adapt this style to each review's specific content and rating.
            </p>
          </div>

          {/* Additional Instructions */}
          <div className="space-y-2">

            <Card className="bg-gray-500">
              <CardContent className="p-3">
                <p className="text-xs text-white" style={{
              fontSize: 18
            }}>
                  <strong>NOTE:</strong> You can use the following variables in reply text:
                  <br />• {"{full_name}"}, {"{first_name}"}, {"{last_name}"} for reviewer information
                  <br />• {"{responsetext}"} for the reply text
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Apply For Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-900">Apply For</h4>
            
            <div className="grid grid-cols-5 gap-3">
              {[1, 2, 3, 4, 5].map(star => <div key={star} className="flex items-center space-x-2">
                  <Checkbox id={`star-${star}`} defaultChecked={true} />
                  <label htmlFor={`star-${star}`} className="text-md text-gray-700 flex items-center gap-1">
                    {star} <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  </label>
                </div>)}
            </div>
          </div>

          {/* AI Response Settings */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-900">AI Response Settings</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Checkbox id="use-reviewer-name" checked={settings.useReviewerName} onCheckedChange={checked => handleSettingChange('useReviewerName', checked === true)} />
                <label htmlFor="use-reviewer-name" className="text-md text-gray-700">
                 Reply to existing reviews (old review)
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox id="adapt-tone" checked={settings.adaptTone} onCheckedChange={checked => handleSettingChange('adaptTone', checked === true)} />
                <label htmlFor="adapt-tone" className="text-md text-gray-700">
                 Enable Auto respond to Review
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox id="reference-points" checked={settings.referenceSpecificPoints} onCheckedChange={checked => handleSettingChange('referenceSpecificPoints', checked === true)} />
                <label htmlFor="reference-points" className="text-md text-gray-700">
                  Disable Auto AI Reply
                </label>
              </div>
            </div>

            <p className="text-md text-gray-500">
              When approval is enabled, AI-generated responses will be saved as drafts for your review before sending.
            </p>
          </div>

          {/* Latest Review Section */}
          <div className="w-full">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-600">Latest Review</span>
                </div>
                
                <div className="space-y-4">
                  {/* User Profile Section */}
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-lg font-medium text-gray-600">JD</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-medium text-gray-900">John Doe</h4>
                        <span className="text-xs text-gray-500">2 hours ago</span>
                      </div>
                      
                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                        <span className="text-sm text-gray-600 ml-1">5.0</span>
                      </div>
                      
                      {/* Review Message */}
                      <p className="text-sm text-gray-700 leading-relaxed">
                        "Great food and excellent service! Sarah was our server and she was fantastic. The pizza was delicious and came out quickly. Will definitely be back!"
                      </p>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full" onClick={handleGenerateAIResponse} disabled={isGenerating}>
                    {isGenerating ? 'Generating AI Response...' : 'Generate AI Response'}
                  </Button>
                  
                  {aiResponse && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-xs text-green-600 font-medium mb-1">Generated AI Response:</p>
                      <p className="text-sm text-gray-700">{aiResponse}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Save AI Setting
            </Button>
          </div>
        </div>}
    </div>;
};