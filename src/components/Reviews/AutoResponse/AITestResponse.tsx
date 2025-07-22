
import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Star, User } from 'lucide-react';

export const AITestResponse: React.FC = () => {
  const [generatedResponse, setGeneratedResponse] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const sampleReview = {
    text: "Great food and excellent service! Sarah was our server and she was fantastic. The pizza was delicious and came out quickly. Will definitely be back!",
    author: "John D.",
    rating: 5
  };

  const handleGenerateResponse = async () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setGeneratedResponse("Hi John! Thank you so much for the wonderful 5-star review! We're thrilled to hear that you enjoyed our delicious pizza and that Sarah provided you with fantastic service. We'll be sure to pass along your kind words to her - it will absolutely make her day! We can't wait to welcome you back soon for another great dining experience. Thanks again for choosing us!");
      setIsGenerating(false);
    }, 2000);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div>
      <h3 className="text-base font-medium text-gray-900 mb-4">Test AI Response</h3>
      
      {/* Sample Review Card */}
      <Card className="bg-gray-50 border border-gray-200 mb-4">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gray-200 rounded-full">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-gray-900">{sampleReview.author}</span>
                <div className="flex">{renderStars(sampleReview.rating)}</div>
              </div>
              <p className="text-sm text-gray-700 italic">"{sampleReview.text}"</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button 
        onClick={handleGenerateResponse}
        disabled={isGenerating}
        className="mb-4 bg-purple-600 hover:bg-purple-700"
      >
        {isGenerating ? 'Generating AI Response...' : 'Generate AI Response'}
      </Button>

      {/* Generated Response */}
      {generatedResponse && (
        <Card className="bg-purple-50 border border-purple-200">
          <CardContent className="p-4">
            <h4 className="font-medium text-purple-900 mb-2">Generated AI Response:</h4>
            <p className="text-sm text-purple-800">{generatedResponse}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
