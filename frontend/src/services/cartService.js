import axiosInstance from "./axiosInstance";

export const addToCart = async (cartData)=>{
    const res = await axiosInstance.post('/cart', cartData)
    return res.data;
}
export const removeFromCart = async (cartData)=>{
    const res = await axiosInstance.post('/cart/remove', cartData)
    return res.data;
}
export const mergeCart = async (cartData)=>{
    const res = await axiosInstance.post('/cart/merge', cartData)
    return res.data;
}
