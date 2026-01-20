import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'lucide-react'; 

function EmptyCart() {
  return (

    <div className="w-full flex flex-col items-center justify-center text-center px-4 py-12 md:py-24">

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative mb-8 z-10"
      >
        {/* Glowing Pulse Effect behind icon */}
        <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-2xl animate-pulse"></div>
        
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="relative bg-slate-900/50 backdrop-blur-xl p-8 rounded-full border border-white/10 shadow-2xl shadow-indigo-500/10"
        >
          <ShoppingBag className="w-16 h-16 text-indigo-400 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" strokeWidth={1.5} />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="space-y-4 relative z-10"
      >
        <h2 className="text-3xl font-black text-white tracking-tight">Your cart is empty</h2>
        <p className="text-slate-400 max-w-sm mx-auto text-lg font-medium">
          Looks like you haven't added anything to your cart yet.
        </p>

        <div className="pt-8">
          <Link to="/shop">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-300 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:from-indigo-500 hover:to-violet-500 group"
            >
              Start Shopping
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default EmptyCart;