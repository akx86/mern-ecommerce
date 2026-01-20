import axiosInstance from "./axiosInstance";

export const createCategory = async (categoryData) => {
    const res = await axiosInstance.post('/categories', categoryData);
    return res.data;
}
export const getAllCategories = async (params = {}) =>{
    const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v != null && v !== '')
    );
    const res = await axiosInstance.get('/categories', { params: cleanParams });
    return res.data;
}
export const deleteCategory = async (id) => {
    const res = await axiosInstance.delete(`/categories/${id}`);
    return res.data;
}
export const updateCategory = async (id, categoryData) => {
    const res = await axiosInstance.patch(`/categories/${id}`, categoryData);
    return res.data;
}
export const getCategoryById = async (id) => {
    const res = await axiosInstance.get(`/categories/${id}`);
    return res.data;
}
