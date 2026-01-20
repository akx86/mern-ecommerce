import axiosInstance from "./axiosInstance"


export const getAllOrders = async (params = {}) =>{
   const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v != null && v !== '')
    );
    const res = await axiosInstance.get('/orders', { params: cleanParams });
    return res.data;
}
export const getOrderById = async (id) => {
    const res = await axiosInstance.get(`/orders/${id}`);
    return res.data;
}
export const updateOrderToPaid = async (id) => {
    const res = await axiosInstance.put(`/orders/${id}/pay`,{});
    return res.data;
}
export const updateOrderToDelivered = async (id) => {
    const res = await axiosInstance.put(`/orders/${id}/deliver`);
    return res.data;
}
export const updateBulkDelivered = async (ids) => {
    const res = await axiosInstance.put(`/orders/bulk-deliver`, { ids });
    return res.data;
}

export const createOrder =async (orderData)=>{
    const res =  await axiosInstance.post('/orders',orderData)
    return res.data;
}
export const getMyOrders = async () =>{
    const res = await axiosInstance.get('/orders/myorders')
    return res.data;
}
export const getOrderDetails = async (id) => {
    const res = await axiosInstance.get(`/orders/${id}`);
    return res.data;
}
export const cancelOrder = async (id) => {
    const res = await axiosInstance.delete(`/orders/${id}`);
    return res.data;
};
export const getDashboardStats = async (range = '7days') => {
    const res = await axiosInstance.get('/orders/dashboard-stats',{
        params: { range }
    });
    return res.data;
};
export const createPaymentIntent = async (orderItems) => {
    const res = await axiosInstance.post(`/orders/create-payment-intent`,{
        orderItems,
    });
    return res.data;
}