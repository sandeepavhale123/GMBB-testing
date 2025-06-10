
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { MoreVertical, Search, Star, ChevronRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useToast } from '../../hooks/use-toast';

export const ReviewComponent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [aiResponse, setAiResponse] = useState('Thank you for the excellent review.');
  const { toast } = useToast();
  
  const sentimentData = [
    { name: 'Positive', value: 86, fill: '#10b981' },
    { name: 'Neutral', value: 10, fill: '#6b7280' },
    { name: 'Negative', value: 4, fill: '#ef4444' }
  ];

  const reviewData = [
    { name: 'Dave', rating: 4, date: 'Jun 12', response: 'Responded', avatar: 'D' },
    { name: 'John', rating: 3, date: 'May 30', response: 'Reply', avatar: 'J' },
    { name: 'John', rating: 0, date: 'May 16', response: 'Reply', avatar: 'J', isNegative: true },
    { name: 'Mike', rating: 3, date: 'Responded', response: 'Generate response', avatar: 'M' }
  ];

  const handleReply = (reviewerName: string) => {
    toast({
      title: "Reply Opened",
      description: `Reply interface opened for ${reviewerName}'s review.`,
    });
  };

  const handleGenerateResponse = (reviewerName: string) => {
    toast({
      title: "Generating Response",
      description: `AI is generating a response for ${reviewerName}'s review.`,
    });
  };

  const handleApprove = () => {
    toast({
      title: "Response Approved",
      description: "The AI response has been approved and sent.",
    });
  };

  const handleModify = () => {
    toast({
      title: "Modify Response",
      description: "Opening response editor for modifications.",
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
      />
    ));
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
                  <input type="checkbox" className="rounded border-gray-300" />
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
                  <span className="text-sm text-gray-600">Negav</span>
                </div>
                <div className="font-semibold">4 %</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-medium">Filter</span>
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Sentiment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="positive">Positive</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
                <SelectItem value="negative">Negative</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Star Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Table */}
      <Card>
        <CardContent className="pt-6">
          {/* Table Header */}
          <div className="grid grid-cols-4 gap-4 pb-4 border-b border-gray-200 font-medium text-gray-700">
            <div>Reviewer</div>
            <div>Rating</div>
            <div>Date</div>
            <div>Response</div>
          </div>

          {/* Table Rows */}
          <div className="space-y-4 mt-4">
            {reviewData.map((review, index) => (
              <div key={index} className="grid grid-cols-4 gap-4 items-center py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-gray-200 text-gray-700">
                      {review.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{review.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  {review.isNegative ? (
                    <Badge variant="destructive" className="text-xs">Negative</Badge>
                  ) : (
                    renderStars(review.rating)
                  )}
                </div>
                <div className="text-gray-600">{review.date}</div>
                <div className="flex items-center justify-between">
                  {review.response === 'Responded' ? (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Responded
                    </Badge>
                  ) : review.response === 'Generate response' ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleGenerateResponse(review.name)}
                    >
                      Generate response
                    </Button>
                  ) : (
                    <div 
                      className="flex items-center gap-2 text-gray-600 cursor-pointer hover:text-gray-900"
                      onClick={() => handleReply(review.name)}
                    >
                      <span>{review.response}</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Response Assistant */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">AI Response assistant</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="text-gray-700">{aiResponse}</p>
          </div>
          <div className="flex gap-2">
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleApprove}
            >
              Approve
            </Button>
            <Button 
              variant="outline"
              onClick={handleModify}
            >
              Modify
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
