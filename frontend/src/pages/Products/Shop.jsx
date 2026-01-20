import React, { useEffect } from "react";
import { getAllProducts } from "@/services/productService";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import ProductCard from '@/components/products/ProductCard';
import { ProductCardSkeleton } from '@/components/products/ProductCard';
import ShopSidebar from "@/components/products/ShopSidebar";
import ShopPagination from "@/components/products/ShopPagination";
import { Filter, Sparkles, X } from 'lucide-react';

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
        <div className="min-h-[50vh] flex items-center justify-center text-red-400 font-bold px-4 text-center">
            Error: {error.message}
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 min-h-screen">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 border-b border-white/5 pb-6 md:pb-8">
                <div className="w-full md:w-auto">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="h-[1px] w-6 md:w-8 bg-cyan-500/50 inline-block"></span>
                        <span className="text-cyan-400 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase">Collections</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-2">
                        New <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-500">Arrivals</span>
                    </h1>
                    <p className="text-slate-400 text-sm md:text-base max-w-md font-light leading-relaxed">
                        Explore our curated selection of premium gear designed for the modern era.
                    </p>
                </div>

                <button 
                    onClick={() => setShowMobileFilter(!showMobileFilter)}
                    className="mt-6 md:mt-0 w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-sm font-bold text-white hover:bg-white/10 transition-all hover:border-white/20 active:scale-95 md:hidden"
                >
                    <Filter size={16} /> Filter Products
                </button>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                <div className={`
                    fixed inset-0 z-40 bg-[#020617]/95 backdrop-blur-sm p-6 pt-24 transition-transform duration-300 md:relative md:inset-auto md:bg-transparent md:backdrop-blur-none md:p-0 md:pt-0 md:block md:w-[260px] lg:w-[280px] md:translate-x-0 shrink-0 border-r border-white/5 md:border-none overflow-y-auto md:overflow-visible
                    ${showMobileFilter ? 'translate-x-0' : '-translate-x-full'}
                `}>
                    <div className="flex justify-between items-center md:hidden mb-8 border-b border-white/5 pb-4">
                        <h2 className="text-xl font-black text-white flex items-center gap-2">
                            <Filter size={20} className="text-cyan-400"/> Filters
                        </h2>
                        <button onClick={() => setShowMobileFilter(false)} className="p-2 bg-white/5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                    
                    <ShopSidebar onClose={() => setShowMobileFilter(false)} />
                </div>

                {showMobileFilter && (
                    <div 
                        className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
                        onClick={() => setShowMobileFilter(false)}
                    />
                )}

                <div className="flex-1 w-full">
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6 content-start">
                        {isLoading || isFetching ? (
                            Array.from({ length: 8 }).map((_, index) => <ProductCardSkeleton key={index} />)
                        ) : (
                            products.length > 0 ? (
                                products.map((product) => (
                                    <div key={product._id} className="h-full">
                                        <ProductCard item={product} />
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full py-20 md:py-32 flex flex-col items-center justify-center text-center px-4">
                                    <div className="w-20 h-20 md:w-24 md:h-24 bg-slate-900 rounded-full border border-white/5 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(255,255,255,0.05)]">
                                        <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-slate-600" />
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2">No products found</h3>
                                    <p className="text-slate-400 text-sm md:text-base max-w-md mx-auto mb-8 font-light">
                                        We couldn't find any matches for your current filters.
                                    </p>
                                    <button 
                                        onClick={() => setSearchParams({})}
                                        className="px-6 py-3 md:px-8 bg-white text-black font-bold rounded-full hover:bg-slate-200 transition-all shadow-lg hover:shadow-white/10 text-sm md:text-base"
                                    >
                                        Clear All Filters
                                    </button>
                                </div>
                            )
                        )}
                    </div>

                    {products.length > 0 && (
                        <div className="mt-12 md:mt-20 border-t border-white/5 pt-8 md:pt-10">
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
                    )}
                </div>
            </div>
        </div>
    );
}

export default Shop;