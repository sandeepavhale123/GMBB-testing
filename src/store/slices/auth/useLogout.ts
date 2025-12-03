import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { logout as logoutAction } from "./authSlice";
import { resetStore } from "@/store/actions/globalActions";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { profileService } from "@/services/profileService";

export const useLogout = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const queryClient = useQueryClient();

  const logout = async () => {
    try {
      // 1. Clear profile service module-level caches
      profileService.clearAllCaches();
      
      // 2. Clear ALL React Query cached data
      queryClient.clear();
      
      // 3. Reset Redux store (also clears localStorage via rootReducer)
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
