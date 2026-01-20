import axios from "axios";

const BASE_URL=import.meta.env.VITE_API_URL
const axiosInstance = axios.create({
    baseURL:BASE_URL,
    timeout:10000,
    
    })

axiosInstance.interceptors.request.use(
    (config)=>{
        const token = localStorage.getItem('token')
        if(token){
            config.headers.Authorization = `Bearer ${token}`
        }
        return config;
    },
    (error)=> Promise.reject(error)
    
    );
axiosInstance.interceptors.response.use(
    (Response)=>Response,
    async (error)=>{
        const OriginalReq = error.config;
        if(error.response?.status ===401 && !OriginalReq._retry && !OriginalReq.url.includes('/login')){
            OriginalReq._retry = true;

            try{
                const refreshToken = localStorage.getItem('token')
                if(!refreshToken){
                    throw new Error("No refresh token found");                    
                }
                const response = await axios.post(`${BASE_URL}/auth/refresh-token`,
                    {refreshToken: refreshToken});
                const {accessToken} = response.data;
                localStorage.setItem('accessToken', accessToken)
                OriginalReq.headers.Authorization = `Bearer ${accessToken}`
                return axiosInstance(OriginalReq);

            }catch(refreshError){
                console.error("Session expired, logging out...");
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);               
            }
        }
        return Promise.reject(error);
    }



)


export default axiosInstance;