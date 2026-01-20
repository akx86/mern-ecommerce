import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    DollarSign, ShoppingBag, Users, Package, 
    TrendingUp 
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getAllOrders, getDashboardStats } from '@/services/orderService';
import AdminLoading from '@/components/admin/AdminLoading';
import SalesChart from '@/components/admin/SalesChart';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const AdminDashboardPage = () => {

    const [dateRange, setDateRange] = useState("7days");

    const { data, isLoading, isError } = useQuery({
        queryKey: ['admin-dashboard', dateRange], 
        queryFn: () => getDashboardStats(dateRange), 
        keepPreviousData: true 
    });

    const { data: ordersData, isLoading: isLoadingOrders } = useQuery({
        queryKey: ['recent-orders'],
        queryFn: () => getAllOrders({ limit: 5, sort: '-createdAt' }), 
    });
    
    if (isLoading) {
        return <AdminLoading />
    }

    if (isError) {
        return <div className="text-red-500 p-8 text-center">Error loading dashboard stats</div>
    }

    const stats = data?.data || {}; 
    const recentOrders = ordersData?.data?.orders || [];
        
    const statCards = [
        {
            title: "Total Sales",
            value: `$${stats.totalSales?.toFixed(2) || 0}`, 
            icon: DollarSign,
            color: "from-emerald-500 to-teal-600",
            glow: "bg-emerald-500/20",
            desc: "Revenue from paid orders"
        },
        {
            title: "Total Orders",
            value: stats.totalOrders || 0,
            icon: ShoppingBag,
            color: "from-blue-500 to-indigo-600",
            glow: "bg-blue-500/20",
            desc: "All received orders"
        },
        {
            title: "Total Users",
            value: stats.totalUsers || 0,
            icon: Users,
            color: "from-violet-500 to-purple-600",
            glow: "bg-violet-500/20",
            desc: "Registered customers"
        },
        {
            title: "Total Products",
            value: stats.totalProducts || 0,
            icon: Package,
            color: "from-orange-500 to-red-600",
            glow: "bg-orange-500/20",
            desc: "Items in catalog"
        }
    ];
    
    return (
        <div className="p-4 md:p-8 space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-20 min-h-screen">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Dashboard Overview</h1>
                    <p className="text-zinc-400 mt-1 text-sm md:text-base">Welcome back! Here's what's happening today.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {statCards.map((card, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative overflow-hidden bg-slate-900/40 backdrop-blur-xl border border-white/10 p-5 md:p-6 rounded-2xl group hover:border-white/20 transition-all duration-300"
                    >
                        <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl ${card.glow} opacity-50 group-hover:opacity-100 transition-opacity`} />

                        <div className="flex justify-between items-start relative z-10">
                            <div>
                                <p className="text-zinc-400 text-xs md:text-sm font-medium">{card.title}</p>
                                <h3 className="text-2xl md:text-3xl font-bold text-white mt-2">{card.value}</h3>
                            </div>
                            <div className={`p-2.5 md:p-3 rounded-xl bg-gradient-to-br ${card.color} shadow-lg shadow-black/20 group-hover:scale-110 transition-transform duration-300 `}>
                                <card.icon className=" text-white w-5 h-5 md:w-6 md:h-6" />
                            </div>
                        </div>

                        <div className="mt-4 flex items-center gap-2 text-xs relative z-10">
                            <span className="text-emerald-400 flex items-center gap-1 font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                                <TrendingUp size={12} />
                                +Live
                            </span>
                            <span className="text-zinc-500 truncate max-w-[120px] md:max-w-none">{card.desc}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-base md:text-lg font-bold text-white">Sales Analytics</h3>
                        
                        <Select value={dateRange} onValueChange={setDateRange}>
                            <SelectTrigger className="w-[130px] md:w-[140px] bg-black/30 border-white/10 text-zinc-400 h-8 text-xs outline-none focus:ring-0 focus:ring-offset-0 focus:border-indigo-500/50">
                                <SelectValue placeholder="Select range" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#18181b] border-white/10 text-zinc-300">
                                <SelectItem value="7days" className="focus:bg-white/10 focus:text-white cursor-pointer">Last 7 Days</SelectItem>
                                <SelectItem value="30days" className="focus:bg-white/10 focus:text-white cursor-pointer">Last 30 Days</SelectItem>
                                <SelectItem value="1year" className="focus:bg-white/10 focus:text-white cursor-pointer">Last Year</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <div className="h-64 md:h-80 w-full">
                        <SalesChart data={stats.salesChart} />
                    </div>
                </div>

                <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-base md:text-lg font-bold text-white">Recent Orders</h3>
                        <a href="/admin/orders" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">View All</a>
                    </div>
                    
                    <div className="space-y-3 md:space-y-4">
                        {recentOrders.length === 0 && !isLoadingOrders && (
                            <p className="text-zinc-500 text-sm text-center py-4">No orders found.</p>
                        )}

                        {recentOrders.map((order) => (
                            <div key={order._id} className="flex items-center gap-3 md:gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-[10px] md:text-xs group-hover:scale-110 transition-transform shrink-0">
                                    {order.user?.name?.slice(0, 2).toUpperCase() || 'UN'}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">
                                        {order.user?.name || 'Unknown User'}
                                    </p>
                                    <p className="text-[10px] md:text-xs text-zinc-400 truncate">
                                        #{order._id.slice(-6)} • {order.orderItems?.length || 0} items
                                    </p>
                                </div>
                                
                                <div className="text-right shrink-0">
                                    <span className="block text-sm font-bold text-emerald-400">
                                        ${order.totalPrice?.toFixed(0) || order.totalOrderPrice?.toFixed(0) || 0}
                                    </span>
                                    <span className="text-[10px] text-zinc-500 block">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

        </div>
    );
};

export default AdminDashboardPage;