import axiosInstance from "./axiosInstance";

export const getAllProducts = async (params = {})=>{
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

export const deleteProduct = async (id)=>{
    const res = await axiosInstance.delete(`/products/${id}`)
    return res.data;
}
export const updateProduct = async ({id,productData})=>{
    const res = await axiosInstance.patch(`/products/${id}`,productData,{
        headers: {
            'Content-Type': 'multipart/form-data', 
        },
    })
    return res.data;
}
export const createProduct = async (productData)=>{
    const res = await axiosInstance.post('/products',productData,{
        headers: {
            'Content-Type': 'multipart/form-data', 
        },
    })
    return res.data;
}