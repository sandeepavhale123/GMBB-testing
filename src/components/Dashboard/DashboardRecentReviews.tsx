
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Star, MessageSquare, AlertCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { useListingContext } from '../../context/ListingContext';
import { fetchReviews, clearReviewsError } from '../../store/slices/reviewsSlice';
import { useNavigate } from 'react-router-dom';

export const DashboardRecentReviews: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { selectedListing } = useListingContext();
  const {
    reviews,
    reviewsLoading,
    reviewsError
  } = useAppSelector(state => state.reviews);

  // Fetch recent reviews when listing changes
  useEffect(() => {
    if (selectedListing?.id) {
      const params = {
        pagination: {
          page: 1,
          limit: 10,
          offset: 0
        },
        filters: {
          search: '',
          status: 'all',
          dateRange: {
            startDate: '2018-01-01',
            endDate: '2025-12-31'
          },
          rating: {
            min: 1,
            max: 5
          },
          sentiment: 'All',
          listingId: selectedListing.id
        },
        sorting: {
          sortBy: 'date',
          sortOrder: 'desc' as const
        }
      };
      
      dispatch(fetchReviews(params));
    }
  }, [dispatch, selectedListing?.id]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star 
        key={index} 
        className={`w-3 h-3 ${index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  const getCustomerInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleViewAll = () => {
    if (selectedListing?.id) {
      navigate(`/reviews/${selectedListing.id}`);
    }
  };

  if (reviewsError) {
    return (
      <Card className="bg-white border border-red-200">
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-600 mb-2 text-sm">{reviewsError}</p>
          <Button onClick={() => dispatch(clearReviewsError())} variant="outline" size="sm">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Recent Reviews</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleViewAll}
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {reviewsLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3 animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-6">
            <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 text-sm">No reviews available</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {reviews.slice(0, 10).map((review) => (
              <div key={review.id} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-b-0">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                  {review.profile_image_url ? (
                    <img 
                      src={review.profile_image_url} 
                      alt={review.customer_name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    getCustomerInitials(review.customer_name)
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm text-gray-900 truncate">
                      {review.customer_name}
                    </span>
                    <div className="flex">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-xs text-gray-600 line-clamp-2 mb-1">
                      {review.comment}
                    </p>
                  )}
                  <span className="text-xs text-gray-500">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
