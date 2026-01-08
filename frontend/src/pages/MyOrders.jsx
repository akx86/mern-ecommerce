import React from 'react';
import { Package, CheckCircle, XCircle, Clock, ChevronRight, Search, AlertCircle, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMyOrders } from '@/services/orderService';

const MyOrdersPage = () => {

    const {data:ordersData,isLoading, error} = useQuery({
        queryKey: ['myOrders'],
        queryFn: getMyOrders
    })
    const orders = ordersData?.orders || ordersData?.data?.orders || [];
        return (
        <div className="min-h-screen bg-[#0f0f13] text-white pt-28 pb-12 px-4 relative overflow-hidden selection:bg-cyan-500 selection:text-black">
            
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-600/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="container mx-auto max-w-6xl relative z-10">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3 tracking-tighter">
                            <Package className="text-cyan-400 w-8 h-8" />
                            MY ORDERS
                        </h1>
                        <p className="text-gray-400 mt-2 text-sm">Track your past purchases and shipping status</p>
                    </div>
                </div>

                {/* 4. معالجة حالات التحميل والأخطاء */}
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
                            <div className="absolute top-0 left-0 w-full h-full animate-ping rounded-full bg-cyan-500/20"></div>
                        </div>
                    </div>
                ) : error ? (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-xl flex items-center gap-4 max-w-2xl mx-auto">
                        <AlertCircle size={32} />
                        <div>
                            <h3 className="font-bold text-lg mb-1">Unable to load orders</h3>
                            <p className="text-sm text-red-400/80">{error?.response?.data?.message || error.message || "Something went wrong"}</p>
                        </div>
                    </div>
                ) : (
                    /* 5. عرض الجدول الحقيقي */
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative">
                        
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 opacity-50" />

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-black/40 text-gray-400 text-xs uppercase tracking-widest border-b border-white/10">
                                        <th className="p-5 font-medium">product</th>
                                        <th className="p-5 font-medium">Date</th>
                                        <th className="p-5 font-medium">Total</th>
                                        <th className="p-5 font-medium">Payment</th>
                                        <th className="p-5 font-medium">Delivery</th>
                                        <th className="p-5 font-medium text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {orders.map((order) => (
                                        <tr key={order._id} className="hover:bg-white/5 transition-all group">
                                            
                                            {/* ID */}
                                            <td className="p-5 font-mono text-sm text-cyan-300">
                                                #{order._id.substring(0, 8)}...
                                            </td>

                                            {/* Date */}
                                            <td className="p-5 text-sm text-gray-300">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>

                                            {/* Total */}
                                            <td className="p-5 font-mono text-sm font-bold text-white">
                                                ${order.totalPrice?.toFixed(2)}
                                            </td>

                                            {/* Payment Status */}
                                            <td className="p-5">
                                                {order.isPaid ? (
                                                    <div className="flex items-center gap-2 text-green-400 bg-green-400/10 px-3 py-1 rounded-full w-fit text-xs font-medium border border-green-400/20">
                                                        <CheckCircle size={14} /> Paid
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-red-400 bg-red-400/10 px-3 py-1 rounded-full w-fit text-xs font-medium border border-red-400/20">
                                                        <XCircle size={14} /> Not Paid
                                                    </div>
                                                )}
                                            </td>

                                            {/* Delivery Status */}
                                            <td className="p-5">
                                                {order.isDelivered ? (
                                                    <div className="flex items-center gap-2 text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded-full w-fit text-xs font-medium border border-cyan-400/20">
                                                        <CheckCircle size={14} /> Delivered
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full w-fit text-xs font-medium border border-yellow-400/20">
                                                        <Clock size={14} /> Processing
                                                    </div>
                                                )}
                                            </td>

                                            {/* Action Button */}
                                            <td className="p-5 text-right">
                                                <Link 
                                                    to={`/orders/${order._id}`}
                                                    className="inline-flex items-center gap-1 text-xs bg-white/5 hover:bg-cyan-500 hover:text-black border border-white/10 hover:border-cyan-400 px-4 py-2 rounded-lg transition-all duration-300 group-hover:translate-x-[-5px]"
                                                >
                                                    Details <ChevronRight size={14} />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Empty State: لو مفيش أوردرات */}
                        {orders.length === 0 && (
                            <div className="p-16 text-center text-gray-500 flex flex-col items-center gap-6">
                                <div className="bg-white/5 p-6 rounded-full">
                                    <ShoppingBag className="w-12 h-12 opacity-40 text-cyan-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">No orders found</h3>
                                    <p className="text-gray-400 mb-6">Looks like you haven't bought anything yet.</p>
                                    <Link to="/shop" className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 px-8 rounded-lg transition-colors shadow-lg shadow-cyan-500/20">
                                        Start Shopping
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrdersPage;