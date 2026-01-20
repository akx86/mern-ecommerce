import React, { useState } from 'react';
import { Save, Upload, Image as ImageIcon, ChevronLeft, FileText, Loader2, AlertTriangle, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCategory } from '@/services/categoryService'; 
import toast from 'react-hot-toast';

const CreateCategoryPage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        title: '',
        image: null
    });
    const [imagePreview, setImagePreview] = useState(null);

    const { mutate, isPending } = useMutation({
        mutationFn: (dataToSend) => createCategory(dataToSend),
        onSuccess: () => {
            queryClient.invalidateQueries(['categories']);
            toast.success('Category created successfully! 🎉');
            navigate('/admin/categories');
        },
        onError: (err) => {
            console.error(err);
            toast.error(err.response?.data?.message || 'Failed to create category');
        }
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        if (e) e.preventDefault();

        if (!formData.title || !formData.image) {
            toast.error("Please provide both a title and an image.");
            return;
        }
        
        const dataToSend = new FormData();
        dataToSend.append('title', formData.title);
        dataToSend.append('image', formData.image);

        mutate(dataToSend);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Link to="/admin/categories" className="p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors">
                        <ChevronLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Add Category</h1>
                        <p className="text-zinc-400 text-sm">Create a new category for your store</p>
                    </div>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <Link 
                        to="/admin/categories" 
                        className="flex-1 md:flex-none text-center px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 transition-colors font-medium"
                    >
                        Cancel
                    </Link>
                    <button
                        onClick={handleSubmit}
                        disabled={isPending}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium shadow-[0_0_20px_rgba(8,145,178,0.3)] hover:shadow-[0_0_30px_rgba(8,145,178,0.5)] transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                    >
                        {isPending ? <Loader2 className='animate-spin' size={18} /> : <Plus size={18} />}
                        {isPending ? 'Creating...' : 'Create Category'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-900/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Category Cover</h3>

                        <div className={`relative group w-full aspect-square bg-black/40 border-2 border-dashed ${!imagePreview ? 'border-cyan-500/30 bg-cyan-500/5' : 'border-white/10'} rounded-xl overflow-hidden flex flex-col items-center justify-center transition-colors hover:border-cyan-500/50`}>
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-full max-h-full object-contain"
                                />
                            ) : (
                                <div className="flex flex-col items-center text-zinc-500 gap-2">
                                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-2 group-hover:bg-cyan-500/10 transition-colors">
                                        <ImageIcon size={32} className="group-hover:text-cyan-400 transition-colors" />
                                    </div>
                                    <span className="text-sm font-medium text-zinc-400 group-hover:text-cyan-200">Upload Image</span>
                                </div>
                            )}

                            <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <Upload className="text-white mb-2" size={32} />
                                <span className="text-white font-medium text-sm">Select Image</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden" 
                                />
                            </label>
                        </div>
                        <p className="text-xs text-zinc-500 mt-4 text-center">
                            Required: JPG, PNG, WEBP (Max 5MB)
                        </p>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-slate-900/30 backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-6">

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">Category Name</label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                                <input
                                    type="text"
                                    name='title'
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Smart Watches"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                                />
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/10 flex gap-3 items-start">
                             <div className="mt-0.5 text-cyan-500">
                                <AlertTriangle size={18} />
                             </div>
                             <div className="space-y-1">
                                <p className="text-sm font-medium text-cyan-200">Creation Tips</p>
                                <p className="text-xs text-cyan-200/60 leading-relaxed">
                                    Categories help organize your products. Make sure to upload a representative image as it will be the first thing customers see on the shop page.
                                </p>
                             </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateCategoryPage;