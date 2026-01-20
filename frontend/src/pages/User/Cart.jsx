import EmptyCart from "@/components/checkout/EmptyCart";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from 'framer-motion';
import { clearCartAPI, getCartAPI, removeFromCartAPI, removeFromCartLocal, addToCartLocal, addToCartAPI } from "@/store/slices/cartSlice"; 
import { useEffect, useState } from "react"; 
import { ProductCardSkeleton } from "@/components/products/ProductCard";
import toast from "react-hot-toast";
import { useAddToCart } from "@/hooks/useAddToCart";
import { Link } from "react-router-dom";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react"; 

function Cart (){
    const {cartItems, totalPrice, loading} = useSelector(state => state.cart);
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector(state => state.auth);
    
    const { handleAddToCart } = useAddToCart();
    const [updatingItemId, setUpdatingItemId] = useState(null);

    useEffect(() => {
        if(isAuthenticated){
            dispatch(getCartAPI()); 
        }
    }, [dispatch, isAuthenticated]);
    
    if(loading && !cartItems) return <div className="pt-20 md:pt-32 pb-12 flex justify-center min-h-screen"><ProductCardSkeleton/></div>
    
    if(!cartItems || cartItems.length === 0){
        return <EmptyCart/>
    }

    const onIncreaseQty = async (item, stock) => {
        const pId = isAuthenticated ? item.product._id : item.product;
        if (loading || updatingItemId === pId) return;
        setUpdatingItemId(pId);

        let productObj;
        if (isAuthenticated) {
            productObj = { ...item.product, countInStock: stock };
        } else {
            productObj = {
                _id: item.product,
                id: item.product,
                title: item.name,
                image: item.image,
                price: item.price,
                countInStock: stock
            };
        }

        await handleAddToCart(productObj, 1, false);
        setUpdatingItemId(null);
    };

    const handleDecrement = (itemId, currentQuantity) => {
        if (loading) return;
        if(currentQuantity > 1){
            if(isAuthenticated){
                dispatch(addToCartAPI({ productId: itemId, quantity: -1 }));
            } else {
                const newCart = [...cartItems];
                const itemIndex = newCart.findIndex(item => item.product === itemId);
                if(itemIndex >= 0){
                    newCart[itemIndex] = { ...newCart[itemIndex], quantity: currentQuantity - 1 };
                    dispatch(addToCartLocal(newCart));
                    localStorage.setItem('cart', JSON.stringify(newCart));
                }
            }
        } else {
            handleRemove(itemId);
        }
    }

    const handleRemove = (productId) => {
        if (loading) return; 

        if(isAuthenticated){
            dispatch(removeFromCartAPI(productId))
            .unwrap() 
            .then(() => toast.success("Item removed", { duration: 4000 }))
            .catch((error) => toast.error(error || "Failed", { duration: 4000 }));
        } else {
            dispatch(removeFromCartLocal(productId));
            toast.success("Removed successfully locally", { duration: 4000 });
        }
    }

    const handleClearCart = () => {
        if(isAuthenticated){
            dispatch(clearCartAPI())
            .unwrap()
            .then(() => toast.success("Cart cleared", { duration: 4000 }))
            .catch((error) => toast.error(error, { duration: 4000 }));
        } else {
            dispatch(addToCartLocal([])); 
            localStorage.removeItem('cart');
            toast.success("Cart cleared", { duration: 4000 });
        }
    };

    const subtotal = totalPrice;
    const shippingEstimate = subtotal > 500 ? 0 : 20;
    const taxEstimate = subtotal * 0.10;
    const finalTotal = subtotal + shippingEstimate + taxEstimate;

    return (
    <div className="container mx-auto px-4 pt-20 pb-12 md:pt-32 min-h-screen relative font-sans text-slate-200">
      
      <div className="absolute top-40 right-0 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="flex justify-between items-end mb-8 md:mb-12 border-b border-white/5 pb-6">
          <div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">Shopping Cart</h1>
              <p className="text-slate-400 text-sm md:text-base">Review your selected items</p>
          </div>
          
          <button 
              onClick={handleClearCart}
              className="group flex items-center gap-2 text-sm font-medium text-red-400 hover:text-red-300 bg-red-500/5 hover:bg-red-500/10 px-4 py-2 rounded-xl transition-all border border-transparent hover:border-red-500/20"
          >
              <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Clear Cart</span>
          </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative z-10">
        
        <div className="lg:col-span-8 space-y-4 md:space-y-6">
          <AnimatePresence mode="popLayout">
            {cartItems.map((item) => {
              const isAuthItem = item.product && typeof item.product === 'object';
              
              const productId = isAuthItem ? item.product._id : item.product;
              const title = isAuthItem ? item.product.title : item.name;
              const image = isAuthItem ? item.product.image : item.image;
              const price = isAuthItem ? item.product.price : item.price;
              const category = isAuthItem ? (item.product.category?.name || item.product.category) : "Category";

              const stock = Number(
                  isAuthItem 
                  ? (item.product.countInStock ?? item.product.stock ?? 0)
                  : (item.stock ?? item.countInStock ?? 0)
              );

              const isUpdating = updatingItemId === productId;

              return (
              <motion.div
                key={productId}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                className="group relative overflow-hidden bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/5 hover:border-indigo-500/30 transition-all duration-300 p-4 sm:p-5"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />

                <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                    
                    <div className="w-full sm:w-32 h-32 flex-shrink-0 rounded-2xl bg-slate-950/50 border border-white/5 overflow-hidden">
                      <img 
                          src={image} 
                          alt={title} 
                          className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500" 
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                        
                        <div className="flex justify-between items-start gap-4">
                            <div>
                                <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-1">{category}</p>
                                <Link to={`/product/${productId}`} className="text-lg md:text-xl font-bold text-white hover:text-indigo-300 transition-colors line-clamp-1">
                                  {title}
                                </Link>
                                
                                <div className="mt-2 my-2 text-[11px] font-bold text-slate-400">
                                    {stock > 0 ? (
                                             <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                 <span className="text-[11px] font-bold text-emerald-400 uppercase">In Stock</span>
                                             </div>
                                        ) : (
                                             <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20">
                                                 <span className="text-[11px] font-bold text-red-400 uppercase">Out of Stock</span>
                                             </div>
                                        )}
                                </div>
                            </div>
                            <p className="text-lg md:text-xl font-bold text-white tracking-tight">${price}</p>
                        </div>

                        <div className="flex items-end justify-between mt-4 sm:mt-0">
                            
                            <div className="flex items-center bg-slate-950/50 rounded-xl border border-white/10 p-1">
                                <button 
                                    onClick={() => handleDecrement(productId, item.quantity)} 
                                    disabled={loading}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition disabled:opacity-30"
                                >
                                    <Minus size={14} />
                                </button>
                                
                                <div className="w-8 flex justify-center font-bold text-white text-sm">
                                    {isUpdating ? <span className="animate-pulse">...</span> : item.quantity}
                                </div>
                                
                                <button 
                                    onClick={() => onIncreaseQty(item, stock)} 
                                    disabled={item.quantity >= stock || loading || isUpdating}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition disabled:opacity-30 disabled:hover:bg-transparent"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>

                            <button 
                              onClick={() => handleRemove(productId)}
                              disabled={loading}
                              className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-red-400 transition-colors px-2 py-1 rounded-lg hover:bg-red-500/5"
                            >
                              <Trash2 size={14} />
                              <span>Remove</span>
                            </button>
                        </div>
                    </div>
                </div>
              </motion.div>
            )})}
          </AnimatePresence>
        </div>
        
        <div className="lg:col-span-4">
            <div className="sticky top-20 md:top-32">
                <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-6 sm:p-8">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <ShoppingBag className="text-cyan-400" size={20} />
                      Order Summary
                    </h2>
                    
                    <div className="space-y-4 mb-8">
                        <div className="flex justify-between text-slate-400 text-sm">
                            <span>Subtotal</span>
                            <span className="font-medium text-slate-200">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-slate-400 text-sm">
                            <span>Shipping estimate</span>
                            <span className="font-medium text-emerald-400">{shippingEstimate === 0 ? 'Free' : `$${shippingEstimate}`}</span>
                        </div>
                        <div className="flex justify-between text-slate-400 text-sm">
                            <span>Tax estimate (10%)</span>
                            <span className="font-medium text-slate-200">${taxEstimate.toFixed(2)}</span>
                        </div>
                        
                        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-4" />
                        
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-white">Total</span>
                            <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                              ${finalTotal.toFixed(2)}
                            </span>
                        </div>
                    </div>
                    
                    <Link to={'/checkout'} className="group relative w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-lg text-white overflow-hidden transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] active:scale-[0.98]">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-cyan-600 transition-all group-hover:scale-105" />
                        
                        <span className="relative z-10 flex items-center gap-2">
                          Checkout
                          <ShoppingBag size={18} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                    </Link>
                    
                    <p className="text-center text-xs text-slate-500 mt-4">
                      Secure Checkout - 256-bit SSL Encrypted
                    </p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}
export default Cart;