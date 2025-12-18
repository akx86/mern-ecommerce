import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Eye, Star } from 'lucide-react';

const ProductCard = ({ 
    image, 
    title, 
    price, 
    category,
    rating = 4.5 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      
      whileHover="hover"
      
      className="group relative w-full h-[400px] rounded-[2rem] overflow-hidden cursor-pointer bg-slate-900 shadow-xl"
    >
        <div className="absolute inset-0 w-full h-full overflow-hidden">
            <motion.img 
                variants={{
                    hover: { scale: 1.1 }
                }}
                transition={{ duration: 0.6 }}
                src={image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000"} 
                alt={title}
                className="w-full h-full object-cover opacity-90 transition-opacity duration-500 group-hover:opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />
        </div>

        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2  rounded-full font-bold text-sm shadow-lg">
                ${price}
            </div>
            <motion.button 
                whileTap={{ scale: 0.9 }}
                className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white hover:text-red-500 transition-colors"
            >
                <Heart size={18} />
            </motion.button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
            
            <motion.div 
                variants={{
                    hover: { y: -5 }
                }}
                transition={{ duration: 0.3 }}
            >
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider bg-blue-500/10 px-2 py-1 rounded">
                        {category || "Fashion"}
                    </span>
                    <div className="flex items-center gap-1 text-yellow-400">
                        <Star size={12} fill="currentColor" />
                        <span className="text-xs font-medium text-slate-300">{rating}</span>
                    </div>
                </div>
                <h3 className="text-2xl font-bold text-white leading-tight line-clamp-2 mb-3">
                    {title || "Product Name"}
                </h3>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                variants={{
                    hover: { opacity: 1, height: 'auto' }
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex gap-3"
            >
                <button className="flex-1 bg-white text-slate-900 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-500 hover:text-white transition-all shadow-lg active:scale-95">
                    <ShoppingBag size={18} />
                    <span>Add to Cart</span>
                </button>
                
                <button className="px-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all active:scale-95">
                    <Eye size={20} />
                </button>
            </motion.div>
        </div>
    </motion.div>
  );
};
export const ProductCardSkeleton = () => {
  return (
    <div className="w-full h-[400px] rounded-[2rem] bg-slate-800/50 animate-pulse relative overflow-hidden">
      <div className="absolute top-4 left-4 right-4 flex justify-between">
        <div className="h-8 w-16 bg-slate-700 rounded-full"></div>
        <div className="h-10 w-10 bg-slate-700 rounded-full"></div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
        <div className="h-4 w-20 bg-slate-700 rounded"></div>
        <div className="h-8 w-3/4 bg-slate-700 rounded"></div>
        <div className="h-12 w-full bg-slate-700 rounded-xl mt-4"></div>
      </div>
    </div>
  );
};

export default ProductCard;