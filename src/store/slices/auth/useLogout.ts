import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { logout as logoutAction } from "./authSlice";
import { resetStore } from "@/store/actions/globalActions";
import { clearUserListings } from "../businessListingsSlice";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const navigate = useNavigate()
  const dispatch: AppDispatch = useDispatch();

  const logout = async () => {
    try {
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
