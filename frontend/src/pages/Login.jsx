import React from 'react';
import * as z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginSuccess } from '@/store/authSlice';
import { loginUser } from '@/services/authService';
import { mergeCart } from '@/services/cartService';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
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
    const { control, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: { email: '', password: '' }
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        const toastId = toast.loading('Signing in...');
        try {
            const response = await loginUser(data);
            dispatch(loginSuccess(response));
            toast.success(`Welcome back! 👋`, { id: toastId });
            setTimeout(() => {
                navigate('/');
            }, 800);

            const localCart = JSON.parse(localStorage.getItem('cart')) || [];
            if(localCart.length > 0){
                await mergeCart(localCart, response.token);
                localStorage.removeItem('cart')
            }
            
            navigate('/');
        } catch (err) {
            console.error(err);
            const errorMessage = err.response?.data?.message || "Wrong email or password";           
            toast.error(errorMessage, { id: toastId });
            setError("root", { message: errorMessage });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-md p-8 relative z-10"
            >
                <div className="absolute inset-0 bg-white rounded-3xl border border-slate-100 -z-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"></div>

                <motion.div variants={itemVariants} className="text-center mb-10">
                    <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                        Welcome Back
                    </h2>
                    <p className="text-slate-500 mt-3 text-sm font-medium">
                        Enter your credentials to access your account.
                    </p>
                </motion.div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    <motion.div variants={itemVariants} className="space-y-2">
                        <label htmlFor="email" className="text-sm font-semibold text-slate-700 ml-1">
                            Email Address
                        </label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors duration-300">
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
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all duration-300"
                                    />
                                )}
                            />
                        </div>
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </motion.div>

                    
                    <motion.div variants={itemVariants} className="space-y-2">
                        <label htmlFor="password" className="text-sm font-semibold text-slate-700 ml-1">
                            Password
                        </label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors duration-300">
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
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all duration-300"
                                    />
                                )}
                            />
                        </div>
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </motion.div>

                    <motion.div variants={itemVariants} className="flex justify-end">
                        <a href="#" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors duration-200">
                            Forgot password?
                        </a>
                    </motion.div>

                    
                    <motion.div variants={itemVariants} className="pt-4">
                        <motion.button
                            whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                            whileTap={!isSubmitting ? { scale: 0.96 } : {}}
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full bg-slate-900 hover:bg-blue-600 text-white font-bold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group relative overflow-hidden shadow-lg shadow-slate-900/20 hover:shadow-blue-600/30 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
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
                        <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                            {errors.root.message}
                        </div>
                    )}

                </form>

                <motion.p variants={itemVariants} className="text-center text-sm text-slate-500 mt-8 font-medium">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-bold transition-colors">
                        Create one now
                    </Link>
                </motion.p>

            </motion.div>
        </div>
    );
}

export default Login;