import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, ShoppingBag, Package } from 'lucide-react';
import { motion } from 'framer-motion';

const CheckoutSuccess = () => {
    return (
        <div className="w-full min-h-[60vh] flex items-center justify-center p-4 relative overflow-hidden font-sans text-slate-200">
            
            {/* Background Effects (Glows) */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="relative z-10 max-w-md w-full bg-slate-900/50 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12 text-center shadow-2xl"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-cyan-500 to-indigo-500 opacity-50" />

                <div className="mb-8 flex justify-center relative">
                    <div className="relative flex items-center justify-center w-24 h-24">
                        <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" />
                        <div className="absolute inset-4 bg-emerald-500/40 rounded-full blur-md" />
                        
                        <div className="relative w-20 h-20 bg-gradient-to-tr from-emerald-500 to-emerald-400 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
                            <Check className="w-10 h-10 text-white stroke-[3]" />
                        </div>

                        <motion.div 
                            animate={{ y: [-5, 5, -5] }} 
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute -top-2 -right-2 w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]" 
                        />
                        <motion.div 
                            animate={{ y: [5, -5, 5] }} 
                            transition={{ duration: 2.5, repeat: Infinity }}
                            className="absolute -bottom-2 -left-2 w-2 h-2 bg-purple-400 rounded-full shadow-[0_0_10px_rgba(192,132,252,0.8)]" 
                        />
                    </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 tracking-tight">
                    Order Confirmed!
                </h1>
                <p className="text-slate-400 mb-8 leading-relaxed text-sm sm:text-base">
                    Thank you for your purchase. We've received your order and it will be shipped shortly.
                </p>

                <div className="space-y-4">
                    <Link 
                        to="/my-orders" 
                        className="group w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-900/20 active:scale-[0.98]"
                    >
                        <Package size={20} />
                        View My Orders
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link 
                        to="/shop" 
                        className="w-full flex items-center justify-center gap-2 py-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 text-slate-300 font-medium rounded-xl transition-all active:scale-[0.98]"
                    >
                        <ShoppingBag size={20} />
                        Continue Shopping
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default CheckoutSuccess;