import axiosInstance from "./axiosInstance";

export const addToCart = async (productData)=>{
    const res = await axiosInstance.post('/cart', productData)
    return res.data;
}
export const getCart = async ()=>{
    const res = await axiosInstance.get('/cart')
    return res.data;
}
export const removeFromCart = async (productId)=>{
    const res = await axiosInstance.delete('/cart/remove', {data:{productId}})
    return res.data;
}
export const mergeCart = async (cartData)=>{
    const res = await axiosInstance.post('/cart/merge', cartData)
    return res.data;
}

export const clearCart = async ()=>{
    const res = await axiosInstance.delete('/cart/clear')
    return res.data;
}