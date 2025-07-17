import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getTeamMembers, addTeamMember, deleteTeamMember, getEditMember, updateTeamMember, GetTeamMembersRequest, AddTeamMemberRequest, DeleteTeamMemberRequest, GetEditMemberRequest, UpdateTeamMemberRequest, TeamMember, TeamPaginationInfo, TeamSummary } from '../../api/teamApi';

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

export const deleteTeamMemberThunk = createAsyncThunk(
  'team/deleteTeamMember',
  async (params: DeleteTeamMemberRequest) => {
    return await deleteTeamMember(params);
  }
);

export const fetchEditMember = createAsyncThunk(
  'team/fetchEditMember',
  async (params: GetEditMemberRequest) => {
    return await getEditMember(params);
  }
);

export const updateEditMember = createAsyncThunk(
  'team/updateEditMember',
  async (params: UpdateTeamMemberRequest) => {
    return await updateTeamMember(params);
  }
);

interface TeamState {
  members: TeamMember[];
  pagination: TeamPaginationInfo | null;
  summary: TeamSummary | null;
  currentEditMember: TeamMember | null;
  isLoading: boolean;
  isAdding: boolean;
  isDeleting: boolean;
  isLoadingEdit: boolean;
  isUpdating: boolean;
  error: string | null;
  addError: string | null;
  deleteError: string | null;
  editError: string | null;
  updateError: string | null;
  searchTerm: string;
  roleFilter: string;
  currentPage: number;
  itemsPerPage: number;
}

const initialState: TeamState = {
  members: [],
  pagination: null,
  summary: null,
  currentEditMember: null,
  isLoading: false,
  isAdding: false,
  isDeleting: false,
  isLoadingEdit: false,
  isUpdating: false,
  error: null,
  addError: null,
  deleteError: null,
  editError: null,
  updateError: null,
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
    clearDeleteError: (state) => {
      state.deleteError = null;
    },
    clearEditError: (state) => {
      state.editError = null;
    },
    clearUpdateError: (state) => {
      state.updateError = null;
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
      })
      .addCase(deleteTeamMemberThunk.pending, (state) => {
        state.isDeleting = true;
        state.deleteError = null;
      })
      .addCase(deleteTeamMemberThunk.fulfilled, (state) => {
        state.isDeleting = false;
        state.deleteError = null;
      })
      .addCase(deleteTeamMemberThunk.rejected, (state, action) => {
        state.isDeleting = false;
        state.deleteError = action.error.message || 'Failed to delete team member';
      })
      .addCase(fetchEditMember.pending, (state) => {
        state.isLoadingEdit = true;
        state.editError = null;
      })
      .addCase(fetchEditMember.fulfilled, (state, action) => {
        state.isLoadingEdit = false;
        state.currentEditMember = action.payload.data as TeamMember;
      })
      .addCase(fetchEditMember.rejected, (state, action) => {
        state.isLoadingEdit = false;
        state.editError = action.error.message || 'Failed to fetch member details';
      })
      .addCase(updateEditMember.pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
      })
      .addCase(updateEditMember.fulfilled, (state) => {
        state.isUpdating = false;
        state.updateError = null;
      })
      .addCase(updateEditMember.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError = action.error.message || 'Failed to update team member';
      });
  },
});

export const { 
  setSearchTerm, 
  setRoleFilter, 
  setCurrentPage, 
  setItemsPerPage, 
  clearError,
  clearAddError,
  clearDeleteError,
  clearEditError,
  clearUpdateError
} = teamSlice.actions;

export default teamSlice.reducer;