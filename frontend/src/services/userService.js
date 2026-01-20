import axiosInstance from "./axiosInstance";

export const getAllUsers = async (params = {}) => {
    const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v != null && v !== '')
    );
    const res = await axiosInstance.get('/users', { params: cleanParams });
    return res.data;
};

export const deleteUser = async (id) => {
    const res = await axiosInstance.delete(`/users/${id}`);
    return res.data;
};

export const updateUser = async (id, userData) => {
    const res = await axiosInstance.put(`/users/${id}`, userData);
    return res.data;
};
export const updateUserProfileService = async ( userData) => {
    const res = await axiosInstance.put(`/users/profile`, userData,{
        headers: {
            'Content-Type': 'multipart/form-data', 
        },
    });
    return res.data;
}
export const getUserProfileService = async () => {
    const res = await axiosInstance.get(`/users/profile`);
    return res.data;
}

