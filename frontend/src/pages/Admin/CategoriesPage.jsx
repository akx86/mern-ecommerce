import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, AlertTriangle, Layers, Tag, FolderOpen, Loader2 } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAllCategories, deleteCategory } from '@/services/categoryService';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import ShopPagination from '@/components/products/ShopPagination';

const CategoriesPage = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [deleteId, setDeleteId] = useState(null);
    const queryClient = useQueryClient();
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1); 
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['categories', page, debouncedSearch],
        queryFn: () => getAllCategories({ page, search: debouncedSearch, limit: 10 }),
        placeholderData: (prevData) => prevData
    });

    const categories = data?.data?.categories || [];
    const totalDocs = data?.results || 0;
    const limit = 10;
    const totalPages = data?.paginationResult?.numberOfPages || Math.ceil(totalDocs / limit) || 1;

    const { mutate, isPending } = useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            setDeleteId(null);
            toast.success('Category deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
        onError: (error) => {
            setDeleteId(null);
            toast.error(error.message || 'Failed to delete category');
        }
    });

    const handleSearch = (e) => {
        setSearch(e.target.value);
    }

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
                            <h3 className="text-xl font-bold text-white mb-2">Delete Category?</h3>
                            <p className="text-zinc-400 text-sm mb-6">
                                This action implies deleting a category. Are you sure?
                            </p>
                            <div className="flex gap-3 w-full">
                                <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium transition-colors">Cancel</button>
                                <button onClick={() => mutate(deleteId)} className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-red-900/20 flex justify-center items-center">
                                    {isPending ? <Loader2 className="animate-spin h-4 w-4" /> : 'Confirm'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Categories</h1>
                    <p className="text-zinc-400 mt-1 text-sm md:text-base">Manage your store categories</p>
                </div>
                <Link to={'/admin/categories/add'} className="w-full md:w-auto flex justify-center items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg active:scale-95 group">
                    <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                    <span className="font-medium">Add Category</span>
                </Link>
            </div>

            <div className="bg-slate-900/30 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-lg">
                <div className="relative w-full md:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={search}
                        onChange={handleSearch}
                        className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-zinc-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all text-sm"
                    />
                </div>
            </div>

            {isLoading && (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
                </div>
            )}

            {!isLoading && !isError && categories.length === 0 && (
                <div className="text-center py-20 bg-slate-900/30 rounded-xl border border-white/5">
                    <FolderOpen className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                    <p className="text-zinc-500">No categories found matching your search.</p>
                </div>
            )}

            {!isLoading && !isError && categories.length > 0 && (
                <>
                    <div className="md:hidden space-y-4">
                        {categories.map((category) => (
                            <div key={category._id} className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                                <div className="flex gap-4 mb-4">
                                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 shrink-0 bg-slate-800">
                                        <img src={category.image} alt={category.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                        <h3 className="text-white font-bold truncate mb-1 text-lg">{category.title}</h3>
                                        <div className="flex items-center gap-2 text-xs text-zinc-400 mb-2 font-mono">
                                            <Tag size={12} />
                                            <span>ID: {category._id?.slice(-6).toUpperCase()}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1">
                                                <Layers size={10} /> {category.productsCount || 0} Items
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 border-t border-white/5 pt-4">
                                    <Link to={`/admin/categories/edit/${category._id}`} className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-zinc-300 py-2 rounded-lg text-sm font-medium transition-colors border border-white/5">
                                        <Edit size={16} /> Edit
                                    </Link>
                                    <button 
                                        onClick={() => setDeleteId(category._id)}
                                        className="flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 py-2 rounded-lg text-sm font-medium transition-colors border border-red-500/10"
                                    >
                                        <Trash2 size={16} /> Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="hidden md:block bg-slate-900/30 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/5 text-zinc-400 text-xs uppercase tracking-wider">
                                    <th className="p-4 pl-6 w-[40%]">Category</th>
                                    <th className="p-4 w-[20%]">ID</th>
                                    <th className="p-4 w-[20%]">Items</th>
                                    <th className="p-4 text-right pr-6 w-[20%]">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm text-zinc-300">
                                {categories.map((category) => (
                                    <tr key={category._id} className='group hover:bg-white/5 transition-all duration-300'>
                                        <td className='p-4 pl-6'>
                                            <div className='flex items-center gap-4'>
                                                <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 bg-slate-800 shrink-0">
                                                    <img src={category.image} alt={category.title} className='w-full h-full object-cover' />
                                                </div>
                                                <span className="font-medium text-white max-w-[200px] truncate">{category.title}</span>
                                            </div>
                                        </td>
                                        <td className='p-4 font-mono text-xs text-zinc-500'>
                                            #{category._id?.slice(-6).toUpperCase()}
                                        </td>
                                        <td className='p-4'>
                                            <span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-cyan-500/10 border border-cyan-500/20 text-cyan-400'>
                                                {category.productsCount || 0} items
                                            </span>
                                        </td>
                                        <td className='p-4 pr-6 text-right'>
                                            <div className='flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                                                <Link to={`/admin/categories/edit/${category._id}`} className='p-2 hover:bg-cyan-500/20 hover:text-cyan-400 rounded-lg transition-colors'>
                                                    <Edit size={18} />
                                                </Link>
                                                <button onClick={() => setDeleteId(category._id)} className='p-2 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors'>
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
                        <span className="bg-white/5 px-3 py-1 rounded-full">Page {page} of {totalPages}</span>
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
};

export default CategoriesPage;