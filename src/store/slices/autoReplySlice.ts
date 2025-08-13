import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types
export interface AutoReplyProject {
  id: string;
  project_name: string;
  status: 'Active' | 'Draft';
  listing_count: number;
  created_at: string;
}

export interface AutoReplyState {
  projects: AutoReplyProject[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}

export interface CreateAutoReplyRequest {
  projectName: string;
  listings: string[];
  replyType: 'AI' | 'Custom';
  aiSettings?: {
    tone: string;
    responseLength: string;
    includePromotions: boolean;
  };
  customSettings?: {
    template: string;
    variables: string[];
  };
}

// API call to fetch auto reply projects
export const fetchAutoReplyProjects = createAsyncThunk(
  'autoReply/fetchProjects',
  async (params: { page: number; limit: number; search?: string }) => {
    try {
      const response = await fetch('/get-bulk-auto-reply-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
      
      const result = await response.json();
      
      if (result.code === 200) {
        // Calculate pagination based on the data
        const totalItems = result.data.length;
        const totalPages = Math.ceil(totalItems / params.limit);
        
        return {
          projects: result.data,
          pagination: {
            currentPage: params.page,
            totalPages,
            totalItems,
            hasNext: params.page < totalPages,
            hasPrev: params.page > 1
          }
        };
      } else {
        throw new Error(result.message || 'Failed to fetch projects');
      }
    } catch (error) {
      throw new Error('Failed to fetch auto reply projects');
    }
  }
);

export const createAutoReplyProject = createAsyncThunk(
  'autoReply/createProject',
  async (data: CreateAutoReplyRequest) => {
    // Mock API call - replace with actual endpoint
    const newProject: AutoReplyProject = {
      id: Date.now().toString(),
      project_name: data.projectName,
      status: 'Draft' as const,
      listing_count: data.listings.length,
      created_at: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    };
    
    return newProject;
  }
);

export const deleteAutoReplyProject = createAsyncThunk(
  'autoReply/deleteProject',
  async (projectId: string) => {
    // Mock API call - replace with actual endpoint
    return projectId;
  }
);

const initialState: AutoReplyState = {
  projects: [],
  loading: false,
  error: null,
  searchQuery: '',
  currentPage: 1,
  pageSize: 10,
  totalPages: 0,
  totalItems: 0
};

const autoReplySlice = createSlice({
  name: 'autoReply',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1; // Reset to first page on search
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch projects
      .addCase(fetchAutoReplyProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAutoReplyProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload.projects;
        state.totalPages = action.payload.pagination.totalPages;
        state.totalItems = action.payload.pagination.totalItems;
      })
      .addCase(fetchAutoReplyProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch projects';
      })
      // Create project
      .addCase(createAutoReplyProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAutoReplyProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.unshift(action.payload);
        state.totalItems += 1;
      })
      .addCase(createAutoReplyProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create project';
      })
      // Delete project
      .addCase(deleteAutoReplyProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAutoReplyProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = state.projects.filter(p => p.id !== action.payload);
        state.totalItems -= 1;
      })
      .addCase(deleteAutoReplyProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete project';
      });
  }
});

export const { setSearchQuery, setCurrentPage, clearError } = autoReplySlice.actions;
export default autoReplySlice.reducer;