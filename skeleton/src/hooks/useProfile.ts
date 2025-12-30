import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./useRedux";
import {
  fetchUserProfile,
  fetchTimezones,
  updateUserProfile,
  clearErrors,
} from "../store/slices/profileSlice";
import { UpdateProfileData } from "../services/profileService";
import { shouldSkipProfileAPI } from "../utils/routeUtils";

export const useProfile = () => {
  const dispatch = useAppDispatch();
  const {
    data: profileData,
    timezones,
    isLoading,
    isUpdating,
    isLoadingTimezones,
    error,
    updateError,
  } = useAppSelector((state) => state.profile);

  useEffect(() => {
    // Skip profile API calls on public report routes
    if (shouldSkipProfileAPI()) {
      return;
    }

    if (!profileData) {
      dispatch(fetchUserProfile());
    }
    if (!timezones) {
      dispatch(fetchTimezones());
    }
  }, [dispatch, profileData, timezones]);

  const updateProfile = async (data: UpdateProfileData) => {
    return dispatch(updateUserProfile(data));
  };

  const clearProfileErrors = () => {
    dispatch(clearErrors());
  };

  const getStoredPassword = () => {
    return profileData?.password || "";
  };

  return {
    profileData,
    timezones,
    isLoading,
    isUpdating,
    isLoadingTimezones,
    error,
    updateError,
    updateProfile,
    clearProfileErrors,
    getStoredPassword,
  };
};
