import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { MoreVertical, Search, Star } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useToast } from '../../hooks/use-toast';

export const ReviewComponent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const sentimentData = [{
    name: 'Positive',
    value: 86,
    fill: '#10b981'
  }, {
    name: 'Neutral',
    value: 10,
    fill: '#6b7280'
  }, {
    name: 'Negative',
    value: 4,
    fill: '#ef4444'
  }];
  const reviewsData = [{
    id: '1',
    name: 'Sarah Johnson',
    rating: 5,
    date: '1/10/2024',
    sentiment: 'Positive',
    comment: 'Absolutely love this place! The food is amazing and the service is top-notch. Will definitely be coming back.',
    aiResponse: "Thank you so much for your wonderful review, Sarah! We're thrilled you enjoyed your experience with us.",
    isGenerated: true
  }, {
    id: '2',
    name: 'Mike Chen',
    rating: 4,
    date: '1/9/2024',
    sentiment: 'Positive',
    comment: 'Good food and decent service. The atmosphere could be better but overall a nice experience.',
    aiResponse: "Hi Mike, thank you for your feedback! We appreciate your comments about the atmosphere and will work on improving it.",
    isGenerated: true
  }, {
    id: '3',
    name: 'Emily Davis',
    rating: 1,
    date: '1/5/2024',
    sentiment: 'Negative',
    comment: 'Waited too long for our order and the food was cold when it arrived. Very disappointed.',
    aiResponse: "Hi Emily, we sincerely apologize for your disappointing experience. We'd love to make this right - please contact us directly.",
    isGenerated: true
  }];

  const handleUseResponse = (reviewId: string) => {
    toast({
      title: "Response Used",
      description: "The AI suggested response has been used for this review."
    });
  };

  const handleEditResponse = (reviewId: string) => {
    toast({
      title: "Edit Response",
      description: "Opening response editor for modifications."
    });
  };

  const handleGenerateResponse = (reviewId: string) => {
    toast({
      title: "Generating Response",
      description: "AI is generating a new response for this review."
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
    ));
  };

  const getSentimentBadgeColor = (sentiment: string) => {
    switch (sentiment) {
      case 'Positive':
        return 'bg-green-100 text-green-800';
      case 'Negative':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Review</h1>
        <Button variant="ghost" size="sm">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Review Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Review Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6 mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900">4,6</div>
                <div className="flex items-center gap-1 mt-1">
                  {renderStars(4)}
                </div>
                <div className="text-sm text-gray-600 mt-1">282 reviews</div>
              </div>
            </div>
            
            {/* Rating Breakdown with Stars */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((stars, index) => (
                <div key={stars} className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">{stars}</span>
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gray-600 h-2 rounded-full" 
                      style={{ width: `${[80, 60, 40, 25, 15][index]}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sentiment Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Sentiment breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center mb-4">
              <div className="w-32 h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={sentimentData} 
                      cx="50%" 
                      cy="50%" 
                      innerRadius={30} 
                      outerRadius={60} 
                      dataKey="value" 
                      startAngle={90} 
                      endAngle={450}
                    >
                      {sentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Positive</span>
                </div>
                <div className="font-semibold">86 %</div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Neutral</span>
                </div>
                <div className="font-semibold">10 %</div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Negative</span>
                </div>
                <div className="font-semibold">4 %</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card></Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {/* Recent Reviews Title */}
        <h2 className="text-xl font-semibold text-gray-900">Recent reviews</h2>

        {/* Review Items */}
        {reviewsData.map((review) => (
          <Card key={review.id} className="border border-gray-200">
            <CardContent className="p-6">
              {/* Review Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-900">{review.name}</span>
                  <div className="flex items-center gap-1">
                    {renderStars(review.rating)}
                  </div>
                  <Badge className={getSentimentBadgeColor(review.sentiment)}>
                    {review.sentiment}
                  </Badge>
                </div>
                <span className="text-sm text-gray-500">{review.date}</span>
              </div>

              {/* Review Comment */}
              <p className="text-gray-700 mb-4">{review.comment}</p>

              {/* AI Response Section */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-900">AI Suggested Response</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleGenerateResponse(review.id)} 
                    className="text-blue-600 border-blue-600 hover:bg-blue-100"
                  >
                    AI Generated
                  </Button>
                </div>
                <p className="text-blue-800 text-sm mb-3">{review.aiResponse}</p>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => handleUseResponse(review.id)} 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Use Response
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEditResponse(review.id)}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
