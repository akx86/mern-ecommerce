import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, ShoppingBag, Package } from 'lucide-react';

const CheckoutSuccess = () => {
    return (
        <div className="min-h-screen bg-[#0f0f13] text-white flex items-center justify-center p-4 relative overflow-hidden">
            
            {/* Background Effects (Glows) */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-600/20 rounded-full blur-[100px] pointer-events-none" />

            {/* Success Card */}
            <div className="relative z-10 max-w-md w-full bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12 text-center shadow-2xl transform transition-all hover:scale-[1.01]">
                
                {/* Decorative Top Line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500 opacity-70" />

                {/* Animated Icon */}
                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-green-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
                        <CheckCircle className="w-24 h-24 text-green-400 relative z-10 drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]" />
                        
                        {/* Floating Particles (Optional CSS decoration) */}
                        <div className="absolute -top-2 -right-2 w-3 h-3 bg-cyan-400 rounded-full animate-bounce"></div>
                        <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
                    </div>
                </div>

                {/* Text Content */}
                <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    Order Placed!
                </h1>
                <p className="text-gray-400 mb-8 leading-relaxed">
                    Thank you for your purchase. Your order has been placed successfully and is now being processed.
                </p>

                {/* Action Buttons */}
                <div className="space-y-4">
                    <Link 
                        to="/my-orders" 
                        className="group w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-900/20"
                    >
                        <Package size={20} />
                        View My Orders
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link 
                        to="/shop" 
                        className="w-full flex items-center justify-center gap-2 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-300 font-medium rounded-xl transition-all"
                    >
                        <ShoppingBag size={20} />
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CheckoutSuccess;