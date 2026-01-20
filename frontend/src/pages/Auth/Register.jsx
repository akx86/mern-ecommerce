import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'; 
import { useForm, Controller } from 'react-hook-form'; 
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from 'zod';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { User, Mail, Lock, ArrowRight, Loader2, ImageIcon, Upload } from 'lucide-react';

import { registerUser } from '@/services/authService';
import { loginSuccess } from '@/store/slices/authSlice';

const registerSchema = z.object({
    name: z.string().min(3, { message: "Name must be at least 3 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    passwordConfirm: z.string()
}).refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match",
    path: ["passwordConfirm"], 
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

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const fileInputRef = useRef(null);

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            passwordConfirm: ''
        }
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const onSubmit = async (data) => {
        const toastId = toast.loading('Creating your account...');

        try {
            const dataToSend = new FormData();
            dataToSend.append('name', data.name);
            dataToSend.append('email', data.email);
            dataToSend.append('password', data.password);
            dataToSend.append('passwordConfirm', data.passwordConfirm);
            
            if (imageFile) {
                dataToSend.append('profileImg', imageFile);
            }

            const response = await registerUser(dataToSend);

            dispatch(loginSuccess(response)); 
            
            toast.success(`Welcome, ${response.data.user.name}! 🎉`, { id: toastId });

            setTimeout(() => {
                navigate('/'); 
            }, 500);

        } catch (err) {
            console.error(err);
            const errorMessage = err.response?.data?.message || "Registration failed";
            toast.error(errorMessage, { id: toastId });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#020617] relative overflow-hidden p-4">
            
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none"></div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-md p-8 relative z-10"
            >
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl -z-10 shadow-2xl shadow-black/50"></div>

                <motion.div variants={itemVariants} className="text-center mb-8">
                    <h2 className="text-4xl font-extrabold text-white tracking-tight">
                        Create Account
                    </h2>
                    <p className="text-slate-400 mt-3 text-sm font-medium">
                        Join us and start your journey today.
                    </p>
                </motion.div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                    <motion.div variants={itemVariants} className="flex justify-center mb-6">
                        <div 
                            className="relative group cursor-pointer"
                            onClick={() => fileInputRef.current.click()}
                        >
                            <div className={`w-24 h-24 rounded-full bg-slate-950/50 border flex items-center justify-center overflow-hidden transition-all duration-300 ${imagePreview ? 'border-indigo-500' : 'border-white/10 group-hover:border-indigo-500/50'}`}>
                                {imagePreview ? (
                                   <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                   <ImageIcon className="text-slate-500 group-hover:text-indigo-400 transition-colors" size={32} />
                                )}
                            </div>
                            
                            <div className="absolute bottom-0 right-0 bg-indigo-600 p-1.5 rounded-full border-2 border-[#020617]">
                                <Upload size={14} className="text-white" />
                            </div>
                            
                            <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*" 
                                ref={fileInputRef}
                                onChange={handleImageChange}
                            />
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-2">
                        <label className="text-sm font-semibold text-slate-300 ml-1">Full Name</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors duration-300">
                                <User size={20} strokeWidth={1.5} />
                            </div>
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <input 
                                        {...field}
                                        type="text" 
                                        placeholder="Ahmed Khaled"
                                        className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-slate-600 outline-none focus:border-indigo-500/50 focus:bg-slate-900/80 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300"
                                    />
                                )}
                            />
                        </div>
                        {errors.name && <p className="text-red-400 text-xs mt-1 ml-1 font-medium">{errors.name.message}</p>}
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-2">
                        <label className="text-sm font-semibold text-slate-300 ml-1">Email Address</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors duration-300">
                                <Mail size={20} strokeWidth={1.5} />
                            </div>
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <input 
                                        {...field}
                                        type="email" 
                                        placeholder="you@example.com"
                                        className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-slate-600 outline-none focus:border-indigo-500/50 focus:bg-slate-900/80 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300"
                                    />
                                )}
                            />
                        </div>
                        {errors.email && <p className="text-red-400 text-xs mt-1 ml-1 font-medium">{errors.email.message}</p>}
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-2">
                        <label className="text-sm font-semibold text-slate-300 ml-1">Password</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors duration-300">
                                <Lock size={20} strokeWidth={1.5} />
                            </div>
                            <Controller
                                name="password"
                                control={control}
                                render={({ field }) => (
                                    <input 
                                        {...field}
                                        type="password" 
                                        placeholder="••••••••"
                                        className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-slate-600 outline-none focus:border-indigo-500/50 focus:bg-slate-900/80 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300"
                                    />
                                )}
                            />
                        </div>
                        {errors.password && <p className="text-red-400 text-xs mt-1 ml-1 font-medium">{errors.password.message}</p>}
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-2">
                        <label className="text-sm font-semibold text-slate-300 ml-1">Confirm Password</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors duration-300">
                                <Lock size={20} strokeWidth={1.5} />
                            </div>
                            <Controller
                                name="passwordConfirm"
                                control={control}
                                render={({ field }) => (
                                    <input 
                                        {...field}
                                        type="password" 
                                        placeholder="••••••••"
                                        className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-slate-600 outline-none focus:border-indigo-500/50 focus:bg-slate-900/80 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300"
                                    />
                                )}
                            />
                        </div>
                        {errors.passwordConfirm && <p className="text-red-400 text-xs mt-1 ml-1 font-medium">{errors.passwordConfirm.message}</p>}
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
                                    <span>Creating Account...</span>
                                </div>
                            ) : (
                                <>
                                    <span className="relative z-10">Sign Up</span>
                                    <ArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" size={20} />
                                    <div className="absolute inset-0 h-full w-full scale-0 rounded-xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/10"></div>
                                </>
                            )}
                        </motion.button>
                    </motion.div>

                </form>

                <motion.p variants={itemVariants} className="text-center text-sm text-slate-500 mt-8 font-medium">
                    Already have an account?{' '}
                    <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">
                        Log in
                    </Link>
                </motion.p>

            </motion.div>
        </div>
    );
};

export default Register;