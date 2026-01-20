import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, ShoppingCart, Users, LogOut, Menu, X } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/slices/authSlice';
import toast from 'react-hot-toast';

const AdminLayout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate();

  const handleLogout = ()=>{
        dispatch(logout()); 
        toast.success("Logged out successfully");
        navigate('/login');
  }
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getLinkClasses = ({ isActive }) => {
    return `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
      isActive
        ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.15)]"
        : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100 hover:translate-x-1"
    }`;
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const storageData = localStorage.getItem('user');
  const user = storageData ? JSON.parse(storageData) : null;
  
  return (
    <div className="relative min-h-screen text-zinc-100 font-sans selection:bg-indigo-500/30 overflow-hidden bg-[#0a0a0a]">
      
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[#020617]"></div> 
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[100px]"></div>
          <div className="absolute top-[20%] right-[-5%] w-[40%] h-[60%] rounded-full bg-violet-900/20 blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[40%] rounded-full bg-indigo-900/10 blur-[100px]"></div>
      </div>

      <div className="relative z-10 flex h-screen">

        <aside className="w-72 hidden md:flex flex-col border-r border-white/5 bg-slate-950/30 backdrop-blur-xl">
          <div className="h-20 flex items-center px-8 border-b border-white/5">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-violet-500 bg-clip-text text-transparent tracking-wider">
              NEXUS<span className="text-white/20">ADMIN</span>
            </h1>
          </div>

          <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
            <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Menu</p>
            <NavLink to="/admin" end className={getLinkClasses}><LayoutDashboard size={20} /><span>Dashboard</span></NavLink>
            <NavLink to="/admin/products" className={getLinkClasses}><ShoppingBag size={20} /><span>Products</span></NavLink>
            <NavLink to="/admin/categories" className={getLinkClasses}><ShoppingBag size={20} /><span>Categories</span></NavLink>
            <NavLink to="/admin/orders" className={getLinkClasses}><ShoppingCart size={20} /><span>Orders</span></NavLink>
            <NavLink to="/admin/users" className={getLinkClasses}><Users size={20} /><span>Users</span></NavLink>
          </nav>

          <div className="p-6 border-t border-white/5">
            <button 
             onClick={handleLogout}
             className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all">
              <LogOut size={20} /><span className="font-medium">Log Out</span>
            </button>
          </div>
        </aside>


        {isMobileMenuOpen && (
            <div className="fixed inset-0 z-50 flex md:hidden">
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                    onClick={closeMobileMenu}
                ></div>
                
                <aside className="relative w-64 h-full bg-[#020617] border-r border-white/10 flex flex-col shadow-2xl transform transition-transform duration-300 animate-in slide-in-from-left">
                    <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-violet-500 bg-clip-text text-transparent">
                        NEXUS<span className="text-white/20">ADMIN</span>
                        </h1>
                        <button onClick={closeMobileMenu} className="p-2 text-zinc-400 hover:text-white bg-white/5 rounded-lg">
                            <X size={20} />
                        </button>
                    </div>

                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                        <NavLink onClick={closeMobileMenu} to="/admin" end className={getLinkClasses}><LayoutDashboard size={20} /><span>Dashboard</span></NavLink>
                        <NavLink onClick={closeMobileMenu} to="/admin/products" className={getLinkClasses}><ShoppingBag size={20} /><span>Products</span></NavLink>
                        <NavLink onClick={closeMobileMenu} to="/admin/categories" className={getLinkClasses}><ShoppingBag size={20} /><span>Categories</span></NavLink>
                        <NavLink onClick={closeMobileMenu} to="/admin/orders" className={getLinkClasses}><ShoppingCart size={20} /><span>Orders</span></NavLink>
                        <NavLink onClick={closeMobileMenu} to="/admin/users" className={getLinkClasses}><Users size={20} /><span>Users</span></NavLink>
                    </nav>

                    <div className="p-4 border-t border-white/10 mt-auto">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-3 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300 group"
                        >
                            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="font-medium">Log Out</span>
                        </button>
                    </div>
                </aside>
            </div>
        )}

        {/* ================= MAIN CONTENT ================= */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
          
          <header className="h-20 flex items-center justify-between px-4 md:px-8 border-b border-white/5 bg-slate-950/20 backdrop-blur-md sticky top-0 z-40">
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="md:hidden p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                    <Menu size={24} />
                </button>
                <h2 className="text-zinc-100 font-semibold text-lg">Overview</h2>
            </div>
            
            <div className="flex items-center gap-3">
    {/* Avatar Circle */}
            <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center overflow-hidden">
                {user?.profileImg ? (
                    <img 
                        src={user.profileImg} 
                        alt="Admin" 
                        className="w-full h-full object-cover" 
                    />
                ) : (
                    // Fallback Initials
                    <span className="text-cyan-400 font-bold">
                        {user?.name?.slice(0, 2).toUpperCase() || 'AD'}
                    </span>
                )}
            </div>
    
    {/* Admin Name */}
              <div className="hidden md:block">
                  <p className="text-sm font-bold text-white">{user?.name}</p>
                  <p className="text-xs text-zinc-400">Admin Account</p>
              </div>
          </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 md:p-8">
             <div className="max-w-7xl mx-auto">
                <Outlet />
             </div>
          </main>

        </div>
      </div>
    </div>
  );
};

export default AdminLayout;