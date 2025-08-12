import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types
export interface AutoReplyProject {
  id: string;
  projectName: string;
  locationCount: number;
  settingType: 'AI' | 'Custom Template';
  listings: string[];
  aiSettings?: {
    tone: string;
    responseLength: string;
    includePromotions: boolean;
  };
  customSettings?: {
    template: string;
    variables: string[];
  };
  createdAt: string;
  updatedAt: string;
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

// Mock API calls (replace with actual API endpoints)
export const fetchAutoReplyProjects = createAsyncThunk(
  'autoReply/fetchProjects',
  async (params: { page: number; limit: number; search?: string }) => {
    // Mock data - replace with actual API call
    const mockData = {
      projects: [
        {
          id: '1',
          projectName: 'Restaurant Responses',
          locationCount: 5,
          settingType: 'AI' as const,
          listings: ['listing1', 'listing2'],
          aiSettings: {
            tone: 'professional',
            responseLength: 'medium',
            includePromotions: true
          },
          createdAt: '2024-01-15',
          updatedAt: '2024-01-15'
        },
        {
          id: '2',
          projectName: 'Retail Chain Replies',
          locationCount: 12,
          settingType: 'Custom Template' as const,
          listings: ['listing3', 'listing4'],
          customSettings: {
            template: 'Thank you for your review! {{customerName}}',
            variables: ['customerName']
          },
          createdAt: '2024-01-10',
          updatedAt: '2024-01-12'
        }
      ],
      pagination: {
        currentPage: params.page,
        totalPages: 1,
        totalItems: 2,
        hasNext: false,
        hasPrev: false
      }
    };
    
    return mockData;
  }
);

export const createAutoReplyProject = createAsyncThunk(
  'autoReply/createProject',
  async (data: CreateAutoReplyRequest) => {
    // Mock API call - replace with actual endpoint
    const newProject: AutoReplyProject = {
      id: Date.now().toString(),
      projectName: data.projectName,
      locationCount: data.listings.length,
      settingType: data.replyType === 'AI' ? 'AI' : 'Custom Template',
      listings: data.listings,
      aiSettings: data.aiSettings,
      customSettings: data.customSettings,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
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