import { useEffect, useCallback, useRef } from "react";
import { useAppDispatch, useAppSelector } from "./useRedux";
import {
  fetchTeamMembers,
  addTeamMemberThunk,
  deleteTeamMemberThunk,
  fetchEditMember,
  updateEditMember,
  setSearchTerm,
  setRoleFilter,
  setCurrentPage,
  setItemsPerPage,
  clearError,
  clearAddError,
  clearDeleteError,
  clearEditError,
  clearSaveError,
} from "../store/slices/teamSlice";
import {
  AddTeamMemberRequest,
  DeleteTeamMemberRequest,
  GetEditMemberRequest,
  UpdateTeamMemberRequest,
} from "../api/teamApi";
import { useDebounce } from "./useDebounce";

export const useTeam = () => {
  const dispatch = useAppDispatch();
  const {
    members,
    pagination,
    summary,
    isLoading,
    isAdding,
    isDeleting,
    currentEditMember,
    isLoadingEdit,
    isSavingEdit,
    error,
    addError,
    deleteError,
    editError,
    saveError,
    searchTerm,
    roleFilter,
    currentPage,
    itemsPerPage,
  } = useAppSelector((state) => state.team);
  const initializedRef = useRef(false);
  const debouncedSearch = useDebounce(searchTerm, 400);
  // Initial fetch on mount
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      dispatch(
        fetchTeamMembers({
          page: currentPage,
          limit: itemsPerPage,
          search: debouncedSearch,
          role: roleFilter === "all" ? "" : roleFilter,
        })
      );
    }
  }, []);

  // Fetch team members when parameters change (after initial mount)
  useEffect(() => {
    if (initializedRef.current) {
      dispatch(
        fetchTeamMembers({
          page: currentPage,
          limit: itemsPerPage,
          search: debouncedSearch,
          role: roleFilter === "all" ? "" : roleFilter,
        })
      );
    }
  }, [debouncedSearch, roleFilter, currentPage, itemsPerPage, dispatch]);

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

  const clearTeamDeleteError = () => {
    dispatch(clearDeleteError());
  };

  const clearTeamEditError = () => {
    dispatch(clearEditError());
  };

  const clearTeamSaveError = () => {
    dispatch(clearSaveError());
  };

  const fetchEditTeamMember = useCallback(
    async (memberId: number) => {
      const result = await dispatch(fetchEditMember({ id: memberId }));
      return result;
    },
    [dispatch]
  );

  const updateTeamMember = useCallback(
    async (memberData: UpdateTeamMemberRequest) => {
      const result = await dispatch(updateEditMember(memberData));
      // Note: We don't refresh team members list here since we're on the edit page
      return result;
    },
    [dispatch]
  );

  const refreshTeamMembers = useCallback(() => {
    dispatch(
      fetchTeamMembers({
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearch,
        role: roleFilter === "all" ? "" : roleFilter,
      })
    );
  }, [dispatch, currentPage, itemsPerPage, debouncedSearch, roleFilter]);

  const addTeamMember = async (memberData: AddTeamMemberRequest) => {
    const result = await dispatch(addTeamMemberThunk(memberData));
    if (addTeamMemberThunk.fulfilled.match(result)) {
      // Refresh the team members list after successful addition
      refreshTeamMembers();
    }
    return result;
  };

  const deleteTeamMember = async (memberData: DeleteTeamMemberRequest) => {
    const result = await dispatch(deleteTeamMemberThunk(memberData));
    if (deleteTeamMemberThunk.fulfilled.match(result)) {
      // Refresh the team members list after successful deletion
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
    isDeleting,
    currentEditMember,
    isLoadingEdit,
    isSavingEdit,
    error,
    addError,
    deleteError,
    editError,
    saveError,
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
    clearTeamDeleteError,
    clearTeamEditError,
    clearTeamSaveError,
    refreshTeamMembers,
    addTeamMember,
    deleteTeamMember,
    fetchEditTeamMember,
    updateTeamMember,
  };
};
