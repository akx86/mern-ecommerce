import EmptyCart from "@/components/layout/EmptyCart";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from 'framer-motion';
import { clearCartAPI, getCartAPI, removeFromCartAPI, removeFromCartLocal, addToCartLocal, addToCartAPI } from "@/store/slices/cartSlice"; 
import { useEffect, useState } from "react"; 
import { ProductCardSkeleton } from "@/components/layout/ProductCard";
import toast from "react-hot-toast";
import { useAddToCart } from "@/hooks/useAddToCart";
import { Link } from "react-router-dom";

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
    
    // [MODIFIED] Skeleton Background
    if(loading && !cartItems) return <div className="py-20 flex justify-center bg-[#020617] min-h-screen"><ProductCardSkeleton/></div>
    
    if(!cartItems || cartItems.length === 0){
        // تأكد ان EmptyCart واخد ستايل Dark برضه أو شفاف
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
            .then(() => toast.success("Item removed"))
            .catch((error) => toast.error(error || "Failed"));
        } else {
            dispatch(removeFromCartLocal(productId));
            toast.success("Removed successfully locally");
        }
    }

    const handleClearCart = () => {
        if(isAuthenticated){
            dispatch(clearCartAPI())
            .unwrap()
            .then(() => toast.success("Cart cleared"))
            .catch((error) => toast.error(error));
        } else {
            dispatch(addToCartLocal([])); 
            localStorage.removeItem('cart');
            toast.success("Cart cleared");
        }
    };

    const subtotal = totalPrice;
    const shippingEstimate = subtotal > 500 ? 0 : 20;
    const taxEstimate = subtotal * 0.10;
    const finalTotal = subtotal + shippingEstimate + taxEstimate;

    return (
    // [MODIFIED] Background: Dark Theme
    <div className="bg-[#020617] min-h-screen pt-28 pb-12 relative overflow-hidden">
      
      {/* Background Glows (Optional for consistency) */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-900/10 to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="flex justify-between items-end mb-8 border-b border-white/5 pb-6">
            <h1 className="text-3xl font-black text-white tracking-tight">Shopping Cart</h1>
            <button 
                onClick={handleClearCart}
                className="text-red-400 hover:text-red-300 font-medium flex items-center gap-2 transition-colors text-sm bg-red-500/10 px-3 py-1.5 rounded-lg hover:bg-red-500/20"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear Cart
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-8 space-y-4">
            <AnimatePresence>
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  // [MODIFIED] Item Card: Glass Dark
                  className="group flex flex-col sm:flex-row items-center gap-6 p-5 bg-slate-900/40 rounded-2xl border border-white/5 shadow-lg hover:border-white/10 transition-all duration-300"
                >
                  <div className="w-full sm:w-28 h-28 flex-shrink-0 overflow-hidden rounded-xl bg-slate-800 border border-white/5">
                    <img src={image} alt={title} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100" />
                  </div>

                  <div className="flex-1 text-center sm:text-left space-y-1">
                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">{category}</p>
                    <h3 className="text-lg font-bold text-white leading-tight">{title}</h3>
                    
                    {stock > 0 ? (
                         <p className="text-emerald-400 text-xs font-medium bg-emerald-400/10 inline-block px-2 py-0.5 rounded-full">In Stock ({stock})</p>
                    ) : (
                         <p className="text-red-400 text-xs font-medium bg-red-400/10 inline-block px-2 py-0.5 rounded-full">Out of Stock</p>
                    )}
                    
                    <p className="sm:hidden text-lg font-bold text-white mt-2">${price}</p>
                  </div>

                  <div className="flex flex-col items-center sm:items-end gap-4 w-full sm:w-auto">
                    
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-white/10 rounded-lg bg-slate-950/50 p-1">
                        
                        <button 
                            onClick={() => handleDecrement(productId, item.quantity)} 
                            disabled={loading}
                            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 rounded-md transition disabled:opacity-50"
                        >
                            -
                        </button>
                        
                        <span className="w-10 text-center text-sm font-bold text-white">
                            {isUpdating ? "..." : item.quantity}
                        </span>
                        
                        <button 
                            onClick={() => onIncreaseQty(item, stock)} 
                            disabled={item.quantity >= stock || loading || isUpdating}
                            className={`w-8 h-8 flex items-center justify-center rounded-md transition 
                                ${(item.quantity >= stock || loading || isUpdating)
                                    ? 'text-slate-600 cursor-not-allowed' 
                                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            +
                        </button>
                      </div>

                      <p className="hidden sm:block text-lg font-bold text-white w-24 text-right">
                        ${(price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    <button 
                    onClick={() => handleRemove(productId)}
                    disabled={loading}
                      className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-red-400 transition-colors disabled:opacity-50 border border-transparent hover:border-red-500/20 px-2 py-1 rounded-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Remove</span>
                    </button>
                  </div>

                </motion.div>
              )})}
            </AnimatePresence>
          </div>
          
          <div className="lg:col-span-4">
              <div className="sticky top-28">
                  {/* [MODIFIED] Summary Card: Dark Glass */}
                  <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-xl border border-white/10 p-8">
                      <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
                      
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
                          <div className="border-t border-white/10 pt-4 flex justify-between items-center mt-4">
                              <span className="text-lg font-bold text-white">Order Total</span>
                              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">${finalTotal.toFixed(2)}</span>
                          </div>
                      </div>
                      
                      <Link to={'/checkout'} className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
                          Checkout
                      </Link>
                  </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Cart;