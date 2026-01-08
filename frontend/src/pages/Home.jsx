import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getAllProducts } from "@/services/productService";
import ProductCard from '@/components/layout/ProductCard';
import { ProductCardSkeleton } from '@/components/layout/ProductCard';

// --- 1. SPECIAL EFFECTS COMPONENTS ---

// Noise Overlay
const NoiseOverlay = () => (
  <div className="fixed inset-0 z-[99] pointer-events-none opacity-[0.05] mix-blend-overlay">
    <svg className="w-full h-full">
      <filter id="noiseFilter">
        <feTurbulence type="fractalNoise" baseFrequency="0.6" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  </div>
);

// Infinite Marquee
const InfiniteMarquee = () => (
  <div className="relative flex overflow-x-hidden border-y border-white/5 py-4 md:py-8 bg-[#020617]/50 backdrop-blur-md rotate-[-2deg] scale-110 my-12 md:my-20">
    <motion.div 
      className="flex whitespace-nowrap"
      animate={{ x: [0, -1000] }}
      transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
    >
      {[...Array(10)].map((_, i) => (
        <div key={i} className="flex items-center gap-6 md:gap-12 text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-500 font-black text-3xl md:text-6xl uppercase tracking-tighter px-4 md:px-6 select-none opacity-50">
          <span>FUTURE FASHION</span>
          <span className="text-indigo-500">✦</span>
          <span>NEXT GEN TECH</span>
          <span className="text-indigo-500">✦</span>
        </div>
      ))}
    </motion.div>
  </div>
);

// 3D Tilt Card
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

  const rotateX = useTransform(mouseY, [-300, 300], [15, -15]);
  const rotateY = useTransform(mouseX, [-300, 300], [-15, 15]);

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

// --- MAIN PAGE ---

function Home() {
  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 500], [0, 200]);

  const { data, isLoading } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: () => getAllProducts({ page: 1, limit: 4 }),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const featuredProducts = data?.data?.products?.slice(0, 4) || [];

  return (
    <div className="relative min-h-screen text-slate-200 font-sans overflow-x-hidden selection:bg-indigo-500/30">
      
      <NoiseOverlay />

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[90vh] lg:min-h-[110vh] flex items-center justify-center pt-20 perspective-1000 overflow-hidden">
         
         <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute top-[-10%] left-[-10%] w-[300px] md:w-[800px] h-[300px] md:h-[800px] bg-indigo-600/30 rounded-full blur-[100px] md:blur-[150px]" 
            />
            <motion.div 
              animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 10, repeat: Infinity, delay: 1 }}
              className="absolute bottom-[-10%] right-[-10%] w-[300px] md:w-[800px] h-[300px] md:h-[800px] bg-violet-600/20 rounded-full blur-[100px] md:blur-[150px]" 
            />
         </div>

         <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            
            <motion.div style={{ y: yHero }} className="space-y-6 md:space-y-8 text-center lg:text-left">
               <motion.div 
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="inline-flex items-center gap-3 border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-md px-4 py-1.5 md:px-6 md:py-2 rounded-full mx-auto lg:mx-0"
               >
                  <span className="animate-pulse w-2 h-2 bg-indigo-400 rounded-full shadow-[0_0_10px_#818cf8]"></span>
                  <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] text-indigo-200 uppercase">New Collection V.25</span>
               </motion.div>

               <motion.h1 
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black text-white leading-[0.95] md:leading-[0.9] tracking-tighter"
               >
                  DEFY <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 drop-shadow-[0_0_30px_rgba(129,140,248,0.3)]">
                    REALITY
                  </span>
               </motion.h1>

               <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="text-base md:text-xl text-slate-400 max-w-lg mx-auto lg:mx-0 leading-relaxed font-light px-4 lg:px-0"
               >
                  Step into the future of shopping. Curated items for those who demand exclusivity and innovation.
               </motion.p>

               <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4"
               >
                  <Link to="/shop">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full sm:w-auto px-10 py-4 md:py-5 bg-white text-black font-bold text-lg rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transition-all flex items-center justify-center gap-2"
                    >
                      Shop Now <ArrowRight className="w-5 h-5"/>
                    </motion.button>
                  </Link>
               </motion.div>
            </motion.div>

            <div className="relative h-[400px] md:h-[600px] w-full hidden lg:block">
               <TiltCard>
                  <motion.div 

                    initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 1, delay: 0.3 }} 
                    
                    className="relative w-full h-full bg-slate-900 rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden"
                    style={{ transformStyle: "preserve-3d", transform: "translateZ(20px)" }}
                  >
                     <img 
                        src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=800&auto=format&fit=crop" 
                        alt="Urban Fashion" 
                        className="absolute inset-0 w-full h-full object-cover"
                     />
                     
                     {/* تدرج خفيف عشان نفصل الصورة عن الحدود */ }
                     <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                     
                     {/* --- الكابشن (بوكس غامق عشان يبان فوق الصورة الفاتحة) --- */}
                     <div className="absolute bottom-10 left-10 transform translate-z-20">
                        <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 p-5 rounded-2xl shadow-xl">
                           <h3 className="text-2xl font-bold text-white mb-1">Urban Essentials</h3>
                           <p className="text-slate-300 text-xs font-medium tracking-wide uppercase">
                              New Season • <span className="text-emerald-400">Available</span>
                           </p>
                        </div>
                     </div>
                  </motion.div>
                </TiltCard>
            </div>
         </div>
      </section>

      {/* --- MARQUEE --- */}
      <InfiniteMarquee />

      {/* --- CATEGORIES --- */}
      <section className="py-16 md:py-20 px-4 max-w-7xl mx-auto relative z-10">
         <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6"
         >
             <div className="text-center md:text-left w-full md:w-auto">
                <h2 className="text-4xl md:text-7xl font-black text-white mb-2 tracking-tighter">Collections</h2>
                <p className="text-slate-400 text-lg md:text-xl">Curated for the bold.</p>
             </div>
             <Link to="/shop" className="group hidden md:flex items-center gap-2 text-white text-lg font-bold hover:text-indigo-400 transition-colors">
                View All <ArrowRight className="group-hover:translate-x-2 transition-transform"/>
             </Link>
         </motion.div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            
            <motion.div 
              whileHover={{ scale: 0.98 }}
              className="md:col-span-2 md:row-span-2 group relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden bg-slate-900 border border-white/10 cursor-pointer min-h-[300px]"
            >
               <Link to="/shop?category=electronics" className="block w-full h-full">
                  <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-all z-10" />
                  <img src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80" alt="Tech" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6 md:p-10 z-20">
                     <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-xs font-bold text-indigo-300 uppercase mb-4 inline-block">Trending</span>
                     <h3 className="text-3xl md:text-5xl font-black text-white mb-2">Electronics</h3>
                     <p className="text-slate-300 max-w-sm text-sm md:text-base">The future of technology, available today.</p>
                  </div>
               </Link>
            </motion.div>

            {/* FASHION CARD (Restored to Girl Image) */}
            <motion.div 
              whileHover={{ scale: 0.98 }}
              className="md:row-span-2 group relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden bg-slate-900 border border-white/10 cursor-pointer min-h-[300px]"
            >
               <Link to="/shop?category=fashion" className="block w-full h-full">
                  <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-all z-10" />
                  
                  {/* [ORIGINAL] صورة البنت الأصلية */}
                  <img 
                    src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80" 
                    alt="Fashion" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6 md:p-8 z-20">
                     <h3 className="text-2xl md:text-3xl font-black text-white mb-1">Fashion</h3>
                     <p className="text-slate-300 text-sm">Define your look.</p>
                  </div>
               </Link>
            </motion.div>

            {/* [UPDATED] PREMIUM SMART WATCH CARD */}
            <motion.div 
              whileHover={{ scale: 0.98 }}
              className="md:col-span-3 group relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden bg-slate-900 border border-white/10 flex items-center justify-between p-6 md:p-10 cursor-pointer min-h-[200px]"
            >
               <Link to="/shop" className="flex w-full h-full items-center justify-between relative z-10">
                   {/* صورة ساعة ذكية فخمة جداً (Premium Tech) */}
                   <img 
                        src="https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=1200&auto=format&fit=crop" 
                        alt="Smart Intelligence" 
                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500"
                   />
                   <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>

                  <div className="relative z-10 pl-4">
                     <span className="text-indigo-400 font-bold tracking-widest uppercase text-xs mb-2 block">New Arrival</span>
                     <h3 className="text-3xl md:text-5xl font-black text-white mb-2">Smart Intelligence</h3>
                     <p className="text-slate-300 text-sm md:text-lg max-w-md">Seamlessly connected. Expertly crafted.</p>
                  </div>
                  
                  <div className="relative z-10 w-16 h-16 md:w-20 md:h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md group-hover:bg-white group-hover:text-black transition-all duration-300 border border-white/20">
                      <ArrowRight className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
               </Link>
            </motion.div>
         </div>
      </section>

      {/* --- FEATURED PRODUCTS --- */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-[#020617] to-slate-900 border-t border-white/5 relative">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="mb-12 md:mb-16 text-center">
               <span className="text-indigo-400 font-bold tracking-[0.3em] uppercase text-xs md:text-sm mb-4 block">Handpicked</span>
               <h2 className="text-3xl md:text-6xl font-black text-white">Latest Drops.</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
               {isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
               ) : (
                  featuredProducts.map((product, idx) => (
                     <motion.div 
                        key={product._id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="hover:-translate-y-2 transition-transform duration-500"
                     >
                        <ProductCard item={product} />
                     </motion.div>
                  ))
               )}
            </div>
         </div>
      </section>

      {/* --- CTA --- */}
      <section className="py-24 md:py-40 px-4 relative overflow-hidden">
         <div className="absolute inset-0 bg-indigo-600/10 z-0 pointer-events-none mix-blend-overlay"></div>
         <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8 md:space-y-12">
            <motion.h2 
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               className="text-4xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter leading-none"
            >
               ELEVATE <br /> YOUR GAME.
            </motion.h2>
            
            <Link to="/shop">
               <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative inline-flex h-16 md:h-24 items-center justify-center overflow-hidden rounded-full bg-white px-10 md:px-20 font-black text-lg md:text-2xl text-black transition-all duration-300 hover:bg-indigo-500 hover:text-white"
               >
                  <span className="mr-4">START SHOPPING</span>
                  <ShoppingBag className="w-6 h-6 md:w-8 md:h-8 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
               </motion.button>
            </Link>
         </div>
      </section>

    </div>
  );
}

export default Home;