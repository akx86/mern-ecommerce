import React, { useState } from 'react';
import { MapPin, Truck, ShieldCheck, Globe, Phone, User, CreditCard, Lock } from 'lucide-react'; 
import { useDispatch, useSelector } from 'react-redux';
import {  createPaymentIntent } from '@/services/orderService';
import toast from 'react-hot-toast';
import { Navigate } from 'react-router-dom';
import {  saveShippingAddress } from '@/store/slices/cartSlice';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import stripePromise from '@/utils/stripe';
import { Elements } from '@stripe/react-stripe-js';
import { motion } from 'framer-motion'; 
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';

const schema = z.object({
  fullName: z.string().min(3, "Name is too short"),
  phone: z.string().regex(/^01[0125][0-9]{8}$/, "Please enter valid Egyptian number"),
  address: z.string().min(5, "Please enter your address details"),
  city: z.string().min(1, "Please enter your city"),
  country: z.string().min(1, "Please enter your country"),
  postalCode: z.string().min(1, "Please enter your postalcode")
});

const CheckoutPage = () => {
   const dispatch = useDispatch();
   const { cartItems, shippingAddress } = useSelector((state) => state.cart);    
   const [clientSecret, setClientSecret] = useState("");
   const [loading, setLoading] = useState(false); 
   const [confirmedData, setConfirmedData] = useState(null);
 

   const { 
       register,     
       handleSubmit,   
       formState: { errors } 
   } = useForm({
       resolver: zodResolver(schema),
       defaultValues: {
           address: shippingAddress?.address || '',
           phone: shippingAddress?.phone || '',
           postalCode: shippingAddress?.postalCode || '',
           city: shippingAddress?.city || '',
           country: shippingAddress?.country || '',
           fullName: shippingAddress?.fullName || '' 
       }
   });

   const onSubmit = async (data) => {
       setLoading(true);
       try {
            dispatch(saveShippingAddress(data));
           const orderItems = cartItems.map((item) => {
               return {
                   _id: item.product._id,
                   quantity: item.quantity
               }
           });
           
           const res = await createPaymentIntent(orderItems);
           if (res.status === 'SUCCESS' || res.data?.clientSecret) {
               setClientSecret(res.data.clientSecret);
               setConfirmedData(data);
           }
       } catch (error) {
           console.error("Error:", error);
           toast.error('Error creating payment intent', { duration: 4000 });
       } finally {
           setLoading(false);
       }
   }

   const subtotal = cartItems.reduce((acc, item) => {
       const price = item.product?.price || item.price || 0; 
       const qty = item.quantity || 0;
       return acc + (price * qty);
   }, 0);
   const shippingPrice = subtotal > 500 ? 0 : 50;
   const taxEstimate = subtotal * 0.10;
   const totalPrice = subtotal + shippingPrice + taxEstimate;

   return (
       <div className="min-h-screen pt-20 md:pt-32 pb-20 text-slate-200 relative overflow-hidden selection:bg-cyan-500/30 font-sans">
           
           <div className="absolute top-20 left-[-10%] w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none" />
           <div className="absolute bottom-20 right-[-10%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />

           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
               
               <div className="mb-8 md:mb-12 border-b border-white/5 pb-6">
                   <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 tracking-tight mb-2">
                       SECURE CHECKOUT
                   </h1>
                   <div className="flex items-center gap-2 text-slate-400 text-sm">
                       <Lock size={14} className="text-emerald-400" />
                       <span>Your transaction is encrypted and secured.</span>
                   </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12">
                   
                   <div className="lg:col-span-2 space-y-6 md:space-y-8">
                       
                       <motion.div 
                           initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                           className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-4 md:p-8 shadow-2xl relative overflow-hidden group"
                       >
                           <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                           
                           <div className="flex items-center gap-3 mb-6 md:mb-8">
                               <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                                   <MapPin size={24} />
                               </div>
                               <h2 className="text-xl font-bold text-white tracking-wide">Shipping Details</h2>
                           </div>

                           <form id="shipping-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6 relative z-10">
                               
                               <div className="space-y-2">
                                   <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                                   <div className="relative">
                                       <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                                       <input 
                                           type="text" 
                                           {...register("fullName")} 
                                           placeholder="Ahmed Khaled" 
                                           className={`w-full bg-slate-950/50 border ${errors.fullName ? 'border-red-500' : 'border-white/10'} rounded-xl py-3 md:py-4 pl-12 pr-4 text-slate-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-600`} 
                                       />
                                   </div>
                                   {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                               </div>

                               <div className="space-y-2">
                                   <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Street Address</label>
                                   <div className="relative">
                                       <input 
                                           type="text" 
                                           {...register("address")}
                                           placeholder="123 Cyber Avenue" 
                                           className={`w-full bg-slate-950/50 border ${errors.address ? 'border-red-500' : 'border-white/10'} rounded-xl py-3 md:py-4 pl-4 pr-4 text-slate-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-600`} 
                                       />
                                   </div>
                                   {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                               </div>

                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                   <div className="space-y-2">
                                       <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">City</label>
                                       <input 
                                           type="text" 
                                           {...register("city")}
                                           placeholder="Cairo" 
                                           className={`w-full bg-slate-950/50 border ${errors.city ? 'border-red-500' : 'border-white/10'} rounded-xl py-3 md:py-4 px-4 text-slate-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-600`} 
                                       />
                                       {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                                   </div>
                                   <div className="space-y-2">
                                       <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Postal Code</label>
                                       <input 
                                           type="text" 
                                           {...register("postalCode")}
                                           placeholder="11511" 
                                           className={`w-full bg-slate-950/50 border ${errors.postalCode ? 'border-red-500' : 'border-white/10'} rounded-xl py-3 md:py-4 px-4 text-slate-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-600`} 
                                       />
                                   {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode.message}</p>}
                                   </div>
                               </div>

                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                   <div className="space-y-2">
                                       <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
                                       <div className="relative">
                                           <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                                           <input 
                                               type="text" 
                                               {...register("phone")}
                                               placeholder="+20 1xxxxxxxxx" 
                                               className={`w-full bg-slate-950/50 border ${errors.phone ? 'border-red-500' : 'border-white/10'} rounded-xl py-3 md:py-4 pl-12 pr-4 text-slate-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-600`} 
                                           />
                                       </div>
                                       {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                                   </div>
                                   <div className="space-y-2">
                                       <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Country</label>
                                       <div className="relative">
                                           <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                                           <input 
                                               type="text" 
                                               {...register("country")}
                                               placeholder="Egypt" 
                                               className={`w-full bg-slate-950/50 border ${errors.country ? 'border-red-500' : 'border-white/10'}  rounded-xl py-3 md:py-4 pl-12 pr-4 text-slate-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-600`}
                                           />
                                       </div>
                                       {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>}
                                   </div>
                               </div>
                           </form>
                       </motion.div>

                       {clientSecret && (
                            <motion.div 
                               initial={{ opacity: 0, height: 0 }} 
                               animate={{ opacity: 1, height: 'auto' }}
                               className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-4 md:p-8 shadow-2xl"
                            >
                               <div className="flex items-center gap-3 mb-6">
                                   <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                                       <CreditCard size={24} />
                                   </div>
                                   <h2 className="text-xl font-bold text-white tracking-wide">Payment Details</h2>
                               </div>
                               <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night', variables: { colorPrimary: '#06b6d4', colorBackground: '#020617', colorText: '#e2e8f0' } } }}>
                                   <CheckoutForm 
                                    shippingData={confirmedData} 
                                    totalAmount={totalPrice}
                                    items={cartItems}
                                   />
                               </Elements>
                            </motion.div>
                       )}
                   </div>

                   <div className="lg:col-span-1">
                       <div className="sticky top-20 md:top-32">
                           <motion.div 
                               initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                               className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-4 md:p-6 shadow-2xl"
                           >
                               <h2 className="text-lg font-bold tracking-wide text-white mb-6 flex items-center gap-2">
                                   <span>Order Summary</span>
                                   <span className="text-xs font-normal text-slate-400 bg-white/5 px-2 py-1 rounded-full">{cartItems.length} items</span>
                               </h2>

                               <div className="space-y-4 mb-6 max-h-60 md:max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                                   {cartItems.length === 0 ? (
                                       <p className="text-slate-500 text-center py-8">Your cart is empty</p>
                                   ) : (
                                       cartItems.map((item, index) => (
                                           <div key={index} className="flex gap-4 items-center bg-slate-950/30 p-3 rounded-2xl border border-white/5 group hover:border-white/10 transition-colors">
                                               <div className="w-14 h-14 rounded-xl bg-slate-800 border border-white/5 overflow-hidden flex-shrink-0">
                                                   <img src={item.product?.image} alt={item.product?.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                               </div>
                                               <div className="flex-1 min-w-0">
                                                   <h4 className="text-sm font-bold text-slate-200 line-clamp-1 group-hover:text-cyan-400 transition-colors">{item.product?.title}</h4>
                                                   <p className="text-xs text-slate-500 font-medium">Qty: {item.quantity}</p>
                                               </div>
                                               <div className="text-slate-200 font-bold text-sm">${(item.quantity * item.product?.price).toFixed(2)}</div>
                                           </div>
                                       ))
                                   )}
                               </div>

                               <div className="space-y-3 border-t border-white/10 pt-6 mb-8">
                                   <div className="flex justify-between text-slate-400 text-sm">
                                       <span>Subtotal</span>
                                       <span className="font-medium text-slate-200">${subtotal.toFixed(2)}</span>
                                   </div>
                                   <div className="flex justify-between text-slate-400 text-sm">
                                       <span>Shipping</span>
                                       <span className="font-medium text-emerald-400">{shippingPrice === 0 ? 'Free' : `$${shippingPrice}`}</span>
                                   </div>
                                   <div className="flex justify-between text-slate-400 text-sm">
                                       <span>Tax (10%)</span>
                                       <span className="font-medium text-slate-200">${taxEstimate.toFixed(2)}</span>
                                   </div>
                                   
                                   <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-4" />

                                   <div className="flex justify-between items-end">
                                       <span className="text-lg font-bold text-white">Total</span>
                                       <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                                           ${totalPrice.toFixed(2)}
                                       </span>
                                   </div>
                               </div>
                               
                               {!clientSecret && (
                                   <button 
                                       type="submit"
                                       form="shipping-form"
                                       disabled={loading}
                                       className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white py-3 md:py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                   >
                                       {loading ? (
                                           <>
                                               <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                               Preparing...
                                           </>
                                       ) : (
                                           <>
                                               Confirm & Pay
                                               <ShieldCheck size={18} />
                                           </>
                                       )}
                                   </button>
                               )}

                               <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest">
                                   <ShieldCheck className="w-3 h-3 text-emerald-500" />
                                   <span>256-Bit SSL Encrypted Payment</span>
                               </div>

                           </motion.div>
                       </div>
                   </div>

               </div>
           </div>
       </div>
   );
};

export default CheckoutPage;