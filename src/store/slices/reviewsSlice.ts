
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

interface DateRange {
  startDate?: string;
  endDate?: string;
}

interface ReviewsState {
  reviews: Review[];
  loading: boolean;
  filter: 'all' | 'pending' | 'replied';
  dateRange: DateRange;
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
  dateRange: {},
};

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setDateRange: (state, action) => {
      state.dateRange = action.payload;
    },
    clearDateRange: (state) => {
      state.dateRange = {};
    },
    replyToReview: (state, action) => {
      const review = state.reviews.find(r => r.id === action.payload);
      if (review) {
        review.replied = true;
      }
    },
  },
});

export const { setFilter, setDateRange, clearDateRange, replyToReview } = reviewsSlice.actions;
export default reviewsSlice.reducer;
