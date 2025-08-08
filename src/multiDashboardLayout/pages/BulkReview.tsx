import React from 'react';
import { MessageCircle, Star, Search, RefreshCw, Calendar, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BulkReviewSummary } from '@/components/BulkReview/BulkReviewSummary';
export const BulkReview: React.FC = () => {
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Bulk Review Management</h1>
          <p className="text-muted-foreground">Manage reviews across all your listings</p>
        </div>
        <Button>
          <MessageCircle className="w-4 h-4 mr-2" />
          Bulk Response
        </Button>
      </div>

      <div className="space-y-6">
        {/* Summary Cards */}
        <BulkReviewSummary />

        {/* Customer Reviews */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Customer Reviews</h3>
            <Button>
              <MessageCircle className="w-4 h-4 mr-2" />
              Bulk Response
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input placeholder="Search reviews..." className="pl-10 flex-1 " />
            </div>
            
            <div className="flex items-center gap-2 ml-auto">
              <Button variant="outline" className="h-10">
                All Reviews
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
              
              <Button variant="outline" className="h-10">
                All Sentiment
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
              
              <Button variant="outline" className="h-10">
                Newest First
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
              
              <Button variant="outline" className="h-10">
                <Calendar className="w-4 h-4 mr-2" />
                Select date range
              </Button>
              
              <Button variant="outline" size="icon" className="h-10 w-10">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {[1, 2, 3].map(index => <div key={index} className="border border-border rounded-lg p-6">
                {/* Review Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">AT</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">Asmita Thakur</span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          positive
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />)}
                        </div>
                        <span className="text-sm text-muted-foreground">(5/5)</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">08 Mar 2019</span>
                </div>

                {/* Review Text */}
                <p className="text-sm text-foreground mb-4">
                  Nice place to work
                </p>

                {/* Reply Section */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Hi Asmita Thakur, Thank you so much for your glowing five-star review of Webmarts Software Solution! We are absolutely thrilled to hear that you had such a positive experience with our services. Your kind words truly make the world of us and serve as a wonderful affirmation of the hard work and dedication our team puts into ensuring the highest level of customer satisfaction. At Webmarts, we strive to provide innovative and reliable software solutions tailored to meet the unique needs of each of our clients. It is incredibly rewarding to know that our efforts have made a significant impact on your business. Your feedback not only motivates us to maintain our standards but also inspires us to continue improving and expanding our offerings.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Replied on 30 May 2025
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Edit Reply
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    Delete Reply
                  </Button>
                </div>
              </div>)}
          </div>
        </div>
      </div>
    </div>;
};