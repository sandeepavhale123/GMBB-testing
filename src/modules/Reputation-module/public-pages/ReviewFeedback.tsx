import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PublicReputationLayout } from "./PublicReputationLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ExternalLink, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const ReviewFeedback: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get rating from URL params or location state
  const searchParams = new URLSearchParams(location.search);
  const rating = Number(searchParams.get('rating')) || location.state?.rating || 0;
  
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    emailPhone: "",
    comment: ""
  });
  const [localRating, setLocalRating] = useState<number>(rating);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData, "Rating:", localRating);
    setSubmitted(true);
  };

  const handleRatingSelect = (selectedRating: number) => {
    setLocalRating(selectedRating);
    navigate(`/review-feedback?rating=${selectedRating}`, { replace: true });
  };

  // If no rating, show rating selector first
  if (localRating === 0) {
    return (
      <PublicReputationLayout>
        <Card className="mt-8">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Rate Your Experience
                </h1>
                <p className="text-muted-foreground">
                  How would you rate your overall experience with us?
                </p>
              </div>

              {/* Star Rating Selector */}
              <div className="flex justify-center gap-3 py-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-12 h-12 text-gray-300 cursor-pointer transition-all hover:scale-110 hover:text-orange-400"
                    strokeWidth={1.5}
                    onClick={() => handleRatingSelect(star)}
                  />
                ))}
              </div>

              <p className="text-sm text-muted-foreground">
                Click a star to rate your experience
              </p>
            </div>
          </CardContent>
        </Card>
      </PublicReputationLayout>
    );
  }

  // Show success message
  if (submitted) {
    return (
      <PublicReputationLayout>
        <Card className="mt-8">
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center space-y-4">
              <CheckCircle2 className="w-16 h-16 text-green-500" />
              <h2 className="text-2xl font-bold text-foreground">Thank You!</h2>
              <p className="text-muted-foreground">
                Your feedback has been submitted successfully.
              </p>
              <Button onClick={() => navigate("/")} className="mt-4">
                Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </PublicReputationLayout>
    );
  }

  // High rating (4-5 stars) - Show review site selection (Step 2)
  if (localRating > 3) {
    return (
      <PublicReputationLayout>
        <Card className="mt-8">
          <CardContent className="p-8">
            <div className="space-y-6">
              {/* Header with stars */}
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-foreground">
                  Share Your Positive Experience
                </h2>
                
                {/* Display selected rating */}
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "w-8 h-8",
                        localRating >= star
                          ? "text-orange-400 fill-orange-400"
                          : "text-gray-300"
                      )}
                      strokeWidth={1.5}
                    />
                  ))}
                </div>

                <p className="text-muted-foreground">
                  We're glad you had a great experience! Please choose where to leave your review:
                </p>
              </div>

              {/* Review Site Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="h-auto py-6 flex flex-col gap-2"
                  onClick={() => window.open('https://google.com/maps', '_blank')}
                >
                  <ExternalLink className="w-5 h-5" />
                  <span className="font-semibold">Google Reviews</span>
                </Button>

                <Button 
                  variant="outline" 
                  size="lg"
                  className="h-auto py-6 flex flex-col gap-2"
                  onClick={() => window.open('https://facebook.com', '_blank')}
                >
                  <ExternalLink className="w-5 h-5" />
                  <span className="font-semibold">Facebook</span>
                </Button>

                <Button 
                  variant="outline" 
                  size="lg"
                  className="h-auto py-6 flex flex-col gap-2"
                  onClick={() => window.open('https://yelp.com', '_blank')}
                >
                  <ExternalLink className="w-5 h-5" />
                  <span className="font-semibold">Yelp</span>
                </Button>

                <Button 
                  variant="outline" 
                  size="lg"
                  className="h-auto py-6 flex flex-col gap-2"
                  onClick={() => window.open('https://trustpilot.com', '_blank')}
                >
                  <ExternalLink className="w-5 h-5" />
                  <span className="font-semibold">Trustpilot</span>
                </Button>
              </div>

              {/* Back button */}
              <div className="flex justify-center mt-6">
                <Button 
                  variant="ghost" 
                  onClick={() => handleRatingSelect(0)}
                >
                  Change Rating
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </PublicReputationLayout>
    );
  }

  // Low rating (1-3 stars) - Show feedback form (Step 3)
  return (
    <PublicReputationLayout>
      <Card className="mt-8">
        <CardContent className="p-8">
          <div className="space-y-6">
            {/* Header with stars */}
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-foreground">
                We'd Like to Hear From You
              </h2>
              
              {/* Display selected rating */}
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "w-8 h-8",
                      localRating >= star
                        ? "text-orange-400 fill-orange-400"
                        : "text-gray-300"
                    )}
                    strokeWidth={1.5}
                  />
                ))}
              </div>

              <p className="text-muted-foreground">
                We're sorry your experience wasn't perfect. Please share your feedback so we can improve:
              </p>
            </div>

            {/* Feedback Form */}
            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  Name
                </label>
                <Input
                  id="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div>
                <label htmlFor="contact" className="block text-sm font-medium text-foreground mb-2">
                  Email or Phone
                </label>
                <Input
                  id="contact"
                  placeholder="Email or Phone"
                  value={formData.emailPhone}
                  onChange={(e) => setFormData({...formData, emailPhone: e.target.value})}
                  required
                />
              </div>

              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-foreground mb-2">
                  Your Feedback
                </label>
                <Textarea
                  id="comment"
                  placeholder="Tell us what went wrong and how we can improve..."
                  value={formData.comment}
                  onChange={(e) => setFormData({...formData, comment: e.target.value})}
                  rows={6}
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => handleRatingSelect(0)}
                  className="flex-1"
                >
                  Change Rating
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Submit Feedback
                </Button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </PublicReputationLayout>
  );
};
