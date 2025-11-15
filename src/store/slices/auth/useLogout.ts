import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { logout as logoutAction } from "./authSlice";
import { resetStore } from "@/store/actions/globalActions";
import { clearUserListings } from "../businessListingsSlice";

export const useLogout = () => {
  const dispatch: AppDispatch = useDispatch();

  const logout = async () => {
    try {
      // Clear business listings first
      dispatch(clearUserListings());

      // Clear auth state and storage
      dispatch(logoutAction());

      // Reset entire store to initial state
      dispatch(resetStore());

      // Navigate to login page
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);

      // Fallback cleanup in case of errors
      dispatch(logoutAction());
      dispatch(resetStore());
      window.location.href = "/login";
    }
  };

  return { logout };
};
