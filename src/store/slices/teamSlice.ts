import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getTeamMembers, addTeamMember, GetTeamMembersRequest, AddTeamMemberRequest, TeamMember, TeamPaginationInfo, TeamSummary } from '../../api/teamApi';

export const fetchTeamMembers = createAsyncThunk(
  'team/fetchTeamMembers',
  async (params: GetTeamMembersRequest) => {
    return await getTeamMembers(params);
  }
);

export const addTeamMemberThunk = createAsyncThunk(
  'team/addTeamMember',
  async (params: AddTeamMemberRequest) => {
    return await addTeamMember(params);
  }
);

interface TeamState {
  members: TeamMember[];
  pagination: TeamPaginationInfo | null;
  summary: TeamSummary | null;
  isLoading: boolean;
  isAdding: boolean;
  error: string | null;
  addError: string | null;
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
  isAdding: false,
  error: null,
  addError: null,
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
    clearAddError: (state) => {
      state.addError = null;
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
      })
      .addCase(addTeamMemberThunk.pending, (state) => {
        state.isAdding = true;
        state.addError = null;
      })
      .addCase(addTeamMemberThunk.fulfilled, (state) => {
        state.isAdding = false;
        state.addError = null;
      })
      .addCase(addTeamMemberThunk.rejected, (state, action) => {
        state.isAdding = false;
        state.addError = action.error.message || 'Failed to add team member';
      });
  },
});

export const { 
  setSearchTerm, 
  setRoleFilter, 
  setCurrentPage, 
  setItemsPerPage, 
  clearError,
  clearAddError
} = teamSlice.actions;

export default teamSlice.reducer;