import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, reset } from "@/features/auth/authSlice";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout()); // هيمسح التوكن
    dispatch(reset());  // هيصفر الحالة
    navigate("/login"); // هيرجعك للدخول
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">أهلاً {user?.name} 👋</h1>
        <Button variant="destructive" onClick={onLogout}>
          تسجيل خروج
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;