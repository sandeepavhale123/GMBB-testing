import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';

// Types
export interface AutoReplyProject {
  id: string;
  project_name: string;
  status: 'Active' | 'Draft';
  setting_type: string;
  listing_count: number;
  created_at: string;
}

export interface AutoReplyState {
  projects: AutoReplyProject[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  selectedFilter: string;
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
  async (params: { page: number; limit: number; search?: string; filter?: string }) => {
    try {
      const response = await axiosInstance.post('/get-bulk-auto-reply-details', params);
      const result = response.data;
      
      if (result.code === 200) {
        // Use API-provided pagination data
        const { pagination, projects } = result.data;
        
        return {
          projects: projects,
          pagination: {
            currentPage: pagination.page,
            totalPages: pagination.pages,
            totalItems: pagination.total,
            hasNext: pagination.has_next,
            hasPrev: pagination.page > 1
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
      setting_type: data.replyType === 'AI' ? 'AI Setting' : 'Custom Setting',
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
    try {
      const response = await axiosInstance.post('/delete-auto-reply-project', {
        projectId: projectId
      });
      
      if (response.data.code === 200) {
        return projectId;
      } else {
        throw new Error(response.data.message || 'Failed to delete project');
      }
    } catch (error) {
      throw new Error('Failed to delete project');
    }
  }
);

const initialState: AutoReplyState = {
  projects: [],
  loading: false,
  error: null,
  searchQuery: '',
  selectedFilter: 'all',
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
    setSelectedFilter: (state, action: PayloadAction<string>) => {
      state.selectedFilter = action.payload;
      state.currentPage = 1; // Reset to first page on filter change
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

export const { setSearchQuery, setSelectedFilter, setCurrentPage, clearError } = autoReplySlice.actions;
export default autoReplySlice.reducer;