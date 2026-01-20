import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllCategories } from '@/services/categoryService';
import { Search, ArrowRight, Sparkles, ShoppingBag, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ShopCategoriesPage = () => {
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['shop-categories', debouncedSearch],
        queryFn: () => getAllCategories({ 
            search: debouncedSearch, 
            limit: 100 
        }),
        placeholderData: (prev) => prev
    });

    const categories = data?.data?.categories || [];

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 min-h-screen text-slate-200 font-sans">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8 md:mb-12 border-b border-white/5 pb-6 md:pb-8">
                <div className="space-y-3 w-full md:w-auto">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-500/20 backdrop-blur-md shadow-[0_0_15px_rgba(8,145,178,0.2)]"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-xs font-bold tracking-widest text-cyan-100 uppercase">
                            Collections
                        </span>
                    </motion.div>
                    
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
                        BROWSE <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-indigo-300 to-purple-300">
                            CATEGORIES
                        </span>
                    </h1>
                </div>

                <div className="w-full md:w-[400px] relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                    
                    <div className="relative flex items-center bg-slate-950/50 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-3.5 transition-all focus-within:bg-slate-900/80">
                        <Search className="text-slate-400 group-focus-within:text-cyan-400 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Find a collection..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-transparent border-none outline-none text-white ml-3 placeholder:text-slate-500 font-medium"
                        />
                        {isLoading && <Loader2 className="animate-spin text-cyan-500 ml-2" size={18} />}
                    </div>
                </div>
            </div>

            {categories.length === 0 && !isLoading ? (
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-center py-32 text-slate-500 bg-slate-900/20 rounded-3xl border border-white/5 backdrop-blur-sm"
                >
                    <ShoppingBag size={64} className="mx-auto mb-6 opacity-20" />
                    <p className="text-2xl font-bold text-slate-400">No categories found</p>
                    <p className="text-slate-600 mt-2">Try adjusting your search terms</p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                    {isLoading ? (
                        [...Array(8)].map((_, i) => (
                            <div key={i} className="aspect-[4/5] bg-slate-900/50 rounded-3xl border border-white/5 animate-pulse" />
                        ))
                    ) : (
                        categories.map((cat, index) => (
                            <motion.div
                                key={cat._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                            >
                                <Link to={`/shop?category=${cat._id}`} className="group block h-full">
                                    
                                    <div className="relative h-full aspect-[4/5] overflow-hidden rounded-2xl md:rounded-3xl bg-slate-900/40 backdrop-blur-sm border border-white/10 group-hover:border-indigo-500/30 transition-all duration-500 shadow-xl group-hover:shadow-2xl group-hover:shadow-indigo-900/20">
                                        
                                        <div className="absolute inset-0 overflow-hidden">
                                            {cat.image ? (
                                                <img 
                                                    src={cat.image} 
                                                    alt={cat.title} 
                                                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 opacity-80 group-hover:opacity-100"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-slate-800 flex items-center justify-center relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-cyan-500/10" />
                                                    <ShoppingBag className="text-slate-700 w-12 h-12 md:w-16 md:h-16 relative z-10" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent opacity-90"></div>
                                        </div>

                                        <div className="absolute bottom-0 left-0 w-full p-4 md:p-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                            
                                            {cat.productsCount !== undefined && (
                                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 md:px-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 mb-3 md:mb-4 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/30 transition-colors">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>
                                                    <span className="text-[10px] md:text-[11px] font-bold text-slate-300 uppercase tracking-wide group-hover:text-white">
                                                        {cat.productsCount} Items
                                                    </span>
                                                </div>
                                            )}

                                            <div className="flex justify-between items-end">
                                                <h3 className="text-lg md:text-2xl font-black text-white leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-indigo-200 transition-all duration-300 capitalize line-clamp-2">
                                                    {cat.name || cat.title} 
                                                </h3>
                                                
                                                <div className="hidden md:flex w-10 h-10 rounded-full bg-white/10 backdrop-blur-md items-center justify-center text-white opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500 hover:bg-cyan-500 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                                                    <ArrowRight size={18} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default ShopCategoriesPage;