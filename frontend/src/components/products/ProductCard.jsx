import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Eye, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAddToCart } from '@/hooks/useAddToCart';

const ProductCard = (props) => {
    const data = props.item || props.product || props;
    if (!data || (!data._id && !data.id)) return null;

    const productId = data._id || data.id;
    
    const { 
        image, 
        title, 
        price, 
        category, 
        rating = 4.5, 
        countInStock 
    } = data;
    
    const stock = Number(countInStock ?? data.stock ?? 0);
    const { handleAddToCart } = useAddToCart();
    
    const onAdd = (e) => {
        e.preventDefault(); 
        handleAddToCart(data);
    };
    
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover="hover"
      className="group relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-slate-900 border border-white/5 shadow-xl transition-all duration-300"
    >
        <div className="absolute inset-0 w-full h-full overflow-hidden">
            <Link to={`/product/${productId}`} className="block w-full h-full">
                <motion.img 
                    variants={{ hover: { scale: 1.1 } }}
                    transition={{ duration: 0.6 }}
                    src={image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000"} 
                    alt={title}
                    className="w-full h-full object-cover opacity-90 transition-opacity duration-500 group-hover:opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-80" />
            </Link>
        </div>

        <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-20 pointer-events-none">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-3 py-1.5 rounded-xl font-bold text-sm shadow-lg pointer-events-auto">
                ${price}
            </div>
            <motion.button 
                whileTap={{ scale: 0.9 }}
                className="p-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white hover:text-red-500 transition-colors pointer-events-auto cursor-pointer"
            >
                <Heart size={16} />
            </motion.button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
            <motion.div 
                variants={{ hover: { y: -5 } }}
                transition={{ duration: 0.3 }}
            >
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider bg-blue-500/10 px-2 py-0.5 rounded">
                        {category?.title || category?.name || "Uncategorized"}
                    </span>
                    <div className="flex items-center gap-1 text-yellow-400">
                        <Star size={12} fill="currentColor" />
                        <span className="text-xs font-medium text-slate-300">{rating}</span>
                    </div>
                </div>
                
                <Link to={`/product/${productId}`}>
                    <h3 className="text-base font-bold text-white leading-tight line-clamp-1 mb-2 hover:text-blue-400 transition-colors">
                        {title || "Product Name"}
                    </h3>
                </Link>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                variants={{ hover: { opacity: 1, height: 'auto' } }}
                transition={{ duration: 0.4 }}
                className="flex gap-2"
            >
                <button
                 onClick={onAdd}
                 disabled={stock <= 0}
                 className={`flex-1 font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 text-xs
                    ${stock <= 0 ? 'bg-gray-500 cursor-not-allowed text-gray-300' : 'bg-white text-slate-900 hover:bg-blue-500 hover:text-white'}
                 `}>
                    <ShoppingBag size={16} />
                    <span>{stock <= 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                </button>
                
                <Link to={`/product/${productId}`} className="px-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all active:scale-95 flex items-center justify-center">
                    <Eye size={18} />
                </Link>
            </motion.div>
        </div>
    </motion.div>
  );
};

export const ProductCardSkeleton = () => {
    return (
      <div className="w-full aspect-[4/5] rounded-2xl bg-slate-800/50 animate-pulse relative overflow-hidden">
        <div className="bg-slate-700 w-full h-full"></div>
      </div>
    );
};

export default ProductCard;