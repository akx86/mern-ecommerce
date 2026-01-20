import React, { useEffect, useState } from 'react';
import { Search, Trash2, User, Mail, ShieldAlert, Loader2, ChevronDown, Check } from "lucide-react";
import { deleteUser, getAllUsers, updateUser } from "@/services/userService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ShopPagination from '@/components/products/ShopPagination';
import toast from 'react-hot-toast';

function AdminUsersPage() {
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

    const { data, isLoading } = useQuery({
        queryKey: ['users', page, debouncedSearch],
        queryFn: () => getAllUsers({ page, search: debouncedSearch }),
        placeholderData: (prevData) => prevData
    });

    const users = data?.data?.users || [];
    const totalPages = data?.paginationResult?.numberOfPages || 1;
    
    const storageData = localStorage.getItem('user');
    const userInfo = storageData ? JSON.parse(storageData) : null;
    const currentUser = userInfo?._id;

    const { mutate: deleteUserMutation, isPending: isDeleting } = useMutation({
        mutationFn: (id) => deleteUser(id),
        onSuccess: () => {
            setDeleteId(null);
            toast.success('User deleted successfully');
            queryClient.invalidateQueries(['users']);
        },
        onError: (err) => {
            setDeleteId(null);
            toast.error(err?.response?.data?.message || 'Failed to delete user');
        }
    });

    const { mutate: toggleRoleMutation, isPending: isUpdatingRole } = useMutation({
        mutationFn: ({ id, isAdmin }) => updateUser(id, { isAdmin }),
        onSuccess: (data, variables) => {
            const newRole = variables.isAdmin ? "Admin" : "User";
            toast.success(`Role updated to ${newRole}`);
            queryClient.invalidateQueries(['users']);
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || 'Failed to update role');
        }
    });

    const handleSearch = (e) => setSearch(e.target.value);

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-24">
            
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={() => setDeleteId(null)}></div>
                    <div className="relative bg-[#18181b] border border-red-500/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl shadow-red-900/10">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                                <Trash2 className="text-red-500 w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Delete User?</h3>
                            <p className="text-zinc-400 text-sm mb-6">Are you sure? This action will permanently remove the user.</p>
                            <div className="flex gap-3 w-full">
                                <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium transition-colors">Cancel</button>
                                <button 
                                    onClick={() => deleteUserMutation(deleteId)} 
                                    disabled={isDeleting}
                                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-medium flex justify-center items-center gap-2 transition-colors shadow-lg shadow-red-900/20"
                                >
                                    {isDeleting ? <Loader2 className="animate-spin h-4 w-4" /> : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Users</h1>
                    <p className="text-zinc-400 mt-1 text-sm md:text-base">Manage system users and permissions</p>
                </div>
            </div>

            <div className="bg-slate-900/30 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-lg">
                <div className="relative w-full md:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input
                        onChange={handleSearch}
                        value={search}
                        type="text"
                        placeholder="Search by name or email..."
                        className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-zinc-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all text-sm placeholder:text-zinc-600"
                    />
                </div>
            </div>

            {isLoading && (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
                </div>
            )}

            {!isLoading && users.length > 0 && (
                <>
                    <div className="md:hidden space-y-4">
                        {users.map((user) => (
                            <div key={user._id} className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-lg relative">
                                
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold overflow-hidden text-lg shrink-0">
                                        {user.profileImg ? (
                                            <img src={user.profileImg} alt={user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            user.name?.slice(0, 2).toUpperCase()
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-white font-bold truncate text-lg">{user.name}</h3>
                                        <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-0.5">
                                            <Mail size={12} />
                                            <span className="truncate">{user.email}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                    {user._id === currentUser ? (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-500/20 border border-purple-500/30 text-purple-300">
                                            <ShieldAlert size={14} /> You (Admin)
                                        </span>
                                    ) : (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger className="outline-none">
                                                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                                                    user.isAdmin 
                                                    ? "bg-purple-500/10 border-purple-500/20 text-purple-400 hover:bg-purple-500/20" 
                                                    : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                                                }`}>
                                                    {user.isAdmin ? <ShieldAlert size={14} /> : <User size={14} />}
                                                    {user.isAdmin ? "Admin" : "User"}
                                                    <ChevronDown size={12} className="opacity-50 ml-1" />
                                                </div>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="start" className="bg-[#18181b] border-white/10 text-zinc-200">
                                                <DropdownMenuItem 
                                                    onClick={() => toggleRoleMutation({ id: user._id, isAdmin: !user.isAdmin })} 
                                                    disabled={isUpdatingRole}
                                                    className="hover:bg-cyan-500/10 hover:text-cyan-400 cursor-pointer"
                                                >
                                                    {user.isAdmin ? <User className="mr-2 h-4 w-4" /> : <ShieldAlert className="mr-2 h-4 w-4" />}
                                                    Make {user.isAdmin ? "User" : "Admin"}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}

                                    {user._id !== currentUser && (
                                        <button 
                                            onClick={() => setDeleteId(user._id)}
                                            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors border border-red-500/10 active:scale-95"
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
                            <table className="w-full min-w-[800px] text-left border-collapse">
                                <thead>
                                    <tr className="bg-white/5 border-b border-white/5 text-zinc-400 text-xs uppercase tracking-wider">
                                        <th className="p-4 pl-6">User</th>
                                        <th className="p-4">Email</th>
                                        <th className="p-4">Role</th>
                                        <th className="p-4 text-right pr-6">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-sm text-zinc-300">
                                    {users.map((user) => (
                                        <tr key={user._id} className='group hover:bg-white/[0.02] transition-colors duration-200'>
                                            <td className='p-4 pl-6'>
                                                <div className='flex items-center gap-3'>
                                                    <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold overflow-hidden text-xs">
                                                        {user.profileImg ? <img src={user.profileImg} alt={user.name} className="w-full h-full object-cover" /> : user.name?.slice(0, 2).toUpperCase()}
                                                    </div>
                                                    <span className="font-medium text-white group-hover:text-cyan-400 transition-colors">{user.name}</span>
                                                </div>
                                            </td>
                                            <td className='p-4 text-zinc-400'>
                                                <div className="flex items-center gap-2 group-hover:text-zinc-300 transition-colors">
                                                    <Mail size={14} className="opacity-50" /> 
                                                    {user.email}
                                                </div>
                                            </td>
                                            <td className='p-4'>
                                                {user._id === currentUser ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/20 border border-purple-500/30 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                                                        <ShieldAlert size={12} /> You (Admin)
                                                    </span>
                                                ) : (
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger className="outline-none">
                                                            <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-200 cursor-pointer ${
                                                                user.isAdmin 
                                                                ? "bg-purple-500/10 border-purple-500/20 text-purple-400 hover:bg-purple-500/20 hover:border-purple-500/40" 
                                                                : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                                                            }`}>
                                                                {user.isAdmin ? <ShieldAlert size={12} /> : <User size={12} />}
                                                                {user.isAdmin ? "Admin" : "User"}
                                                                <ChevronDown size={12} className="opacity-50 ml-1" />
                                                            </div>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="start" className="bg-[#18181b] border-white/10 text-zinc-200">
                                                            <DropdownMenuItem 
                                                                onClick={() => toggleRoleMutation({ id: user._id, isAdmin: !user.isAdmin })} 
                                                                disabled={isUpdatingRole}
                                                                className="hover:bg-cyan-500/10 hover:text-cyan-400 cursor-pointer"
                                                            >
                                                                {user.isAdmin ? <User className="mr-2 h-4 w-4" /> : <ShieldAlert className="mr-2 h-4 w-4" />}
                                                                Make {user.isAdmin ? "User" : "Admin"}
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                )}
                                            </td>
                                            <td className='p-4 pr-6 text-right'>
                                                {user._id !== currentUser && (
                                                    <div className='opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out'>
                                                        <button 
                                                            onClick={() => setDeleteId(user._id)} 
                                                            className='p-2 hover:bg-red-500/10 hover:text-red-400 text-zinc-500 rounded-lg transition-colors'
                                                            title="Delete User"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                )}
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

export default AdminUsersPage;