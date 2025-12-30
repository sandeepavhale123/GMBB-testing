import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { logout as logoutAction } from "./authSlice";
import { resetStore } from "@/store/actions/globalActions";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { profileService } from "@/services/profileService";
import { useSupabaseProfileSync } from "@/hooks/useSupabaseProfileSync";

export const useLogout = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const queryClient = useQueryClient();
  const { clearSupabaseProfileId } = useSupabaseProfileSync();

  const logout = async () => {
    try {
      // 1. Clear profile service module-level caches
      profileService.clearAllCaches();
      
      // 2. Clear ALL React Query cached data
      queryClient.clear();
      
      // 3. Clear Supabase profile ID from localStorage
      clearSupabaseProfileId();
      
      // 4. Reset Redux store (also clears localStorage via rootReducer)
      dispatch(resetStore());
      dispatch(resetStore());
    } catch (error) {
      console.error("Logout error:", error);
      dispatch(logoutAction());
    } finally {
      navigate("/login");
    }
  };

  return { logout };
};
