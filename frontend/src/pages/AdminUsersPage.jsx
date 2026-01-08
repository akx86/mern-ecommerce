import React from 'react';
import { 
    Search, Trash2, User, Mail, Shield, ShieldAlert, CheckCircle2, Loader2, ChevronLeft, ChevronRight 
} from "lucide-react";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteUser, getAllUsers, updateUser } from "@/services/userService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import ShopPagination from '@/components/layout/ShopPagination';
import toast from 'react-hot-toast';

function AdminUsersPage() {
    const [page , setPage] = useState(1);
    const [search , setSearch] = useState('')
    const [deleteId, setDeleteId] = useState(null)
    const queryClient = useQueryClient();

    const {data, isLoading } = useQuery({
        queryKey :['users', page, search],
        queryFn : ()=> getAllUsers({page, search}),
        placeholderData : (prevData)=> prevData
    })
    const users = data?.data?.users || [];
    const totalDocs = data?.total || 0;
    const totalPages = data?.paginationResult?.numberOfPages || 1;
    
    const {mutate: deleteUserMutation, isPending: isDeleting} = useMutation({
        mutationFn:(id)=> deleteUser(id),
        onSuccess:()=> {
            setDeleteId(null);
            toast.success('User deleted successfully');
            queryClient.invalidateQueries(['users']);

        },
        onError:(err)=> {
            setDeleteId(null);
            toast.error(err?.response?.data?.message || 'Failed to delete user');
        }
    })

    const {mutate: toggleRoleMutation, isPending: isUpdatingRole} = useMutation({
        mutationFn:({id,isAdmin})=> updateUser(id,{isAdmin}),
       onSuccess: (response) => {
            const updatedUser = response?.data?.user || response?.data?.updatedUser; 
            
            if (updatedUser) {
                const role = updatedUser.isAdmin ? "Admin" : "User";
                toast.success(`User role updated to ${role}`);
            } else {
                toast.success("User role updated successfully");
            }
            queryClient.invalidateQueries(['users']);
        },
        onError: (err) => {
            console.error("Mutation Error:", err);
            toast.error(err?.response?.data?.message || 'Failed to update role');
        }
    })
    const handleSearch = (e) =>{
        setSearch(e.target.value)
        setPage(1)
    }
   const storageData = localStorage.getItem('user');
    const userInfo = storageData ? JSON.parse(storageData) : null;
    const currentUser = userInfo?._id;
    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDeleteId(null)}></div>
                    <div className="relative bg-[#18181b] border border-red-500/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                                <Trash2 className="text-red-500 w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Delete User?</h3>
                            <p className="text-zinc-400 text-sm mb-6">Are you sure? This action will permanently remove the user.</p>
                            <div className="flex gap-3 w-full">
                                <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium">Cancel</button>
                                <button 
                                    onClick={() => deleteUserMutation(deleteId)} 
                                    disabled={isDeleting}
                                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-medium flex justify-center items-center gap-2"
                                >
                                    {isDeleting ? <Loader2 className="animate-spin h-4 w-4" /> : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* --- Header & Search (زي ما هما) --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Users</h1>
                    <p className="text-zinc-400 mt-1">Manage system users and permissions</p>
                </div>
            </div>

            <div className="bg-slate-900/30 backdrop-blur-md border border-white/10 p-4 rounded-xl flex gap-4 shadow-lg">
                <div className="relative w-full md:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input
                        onChange={handleSearch}
                        value={search}
                        type="text"
                        placeholder="Search by name or email..."
                        className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-zinc-200 focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-zinc-600"
                    />
                </div>
            </div>

            {/* --- Table --- */}
            <div className="bg-slate-900/30 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px] text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/5">
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-400">User</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Email</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Role</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-400 text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-white/5 text-sm text-zinc-300">
                        {isLoading ? (
        <tr>
            <td colSpan="4" className="p-8 text-center text-zinc-500">
                <div className="flex justify-center items-center gap-2">
                    <Loader2 className="animate-spin" /> Loading users...
                </div>
            </td>
        </tr>
    ) : users.length === 0 ? (
        <tr><td colSpan="4" className="p-8 text-center text-zinc-500">No users found.</td></tr>
    ) : ( users.map((user) => (
                                <tr key={user._id} className='group hover:bg-white/5 transition-all duration-300'>
                                    
                                    {/* 1. Name & Avatar */}
                                    <td className='p-4'>
                                        <div className='flex items-center gap-3'>
                                            <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold overflow-hidden">
                                                {user.profileImg ? (
                                                    <img src={user.profileImg} alt={user.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    user.name?.slice(0, 2).toUpperCase()
                                                )}
                                            </div>
                                            <span className="font-medium text-white">{user.name}</span>
                                        </div>
                                    </td>

                                    {/* 2. Email */}
                                    <td className='p-4 text-zinc-400'>
                                        <div className="flex items-center gap-2">
                                            <Mail size={14} /> {user.email}
                                        </div>
                                    </td>

                                    {/* 3. Role (Dropdown for Switching) */}
                                    <td className='p-4'>
                                        {user._id === currentUser ?(
                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/20 border border-purple-500/30 text-purple-300 cursor-default shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                                                <ShieldAlert size={12} /> You (Admin)
                                            </div>
                                             ):(      
                                            <DropdownMenu>
                                            <DropdownMenuTrigger className="outline-none">
                                                {/* شكل الزرار بيتغير حسب الحالة زي الأوردرات */}
                                                {user.isAdmin ? (
                                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/10 border border-purple-500/20 text-purple-400 cursor-pointer hover:bg-purple-500/20 transition-colors">
                                                        <ShieldAlert size={12} /> Admin
                                                    </div>
                                                ) : (
                                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-800 border border-zinc-700 text-zinc-400 cursor-pointer hover:bg-zinc-700 transition-colors">
                                                        <User size={12} /> User
                                                    </div>
                                                )}
                                            </DropdownMenuTrigger>
                                            
                                            <DropdownMenuContent align="start" className="bg-[#18181b] border-white/10 text-zinc-200">
                                                <DropdownMenuItem
                                                onClick={()=> toggleRoleMutation({id:user._id,isAdmin:!user.isAdmin})}
                                                disabled={isUpdatingRole}
                                                 className="cursor-pointer hover:bg-white/10">
                                                    {user.isAdmin ? (
                                                        <><User className="mr-2 h-4 w-4" /> Demote to User</>
                                                    ) : (
                                                        <><Shield className="mr-2 h-4 w-4 text-purple-400" /> Promote to Admin</>
                                                    )}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                  
                                    </td>

                                    {/* 4. Actions (Direct Trash Icon) */}
                                    <td className='p-4 text-right'>
                                        {user._id !== currentUser && (
                                            <div className='flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0'>
                                                <button 
                                                    onClick={() => setDeleteId(user._id)}
                                                    className='p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors'
                                                    title="Delete User"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        )}
                                        
                                    </td>
                                </tr>
                            ))
                        )}
                           
                        </tbody>
                    </table>
                </div>

                {/* Pagination (Static) */}
                <div className="p-4 border-t border-white/5 bg-white/[0.02] flex justify-between items-center text-xs text-zinc-500">
                    <span>Showing {users.length} users</span>
                    {totalPages > 1 && (
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

}

export default AdminUsersPage;