import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getTeamMembers, GetTeamMembersRequest, TeamMember, TeamPaginationInfo, TeamSummary } from '../../api/teamApi';

export const fetchTeamMembers = createAsyncThunk(
  'team/fetchTeamMembers',
  async (params: GetTeamMembersRequest) => {
    return await getTeamMembers(params);
  }
);

interface TeamState {
  members: TeamMember[];
  pagination: TeamPaginationInfo | null;
  summary: TeamSummary | null;
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  roleFilter: string;
  currentPage: number;
  itemsPerPage: number;
}

const initialState: TeamState = {
  members: [],
  pagination: null,
  summary: null,
  isLoading: false,
  error: null,
  searchTerm: '',
  roleFilter: 'all',
  currentPage: 1,
  itemsPerPage: 10,
};

const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.currentPage = 1; // Reset to first page when searching
    },
    setRoleFilter: (state, action: PayloadAction<string>) => {
      state.roleFilter = action.payload;
      state.currentPage = 1; // Reset to first page when filtering
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
      state.currentPage = 1; // Reset to first page when changing items per page
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeamMembers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTeamMembers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.members = action.payload.data.members;
        state.pagination = action.payload.data.pagination;
        state.summary = action.payload.data.summary;
      })
      .addCase(fetchTeamMembers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch team members';
      });
  },
});

export const { 
  setSearchTerm, 
  setRoleFilter, 
  setCurrentPage, 
  setItemsPerPage, 
  clearError 
} = teamSlice.actions;

export default teamSlice.reducer;