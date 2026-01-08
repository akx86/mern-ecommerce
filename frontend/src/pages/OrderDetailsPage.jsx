import React, { useState } from 'react'; // 1. استدعاء useState
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrderDetails, cancelOrder } from '@/services/orderService';
import toast from 'react-hot-toast';
import { 
    Package, CreditCard, Truck, CheckCircle, 
    XCircle, AlertCircle, Calendar,
    ArrowLeft, Trash2, AlertTriangle // أيقونة التحذير للمودال
} from 'lucide-react';

const OrderDetailsPage = () => {
    const { id: orderId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    
    // 2. حالة للتحكم في ظهور المودال
    const [showModal, setShowModal] = useState(false);

    const { data: orderData, isLoading, error } = useQuery({
        queryKey: ['orderDetails', orderId],
        queryFn: () => getOrderDetails(orderId),
    });

    const order = orderData?.data?.order || orderData?.order;

    // --- لوجيك الحذف ---
    const { mutate: deleteOrder, isPending: isDeleting } = useMutation({
        mutationFn: cancelOrder,
        onSuccess: () => {
            setShowModal(false); // نقفل المودال
            toast.success('Order cancelled successfully');
            queryClient.invalidateQueries(['myOrders']);
            setTimeout(() => navigate('/my-orders'), 1000);
        },
        onError: (err) => {
            setShowModal(false); // نقفل المودال لو حصل خطأ برضه
            toast.error(err.response?.data?.message || 'Failed to cancel order');
        }
    });

    // الحسابات
    const itemsPrice = order?.orderItems?.reduce((acc, item) => acc + (item.quantity * item.price), 0) || 0;
    const shippingPrice = order?.shippingPrice || (itemsPrice > 500 ? 0 : 50);
    const taxPrice = order?.taxPrice || Number((0.10 * itemsPrice).toFixed(2));
    const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);

    return (
        <div className="min-h-screen bg-[#0f0f13] text-white pt-28 pb-12 px-4 relative overflow-hidden selection:bg-cyan-500 selection:text-black">
            
           

            {/* الخلفية */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-600/10 rounded-full blur-[80px] pointer-events-none" />

            {/* 👇👇👇 المودال (Confirmation Modal) 👇👇👇 */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop (التعتيم الخلفي) */}
                    <div 
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
                        onClick={() => setShowModal(false)}
                    ></div>

                    {/* جسم المودال */}
                    <div className="relative bg-[#18181b] border border-red-500/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl shadow-red-900/20 transform transition-all scale-100">
                        <div className="flex flex-col items-center text-center">
                            {/* أيقونة التحذير */}
                            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                                <AlertTriangle className="text-red-500 w-6 h-6" />
                            </div>
                            
                            <h3 className="text-xl font-bold text-white mb-2">Cancel Order?</h3>
                            <p className="text-gray-400 text-sm mb-6">
                                Are you sure you want to cancel this order? This action cannot be undone.
                            </p>

                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-2.5 bg-gray-700/50 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors"
                                >
                                    No, Keep it
                                </button>
                                <button
                                    onClick={() => deleteOrder(orderId)}
                                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-red-900/20"
                                >
                                    {isDeleting ? 'Cancelling...' : 'Yes, Cancel'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* 👆👆👆 نهاية المودال 👆👆👆 */}

            <div className="container mx-auto max-w-6xl relative z-10">
                {isLoading ? (
                    <div className="flex justify-center items-center h-screen">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
                    </div>
                ) : error ? (
                    <div className="flex justify-center mt-20">
                         <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-xl flex items-center gap-4">
                            <AlertCircle size={32} />
                            <div>
                                <h3 className="font-bold text-lg">Error Loading Order</h3>
                                <p>{error?.response?.data?.message || error.message}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* زرار الرجوع */}
                        <Link 
                            to="/my-orders" 
                            className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors mb-8 group"
                        >
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                            <span>Back to Orders</span>
                        </Link>

                        {/* ... (الهيدر وباقي الصفحة زي ما هي بدون تغيير) ... */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                            <div>
                                <div className="flex items-center gap-3 text-cyan-400 mb-2">
                                    <Package className="w-6 h-6" />
                                    <span className="text-sm font-mono tracking-wider opacity-80">ORDER DETAILS</span>
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold font-mono text-white">
                                    Order <span className="text-gray-500">#</span>{order._id}
                                </h1>
                                <p className="text-gray-400 text-sm mt-1 flex items-center gap-2">
                                    <Calendar size={14} /> Placed on {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            
                            <div className="flex flex-wrap gap-3">
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${order.isPaid ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                                    {order.isPaid ? <CheckCircle size={16} /> : <XCircle size={16} />}
                                    <span className="text-xs font-bold uppercase">{order.isPaid ? "Paid" : "Not Paid"}</span>
                                </div>
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${order.isDelivered ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'}`}>
                                    {order.isDelivered ? <CheckCircle size={16} /> : <Truck size={16} />}
                                    <span className="text-xs font-bold uppercase">{order.isDelivered ? "Delivered" : "Processing"}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            
                            {/* LEFT COLUMN */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8">
                                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-100">
                                        <Package className="text-purple-400" size={20} /> Order Items
                                    </h2>
                                    <div className="space-y-4">
                                        {order.orderItems?.map((item, index) => (
                                            <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5 hover:border-white/10 transition-colors gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/5 p-1 flex-shrink-0">
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-md" />
                                                    </div>
                                                    <div>
                                                        <span className="text-white font-medium hover:text-cyan-400 transition-colors line-clamp-1">
                                                            {item.name}
                                                        </span>
                                                        <div className="text-gray-500 text-xs mt-1">
                                                            Quantity: {item.quantity} 
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-cyan-400 font-mono font-bold">
                                                    ${(item.quantity * item.price).toFixed(2)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {/* الجزء الخاص بالشحن */}
                                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8">
                                     {/* ... (نفس كود الشحن القديم) ... */}
                                    <div className="space-y-4 text-gray-300 text-sm">
                                         <div className="grid grid-cols-[100px_1fr] gap-4">
                                            <span className="text-gray-500">Address:</span>
                                            <span className="font-medium text-white">
                                                {order.shippingAddress?.address}, {order.shippingAddress?.city}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT COLUMN */}
                            <div className="lg:col-span-1">
                                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 sticky top-24">
                                    <h2 className="text-xl font-bold mb-6 text-gray-100 flex items-center gap-2">
                                        <CreditCard size={20} className="text-purple-400"/> Order Summary
                                    </h2>
                                    
                                    <div className="space-y-3 pb-6 border-b border-white/10 text-sm">
                                        <div className="flex justify-between text-gray-400">
                                            <span>Items Price</span>
                                            <span className="text-white font-mono">${itemsPrice.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-400">
                                            <span>Shipping</span>
                                            <span className="text-white font-mono">${shippingPrice.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-400">
                                            <span>Tax (10%)</span>
                                            <span className="text-white font-mono">${taxPrice}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center py-6 text-lg font-bold">
                                        <span>Total</span>
                                        <span className="text-cyan-400 font-mono text-xl">${totalPrice}</span>
                                    </div>

                                    <div className={`mb-6 p-3 rounded text-center text-xs font-bold border ${order.isPaid ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                                        {order.isPaid ? `PAID ON ${new Date(order.paidAt).toLocaleDateString()}` : 'NOT PAID'}
                                    </div>

                                    {!order.isPaid && (
                                        <>
                                            <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg font-bold text-white hover:opacity-90 transition-opacity shadow-lg shadow-purple-600/20 disabled:opacity-50 disabled:cursor-not-allowed">
                                                Proceed to Pay
                                            </button>

                                            {/* 👇 الزرار دلوقتي بيفتح المودال مش الـ window.confirm 👇 */}
                                            {!order.isDelivered && (
                                                <button 
                                                    onClick={() => setShowModal(true)} // فتح المودال
                                                    disabled={isDeleting}
                                                    className="w-full mt-3 py-3 border border-red-500/30 text-red-400 rounded-lg font-bold hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2 group"
                                                >
                                                    <Trash2 size={18} className="group-hover:text-red-500" /> 
                                                    Cancel Order
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default OrderDetailsPage;