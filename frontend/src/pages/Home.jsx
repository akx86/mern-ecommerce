import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query'; 
import { getAllProducts } from "@/services/productService";
import { getAllCategories } from "@/services/categoryService"; 
import ProductCard from '@/components/products/ProductCard';
import { ProductCardSkeleton } from '@/components/products/ProductCard';

const InfiniteMarquee = () => (
  <div className="relative flex overflow-x-hidden border-y border-white/5 py-3 md:py-8 bg-slate-950/40 backdrop-blur-xl rotate-[-1deg] scale-105 my-8 md:my-20 shadow-2xl z-20">
    <motion.div 
      className="flex whitespace-nowrap"
      animate={{ x: [0, -1000] }}
      transition={{ repeat: Infinity, duration: 45, ease: "linear" }}
    >
      {[...Array(10)].map((_, i) => (
        <div key={i} className="flex items-center gap-8 md:gap-16 text-transparent bg-clip-text bg-gradient-to-r from-slate-400 via-indigo-300 to-slate-400 font-black text-2xl md:text-5xl uppercase tracking-tighter px-4 select-none opacity-90">
          <span>Visionary</span>
          <span className="text-cyan-500/40 text-xl md:text-2xl">✦</span>
          <span>Aesthetics</span>
          <span className="text-purple-500/40 text-xl md:text-2xl">✦</span>
        </div>
      ))}
    </motion.div>
  </div>
);

const TiltCard = ({ children }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    x.set(clientX - left - width / 2);
    y.set(clientY - top - height / 2);
  }

  const rotateX = useTransform(mouseY, [-300, 300], [8, -8]);
  const rotateY = useTransform(mouseX, [-300, 300], [-8, 8]);

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className="relative w-full h-full"
    >
      {children}
    </motion.div>
  );
};

function Home() {
  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 500], [0, 150]);
  const queryClient = useQueryClient();

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: () => getAllProducts({ page: 1, limit: 4 }),
    staleTime: 1000 * 60 * 5, 
    refetchOnWindowFocus: false,
  });

  const featuredProducts = productsData?.data?.products?.slice(0, 4) || [];
  const { data: categoriesData } = useQuery({
    queryKey: ['categoriesList'],
    queryFn: () => getAllCategories(),
    staleTime: 1000 * 60 * 60,
  });

  const categories = categoriesData?.data?.categories || [];
  const getCatId = (name) => {
    const cat = categories.find(c => c.name?.toLowerCase() === name.toLowerCase() || c.title?.toLowerCase() === name.toLowerCase());
    return cat ? cat._id : name; 
  };

  const prefetchCategory = (categoryId) => {
    queryClient.prefetchQuery({
        queryKey: ['products', { category: categoryId }], 
        queryFn: () => getAllProducts({ category: categoryId, page: 1, limit: 12 }),
        staleTime: 1000 * 60 * 5, 
    });
  };

  return (
    <div className="relative w-full overflow-hidden">

      <section className="relative min-h-[85vh] lg:min-h-[100vh] flex items-center justify-center pt-20 lg:pt-32 pb-12 perspective-1000">
         <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div 
              animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.1, 1] }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute top-[10%] left-[50%] translate-x-[-50%] w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 rounded-full blur-[60px] md:blur-[100px]" 
            />
         </div>

         <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10">
            <motion.div style={{ y: yHero }} className="space-y-6 md:space-y-8 text-center lg:text-left">
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.8 }}
                 className="inline-flex items-center gap-2 border border-cyan-500/20 bg-cyan-950/30 backdrop-blur-md px-3 py-1 md:px-4 md:py-1.5 rounded-full mx-auto lg:mx-0 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
               >
                 <Sparkles className="w-3 h-3 text-cyan-400" />
                 <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-cyan-100 uppercase">New Era V.02</span>
               </motion.div>

               <motion.h1 
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.8, delay: 0.2 }}
                 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black text-white leading-[0.95] md:leading-[0.9] tracking-tighter"
               >
                 BEYOND <br />
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-indigo-300 to-purple-300 drop-shadow-[0_0_20px_rgba(165,180,252,0.2)]">
                   LIMITS
                 </span>
               </motion.h1>

               <motion.p 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ duration: 1, delay: 0.5 }}
                 className="text-sm md:text-lg text-slate-400 max-w-lg mx-auto lg:mx-0 leading-relaxed font-light px-2 lg:px-0"
               >
                 Where aesthetics meet performance. Discover a curated collection designed for the ones who dare to lead.
               </motion.p>

               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.8, delay: 0.7 }}
                 className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center lg:justify-start pt-4"
               >
                 <Link to="/shop" className="w-full sm:w-auto">
                   <motion.button 
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                     className="w-full sm:w-auto px-6 py-3.5 md:px-8 md:py-4 bg-slate-50 text-slate-950 font-bold text-base md:text-lg rounded-full shadow-[0_0_25px_rgba(255,255,255,0.15)] hover:shadow-[0_0_35px_rgba(255,255,255,0.25)] transition-all flex items-center justify-center gap-2"
                   >
                     Start Exploring <ArrowRight className="w-5 h-5"/>
                   </motion.button>
                 </Link>
               </motion.div>
            </motion.div>

            <div className="relative h-[300px] md:h-[600px] w-full hidden lg:block">
               <TiltCard>
                  <motion.div 
                    initial={{ opacity: 0, rotate: -5 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    transition={{ duration: 1, delay: 0.3 }} 
                    className="relative w-full h-full bg-[#0f172a] rounded-[2.5rem] border border-indigo-500/20 shadow-2xl shadow-indigo-500/10 overflow-hidden"
                    style={{ transformStyle: "preserve-3d", transform: "translateZ(20px)" }}
                  >
                     <img 
                       src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=800&auto=format&fit=crop" 
                       alt="Urban Fashion" 
                       className="absolute inset-0 w-full h-full object-cover opacity-90"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent"></div>
                     
                     <div className="absolute bottom-10 left-10 transform translate-z-20">
                        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-4 md:p-6 rounded-2xl shadow-xl">
                           <h3 className="text-xl md:text-2xl font-bold text-white mb-1">Urban Noir</h3>
                           <p className="text-indigo-300 text-[10px] md:text-xs font-bold tracking-wide uppercase">
                              Premium Collection
                           </p>
                        </div>
                     </div>
                  </motion.div>
               </TiltCard>
            </div>
         </div>
      </section>
      
      <InfiniteMarquee />

      <section className="py-16 md:py-20 px-4 max-w-7xl mx-auto relative z-10">
         <motion.div 
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-12 gap-4 md:gap-6"
         >
             <div className="text-center md:text-left w-full md:w-auto">
                <h2 className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tighter">
                  Curated <span className="text-slate-600">Sets.</span>
                </h2>
             </div>
             <Link to="/shop" className="hidden md:flex items-center gap-2 text-indigo-300 hover:text-indigo-200 transition-colors font-medium">
                View All Categories <ArrowRight className="w-4 h-4"/>
             </Link>
         </motion.div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[220px] md:auto-rows-[280px]">

            <motion.div 
               whileHover={{ scale: 0.98 }}
               onMouseEnter={() => prefetchCategory(getCatId('electronics'))}
               className="md:col-span-2 md:row-span-2 group relative rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-slate-900 border border-slate-800 hover:border-indigo-500/30 transition-colors cursor-pointer"
            >
               <Link to={`/shop?category=${getCatId('electronics')}`} className="block w-full h-full">
                  <div className="absolute inset-0 bg-slate-950/30 group-hover:bg-transparent transition-all z-10" />
                  <img src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80" alt="Tech" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6 md:p-8 z-20">
                      <span className="px-2.5 py-0.5 md:px-3 md:py-1 bg-indigo-500/20 backdrop-blur-md border border-indigo-500/20 rounded-lg text-[10px] md:text-xs font-bold text-indigo-200 uppercase mb-2 md:mb-3 inline-block">Featured</span>
                      <h3 className="text-2xl md:text-3xl font-bold text-white">Electronics</h3>
                  </div>
               </Link>
            </motion.div>

            <motion.div 
               whileHover={{ scale: 0.98 }}
               onMouseEnter={() => prefetchCategory(getCatId('fashion'))}
               className="md:row-span-2 group relative rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-slate-900 border border-slate-800 hover:border-purple-500/30 transition-colors cursor-pointer"
            >
               <Link to={`/shop?category=${getCatId('fashion')}`} className="block w-full h-full">
                  <div className="absolute inset-0 bg-slate-950/30 group-hover:bg-transparent transition-all z-10" />
                  <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80" alt="Fashion" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6 md:p-8 z-20">
                      <h3 className="text-2xl md:text-2xl font-bold text-white">Fashion</h3>
                  </div>
               </Link>
            </motion.div>

            <motion.div 
               whileHover={{ scale: 0.98 }}
               onMouseEnter={() => prefetchCategory(getCatId('accessories'))} 
               className="md:col-span-3 group relative rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-slate-900 border border-slate-800 hover:border-cyan-500/30 transition-colors flex items-center justify-between p-6 md:p-10 cursor-pointer min-h-[180px] md:min-h-[220px]"
            >
               <Link to={`/shop?category=${getCatId('accessories')}`} className="flex w-full h-full items-center justify-between relative z-10">
                   <img 
                       src="https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=1200&auto=format&fit=crop" 
                       alt="Watch" 
                       className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-50 transition-opacity duration-500"
                   />
                   <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617]/80 to-transparent"></div>

                  <div className="relative z-10 pl-2">
                      <h3 className="text-2xl md:text-4xl font-bold text-white mb-1 md:mb-2">Accessories</h3>
                      <p className="text-slate-400 text-xs md:text-base max-w-sm hidden md:block">The final touch to your perfect look.</p>
                  </div>
                  
                  <div className="relative z-10 w-10 h-10 md:w-14 md:h-14 bg-white/5 rounded-full flex items-center justify-center backdrop-blur-md group-hover:bg-white group-hover:text-black transition-all duration-300 border border-white/10">
                      <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
               </Link>
            </motion.div>
         </div>
      </section>

      <section className="py-16 md:py-24 relative">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"></div>
         
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="mb-12 md:mb-16 text-center">
               <span className="text-indigo-400 font-bold tracking-[0.3em] uppercase text-xs md:text-sm mb-3 md:mb-4 block">New Arrivals</span>
               <h2 className="text-3xl md:text-5xl font-black text-white">Top Picks.</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
               {productsLoading ? (
                  Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
               ) : (
                  featuredProducts.map((product, idx) => (
                      <motion.div 
                        key={product._id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                      >
                         <ProductCard item={product} />
                      </motion.div>
                  ))
               )}
            </div>
         </div>
      </section>

      <section className="py-20 md:py-40 px-4 relative overflow-hidden">
         <div className="absolute inset-0 bg-indigo-950/20 z-0 pointer-events-none"></div>
         <div className="absolute bottom-[-50%] left-[-20%] w-[80%] h-[80%] bg-indigo-600/10 rounded-full blur-[150px]"></div>
         
         <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8 md:space-y-12">
            <motion.h2 
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               className="text-4xl md:text-8xl font-black text-white tracking-tighter leading-none"
            >
               READY TO <br /> UPGRADE?
            </motion.h2>
            
            <Link to="/shop">
               <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative inline-flex h-14 md:h-20 items-center justify-center overflow-hidden rounded-full bg-white px-10 md:px-20 font-black text-base md:text-xl text-black transition-all duration-300 shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:shadow-[0_0_70px_rgba(255,255,255,0.3)]"
               >
                  <span className="mr-3">SHOP NOW</span>
                  <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
               </motion.button>
            </Link>
         </div>
      </section>

    </div>
  );
}

export default Home;