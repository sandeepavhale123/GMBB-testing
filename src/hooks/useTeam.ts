import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import { 
  fetchTeamMembers,
  addTeamMemberThunk,
  setSearchTerm, 
  setRoleFilter, 
  setCurrentPage, 
  setItemsPerPage, 
  clearError,
  clearAddError
} from '../store/slices/teamSlice';
import { AddTeamMemberRequest } from '../api/teamApi';

export const useTeam = () => {
  const dispatch = useAppDispatch();
  const {
    members,
    pagination,
    summary,
    isLoading,
    isAdding,
    error,
    addError,
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

  const clearTeamAddError = () => {
    dispatch(clearAddError());
  };

  const refreshTeamMembers = () => {
    dispatch(fetchTeamMembers({
      page: currentPage,
      limit: itemsPerPage,
      search: searchTerm,
      role: roleFilter === 'all' ? '' : roleFilter
    }));
  };

  const addTeamMember = async (memberData: AddTeamMemberRequest) => {
    const result = await dispatch(addTeamMemberThunk(memberData));
    if (addTeamMemberThunk.fulfilled.match(result)) {
      // Refresh the team members list after successful addition
      refreshTeamMembers();
    }
    return result;
  };

  return {
    members,
    pagination,
    summary,
    isLoading,
    isAdding,
    error,
    addError,
    searchTerm,
    roleFilter,
    currentPage,
    itemsPerPage,
    updateSearchTerm,
    updateRoleFilter,
    updateCurrentPage,
    updateItemsPerPage,
    clearTeamError,
    clearTeamAddError,
    refreshTeamMembers,
    addTeamMember
  };
};