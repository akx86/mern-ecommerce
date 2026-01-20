import React from 'react';
import * as z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';

import { loginSuccess } from '@/store/slices/authSlice';
import { loginUser } from '@/services/authService';
import {  getCartAPI, mergeCartAPI } from '@/store/slices/cartSlice';

const formSchema = z.object({
    email: z.string().trim().email({ message: 'Invalid email address' }),
    password: z.string().trim().min(6, { message: 'Password must be at least 6 characters long' })
});

const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut", when: "beforeChildren", staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { control, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: { email: '', password: '' }
    });
    const onSubmit = async (data) => {
        const toastId = toast.loading('Signing in...');

        try {
            const response = await loginUser(data);
            dispatch(loginSuccess(response));

            const localCart = JSON.parse(localStorage.getItem('cart')) || []; 

            if (localCart.length > 0) {
                try {
                   const itemsToMerge = localCart.map(item => ({
                    product: item.product, 
                    quantity: item.quantity
                }));
                    await dispatch(mergeCartAPI(itemsToMerge)).unwrap();
                    localStorage.removeItem('cart');
                } catch (mergeError) {
                    console.error("Merge failed", mergeError);
                }
            }
            dispatch(getCartAPI());
            toast.success(`Welcome back! 👋`, { id: toastId });
            setTimeout(() => {
                const origin = location.state?.from?.pathname;
                const defaultRedirect = response?.data?.user?.isAdmin ? '/admin' : '/';
                navigate(origin || defaultRedirect, { replace: true });
            }, 500);

        } catch (err) {
            console.error(err);
            const errorMessage = err.response?.data?.message || "Wrong email or password";          
            toast.error(errorMessage, { id: toastId });
            setError("root", { message: errorMessage });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#020617] relative overflow-hidden">
            
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none"></div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-md p-8 relative z-10"
            >
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl -z-10 shadow-2xl shadow-black/50"></div>

                <motion.div variants={itemVariants} className="text-center mb-10">
                    <h2 className="text-4xl font-extrabold text-white tracking-tight">
                        Welcome Back
                    </h2>
                    <p className="text-slate-400 mt-3 text-sm font-medium">
                        Enter your credentials to access your account.
                    </p>
                </motion.div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    <motion.div variants={itemVariants} className="space-y-2">
                        <label htmlFor="email" className="text-sm font-semibold text-slate-300 ml-1">
                            Email Address
                        </label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors duration-300">
                                <Mail size={20} strokeWidth={1.5} />
                            </div>

                            <Controller
                                name="email"
                                control={control} 
                                render={({ field }) => (
                                    <motion.input
                                        {...field} 
                                        whileFocus={{ scale: 1.01 }} 
                                        type="email"
                                        id="email"
                                        placeholder="you@example.com"
                                        className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-slate-600 outline-none focus:border-indigo-500/50 focus:bg-slate-900/80 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300"
                                    />
                                )}
                            />
                        </div>
                        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                    </motion.div>

                    
                    <motion.div variants={itemVariants} className="space-y-2">
                        <label htmlFor="password" className="text-sm font-semibold text-slate-300 ml-1">
                            Password
                        </label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors duration-300">
                                <Lock size={20} strokeWidth={1.5} />
                            </div>

                            <Controller
                                name="password"
                                control={control}
                                render={({ field }) => (
                                    <motion.input
                                        {...field}
                                        whileFocus={{ scale: 1.01 }} 
                                        type="password"
                                        id="password"
                                        placeholder="••••••••"
                                        className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-slate-600 outline-none focus:border-indigo-500/50 focus:bg-slate-900/80 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300"
                                    />
                                )}
                            />
                        </div>
                        {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
                    </motion.div>

                    <motion.div variants={itemVariants} className="flex justify-end">
                        <a href="#" className="text-sm font-medium text-slate-400 hover:text-indigo-400 transition-colors duration-200">
                            Forgot password?
                        </a>
                    </motion.div>

                    
                    <motion.div variants={itemVariants} className="pt-4">
                        <motion.button
                            whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                            whileTap={!isSubmitting ? { scale: 0.96 } : {}}
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group relative overflow-hidden shadow-lg shadow-indigo-500/20 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? (
                                <div className="flex items-center justify-center gap-2">
                                    <Loader2 className="animate-spin" size={20} />
                                    <span>Signing in...</span>
                                </div>
                            ) : (
                                <>
                                    <span className="relative z-10">Sign In</span>
                                    <ArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" size={20} />
                                    <div className="absolute inset-0 h-full w-full scale-0 rounded-xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/10"></div>
                                </>
                            )}
                        </motion.button>
                    </motion.div>

                    {errors.root && (
                        <div className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 p-2 rounded-lg">
                            {errors.root.message}
                        </div>
                    )}

                </form>

                <motion.p variants={itemVariants} className="text-center text-sm text-slate-500 mt-8 font-medium">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">
                        Create one now
                    </Link>
                </motion.p>

            </motion.div>
        </div>
    );
}

export default Login;