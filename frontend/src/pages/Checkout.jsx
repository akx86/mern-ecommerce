import React, { useState } from 'react';
import { MapPin, Truck, ShieldCheck, Globe } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder } from '@/services/orderService';
import toast from 'react-hot-toast';
import { Navigate, useNavigate } from 'react-router-dom';
import { clearCart, saveShippingAddress } from '@/store/slices/cartSlice';
const CheckoutPage = () => {
   const navigate = useNavigate();
   const dispatch = useDispatch()
    const {cartItems, shippingAddress} = useSelector((state) => state.cart);

   const subtotal = cartItems.reduce((acc, item) => {
        const price = item.product?.price || item.price || 0; 
        const qty = item.quantity || 0;
        return acc + (price * qty);
    }, 0);
    const shippingPrice = subtotal >500 ? 0 : 50
    const taxEstimate = subtotal * 0.10;
    const totalPrice = subtotal + shippingPrice +taxEstimate
    

    const [formData,setFormData] = useState({
        address:shippingAddress?.address || '',
        phone : shippingAddress?.phone || '',
        postalCode:shippingAddress?.postalCode || '',
        city : shippingAddress?.city || '',
        country:shippingAddress?.country || ''
    })

    const handleChange = (e) => {
        setFormData({...formData , [e.target.name]: e.target.value})
    }
    
    const handlePlaceOrder = async ()=> {
        if(cartItems.length === 0){
            toast.error('your cart is empity')
            return;
        }
        if(!formData){
            toast.error('complete form please')
            return;
        }
        dispatch(saveShippingAddress(formData))
        const formattedOrderItems = cartItems.map((item) => {
        return {
        name: item.product?.title,
        quantity: Number(item.quantity),    
        image: item.product?.image,
        price: item.product?.price,
        product: item.product?._id      
    };
});
    const orderData = {
    orderItems: formattedOrderItems,
    shippingAddress: formData,     // دي مظبوطة لأن المفاتيح (address, city...) زي الموديل
    paymentMethod: 'COD',          // أو 'Cash', المهم سترينج زي ما الموديل طالب
    itemsPrice: subtotal,          // (اختياري) لو عايز تخزنه
    taxPrice: taxEstimate,                   // الموديل طالبها (ممكن تحسب ضريبة 14% لو عايز)
    shippingPrice: shippingPrice,  // اللي حسبناها فوق
    totalPrice: totalPrice,        // الإجمالي النهائي
};
    try{
        const res = await  createOrder(orderData)
        toast.success("Order placed successfully! 🎉")
        navigate('/success')
        dispatch(clearCart)
    }catch(err){
        console.error(err)
        toast.error(err.response?.data?.message || "Failed to place order");
    }

    }
    return (
        <div className="min-h-screen bg-[#0f0f13] pt-20 pb-12 text-white relative overflow-hidden selection:bg-cyan-500 selection:text-black">
            
            {/* Background Glows */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-600/20 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

            <div className="container mx-auto px-4 py-12 relative z-10">
                
                {/* Header */}
                <h1 className="text-4xl md:text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 tracking-tighter">
                    SECURE CHECKOUT
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* === Left Section: Shipping Form === */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                            
                            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                                <MapPin className="text-cyan-400 w-6 h-6" />
                                <h2 className="text-xl font-semibold tracking-wide text-gray-100">SHIPPING DETAILS</h2>
                            </div>

                            <form className="space-y-5 relative z-10">
                                {/* Address */}
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-gray-400 ml-1">Street Address</label>
                                    <input type="text" name="address" value={formData.address} onChange={handleChange} required placeholder="123 Cyber Avenue" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-gray-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-gray-600" />
                                </div>

                                {/* City & Postal Code */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase tracking-widest text-gray-400 ml-1">City</label>
                                        <input type="text" name="city" value={formData.city} onChange={handleChange} required placeholder="Cairo" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-gray-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-gray-600" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase tracking-widest text-gray-400 ml-1">Postal Code</label>
                                        <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} required placeholder="11511" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-gray-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-gray-600" />
                                    </div>
                                </div>

                                {/* Phone & Country */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase tracking-widest text-gray-400 ml-1">Phone Number</label>
                                        <input type="text" name="phone" value={formData.phone} onChange={handleChange} required placeholder="+20 1xxxxxxxxx" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-gray-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-gray-600" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase tracking-widest text-gray-400 ml-1">Country</label>
                                        <div className="relative">
                                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                            <input type="text" name="country" value={formData.country} onChange={handleChange} required placeholder="Egypt" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-gray-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-gray-600" />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* === Right Section: Order Summary (الحتة اللي كانت ناقصة) === */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl sticky top-4">
                            
                            <h2 className="text-xl font-semibold tracking-wide text-gray-100 mb-6 border-b border-white/10 pb-4">ORDER SUMMARY</h2>

                            {/* 1. Items List */}
                            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {cartItems.length === 0 ? (
                                    <p className="text-gray-400 text-center py-4">Your cart is empty</p>
                                ) : (
                                    cartItems.map((item, index) => (
                                        <div key={index} className="flex gap-4 items-center bg-white/5 p-3 rounded-lg border border-white/5">
                                            <img src={item.product?.image} alt={item.product?.title} className="w-12 h-12 rounded-md object-cover border border-white/10" />
                                            <div className="flex-1">
                                                <h4 className="text-sm font-medium text-gray-200 line-clamp-1">{item.product?.title}</h4>
                                                <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                                            </div>
                                            <div className="text-cyan-400 font-mono text-sm">${(item.quantity * item.product?.price).toFixed(2)}</div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* 2. Cost Breakdown (دي اللي كانت ممسوحة) */}
                            <div className="space-y-3 border-t border-white/10 pt-4 mb-6">
                                <div className="flex justify-between text-gray-400 text-sm">
                                    <span>Subtotal</span>
                                    <span className="font-mono text-white">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-400 text-sm">
                                    <span>Shipping</span>
                                    <span className="font-mono text-white">{shippingPrice === 0 ? 'Free' : `$${shippingPrice}`}</span>
                                </div>
                                <div className="flex justify-between text-gray-400 text-sm">
                                    <span>taxEstimate (10%)</span>
                                    <span className="font-mono text-white">${taxEstimate}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-white mt-4">
                                    <span>Total</span>
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 font-mono">
                                        ${totalPrice.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            {/* 3. Button (وده كمان كان ممسوح) */}
                            <button onClick={handlePlaceOrder} className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all transform hover:scale-[1.02] active:scale-[0.98] flex justify-center items-center gap-2 group">
                                CONFIRM ORDER
                                <Truck className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                                <ShieldCheck className="w-4 h-4" />
                                <span>Secure Encrypted Transaction</span>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;