import axiosInstance from "./axiosInstance";

export const registerUser = async (userData)=>{
    const res = await axiosInstance.post('/auth/register', userData,{
        headers: {
            "Content-Type": undefined
        }
    })
    
    return res.data;
}
export const loginUser = async (userData)=>{
    const res = await axiosInstance.post('/auth/login', userData)
    return res.data;
}

export const logOutUser = async ()=>{
    const res = await axiosInstance.post('/auth/logout')
    return res.data;
}

