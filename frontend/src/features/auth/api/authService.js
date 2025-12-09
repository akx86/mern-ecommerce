import apiClient from "@/lib/axiosInstance";

// دالة تسجيل الدخول
export const loginUser = async (userData) => {
  const response = await apiClient.post('/auth/login', userData);
  return response.data;
};

// دالة التسجيل
export const registerUser = async (userData) => {
  const response = await apiClient.post('/auth/register', userData);
  return response.data;
};

export const logoutUser = async()=>{
    return ;
}