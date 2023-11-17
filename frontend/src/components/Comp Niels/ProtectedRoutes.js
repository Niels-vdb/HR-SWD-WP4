import { useLocation } from "react-router";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  const location = useLocation();
  console.log(location.pathname);
  sessionStorage.setItem("pathname", location.pathname)
  const isAuth = sessionStorage.getItem('userId')
  return isAuth ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace state={{ from: location.pathname }} />
  );
};

export default ProtectedRoutes;