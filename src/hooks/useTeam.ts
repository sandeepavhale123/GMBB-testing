import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import { 
  fetchTeamMembers, 
  setSearchTerm, 
  setRoleFilter, 
  setCurrentPage, 
  setItemsPerPage, 
  clearError 
} from '../store/slices/teamSlice';

export const useTeam = () => {
  const dispatch = useAppDispatch();
  const {
    members,
    pagination,
    summary,
    isLoading,
    error,
    searchTerm,
    roleFilter,
    currentPage,
    itemsPerPage
  } = useAppSelector(state => state.team);

  // Fetch team members when parameters change
  useEffect(() => {
    dispatch(fetchTeamMembers({
      page: currentPage,
      limit: itemsPerPage,
      search: searchTerm,
      role: roleFilter === 'all' ? '' : roleFilter
    }));
  }, [dispatch, currentPage, itemsPerPage, searchTerm, roleFilter]);

  const updateSearchTerm = (search: string) => {
    dispatch(setSearchTerm(search));
  };

  const updateRoleFilter = (role: string) => {
    dispatch(setRoleFilter(role));
  };

  const updateCurrentPage = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const updateItemsPerPage = (limit: number) => {
    dispatch(setItemsPerPage(limit));
  };

  const clearTeamError = () => {
    dispatch(clearError());
  };

  const refreshTeamMembers = () => {
    dispatch(fetchTeamMembers({
      page: currentPage,
      limit: itemsPerPage,
      search: searchTerm,
      role: roleFilter
    }));
  };

  return {
    members,
    pagination,
    summary,
    isLoading,
    error,
    searchTerm,
    roleFilter,
    currentPage,
    itemsPerPage,
    updateSearchTerm,
    updateRoleFilter,
    updateCurrentPage,
    updateItemsPerPage,
    clearTeamError,
    refreshTeamMembers
  };
};