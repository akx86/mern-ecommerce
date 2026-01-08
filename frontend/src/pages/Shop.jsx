import React, { useEffect } from "react";
import { getAllProducts } from "@/services/productService";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import ProductCard from '@/components/layout/ProductCard';
import { ProductCardSkeleton } from '@/components/layout/ProductCard';
import ShopSidebar from "@/components/layout/ShopSidebar";
import ShopPagination from "@/components/layout/ShopPagination";
import { Filter } from 'lucide-react';

function Shop() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [showMobileFilter, setShowMobileFilter] = React.useState(false);

    const page = parseInt(searchParams.get('page')) || 1;
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const maxPrice = searchParams.get('maxPrice'); 
    const limit = 12; 

    const {
        data, isLoading, isError, error, isFetching
    } = useQuery({
        queryKey: ['products', page, search, category, maxPrice], 
        queryFn: () => getAllProducts({ page, limit, search, category, maxPrice }),
        placeholderData: (prevData) => prevData,
    });

    useEffect(() => { window.scrollTo(0, 0); }, [page]);

    const products = data?.data?.products || [];
    const totalItems = data?.total || 0;
    const totalPages = Math.ceil(totalItems / limit);

    if (isError) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-red-400 font-bold">
            Error: {error.message}
        </div>
    );

    return (
        // [تعديل الخلفية]
        // 1. bg-slate-950: لون أساسي غامق جداً (كحلي مسود)
        // 2. relative overflow-hidden: عشان الألوان المموهة متطلعش بره الشاشة
        <div className="relative min-h-screen w-full bg-slate-950 text-slate-200 overflow-hidden pt-24 pb-12">
            
            {/* --- PREMIUM AMBIENT BACKGROUND --- */}
            
            {/* Gradient 1: لون بنفسجي غامق في أعلى الشمال (ناعم جداً) */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-900/30 rounded-full blur-[120px] -translate-x-1/3 -translate-y-1/3 pointer-events-none" />
            
            {/* Gradient 2: لون أزرق ليلي في أسفل اليمين */}
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[150px] translate-x-1/3 translate-y-1/3 pointer-events-none" />

            {/* Gradient 3: لمسة خفيفة جداً في النص عشان تكسر السواد (اختياري) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-slate-900/50 rounded-full blur-[100px] pointer-events-none" />

            {/* ---------------------------------- */}

            <div className="relative z-10 container mx-auto px-4">
                
                {/* Header */}
                <div className="flex justify-between items-end mb-10 border-b border-white/5 pb-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
                            New Arrivals
                        </h1>
                        <p className="text-slate-400 text-sm md:text-base">
                            Discover the latest trends in our collection
                        </p>
                    </div>
                    {/* Mobile Filter Button */}
                    <button 
                        onClick={() => setShowMobileFilter(!showMobileFilter)}
                        className="md:hidden flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors"
                    >
                        <Filter size={16} /> Filters
                    </button>
                </div>
                
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    
                    {/* Sidebar Wrapper */}
                    <div className={`
                        fixed inset-0 z-40 bg-slate-950/95 backdrop-blur-xl p-6 transition-transform duration-300 md:relative md:inset-auto md:bg-transparent md:backdrop-blur-none md:p-0 md:block md:w-[280px] md:translate-x-0 shrink-0
                        ${showMobileFilter ? 'translate-x-0' : '-translate-x-full'}
                    `}>
                        <div className="flex justify-between items-center md:hidden mb-6">
                            <h2 className="text-xl font-bold text-white">Filters</h2>
                            <button onClick={() => setShowMobileFilter(false)} className="text-slate-400">Close</button>
                        </div>
                        
                        <ShopSidebar />
                    </div>

                    {/* Products Grid */}
                    <div className="flex-1 w-full">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 content-start">
                            {isLoading || isFetching ? (
                                Array.from({ length: 8 }).map((_, index) => <ProductCardSkeleton key={index} />)
                            ) : (
                                products.length > 0 ? (
                                    products.map((product) => (
                                        <ProductCard key={product._id} item={product} />
                                    ))
                                ) : (
                                    <div className="col-span-full py-32 flex flex-col items-center justify-center text-center">
                                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                            <Filter className="w-8 h-8 text-slate-500" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">No products found</h3>
                                        <p className="text-slate-400 max-w-md mx-auto mb-6">
                                            We couldn't find any products matching your current filters. Try adjusting them.
                                        </p>
                                        <button 
                                            onClick={() => setSearchParams({})}
                                            className="px-6 py-2.5 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                                        >
                                            Clear All Filters
                                        </button>
                                    </div>
                                )
                            )}
                        </div>

                        {/* Pagination */}
                        <div className="mt-16 border-t border-white/5 pt-8">
                            <ShopPagination
                                currentPage={page}
                                totalPages={totalPages}
                                onPageChange={(p) => {
                                    const newParams = new URLSearchParams(searchParams);
                                    newParams.set('page', p);                           
                                    setSearchParams(newParams);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Shop;