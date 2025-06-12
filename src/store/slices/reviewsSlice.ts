
import { createSlice } from '@reduxjs/toolkit';

interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  business: string;
  date: string;
  replied: boolean;
}

interface ReviewsState {
  reviews: Review[];
  loading: boolean;
  filter: 'all' | 'pending' | 'replied';
}

const initialState: ReviewsState = {
  reviews: [
    {
      id: '1',
      customerName: 'Sarah Johnson',
      rating: 5,
      comment: 'Amazing coffee and friendly staff! Will definitely come back.',
      business: 'Downtown Coffee',
      date: '2024-06-08',
      replied: true
    },
    {
      id: '2',
      customerName: 'Mike Chen',
      rating: 4,
      comment: 'Great atmosphere and delicious pastries.',
      business: 'Main Street Bakery',
      date: '2024-06-07',
      replied: false
    }
  ],
  loading: false,
  filter: 'all',
};

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    replyToReview: (state, action) => {
      const review = state.reviews.find(r => r.id === action.payload);
      if (review) {
        review.replied = true;
      }
    },
  },
});

export const { setFilter, replyToReview } = reviewsSlice.actions;
export default reviewsSlice.reducer;
