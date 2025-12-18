import axiosInstance from "./axiosInstance";

export const getAllProducts = async (params)=>{
    const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v != null && v !== '')
    );
    const res = await axiosInstance.get('/products',{params: cleanParams});
    return res.data;
}
export const getProductById = async (id)=>{
    const res = await axiosInstance.get(`/products/${id}`)
    return res.data;
}
