
import { createSlice } from '@reduxjs/toolkit';

interface Post {
  id: string;
  title: string;
  content: string;
  status: 'published' | 'draft' | 'scheduled';
  business: string;
  publishDate: string;
  engagement: {
    views: number;
    clicks: number;
    shares: number;
  };
}

interface PostsState {
  posts: Post[];
  loading: boolean;
  filter: 'all' | 'published' | 'draft' | 'scheduled';
}

const initialState: PostsState = {
  posts: [
    {
      id: '1',
      title: 'Weekend Special Offer',
      content: 'Join us this weekend for 20% off all menu items!',
      status: 'published',
      business: 'Downtown Coffee',
      publishDate: '2024-06-08',
      engagement: { views: 1250, clicks: 89, shares: 12 }
    },
    {
      id: '2',
      title: 'New Menu Items',
      content: 'Try our fresh seasonal dishes available now!',
      status: 'scheduled',
      business: 'Main Street Bakery',
      publishDate: '2024-06-10',
      engagement: { views: 0, clicks: 0, shares: 0 }
    }
  ],
  loading: false,
  filter: 'all',
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    addPost: (state, action) => {
      state.posts.unshift(action.payload);
    },
    updatePost: (state, action) => {
      const index = state.posts.findIndex(post => post.id === action.payload.id);
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
    },
  },
});

export const { setFilter, addPost, updatePost } = postsSlice.actions;
export default postsSlice.reducer;
