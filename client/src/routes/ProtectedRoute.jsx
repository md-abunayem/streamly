import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "../redux/slices/authSlice";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, isLoading } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    const hasToken = !!localStorage.getItem("accessToken");

    if (hasToken && !user) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, user]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!localStorage.getItem("accessToken") || !isAuthenticated) {
    toast.info("Please login to access this page");
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
