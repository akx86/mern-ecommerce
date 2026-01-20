import React from 'react';
import { Package, Check, X, Clock, ChevronRight, AlertCircle, ShoppingBag, Truck, Calendar, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMyOrders } from '@/services/orderService';
import { motion } from 'framer-motion';

const StatusBadge = ({ type, status, icon: Icon }) => {
    const styles = {
        paid: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        unpaid: "bg-red-500/10 text-red-400 border-red-500/20",
        delivered: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
        processing: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    };
    
    return (
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] md:text-xs font-bold uppercase tracking-wider w-fit ${styles[type]}`}>
            <Icon size={12} strokeWidth={3} />
            {status}
        </div>
    );
};

const MyOrdersPage = () => {

    const {data:ordersData, isLoading, error} = useQuery({
        queryKey: ['myOrders'],
        queryFn: getMyOrders
    })
    
    const orders = ordersData?.orders || ordersData?.data?.orders || [];

    return (
        <div className="min-h-screen w-full bg-transparent text-slate-200 pt-20 md:pt-32 pb-20 px-4 md:px-8 relative overflow-hidden font-sans selection:bg-cyan-500/30">
            
            <div className="w-full max-w-7xl mx-auto relative z-10">
                
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-4 md:gap-6"
                >
                    <div>
                        <h1 className="text-3xl md:text-5xl font-black flex items-center gap-3 md:gap-4 tracking-tight text-white mb-2">
                            <div className="p-2 md:p-3 bg-slate-900/50 rounded-2xl border border-white/10 shadow-lg shadow-cyan-900/20">
                                <Package className="text-cyan-400 w-6 h-6 md:w-8 md:h-8" />
                            </div>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
                                MY ORDERS
                            </span>
                        </h1>
                        <p className="text-slate-400 text-sm md:text-lg ml-1">Track your history and shipping status</p>
                    </div>
                </motion.div>

                {isLoading ? (
                     <div className="flex flex-col justify-center items-center h-64 gap-4">
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-t-cyan-500 rounded-full animate-spin"></div>
                        </div>
                        <p className="text-slate-500 animate-pulse text-sm font-medium">Loading Orders...</p>
                    </div>
                ) : error ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        className="bg-red-500/5 backdrop-blur-md border border-red-500/10 text-red-400 p-6 md:p-8 rounded-3xl flex flex-col items-center text-center gap-4 max-w-lg mx-auto"
                    >
                        <div className="p-4 bg-red-500/10 rounded-full">
                            <AlertCircle size={40} />
                        </div>
                        <div>
                            <h3 className="font-bold text-xl text-white mb-2">Unable to load orders</h3>
                            <p className="text-sm text-red-300/80">{error?.response?.data?.message || error.message || "Something went wrong"}</p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="w-full" 
                    >
                        {orders.length === 0 ? (
                            <div className="p-12 md:p-20 text-center flex flex-col items-center gap-6 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl">
                                <div className="bg-slate-800/50 p-6 rounded-full border border-white/5 shadow-inner">
                                    <ShoppingBag className="w-12 h-12 md:w-16 md:h-16 text-slate-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2">No orders found</h3>
                                    <p className="text-slate-400 mb-8 max-w-md mx-auto text-sm md:text-base">Looks like you haven't made any purchases yet.</p>
                                    <Link to="/shop" className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-cyan-900/20 hover:shadow-cyan-900/40 hover:-translate-y-1">
                                        <ShoppingBag size={20} />
                                        Start Shopping
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="md:hidden space-y-4">
                                    {orders.map((order, index) => (
                                        <div key={order._id} className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-lg relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-500 to-indigo-500 opacity-50" />
                                            
                                            <div className="flex justify-between items-start mb-4 pl-3">
                                                <div>
                                                    <p className="text-[10px] text-slate-500 font-mono uppercase mb-1">Order ID</p>
                                                    <span className="font-mono text-sm text-cyan-400 bg-cyan-950/30 px-2 py-1 rounded border border-cyan-500/20">
                                                        #{order._id.substring(0, 8)}
                                                    </span>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] text-slate-500 mb-1">Date</p>
                                                    <p className="text-sm text-slate-300 font-medium">
                                                        {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center bg-white/5 rounded-xl p-3 mb-4 ml-3 border border-white/5">
                                                <span className="text-slate-400 text-sm">Total</span>
                                                <span className="text-white font-bold text-lg">${order.totalPrice?.toFixed(2)}</span>
                                            </div>

                                            <div className="flex flex-wrap gap-2 mb-4 pl-3">
                                                {order.isPaid ? <StatusBadge type="paid" status="Paid" icon={Check} /> : <StatusBadge type="unpaid" status="Unpaid" icon={X} />}
                                                {order.isDelivered ? <StatusBadge type="delivered" status="Delivered" icon={Check} /> : <StatusBadge type="processing" status="Processing" icon={Clock} />}
                                            </div>

                                            <Link to={`/orders/${order._id}`} className="block w-full text-center bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold py-3 rounded-xl border border-white/10 transition-colors ml-1 active:scale-[0.98]">
                                                View Details
                                            </Link>
                                        </div>
                                    ))}
                                </div>

                                <div className="hidden md:block bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 opacity-50" />
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-slate-950/50 text-slate-400 text-xs uppercase tracking-widest border-b border-white/5">
                                                    <th className="p-6 font-semibold flex items-center gap-2"> <Package size={14}/> Order ID</th>
                                                    <th className="p-6 font-semibold"><div className="flex items-center gap-2"><Calendar size={14}/> Date</div></th>
                                                    <th className="p-6 font-semibold">Total</th>
                                                    <th className="p-6 font-semibold"><div className="flex items-center gap-2"><CreditCard size={14}/> Payment</div></th>
                                                    <th className="p-6 font-semibold"><div className="flex items-center gap-2"><Truck size={14}/> Delivery</div></th>
                                                    <th className="p-6 font-semibold text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {orders.map((order, index) => (
                                                    <motion.tr 
                                                        key={order._id}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: index * 0.05 }}
                                                        className="hover:bg-white/[0.02] transition-colors group"
                                                    >
                                                        <td className="p-6">
                                                            <span className="font-mono text-sm text-cyan-400 bg-cyan-950/30 px-2 py-1 rounded border border-cyan-500/20">
                                                                #{order._id.substring(0, 8)}...
                                                            </span>
                                                        </td>
                                                        <td className="p-6 text-sm text-slate-300 font-medium">
                                                            {new Date(order.createdAt).toLocaleDateString(undefined, {
                                                                year: 'numeric', month: 'short', day: 'numeric'
                                                            })}
                                                        </td>
                                                        <td className="p-6">
                                                            <span className="text-white font-bold text-base">
                                                                ${order.totalPrice?.toFixed(2)}
                                                            </span>
                                                        </td>
                                                        <td className="p-6">
                                                            {order.isPaid ? (
                                                                <StatusBadge type="paid" status="Paid" icon={Check} />
                                                            ) : (
                                                                <StatusBadge type="unpaid" status="Unpaid" icon={X} />
                                                            )}
                                                        </td>
                                                        <td className="p-6">
                                                            {order.isDelivered ? (
                                                                <StatusBadge type="delivered" status="Delivered" icon={Check} />
                                                            ) : (
                                                                <StatusBadge type="processing" status="Processing" icon={Clock} />
                                                            )}
                                                        </td>
                                                        <td className="p-6 text-right">
                                                            <Link 
                                                                to={`/orders/${order._id}`}
                                                                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white bg-slate-800/50 hover:bg-cyan-600 border border-white/10 hover:border-cyan-500/50 px-4 py-2.5 rounded-lg transition-all duration-300 group-hover:translate-x-[-5px]"
                                                            >
                                                                Details <ChevronRight size={14} />
                                                            </Link>
                                                        </td>
                                                    </motion.tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default MyOrdersPage;