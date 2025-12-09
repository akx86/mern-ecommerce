import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux"; // استخدام Redux

const ProtectedRoute = ({ allowedRoles }) => {
  const location = useLocation();

  const { user} = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  const userRole = user.isAdmin ? 'admin' : 'user';
  
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;