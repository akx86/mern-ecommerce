import axios from "axios";

const BASE_URL = 'http://localhost:5000/api'

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers:{'Content-Type':'application/json'}
    ,withCredentials: true,
})

apiClient.interceptors.request.use(
    (config)=>{
        const token = localStorage.getItem('token')
        if(token){
            config.headers.Authorization = `Bearer ${token}`
        }
        return config;
    },
    (error)=> Promise.reject(error)
);
apiClient.interceptors.response.use(
    (response) =>response,
    async (error)=>{
       const originalRequest = error.config;
       if(error.response?.status ===401&&!originalRequest._retry){
        originalRequest._retry = true;
        try{
            const refreshToken = localStorage.getItem('refreshToken');
            if(!refreshToken){
                throw new Error("No refresh token available");
                
            }
            const response = await axios.post(`${BASE_URL}/auth/refresh-token`,{
                refreshToken: refreshToken,
            });
            const {accessToken} = response.data
            localStorage.setItem('accessToken', accessToken);
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            return apiClient(originalRequest);

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
export default apiClient;