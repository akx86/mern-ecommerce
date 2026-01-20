import React, { useState } from 'react';
import { Save, Upload, Image as ImageIcon, ChevronLeft, LayoutGrid, DollarSign, Package, FileText, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createProduct } from '@/services/productService';
import { getAllCategories } from '@/services/categoryService';
import toast from 'react-hot-toast';

const CreateProductPage = () => {
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        countInStock: '',
        category: '',
        description: '',
        image: null
    })

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [imagePreview, setImagePreview] = useState(null);

    const { data: categoriesData } = useQuery({
        queryKey: ['categories'],
        queryFn: getAllCategories,
    });
    const categories = categoriesData?.data?.categories || [];

    const { mutate, isPending: isSaving } = useMutation({
        mutationFn: createProduct,
        onSuccess: () => {
            toast.success('Product created successfully! 🚀');
            queryClient.invalidateQueries(['products']);
            navigate('/admin/products')
        },
        onError: (err) => {
            console.error(err);
            toast.error(err.response?.data?.message || 'Failed to create product');
        }
    })

    const handleSubmit = () => {
        if (!formData.image) return toast.error('Please upload an image');
        if (!formData.category) return toast.error('Please select a category');
        if (!formData.title || !formData.price || !formData.countInStock) return toast.error('Please fill all required fields');

        const dataToSend = new FormData();
        dataToSend.append('title', formData.title);
        dataToSend.append('price', formData.price);
        dataToSend.append('countInStock', formData.countInStock);
        dataToSend.append('category', formData.category);
        dataToSend.append('description', formData.description);
        dataToSend.append('image', formData.image);

        mutate(dataToSend);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Link to="/admin/products" className="p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors">
                        <ChevronLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Create Product</h1>
                        <p className="text-zinc-400 text-sm">Add a new item to your inventory</p>
                    </div>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <Link 
                        to="/admin/products" 
                        className="flex-1 md:flex-none text-center px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 transition-colors font-medium"
                    >
                        Cancel
                    </Link>
                    <button
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium shadow-[0_0_20px_rgba(8,145,178,0.3)] hover:shadow-[0_0_30px_rgba(8,145,178,0.5)] transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                    >
                        {isSaving ? <Loader2 className='animate-spin' size={18} /> : <Save size={18} />}
                        {isSaving ? 'Creating...' : 'Create Product'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-900/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Product Image</h3>

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
                                <span className="text-white font-medium text-sm">Change Image</span>
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
                            <label className="text-sm font-medium text-zinc-300">Product Title</label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                                <input
                                    type="text"
                                    name='title'
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g. iPhone 15 Pro Max"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300">Price</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                                    <input
                                        type="number"
                                        name='price'
                                        value={formData.price}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300">Stock Quantity</label>
                                <div className="relative">
                                    <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                                    <input
                                        type="number"
                                        name='countInStock'
                                        value={formData.countInStock}
                                        onChange={handleChange}
                                        placeholder="0"
                                        className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">Category</label>
                            <div className="relative">
                                <LayoutGrid className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                                <select
                                    name='category'
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-zinc-300 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all appearance-none cursor-pointer"
                                >
                                    <option value="" disabled>Select Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat._id} value={cat._id} className="bg-zinc-900 text-white">
                                            {cat.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">Description</label>
                            <textarea
                                name='description'
                                value={formData.description}
                                onChange={handleChange}
                                rows="5"
                                placeholder="Write a detailed description..."
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all resize-none"
                            ></textarea>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateProductPage;