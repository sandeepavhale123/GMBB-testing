import React, { useState } from 'react';
import { Switch } from '../../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Textarea } from '../../ui/textarea';
import { Checkbox } from '../../ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
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
  const [selectedStarRating, setSelectedStarRating] = useState('5');
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
      {enabled && <div className="space-y-8 p-6 bg-gradient-to-br from-background to-muted/20 border border-border/50 rounded-xl shadow-sm animate-fade-in">
          {/* AI Response Style */}
          <div className="space-y-3 group">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <label className="text-sm font-semibold text-foreground">AI Response Style</label>
            </div>
            <Select value={responseStyle} onValueChange={setResponseStyle}>
              <SelectTrigger className="bg-background/80 border-border/60 hover:border-primary/50 transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                <SelectValue placeholder="Choose your response style..." />
              </SelectTrigger>
              <SelectContent className="bg-background border-border/60 shadow-lg">
                <SelectItem value="professional" className="hover:bg-muted/80">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Professional
                  </div>
                </SelectItem>
                <SelectItem value="friendly" className="hover:bg-muted/80">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Friendly
                  </div>
                </SelectItem>
                <SelectItem value="casual" className="hover:bg-muted/80">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    Casual
                  </div>
                </SelectItem>
                <SelectItem value="formal" className="hover:bg-muted/80">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    Formal
                  </div>
                </SelectItem>
                <SelectItem value="empathetic" className="hover:bg-muted/80">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Empathetic
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground bg-muted/30 p-2 rounded-md">
              💡 AI will adapt this style to each review's specific content and rating.
            </p>
          </div>

          {/* Variables Info Card */}
          <div className="space-y-3 group">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              <label className="text-sm font-semibold text-foreground">Template Variables</label>
            </div>
            <Card className="bg-gradient-to-r from-accent/10 to-primary/10 border-accent/20 hover:shadow-md transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-accent/20 rounded-lg">
                    <Sparkles className="w-4 h-4 text-accent" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Available Variables:</p>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <code className="px-2 py-1 bg-muted/50 rounded text-xs">{"{full_name}"}</code>
                        <span>Complete reviewer name</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="px-2 py-1 bg-muted/50 rounded text-xs">{"{first_name}"}</code>
                        <span>First name only</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="px-2 py-1 bg-muted/50 rounded text-xs">{"{last_name}"}</code>
                        <span>Last name only</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Apply For Section */}
          <div className="space-y-4 group">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <h4 className="text-sm font-semibold text-foreground">Apply For Star Ratings</h4>
            </div>
            
            <RadioGroup value={selectedStarRating} onValueChange={setSelectedStarRating} className="grid grid-cols-5 gap-3">
              {[1, 2, 3, 4, 5].map(star => 
                <Card 
                  key={star} 
                  className={`p-3 hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105 border-border/60 ${selectedStarRating === star.toString() ? 'border-primary bg-primary/5' : ''}`}
                  onClick={() => setSelectedStarRating(star.toString())}
                >
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-foreground flex items-center gap-1 cursor-pointer">
                      {star} <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> Star
                    </label>
                    <RadioGroupItem value={star.toString()} className="data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                  </div>
                </Card>
              )}
            </RadioGroup>
          </div>

          {/* AI Response Settings */}
          <div className="space-y-4 group">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <h4 className="text-sm font-semibold text-foreground">Response Settings</h4>
            </div>
            
            <Card className="p-4 bg-muted/30 border-border/60">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-background/80 rounded-lg border border-border/40 hover:border-primary/30 transition-all duration-200">
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      id="use-reviewer-name" 
                      checked={settings.useReviewerName} 
                      onCheckedChange={checked => handleSettingChange('useReviewerName', checked === true)}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <div>
                      <label htmlFor="use-reviewer-name" className="text-sm font-medium text-foreground cursor-pointer">
                        Reply to existing reviews
                      </label>
                      <p className="text-xs text-muted-foreground">Auto-respond to previous customer reviews</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/50 rounded-lg p-3">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                💡 AI-generated responses will be saved as drafts for your review before sending when approval is enabled.
              </p>
            </div>
          </div>

          {/* Latest Review Section */}
          <div className="space-y-4 group">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <h4 className="text-sm font-semibold text-foreground">AI Response Preview</h4>
            </div>
            
            <Card className="bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200/60 dark:border-blue-800/60 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-blue-600">Latest Review Preview</span>
                </div>
                
                <div className="space-y-4">
                  {/* User Profile Section */}
                  <div className="flex items-start gap-4 p-4 bg-background/60 rounded-lg border border-border/40">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-lg font-bold text-white">JD</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h4 className="text-sm font-semibold text-foreground">John Doe</h4>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                            <span className="text-sm text-muted-foreground ml-1">5.0</span>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">2 hours ago</span>
                      </div>
                      
                      {/* Review Message */}
                      <div className="bg-muted/30 p-3 rounded-lg border-l-4 border-primary/50">
                        <p className="text-sm text-foreground leading-relaxed italic">
                          "Great food and excellent service! Sarah was our server and she was fantastic. The pizza was delicious and came out quickly. Will definitely be back!"
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleGenerateAIResponse} 
                      disabled={isGenerating}
                      className="hover:bg-primary/10 hover:border-primary/50 transition-all duration-200"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      {isGenerating ? 'Generating AI Response...' : 'Generate AI Response'}
                    </Button>
                  </div>
                  
                  {aiResponse && 
                    <div className="mt-4 p-4 bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200/60 dark:border-green-800/60 rounded-lg animate-fade-in">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <p className="text-sm font-medium text-green-700 dark:text-green-300">Generated AI Response:</p>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed bg-background/40 p-3 rounded border border-border/40">{aiResponse}</p>
                    </div>
                  }
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t border-border/30">
            <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 px-8">
              <Sparkles className="w-4 h-4 mr-2" />
              Save AI Settings
            </Button>
          </div>
        </div>}
    </div>;
};