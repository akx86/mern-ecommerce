import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from 'zod';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Save, Loader2, Shield, ArrowLeft, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
import { updateUserProfileService } from '@/services/userService';
import { updateProfileSuccess } from '@/store/slices/authSlice';

const profileSchema = z.object({
    name: z.string().min(3, { message: "Name must be at least 3 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().optional(),
    passwordConfirm: z.string().optional()
}).refine((data) => {
    if (data.password && data.password.length > 0) {
        return data.password.length >= 6 && data.password === data.passwordConfirm;
    }
    return true;
}, {
    message: "Passwords do not match or too short",
    path: ["passwordConfirm"],
});

const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
        opacity: 1, y: 0, 
        transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.1 } 
    }
};

const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
};

const ProfilePage = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const [avatarPreview, setAvatarPreview] = useState("/images/default_avatar.png"); 
    const [avatarFile, setAvatarFile] = useState(null); 

    const { control, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            passwordConfirm: ''
        }
    });

    useEffect(() => {
        if (user) {
            setValue('name', user.name);
            setValue('email', user.email);

           const imgUrl = user.profileImg?.url || user.profileImg;
            if (imgUrl) setAvatarPreview(imgUrl);
        }
    }, [user, setValue]);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if(file) {
            setAvatarFile(file); 
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) setAvatarPreview(reader.result); 
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data) => {
        const toastId = toast.loading('Updating profile...');

        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('email', data.email);

            if (data.password && data.password.trim() !== '') {
                formData.append('password', data.password);
            }

            if (avatarFile) {
                formData.append('profileImg', avatarFile);
            }

            const updatedUserResponse = await updateUserProfileService(formData);
            
            const actualUser = updatedUserResponse.data?.user || updatedUserResponse.user || updatedUserResponse;
            localStorage.setItem('user', JSON.stringify(actualUser));
            dispatch(updateProfileSuccess(actualUser));

            toast.success("Profile Updated Successfully! 🎉", { id: toastId, duration: 4000 });

            reset({
                name: actualUser.name, 
                email: actualUser.email, 
                password: '',
                passwordConfirm: ''
            });

            if(actualUser.profileImg) setAvatarPreview(actualUser.profileImg);
            setAvatarFile(null); 

        } catch (err) {
            console.error(err);
            let msg = err.response?.data?.message || "Update failed";
            if (err.code === 'ECONNABORTED') msg = "Request timed out. Image might be too large.";
            if (err.code === 'ERR_NETWORK') msg = "Server is not reachable. Is backend running?";
            toast.error(msg, { id: toastId, duration: 4000 });
        }
    };

    return (
        <div className="min-h-screen w-full bg-transparent pt-20 md:pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex justify-center items-start font-sans">

            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-2xl w-full relative z-10"
            >
                <Link 
                    to="/" 
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-white/5 text-slate-400 hover:text-white hover:border-white/20 transition-all mb-8 group w-fit backdrop-blur-md"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-bold">Back to Home</span>
                </Link>

                <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden relative">
                    
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-50" />

                    <div className="p-6 md:p-8 border-b border-white/5 bg-white/[0.02] flex flex-col items-center sm:flex-row sm:items-start gap-6">
                        
                        <div className="relative group cursor-pointer">
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.3)] bg-slate-800">
                                <img 
                                    src={avatarPreview} 
                                    alt="Profile" 
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                    onError={(e) => {e.target.src = "/images/default_avatar.png"}}
                                />
                            </div>
                            
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <Camera className="text-white w-6 h-6 md:w-8 md:h-8" />
                            </div>

                            <input
                                type="file"
                                name="profileImg" 
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>

                        <div className="text-center sm:text-left mt-1 md:mt-2">
                            <h2 className="text-2xl font-bold text-white tracking-tight">Profile Settings</h2>
                            <p className="text-slate-400 text-sm">Update your photo and personal details</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-6">

                        <motion.div variants={itemVariants} className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                                <Controller
                                    name="name"
                                    control={control}
                                    render={({ field }) => (
                                        <input 
                                            {...field}
                                            type="text" 
                                            className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:border-indigo-500/50 focus:bg-slate-900/80 focus:ring-1 focus:ring-indigo-500/50 transition-all outline-none placeholder:text-slate-600"
                                            placeholder="Your Name"
                                        />
                                    )}
                                />
                            </div>
                            {errors.name && <p className="text-red-400 text-xs ml-1 font-medium">{errors.name.message}</p>}
                        </motion.div>

                        <motion.div variants={itemVariants} className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                                <Controller
                                    name="email"
                                    control={control}
                                    render={({ field }) => (
                                        <input 
                                            {...field}
                                            type="email" 
                                            className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:border-indigo-500/50 focus:bg-slate-900/80 focus:ring-1 focus:ring-indigo-500/50 transition-all outline-none placeholder:text-slate-600"
                                            placeholder="john@example.com"
                                        />
                                    )}
                                />
                            </div>
                            {errors.email && <p className="text-red-400 text-xs ml-1 font-medium">{errors.email.message}</p>}
                        </motion.div>

                        <div className="border-t border-white/10 my-8 pt-6">
                            <div className="flex items-center gap-2 mb-6">
                                <Shield className="text-emerald-400 w-5 h-5" />
                                <h3 className="text-lg font-bold text-white">Security</h3>
                            </div>
                            
                            <motion.div variants={itemVariants} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">New Password <span className="text-[10px] font-normal text-slate-500 lowercase ml-1">(optional)</span></label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={20} />
                                        <Controller
                                            name="password"
                                            control={control}
                                            render={({ field }) => (
                                                <input 
                                                    {...field}
                                                    type="password" 
                                                    placeholder="••••••••"
                                                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-slate-600 focus:border-emerald-500/50 focus:bg-slate-900/80 focus:ring-1 focus:ring-emerald-500/50 transition-all outline-none"
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Confirm New Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={20} />
                                        <Controller
                                            name="passwordConfirm"
                                            control={control}
                                            render={({ field }) => (
                                                <input 
                                                    {...field}
                                                    type="password" 
                                                    placeholder="••••••••"
                                                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-slate-600 focus:border-emerald-500/50 focus:bg-slate-900/80 focus:ring-1 focus:ring-emerald-500/50 transition-all outline-none"
                                                />
                                            )}
                                        />
                                    </div>
                                    {errors.passwordConfirm && <p className="text-red-400 text-xs ml-1 font-medium">{errors.passwordConfirm.message}</p>}
                                </div>
                            </motion.div>
                        </div>

                        <motion.div variants={itemVariants} className="pt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-[0.98] ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        <span>Saving Changes...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save size={20} />
                                        <span>Update Profile</span>
                                    </>
                                )}
                            </button>
                        </motion.div>

                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default ProfilePage;