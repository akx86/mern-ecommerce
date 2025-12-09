import { Button } from "@/components/ui/button";
import {  useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">403 - ممنوع الدخول ⛔</h1>
      <p className="text-gray-600 mb-6 text-lg">
        عفواً، ليس لديك صلاحية للوصول إلى هذه الصفحة.
      </p>
      <Button onClick={() => navigate('/')}>عودة للرئيسية</Button>
    </div>
  );
};

export default Unauthorized;