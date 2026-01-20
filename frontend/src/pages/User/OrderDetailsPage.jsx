import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrderDetails, cancelOrder } from '@/services/orderService';
import toast from 'react-hot-toast';
import { 
    Package, CreditCard, Truck, Check, 
    X, AlertCircle, Calendar,
    ArrowLeft, Trash2, AlertTriangle, MapPin, Mail, Phone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const OrderDetailsPage = () => {
    const { id: orderId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    
    const [showModal, setShowModal] = useState(false);

    const { data: orderData, isLoading, error } = useQuery({
        queryKey: ['orderDetails', orderId],
        queryFn: () => getOrderDetails(orderId),
    });

    const order = orderData?.data?.order || orderData?.order;

    const { mutate: deleteOrder, isPending: isDeleting } = useMutation({
        mutationFn: cancelOrder,
        onSuccess: () => {
            setShowModal(false);
            toast.success('Order cancelled successfully', { duration: 4000 });
            queryClient.invalidateQueries(['myOrders']);
            setTimeout(() => navigate('/my-orders'), 1000);
        },
        onError: (err) => {
            setShowModal(false);
            toast.error(err.response?.data?.message || 'Failed to cancel order', { duration: 4000 });
        }
    });

    const itemsPrice = order?.orderItems?.reduce((acc, item) => acc + (item.quantity * item.price), 0) || 0;
    const shippingPrice = (itemsPrice > 500 ? 0 : 50);
    const taxPrice = Number((0.10 * itemsPrice).toFixed(2));
    const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);

    const StatusBadge = ({ isPositive, positiveText, negativeText, icon: Icon }) => (
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider ${
            isPositive 
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
        }`}>
            {Icon && <Icon size={14} strokeWidth={3} />}
            {isPositive ? positiveText : negativeText}
        </div>
    );

    return (
        <div className="w-full pt-20 md:pt-32 pb-20 px-4 md:px-8 relative font-sans text-slate-200">

            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                            onClick={() => setShowModal(false)}
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-slate-900/90 border border-red-500/30 rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl shadow-red-900/20 overflow-hidden"
                        >
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-red-500/20 rounded-full blur-3xl pointer-events-none" />
                            <div className="relative flex flex-col items-center text-center z-10">
                                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                                    <AlertTriangle className="text-red-500 w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Cancel Order?</h3>
                                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                                    Are you sure you want to cancel order <span className="text-slate-200 font-mono">#{order._id.substring(0,8)}</span>? This action cannot be undone.
                                </p>
                                <div className="flex gap-3 w-full">
                                    <button onClick={() => setShowModal(false)} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors border border-white/5">Keep Order</button>
                                    <button onClick={() => deleteOrder(orderId)} disabled={isDeleting} className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-colors shadow-lg shadow-red-500/20 flex items-center justify-center gap-2">
                                        {isDeleting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Trash2 size={18} /> Cancel</>}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="max-w-7xl mx-auto relative z-10">
                {isLoading ? (
                    <div className="flex flex-col justify-center items-center h-64 gap-4">
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-t-cyan-500 rounded-full animate-spin"></div>
                        </div>
                        <p className="text-slate-500 animate-pulse text-sm font-medium">Loading Details...</p>
                    </div>
                ) : error ? (
                    <div className="flex justify-center mt-20">
                         <div className="bg-red-500/10 backdrop-blur-md border border-red-500/20 text-red-400 p-8 rounded-3xl flex flex-col items-center gap-4 text-center">
                            <AlertCircle size={40} />
                            <div>
                                <h3 className="font-bold text-xl text-white mb-1">Error Loading Order</h3>
                                <p className="text-sm opacity-80">{error?.response?.data?.message || error.message}</p>
                            </div>
                            <Link to="/my-orders" className="mt-4 px-6 py-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-sm font-bold transition-colors">Go Back</Link>
                        </div>
                    </div>
                ) : (
                    <>
                        <Link to="/my-orders" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-white/5 text-slate-400 hover:text-white hover:border-white/20 transition-all mb-8 group w-fit">
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm font-bold">Back to Orders</span>
                        </Link>

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
                            <div>
                                <div className="flex items-center gap-2 text-cyan-400 mb-2 bg-cyan-950/30 px-3 py-1 rounded-lg border border-cyan-500/20 w-fit">
                                    <Package size={14} />
                                    <span className="text-xs font-bold tracking-widest uppercase">Order Details</span>
                                </div>
                                <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight mb-2">
                                    Order <span className="font-mono text-slate-500">#</span><span className="font-mono text-slate-200">{order._id}</span>
                                </h1>
                                <p className="text-slate-400 text-sm flex items-center gap-2">
                                    <Calendar size={14} /> Placed on {new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                </p>
                            </div>
                            
                            <div className="flex flex-wrap gap-3">
                                <StatusBadge isPositive={order.isPaid} positiveText="Paid" negativeText="Unpaid" icon={Check} />
                                <StatusBadge isPositive={order.isDelivered} positiveText="Delivered" negativeText="Processing" icon={Truck} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                            
                            <div className="lg:col-span-2 space-y-6 md:space-y-8">
                                <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-4 md:p-8 overflow-hidden relative">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-30" />
                                    <h2 className="text-lg md:text-xl font-bold mb-6 flex items-center gap-3 text-white">
                                        <div className="p-2 bg-slate-800 rounded-lg"><Package size={18} className="text-cyan-400" /></div>
                                        Items ({order.orderItems?.length})
                                    </h2>
                                    <div className="space-y-4">
                                        {order.orderItems?.map((item, index) => (
                                            <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-slate-950/50 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group">
                                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden bg-slate-800 border border-white/5 flex-shrink-0">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-white font-bold text-base md:text-lg hover:text-cyan-400 transition-colors line-clamp-1">{item.name}</h4>
                                                    <p className="text-slate-500 text-sm mt-1 font-medium">Qty: <span className="text-slate-300">{item.quantity}</span> × ${item.price}</p>
                                                </div>
                                                <div className="text-right w-full sm:w-auto">
                                                    <div className="text-cyan-400 font-bold font-mono text-lg">${(item.quantity * item.price).toFixed(2)}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-4 md:p-8">
                                    <h2 className="text-lg md:text-xl font-bold mb-6 flex items-center gap-3 text-white">
                                        <div className="p-2 bg-slate-800 rounded-lg"><Truck size={18} className="text-purple-400" /></div>
                                        Shipping & Contact
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                        <div className="p-4 rounded-2xl bg-slate-950/30 border border-white/5 space-y-1">
                                            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-2"><MapPin size={12} /> Address</div>
                                            <p className="text-white font-medium">{order.shippingAddress?.address}</p>
                                            <p className="text-slate-400 text-sm">{order.shippingAddress?.city}, {order.shippingAddress?.country}</p>
                                            <p className="text-slate-400 text-sm font-mono mt-1">{order.shippingAddress?.postalCode}</p>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="p-4 rounded-2xl bg-slate-950/30 border border-white/5 flex items-center gap-4">
                                                <div className="p-2 bg-slate-900 rounded-lg text-slate-400"><Phone size={18} /></div>
                                                <div><p className="text-xs text-slate-500 font-bold uppercase">Phone</p><p className="text-white font-medium font-mono">{order.shippingAddress?.phone || "N/A"}</p></div>
                                            </div>
                                            <div className="p-4 rounded-2xl bg-slate-950/30 border border-white/5 flex items-center gap-4">
                                                <div className="p-2 bg-slate-900 rounded-lg text-slate-400"><Mail size={18} /></div>
                                                <div><p className="text-xs text-slate-500 font-bold uppercase">Email</p><p className="text-white font-medium">{order.user?.email || "N/A"}</p></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-1">
                                <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-4 md:p-8 sticky top-32 shadow-2xl">
                                    <h2 className="text-lg md:text-xl font-bold mb-6 text-white flex items-center gap-3">
                                        <div className="p-2 bg-slate-800 rounded-lg"><CreditCard size={18} className="text-emerald-400"/></div>
                                        Order Summary
                                    </h2>
                                    <div className="space-y-3 pb-6 border-b border-white/10 text-sm">
                                        <div className="flex justify-between text-slate-400"><span>Subtotal</span><span className="text-slate-200 font-medium">${itemsPrice.toFixed(2)}</span></div>
                                        <div className="flex justify-between text-slate-400"><span>Shipping</span><span className="text-emerald-400 font-medium">{shippingPrice === 0 ? 'Free' : `$${shippingPrice.toFixed(2)}`}</span></div>
                                        <div className="flex justify-between text-slate-400"><span>Tax (10%)</span><span className="text-slate-200 font-medium">${taxPrice}</span></div>
                                    </div>
                                    <div className="flex justify-between items-end py-6">
                                        <span className="text-lg font-bold text-white">Total</span>
                                        <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">${totalPrice}</span>
                                    </div>
                                    <div className="space-y-3">
                                        {!order.isPaid && (
                                            <button className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl font-bold text-white transition-all shadow-lg shadow-cyan-500/20 active:scale-[0.98]">Pay Now</button>
                                        )}
                                        {!order.isDelivered && !order.isPaid && (
                                            <button onClick={() => setShowModal(true)} disabled={isDeleting} className="w-full py-3.5 border border-red-500/20 text-red-400 bg-red-500/5 hover:bg-red-500/10 rounded-xl font-bold transition-all flex items-center justify-center gap-2 group hover:border-red-500/40 active:scale-[0.98]">
                                                <Trash2 size={18} className="group-hover:text-red-500 transition-colors" /> Cancel Order
                                            </button>
                                        )}
                                    </div>
                                    {order.isPaid && (
                                         <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
                                            <p className="text-xs font-bold text-emerald-400 uppercase tracking-wide">Payment Verified</p>
                                         </div>
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