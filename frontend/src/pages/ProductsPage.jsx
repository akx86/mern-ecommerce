import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteProduct, getAllProducts } from '@/services/productService';
import { ProductCardSkeleton } from '../components/layout/ProductCard';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import ShopPagination from '@/components/layout/ShopPagination';

const ProductsPage = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const { data, isLoading, isError } = useQuery({
        queryKey: ['products', page, search],
        queryFn: () => getAllProducts({ page, search, limit: 10 }),
        placeholderData: (prevData) => prevData
    });
    const products = data?.data?.products || [];
    const totalDocs = data?.total || 0
    const limit = 10;
    const totalPages = data?.paginationResult?.numberOfPages || Math.ceil(totalDocs / limit) || 1;
    const queryClient = useQueryClient();
    const [deleteId, setDeleteId] = useState(null);
    const { mutate, isPending } = useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            setDeleteId(null);
            toast.success('Product deleted successfully');
            queryClient.invalidateQueries(['products'])
        },
        onError: (error) => {
            setDeleteId(null);
            toast.error(error.message || 'Failed to delete product');
        }
    })
    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10"> {/* Added pb-10 for mobile scroll space */}

            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
                        onClick={() => setDeleteId(null)}
                    ></div>

                    {/* Modal Body */}
                    <div className="relative bg-[#18181b] border border-red-500/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl shadow-red-900/20 transform transition-all scale-100">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                                <AlertTriangle className="text-red-500 w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Delete Product?</h3>
                            <p className="text-gray-400 text-sm mb-6">
                                Are you sure you want to delete this product? This action cannot be undone.
                            </p>

                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={() => setDeleteId(null)}
                                    className="flex-1 py-2.5 bg-gray-700/50 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors"
                                >
                                    No, Keep it
                                </button>
                                <button
                                    onClick={() => mutate(deleteId)}
                                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-red-900/20"
                                >
                                    {isPending ? 'Deleting...' : 'Confirm Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 1. Page Header & Actions - Responsive Update */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Products</h1>
                    <p className="text-zinc-400 mt-1">Manage your store inventory</p>
                </div>

                {/* Button becomes full width on mobile for easier tapping */}
                <Link to={'/admin/products/add'} className="w-full md:w-auto flex justify-center items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-2.5 rounded-xl transition-all shadow-[0_0_20px_rgba(8,145,178,0.3)] hover:shadow-[0_0_30px_rgba(8,145,178,0.6)] active:scale-95 group">
                    <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                    <span className="font-medium">Add Product</span>
                </Link>
            </div>

            {/* 2. Filters Bar - Responsive Update */}
            <div className="bg-slate-900/30 backdrop-blur-md border border-white/10 p-4 rounded-xl flex gap-4 shadow-lg">
                <div className="relative w-full md:max-w-md"> {/* Changed flex-1 to w-full md:max-w-md */}
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={handleSearch}
                        className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-zinc-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                    />
                </div>
            </div>

            {/* 3. Products Table - Responsive Update */}
            <div className="bg-slate-900/30 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                {/* overflow-x-auto enables horizontal scrolling on mobile */}
                <div className="overflow-x-auto">
                    {/* min-w-[900px] forces table to keep its shape, triggering scroll on small screens */}
                    <table className="w-full min-w-[900px] text-left border-collapse">

                        {/* Table Head */}
                        <thead>
                            <tr className="bg-white/5 border-b border-white/5">
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Product</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Category</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Price</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Stock</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-400 text-right">Actions</th>
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody className="divide-y divide-white/5 text-sm text-zinc-300">
                            {isLoading && (
                                <tr>
                                    <td colSpan={5} className="p-0"><ProductCardSkeleton /></td>
                                </tr>
                            )}
                            {isError && (
                                <tr>
                                    <td colSpan={5} className="text-center p-10 text-red-400 bg-red-500/5">
                                        <p>فشل تحميل المنتجات</p>
                                    </td>
                                </tr>
                            )}

                            {!isLoading && !isError && products?.map((product) => (
                                <tr key={product._id} className='group hover:bg-white/5 transition-all duration-300 border-b border-white/5 last:border-0'>

                                    <td className='p-4'>
                                        <div className='flex items-center gap-4'>
                                            <div className="relative overflow-hidden rounded-lg w-12 h-12 border border-white/10 group-hover:border-cyan-500/50 transition-colors shrink-0"> {/* shrink-0 prevents image squash */}
                                                <img src={product.image} alt={product.title} className='w-full h-full object-cover' />
                                            </div>
                                            <span className="font-medium text-zinc-200 group-hover:text-white transition-colors truncate max-w-[200px]">{product.title}</span>
                                        </div>
                                    </td>

                                    <td className='p-4'>
                                        <div className='flex items-center gap-2'>
                                            <span className='inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:border-white/20 transition-all'>
                                                <span className='w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]'></span>
                                                {product.category?.title}
                                            </span>
                                        </div>
                                    </td>

                                    <td className='p-4'>
                                        <span className="text-zinc-100 font-bold tracking-wide">
                                            ${Number(product.price).toLocaleString()}
                                        </span>
                                    </td>

                                    <td className='p-4'>
                                        {(product.countInStock) > 0 ? (
                                            <div className="flex items-center gap-2">
                                                <span className="relative flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                                </span>
                                                <span className="text-emerald-400 font-medium">
                                                    ({product.countInStock}) InStock
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-red-400 font-medium bg-red-500/10 px-2 py-1 rounded-lg border border-red-500/20 text-xs">
                                                Out of Stock
                                            </span>
                                        )}
                                    </td>

                                    <td className='text-right p-4'>
                                        <div className='flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0'>

                                            <Link to={`/admin/products/edit/${product._id}`}
                                                className='p-2 text-zinc-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors'
                                                title='Edit'>
                                                <Edit size={18} />
                                            </Link>

                                            <button
                                                onClick={() => setDeleteId(product._id)}
                                                disabled={isPending}
                                                className='p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors'
                                                title="Delete">
                                                <Trash2 size={18} />
                                            </button>

                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer & Pagination - Responsive Update */}
                {/* Changed to flex-col on mobile to prevent squashing */}
                <div className="p-4 border-t border-white/5 bg-white/[0.02] text-xs text-zinc-500 flex flex-col md:flex-row justify-between items-center gap-4">
                    <span>Showing {products.length} products</span>
                    {totalPages > 1 && (
                        /* Removed mt-8 to fit better in the flex layout */
                        <div className="flex justify-center w-full md:w-auto">
                            <ShopPagination
                                currentPage={page}
                                totalPages={totalPages}
                                onPageChange={(p) => setPage(p)}
                            />
                        </div>
                    )}
                </div>

            </div>

        </div>
    );
};

export default ProductsPage;