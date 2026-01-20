import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Search, ShoppingBag, User, Menu, X, LogOut, ChevronDown } from 'lucide-react';
import { logout } from '@/store/slices/authSlice';
import { clearCart } from '@/store/slices/cartSlice';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || "");

  const { cartItems } = useSelector(state => state.cart);
  const totalQuantity = cartItems?.length || 0;
  const { user, isAuthenticated } = useSelector(state => state.auth);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profileRef = useRef(null);

  useEffect(() => {
    setSearchQuery(searchParams.get('search') || "");
  }, [searchParams]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileRef]);

  const handleLogout = () => {
    dispatch(clearCart());
    dispatch(logout());
    navigate('/');
    setIsProfileOpen(false);
    setIsNavOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const userImage = user?.profileImg || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=6366f1&color=fff`;


  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={` fixed top-0 z-[100] w-full !bg-transparent transition-all duration-500 ease-in-out ${
        scrolled ? 'py-3 px-3 sm:px-6' : 'py-5 px-0'
      }`}
    >
      <div 
        className={`max-w-7xl mx-auto relative transition-all duration-500 pointer-events-auto ${
        scrolled 
          ? 'bg-slate-900/10 backdrop-blur-xl rounded-2xl shadow-lg shadow-black/5' 
          : 'bg-transparent px-4 sm:px-6'
      }`}>
        <div className=" flex justify-between items-center h-16 px-3 sm:px-6">

          <Link to="/" className="text-2xl font-black tracking-tighter text-white shrink-0 z-50 drop-shadow-sm">
            STORE<span className="text-indigo-400">.</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8 mr-6">
            <Link to="/" className="text-sm font-medium text-slate-200 hover:text-white transition-colors hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">Home</Link>
            <Link to="/shop" className="text-sm font-medium text-slate-200 hover:text-white transition-colors hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">Shop</Link>
            <Link to="/shop/categories" className="text-sm font-medium text-slate-200 hover:text-white transition-colors hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">Categories</Link>
          </div>

          <div className="flex items-center gap-1 sm:gap-3">
            <Link to="/cart" className="relative p-2 group">
               <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                 <ShoppingBag size={22} className="text-slate-200 group-hover:text-indigo-400 transition-colors" />
                 {totalQuantity > 0 && (
                   <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white shadow-lg shadow-indigo-500/40">
                     {totalQuantity}
                   </span>
                 )}
               </motion.div>
            </Link>

            {isAuthenticated ? (
              <div className="relative" ref={profileRef}>
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-white/5 transition-all border border-transparent hover:border-white/10 active:scale-95"
                >
                  <img src={userImage} alt="User" className="w-8 h-8 rounded-full object-cover border border-indigo-500/30" />
                  <ChevronDown size={14} className={` text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-48 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl py-2 z-[60] overflow-hidden"
                    >
                      <div className="px-4 py-2 border-b border-white/5 mb-1">
                        <p className="text-xs text-slate-500">Signed in as</p>
                        <p className="text-sm font-bold text-white truncate">{user.name}</p>
                      </div>
                      <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-indigo-600 hover:text-white transition-all">
                        <User size={14} /> Profile
                      </Link>
                      <Link to="/my-orders" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-indigo-600 hover:text-white transition-all">
                        <User size={14} /> My Orders
                      </Link>
                      <button onClick={handleLogout} className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-all">
                        <LogOut size={14} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="hidden sm:flex items-center gap-2 px-5 py-2 text-xs font-black text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all active:scale-95">
                LOGIN
              </Link>
            )}

            <button 
              className="md:hidden p-2 text-slate-200 hover:text-indigo-400 transition-colors ml-1"
              onClick={() => { setIsNavOpen(!isNavOpen); setIsSearchOpen(false); }}
            >
               {isNavOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {isNavOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/5 bg-slate-950/90 backdrop-blur-xl rounded-b-2xl overflow-hidden"
            >
              <div className="p-4 space-y-2">
                <Link to="/" onClick={() => setIsNavOpen(false)} className="block py-3 px-4 rounded-xl hover:bg-white/5 text-slate-200 font-medium transition-all">Home</Link>
                <Link to="/shop" onClick={() => setIsNavOpen(false)} className="block py-3 px-4 rounded-xl hover:bg-white/5 text-slate-200 font-medium transition-all">Shop</Link>
                <Link to="/shop/categories" onClick={() => setIsNavOpen(false)} className="block py-3 px-4 rounded-xl hover:bg-white/5 text-slate-200 font-medium transition-all">Categories</Link>
                {!isAuthenticated && (
                      <div className="pt-2 border-t border-white/5 mt-2">
                        <Link to="/login" onClick={() => setIsNavOpen(false)} className="block w-full py-3 rounded-xl bg-indigo-600 text-white text-center font-bold shadow-lg shadow-indigo-600/20">LOGIN / REGISTER</Link>
                      </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}

export default Navbar;