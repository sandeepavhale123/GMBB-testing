import { createSlice } from '@reduxjs/toolkit';

interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  business: string;
  uploadDate: string;
  title: string;
}

interface MediaState {
  media: MediaItem[];
  loading: boolean;
  selectedBusiness: string;
}

const initialState: MediaState = {
  media: [
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300',
      type: 'image',
      business: 'Downtown Coffee',
      uploadDate: '2024-06-08',
      title: 'Morning Coffee Setup'
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300',
      type: 'image',
      business: 'Main Street Bakery',
      uploadDate: '2024-06-07',
      title: 'Fresh Baked Goods'
    }
  ],
  loading: false,
  selectedBusiness: 'all',
};

const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    setSelectedBusiness: (state, action) => {
      state.selectedBusiness = action.payload;
    },
    addMedia: (state, action) => {
      state.media.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase('RESET_STORE', () => {
        return initialState;
      });
  },
});

export const { setSelectedBusiness, addMedia } = mediaSlice.actions;
export default mediaSlice.reducer;
