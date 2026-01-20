import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Star, ShoppingBag, Heart, ArrowLeft, Truck, ShieldCheck, RefreshCw, CheckCircle2 } from 'lucide-react';

import { getProductById } from '@/services/productService'; 
import { useAddToCart } from '@/hooks/useAddToCart'; 

const ProductDetailsSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 pt-32 pb-12">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div className="space-y-4">
        <div className="aspect-square bg-slate-900/50 rounded-3xl animate-pulse border border-white/5 shadow-2xl" />
        <div className="flex gap-4 justify-center">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 w-24 bg-slate-900/50 rounded-2xl animate-pulse border border-white/5" />
          ))}
        </div>
      </div>
      <div className="space-y-8">
        <div className="h-4 w-32 bg-slate-800/50 rounded-full animate-pulse" />
        <div className="h-10 w-3/4 bg-slate-800/50 rounded-2xl animate-pulse" />
        <div className="h-6 w-1/4 bg-slate-800/50 rounded-full animate-pulse" />
        <div className="h-32 w-full bg-slate-800/30 rounded-2xl animate-pulse" />
        <div className="h-16 w-full bg-slate-800/50 rounded-2xl animate-pulse" />
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

  const { data, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
  });

  const product = data?.data?.product;

  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
    }
  }, [product]);

  const images = product?.images?.length > 0 ? product.images : [product?.image, product?.image, product?.image];

  const descriptionPoints = product?.description 
    ? product.description.split('. ').filter(point => point.trim().length > 0)
    : ["Experience premium quality with this outstanding product.", "Designed for performance and style.", "Features top-tier materials and cutting-edge technology."];

  if (isLoading) return <div className="min-h-screen bg-[#020617]"><ProductDetailsSkeleton /></div>;
  
  if (isError || !product) return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-red-900/20 rounded-full blur-[100px]" />
        <h2 className="text-3xl font-bold mb-4 z-10">Product not found</h2>
        <button onClick={() => navigate('/shop')} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all z-10 border border-white/10">
            Back to Shop
        </button>
    </div>
  );

  const onAddToCart = async () => {
    let productObj;
        productObj = {
            _id: product._id,
            id: product._id,
            title: product.title,
            image: product.image,
            price: product.price,
            countInStock: product.countInStock || product.stock
        };
    await handleAddToCart(productObj, quantity);
  };

  return (
    <div className="min-h-screen bg-transparent pt-32 pb-20 relative text-slate-200">
      
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <button 
            onClick={() => navigate(-1)} 
            className="group flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/30 border border-white/5 hover:bg-slate-800/50 hover:border-white/20 text-slate-400 hover:text-white mb-8 transition-all duration-300 backdrop-blur-sm w-fit"
        >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Shop</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
            
            <div className="space-y-6">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative aspect-square bg-slate-950/30 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden shadow-2xl group"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/50 to-transparent pointer-events-none z-[1]" />
                    
                    <img 
                        src={selectedImage || product.image} 
                        alt={product.title} 
                        className="relative z-[2] w-full h-full object-contain p-12 group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    
                    {product.countInStock > 0 ? (
                        <div className="absolute top-6 left-6 z-10 flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-xl shadow-lg shadow-emerald-900/20">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            In Stock
                        </div>
                    ) : (
                        <div className="absolute top-6 left-6 z-10 bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-xl">
                            Out of Stock
                        </div>
                    )}
                </motion.div>

                {images && images.length > 1 && (
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide justify-center">
                        {images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedImage(img)}
                                className={`relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-2xl overflow-hidden border transition-all duration-300 ${
                                    selectedImage === img 
                                    ? 'border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)] scale-105 z-10' 
                                    : 'border-white/5 hover:border-white/20 opacity-70 hover:opacity-100 bg-slate-900/50'
                                }`}
                            >
                                <img src={img} alt={`View ${idx}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex flex-col justify-center pt-4">
                
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <span className="h-px w-8 bg-cyan-500/50"></span>
                        <span className="text-cyan-400 font-bold tracking-widest text-xs uppercase shadow-cyan-500/20 drop-shadow-sm">
                            {product.category?.name || "Electronics"}
                        </span>
                    </div>
                    
                    <h1 className="text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-100 to-slate-500 mb-6 leading-tight">
                        {product.title}
                    </h1>

                    <div className="flex items-center gap-4 mb-8 p-3 rounded-2xl bg-white/[0.02] border border-white/5 w-fit">
                        <div className="flex items-center text-amber-400 drop-shadow-lg">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={18} fill={i < (product.rating || 4.5) ? "currentColor" : "none"} className={i < (product.rating || 4.5) ? "" : "text-slate-700"} />
                            ))}
                        </div>
                        <span className="w-px h-4 bg-white/10"></span>
                        <span className="text-slate-400 text-sm font-medium">{product.numReviews || 128} Reviews</span>
                    </div>

                    <div className="flex items-end gap-4 mb-8">
                        <div className="relative">
                            <span className="text-5xl font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                                ${product.price}
                            </span>
                        </div>
                        {product.oldPrice && (
                            <span className="text-xl text-slate-500 line-through mb-2 decoration-slate-600 decoration-2">
                                ${product.oldPrice}
                            </span>
                        )}
                    </div>
                        
                    <div className="mb-10">
                        <span className='block mb-4 text-2xl font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]'>Product Features</span>
                        <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-6">
                            <ul className="space-y-4">
                                {descriptionPoints.map((point, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <div className="mt-1 p-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex-shrink-0">
                                            <CheckCircle2 size={14} />
                                        </div>
                                        <span className="text-slate-300 leading-relaxed text-base">{point}{point.endsWith('.') ? '' : '.'}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="space-y-8 border-t border-white/5 pt-8">
                        
                        <div className="flex flex-col sm:flex-row gap-5 relative z-20">
                            
                            <div className="flex items-center justify-between bg-slate-950/50 border border-white/10 rounded-xl px-2 h-16 w-full sm:w-40 backdrop-blur-sm">
                                <button 
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors text-xl font-medium"
                                >-</button>
                                <span className="text-white font-bold text-lg">{quantity}</span>
                                <button 
                                    onClick={() => setQuantity(q => q + 1)}
                                    className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors text-xl font-medium"
                                >+</button>
                            </div>

                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onAddToCart();
                                }}
                                disabled={product.countInStock === 0}
                                className={`flex-1 h-16 w-full flex items-center justify-center gap-3 rounded-xl font-bold text-lg transition-all duration-300 relative z-20 active:scale-95 
                                    ${product.countInStock > 0 
                                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 lg:hover:from-cyan-500 lg:hover:to-blue-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] lg:hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] lg:hover:-translate-y-1' 
                                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'}`}
                            >
                                <ShoppingBag size={22} className={product.countInStock > 0 ? "animate-pulse" : ""} />
                                {product.countInStock > 0 ? "Add to Cart" : "Out of Stock"}
                            </button>
                            
                            <button className="h-16 w-16 hidden sm:flex flex-shrink-0 items-center justify-center rounded-xl bg-slate-950/30 border border-white/10 text-slate-400 hover:text-pink-500 hover:border-pink-500/30 hover:bg-pink-500/5 transition-all hover:scale-105 active:scale-95 hover:shadow-[0_0_15px_rgba(236,72,153,0.2)]">
                                <Heart size={24} />
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { icon: Truck, label: "Free Shipping", delay: 0 },
                                { icon: ShieldCheck, label: "2 Year Warranty", delay: 0.1 },
                                { icon: RefreshCw, label: "30 Days Return", delay: 0.2 }
                            ].map((feature, idx) => (
                                <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 + feature.delay }}
                                    className="flex flex-col items-center text-center gap-3 p-4 rounded-2xl bg-slate-900/20 border border-white/5 hover:bg-slate-800/40 hover:border-white/10 transition-colors group cursor-default"
                                >
                                    <div className="p-3 rounded-full bg-slate-900/50 group-hover:bg-cyan-500/20 group-hover:text-cyan-400 text-slate-400 transition-colors">
                                        <feature.icon size={20} />
                                    </div>
                                    <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-200 transition-colors">
                                        {feature.label}
                                    </span>
                                </motion.div>
                            ))}
                        </div>

                    </div>
                </motion.div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;