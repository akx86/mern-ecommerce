import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// استقبلنا data كـ prop
const SalesChart = ({ data }) => {
    
    // تحويل البيانات لشكل يفهمه Recharts (لو البيانات جاية فاضية نستخدم مصفوفة فاضية)
    // الباك اند بيبعت {_id: '2024-01-01', sales: 500}
    // احنا هنحولها لـ {name: 'Jan 01', sales: 500}
    const chartData = data?.map(item => ({
        name: new Date(item._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), // يحول التاريخ لـ Jan 1
        sales: item.sales
    })) || [];

    // لو مفيش بيانات خالص، نعرض رسالة
    if (chartData.length === 0) {
        return (
            <div className="h-full w-full flex flex-col items-center justify-center text-zinc-500">
                <p>No sales data for the last 7 days</p>
            </div>
        );
    }

    return (
        <div className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    
                    <XAxis 
                        dataKey="name" 
                        stroke="#71717a" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                    />
                    <YAxis 
                        stroke="#71717a" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                        tickFormatter={(value) => `$${value}`} 
                    />
                    
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
                        itemStyle={{ color: '#818cf8' }}
                        cursor={{ stroke: '#ffffff20' }}
                    />
                    
                    <Area 
                        type="monotone" 
                        dataKey="sales" 
                        stroke="#6366f1" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorSales)" 
                        animationDuration={1500} // أنيميشن ناعم
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SalesChart;