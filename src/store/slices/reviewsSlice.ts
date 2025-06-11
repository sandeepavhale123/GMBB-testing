
import { createSlice } from '@reduxjs/toolkit';

interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  business: string;
  date: string;
  replied: boolean;
  reply?: string;
  sentiment: 'positive' | 'negative' | 'neutral';
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
      date: '2024-07-07',
      replied: true,
      reply: 'Thank you so much for your wonderful review, Sarah! We\'re thrilled you enjoyed our coffee and experienced our friendly service. We look forward to welcoming you back soon!',
      sentiment: 'positive'
    },
    {
      id: '2',
      customerName: 'Mike Chen',
      rating: 4,
      comment: 'Great atmosphere and delicious pastries.',
      business: 'Main Street Bakery',
      date: '2024-06-15',
      replied: false,
      sentiment: 'positive'
    },
    {
      id: '3',
      customerName: 'Emily Davis',
      rating: 2,
      comment: 'Coffee was cold and service was slow. Not what I expected.',
      business: 'Downtown Coffee',
      date: '2024-06-12',
      replied: true,
      reply: 'We sincerely apologize for your disappointing experience, Emily. We take your feedback seriously and are working to improve our service speed and coffee quality. Please give us another chance to make it right.',
      sentiment: 'negative'
    },
    {
      id: '4',
      customerName: 'John Smith',
      rating: 3,
      comment: 'Decent food, average service. Nothing special but not bad either.',
      business: 'Main Street Bakery',
      date: '2024-06-08',
      replied: false,
      sentiment: 'neutral'
    },
    {
      id: '5',
      customerName: 'Lisa Wilson',
      rating: 5,
      comment: 'Absolutely love this place! Best pastries in town and the staff is amazing.',
      business: 'Main Street Bakery',
      date: '2024-05-28',
      replied: true,
      reply: 'Lisa, your kind words absolutely made our day! We\'re so happy you love our pastries and appreciate our team. Thank you for being such a wonderful customer!',
      sentiment: 'positive'
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
      const { id, reply } = action.payload;
      const review = state.reviews.find(r => r.id === id);
      if (review) {
        review.replied = true;
        review.reply = reply;
      }
    },
    updateReply: (state, action) => {
      const { id, reply } = action.payload;
      const review = state.reviews.find(r => r.id === id);
      if (review) {
        review.reply = reply;
      }
    },
  },
});

export const { setFilter, replyToReview, updateReply } = reviewsSlice.actions;
export default reviewsSlice.reducer;
