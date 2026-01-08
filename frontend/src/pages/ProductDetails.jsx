import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Star, ShoppingBag, Heart, Share2, ArrowLeft, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

// Imports from your project
import { getProductById } from '@/services/productService'; // تأكد إن الدالة دي موجودة
import { useAddToCart } from '@/hooks/useAddToCart'; // الهوك اللي انت عامله

// --- Skeleton Loader Component ---
const ProductDetailsSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 pt-32 pb-12">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Image Skeleton */}
      <div className="space-y-4">
        <div className="aspect-square bg-slate-900/50 rounded-2xl animate-pulse border border-white/5" />
        <div className="flex gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 w-20 bg-slate-900/50 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
      {/* Info Skeleton */}
      <div className="space-y-6">
        <div className="h-4 w-32 bg-slate-900/50 rounded animate-pulse" />
        <div className="h-10 w-3/4 bg-slate-900/50 rounded animate-pulse" />
        <div className="h-6 w-1/4 bg-slate-900/50 rounded animate-pulse" />
        <div className="h-32 w-full bg-slate-900/50 rounded animate-pulse" />
        <div className="h-14 w-full bg-slate-900/50 rounded animate-pulse" />
      </div>
    </div>
  </div>
);

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleAddToCart } = useAddToCart();
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { isAuthenticated } = useSelector(state => state.auth);

  // 1. Fetch Product Data
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
  });

  const product = data?.data?.product;

  // Set default image when product loads
  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
    }
  }, [product]);

  // Images Array (If your API returns multiple images, use them here. 
  // If not, we'll simulate thumbnails using the main image for design demo)
  const images = product?.images?.length > 0 ? product.images : [product?.image, product?.image, product?.image];

  if (isLoading) return <div className="min-h-screen bg-[#020617]"><ProductDetailsSkeleton /></div>;
  
  if (isError || !product) return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-white">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <button onClick={() => navigate('/shop')} className="text-indigo-400 hover:underline">Back to Shop</button>
    </div>
  );

  // Add To Cart Handler
  const onAddToCart = async () => {
    let productObj;
    if (isAuthenticated) {
        productObj = { ...product }; // Backend logic handles ID
    } else {
        productObj = {
            _id: product._id,
            id: product._id,
            title: product.title,
            image: product.image,
            price: product.price,
            countInStock: product.countInStock || product.stock
        };
    }
    await handleAddToCart(productObj, quantity);
  };

  return (
    // [BACKGROUND] Deep Dark Theme
    <div className="min-h-screen bg-[#020617] pt-28 pb-12 relative overflow-hidden text-slate-200">
      
      {/* Ambient Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Back Button */}
        <button 
            onClick={() => navigate(-1)} 
            className="group flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
        >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Shop</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            
            {/* ---------------- LEFT: IMAGE GALLERY ---------------- */}
            <div className="space-y-6">
                {/* Main Image Container (Glassy Border) */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative aspect-square bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/5 overflow-hidden shadow-2xl"
                >
                    <img 
                        src={selectedImage || product.image} 
                        alt={product.title} 
                        className="w-full h-full object-contain p-8 hover:scale-110 transition-transform duration-700"
                    />
                    
                    {/* Floating Badges */}
                    {product.countInStock > 0 ? (
                        <div className="absolute top-4 left-4 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                            In Stock
                        </div>
                    ) : (
                        <div className="absolute top-4 left-4 bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                            Out of Stock
                        </div>
                    )}
                </motion.div>

                {/* Thumbnails */}
                {images && images.length > 1 && (
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                        {images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedImage(img)}
                                className={`relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                                    selectedImage === img 
                                    ? 'border-indigo-500 ring-4 ring-indigo-500/20' 
                                    : 'border-white/5 hover:border-white/20'
                                }`}
                            >
                                <img src={img} alt={`View ${idx}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* ---------------- RIGHT: PRODUCT INFO ---------------- */}
            <div className="flex flex-col justify-center">
                
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {/* Category */}
                    <span className="text-indigo-400 font-bold tracking-wider text-sm uppercase">
                        {product.category?.name || "Electronics"}
                    </span>
                    
                    {/* Title */}
                    <h1 className="text-3xl md:text-5xl font-black text-white mt-2 mb-4 leading-tight">
                        {product.title}
                    </h1>

                    {/* Rating & Reviews */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center text-amber-400">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={18} fill={i < (product.rating || 4.5) ? "currentColor" : "none"} className={i < (product.rating || 4.5) ? "" : "text-slate-600"} />
                            ))}
                        </div>
                        <span className="text-slate-400 text-sm font-medium">({product.numReviews || 128} reviews)</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-end gap-4 mb-8">
                        <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">
                            ${product.price}
                        </span>
                        {product.oldPrice && (
                            <span className="text-xl text-slate-500 line-through mb-1">
                                ${product.oldPrice}
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    <p className="text-slate-400 leading-relaxed mb-8 border-b border-white/5 pb-8">
                        {product.description || "Experience premium quality with this outstanding product. Designed for performance and style, it features top-tier materials and cutting-edge technology."}
                    </p>

                    {/* Actions Area */}
                    <div className="space-y-6">
                        
                        {/* Quantity & Add to Cart */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            
                            {/* Quantity Selector */}
                            <div className="flex items-center bg-slate-900/50 border border-white/10 rounded-xl px-4 h-14 w-fit">
                                <button 
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    className="text-slate-400 hover:text-white transition-colors text-xl font-medium w-8"
                                >-</button>
                                <span className="text-white font-bold w-12 text-center">{quantity}</span>
                                <button 
                                    onClick={() => setQuantity(q => q + 1)} // Add logic for max stock if needed
                                    className="text-slate-400 hover:text-white transition-colors text-xl font-medium w-8"
                                >+</button>
                            </div>

                            {/* Add to Cart Button */}
                            <button
                                onClick={onAddToCart}
                                disabled={product.countInStock === 0}
                                className={`flex-1 h-14 flex items-center justify-center gap-2 rounded-xl font-bold text-lg transition-all shadow-lg shadow-indigo-500/20 
                                    ${product.countInStock > 0 
                                        ? 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white hover:scale-[1.02] active:scale-95' 
                                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
                            >
                                <ShoppingBag size={20} />
                                {product.countInStock > 0 ? "Add to Cart" : "Out of Stock"}
                            </button>
                            
                            {/* Wishlist Button (Icon only) */}
                            <button className="h-14 w-14 flex items-center justify-center rounded-xl bg-slate-900/50 border border-white/10 text-slate-400 hover:text-red-400 hover:border-red-500/30 transition-all hover:scale-105 active:scale-95">
                                <Heart size={24} />
                            </button>
                        </div>

                        {/* Features / Assurance */}
                        <div className="grid grid-cols-3 gap-4 pt-4">
                            <div className="flex flex-col items-center text-center gap-2 p-4 rounded-2xl bg-slate-900/30 border border-white/5">
                                <Truck size={24} className="text-indigo-400" />
                                <span className="text-xs font-medium text-slate-300">Free Shipping</span>
                            </div>
                            <div className="flex flex-col items-center text-center gap-2 p-4 rounded-2xl bg-slate-900/30 border border-white/5">
                                <ShieldCheck size={24} className="text-indigo-400" />
                                <span className="text-xs font-medium text-slate-300">2 Year Warranty</span>
                            </div>
                            <div className="flex flex-col items-center text-center gap-2 p-4 rounded-2xl bg-slate-900/30 border border-white/5">
                                <RefreshCw size={24} className="text-indigo-400" />
                                <span className="text-xs font-medium text-slate-300">30 Days Return</span>
                            </div>
                        </div>

                    </div>
                </motion.div>
            </div>
        </div>

        {/* --- Optional: Related Products or Detailed Specs Section could go here --- */}
        
      </div>
    </div>
  );
}

export default ProductDetails;