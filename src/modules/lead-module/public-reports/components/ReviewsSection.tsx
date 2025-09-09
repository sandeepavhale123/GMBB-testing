import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, MessageSquare } from "lucide-react";

interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  platform?: string;
}

interface ReviewsSectionProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ 
  reviews, 
  averageRating, 
  totalReviews 
}) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Reviews ({totalReviews} total)
        </CardTitle>
        <div className="flex items-center gap-2">
          <div className="flex">{renderStars(Math.round(averageRating))}</div>
          <span className="font-semibold">{averageRating.toFixed(1)}</span>
          <span className="text-muted-foreground">average rating</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="p-4 border rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-medium">{review.author}</div>
                  <div className="flex items-center gap-2">
                    <div className="flex">{renderStars(review.rating)}</div>
                    <span className="text-sm text-muted-foreground">{review.date}</span>
                  </div>
                </div>
                {review.platform && (
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {review.platform}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-700">{review.text}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};