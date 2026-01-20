import React, { useEffect, useState } from 'react';
import { cancelOrder, getAllOrders, updateOrderToDelivered, updateOrderToPaid } from "@/services/orderService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import ShopPagination from '@/components/products/ShopPagination';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Box, CreditCard, Calendar, User, Search, ChevronDown, Trash2, Loader2, Eye, X, MapPin, ShoppingBag, Truck, Check, AlertTriangle } from "lucide-react";

function OrdersPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [deleteId, setDeleteId] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const queryClient = useQueryClient();
    const [debouncedSearch, setDebouncedSearch] = useState('');
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1); 
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const { data, isLoading } = useQuery({
        queryKey: ['orders', page, debouncedSearch],
        queryFn: () => getAllOrders({ page, limit: 10, search:debouncedSearch }),
        placeholderData: (prevData) => prevData || [],
    });

    const orders = data?.data?.orders || [];
    const totalDocs = data?.total || 0;
    const totalPages = data?.paginationResult?.numberOfPages || Math.ceil(totalDocs / 10) || 1;

    const { mutate: cancelOrderMutation, isPending: isCancelling } = useMutation({
        mutationFn: (orderId) => cancelOrder(orderId),
        onSuccess: () => {
            setDeleteId(null);
            toast.success('Order cancelled successfully');
            queryClient.invalidateQueries(['orders', page]);
        },
        onError: (error) => {
            setDeleteId(null);
            toast.error(error?.response?.data?.message || 'Failed to cancel order');
        }
    });

    const { mutate: markDelivered, isPending: IsDelivering } = useMutation({
        mutationFn: (orderId) => updateOrderToDelivered(orderId),
        onSuccess: () => {
            toast.success("Order marked as delivered");
            queryClient.invalidateQueries({ queryKey: ['orders', page] });
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || "Failed to update status");
        }
    });

    const { mutate: markAsPaidMutation, isPending: isPaying } = useMutation({
        mutationFn: (orderId) => updateOrderToPaid(orderId),
        onSuccess: () => {
            toast.success("Order marked as paid");
            queryClient.invalidateQueries({ queryKey: ['orders', page] });
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || "Failed to mark as paid");
        }
    });

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };
   
    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-24">

            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={() => setDeleteId(null)}></div>
                    <div className="relative bg-[#18181b] border border-red-500/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl shadow-red-900/20 transform transition-all scale-100">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                                <AlertTriangle className="text-red-500 w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Cancel Order?</h3>
                            <p className="text-zinc-400 text-sm mb-6">Are you sure you want to cancel this order? This action cannot be undone.</p>
                            <div className="flex gap-3 w-full">
                                <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium transition-colors">No, Keep it</button>
                                <button onClick={() => cancelOrderMutation(deleteId)} disabled={isCancelling} className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-red-900/20 flex justify-center items-center gap-2">
                                    {isCancelling ? <Loader2 className="animate-spin h-4 w-4" /> : 'Confirm'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={() => setSelectedOrder(null)}></div>
                    <div className="relative bg-[#18181b] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-300">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <div>
                                <h3 className="text-xl font-bold text-white">Order Details</h3>
                                <p className="text-zinc-400 text-sm font-mono mt-1">#{selectedOrder._id}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="overflow-y-auto p-6 space-y-6 custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                                    <h4 className="text-sm font-semibold text-zinc-300 mb-3 flex items-center gap-2"><User size={16} className="text-cyan-400" /> Customer</h4>
                                    <div className="space-y-1 text-sm">
                                        <p className="text-white font-medium">{selectedOrder.user?.name || 'Unknown'}</p>
                                        <p className="text-zinc-500">{selectedOrder.user?.email}</p>
                                    </div>
                                </div>
                                <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                                    <h4 className="text-sm font-semibold text-zinc-300 mb-3 flex items-center gap-2"><MapPin size={16} className="text-purple-400" /> Shipping Address</h4>
                                    <div className="space-y-1 text-sm text-zinc-400">
                                        <p>{selectedOrder.shippingAddress?.address || 'No address details'}</p>
                                        <p>{selectedOrder.shippingAddress?.city} - {selectedOrder.shippingAddress?.phone}</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2"><ShoppingBag size={16} className="text-emerald-400" /> Order Items</h4>
                                <div className="bg-zinc-900/50 rounded-xl border border-white/5 overflow-hidden">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-white/5 text-zinc-400">
                                            <tr>
                                                <th className="p-3 font-medium">Product</th>
                                                <th className="p-3 font-medium text-center">Qty</th>
                                                <th className="p-3 font-medium text-right">Price</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {selectedOrder.orderItems?.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="p-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-white/10 overflow-hidden flex-shrink-0">
                                                                {item.product?.image ? (
                                                                    <img src={item.product.image} alt="" className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">IMG</div>
                                                                )}
                                                            </div>
                                                            <span className="text-zinc-200">{item?.name || 'Product info unavailable'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-3 text-center text-zinc-400">x{item.quantity}</td>
                                                    <td className="p-3 text-right text-zinc-200">${item.price}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-white/10 bg-zinc-900 flex justify-between items-center">
                            <span className="text-zinc-400">Total Amount</span>
                            <span className="text-2xl font-bold text-white">${(selectedOrder.totalPrice || 0).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Orders</h1>
                    <p className="text-zinc-400 mt-1 text-sm md:text-base">Manage and track system orders ({totalDocs} total)</p>
                </div>
            </div>

            <div className="bg-slate-900/30 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-lg">
                <div className="relative w-full md:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search order ID..."
                        value={search}
                        onChange={handleSearch}
                        className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-zinc-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all text-sm placeholder:text-zinc-600"
                    />
                </div>
            </div>

            {isLoading && (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
                </div>
            )}

            {!isLoading && orders.length > 0 && (
                <>
                    <div className="md:hidden space-y-4">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-lg relative">
                                
                                <div className="flex justify-between items-start mb-4 border-b border-white/5 pb-3">
                                    <div>
                                        <span className="font-mono text-xs text-cyan-400 bg-cyan-950/30 px-2 py-1 rounded border border-cyan-500/20">
                                            #{order._id?.slice(-6).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="text-xs text-zinc-500 flex items-center gap-1">
                                        <Calendar size={12} />
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </div>
                                </div>

                                <div className="mb-4 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2 text-zinc-300">
                                            <User size={14} className="text-zinc-500" />
                                            <span className="text-sm font-medium">{order.user?.name || "Unknown"}</span>
                                        </div>
                                        <span className="text-lg font-bold text-white">${(order.totalPrice || 0).toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    {order.isPaid ? (
                                        <div className="flex items-center justify-center gap-2 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                                            <Check size={12} /> Paid
                                        </div>
                                    ) : (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger className="outline-none w-full">
                                                <div className="flex items-center justify-center gap-2 py-2 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 text-xs font-medium cursor-pointer transition-colors">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Pending <ChevronDown size={12} />
                                                </div>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="center" className="bg-[#18181b] border-white/10 text-zinc-200">
                                                <DropdownMenuItem onClick={() => markAsPaidMutation(order._id)} disabled={isPaying} className="hover:bg-emerald-500/10 hover:text-emerald-400 cursor-pointer">
                                                    <CreditCard className="mr-2 h-4 w-4" /> Mark as Paid
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}

                                    {order.isDelivered ? (
                                        <div className="flex items-center justify-center gap-2 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium">
                                            <Box size={12} /> Delivered
                                        </div>
                                    ) : (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger className="outline-none w-full">
                                                <div className="flex items-center justify-center gap-2 py-2 rounded-lg border border-purple-500/30 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 text-xs font-medium cursor-pointer transition-colors">
                                                    <Truck size={12} /> Processing <ChevronDown size={12} />
                                                </div>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="center" className="bg-[#18181b] border-white/10 text-zinc-200">
                                                <DropdownMenuItem onClick={() => markDelivered(order._id)} disabled={IsDelivering} className="hover:bg-cyan-500/10 hover:text-cyan-400 cursor-pointer">
                                                    <Box className="mr-2 h-4 w-4" /> Mark as Delivered
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => setSelectedOrder(order)} 
                                        className="flex-1 bg-white/5 hover:bg-white/10 text-zinc-300 py-2.5 rounded-xl text-sm font-medium transition-colors flex justify-center items-center gap-2 border border-white/5"
                                    >
                                        <Eye size={16} /> Details
                                    </button>
                                    {!order.isDelivered && !order.isPaid && (
                                        <button 
                                            onClick={() => setDeleteId(order._id)} 
                                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 rounded-xl transition-colors border border-red-500/20"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="hidden md:block bg-slate-900/30 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[900px] text-left border-collapse">
                                <thead>
                                    <tr className="bg-white/5 border-b border-white/5 text-zinc-400 text-xs uppercase tracking-wider">
                                        <th className="p-4 pl-6">Order ID</th>
                                        <th className="p-4">Customer</th>
                                        <th className="p-4">Date</th>
                                        <th className="p-4">Total</th>
                                        <th className="p-4">Payment</th>
                                        <th className="p-4">Delivery</th>
                                        <th className="p-4 text-right pr-6">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-sm text-zinc-300">
                                    {orders.map((order) => (
                                        <tr key={order?._id || Math.random()} className='group hover:bg-white/[0.02] transition-colors duration-200'>
                                            <td className='p-4 pl-6 font-mono text-cyan-400/90 tracking-wide'>#{order?._id?.slice(-6).toUpperCase() || "---"}</td>
                                            <td className='p-4'>
                                                <div className='flex items-center gap-3'>
                                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10"><User size={14} className="text-zinc-400" /></div>
                                                    <div className='flex flex-col'>
                                                        <span className="font-medium text-zinc-200 group-hover:text-white transition-colors">{order?.user?.name || "Deleted User"}</span>
                                                        <span className="text-xs text-zinc-500">{order?.user?.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='p-4'>
                                                <div className="flex items-center gap-2 text-zinc-400"><Calendar size={14} />{order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : "---"}</div>
                                            </td>
                                            <td className='p-4'><span className="text-zinc-100 font-bold tracking-wide">${(order?.totalPrice || 0).toFixed(2)}</span></td>
                                            <td className='p-4'>
                                                {order?.isPaid ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                                        <Check size={12} /> Paid
                                                    </span>
                                                ) : (
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger className="outline-none">
                                                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 cursor-pointer transition-colors">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Pending <ChevronDown size={12} />
                                                            </div>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="start" className="bg-[#18181b] border-white/10 text-zinc-200">
                                                            <DropdownMenuItem onClick={() => markAsPaidMutation(order._id)} disabled={isPaying} className="hover:bg-emerald-500/10 hover:text-emerald-400 cursor-pointer">
                                                                {isPaying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CreditCard className="mr-2 h-4 w-4" />} Mark as Paid
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                )}
                                            </td>
                                            <td className='p-4'>
                                                {order?.isDelivered ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                                                        <Box size={12} /> Delivered
                                                    </span>
                                                ) : (
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger className="outline-none">
                                                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border border-purple-500/30 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 cursor-pointer transition-colors">
                                                                <Truck size={12} /> Processing <ChevronDown size={12} />
                                                            </div>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="start" className="bg-[#18181b] border-white/10 text-zinc-200">
                                                            <DropdownMenuItem onClick={() => markDelivered(order._id)} disabled={IsDelivering} className="hover:bg-cyan-500/10 hover:text-cyan-400 cursor-pointer">
                                                                {IsDelivering ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Box className="mr-2 h-4 w-4" />} Mark as Delivered
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                )}
                                            </td>
                                            <td className='p-4 pr-6 text-right'>
                                                <div className='flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out'>
                                                    <button onClick={() => setSelectedOrder(order)} className='p-2 hover:bg-cyan-500/20 hover:text-cyan-400 rounded-lg transition-colors' title="View Details">
                                                        <Eye size={18} />
                                                    </button>
                                                    {!order?.isDelivered && !order?.isPaid && (
                                                        <button onClick={() => setDeleteId(order._id)} className='p-2 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors' title="Cancel Order">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
                        <span className="bg-white/5 px-3 py-1 rounded-full border border-white/5">Page {page} of {totalPages}</span>
                        {totalPages > 1 && (
                            <ShopPagination
                                currentPage={page}
                                totalPages={totalPages}
                                onPageChange={(p) => setPage(p)}
                            />
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default OrdersPage;