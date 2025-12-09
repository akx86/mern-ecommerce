import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = () => {
  const { user } = useSelector((state) => state.auth);

  // لو المستخدم موجود (مسجل دخول)، نطرده على الداشبورد
  // (لأنه مينفعش يسجل دخول وهو أصلاً جوه)
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // لو مش مسجل، اتفضل ادخل صفحة اللوجين أو التسجيل
  return <Outlet />;
};

export default PublicRoute;