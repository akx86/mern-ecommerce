import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Heart, Mail, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getAllCategories } from '@/services/categoryService';
import toast from 'react-hot-toast';

function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { Icon: Facebook, url: "https://www.facebook.com/share/17mmvexwhP/", label: "Facebook" },
    { Icon: Twitter, url: "https://x.com/a_kx85", label: "Twitter" },
    { Icon: Instagram, url: "https://www.instagram.com/ahmed.obito0?igsh=ajM0bGV2MHpybnA0", label: "Instagram" },
    { Icon: Linkedin, url: "https://www.linkedin.com/in/ahmed-khaled-765511348?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app", label: "LinkedIn" }
  ];

  const { data: categoriesData } = useQuery({
    queryKey: ['footerCategories'],
    queryFn: getAllCategories,
    staleTime: 1000 * 60 * 60,
  });

  const categories = categoriesData?.data?.categories?.slice(0, 5) || [];

  const handleSubscribe = (e) => {
    e.preventDefault();
    toast.success("Thanks for subscribing! 🚀");
  };

  return (
    <footer className="bg-slate-950 border-t border-white/10 pt-16 pb-8 relative overflow-hidden font-sans text-slate-300">

      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-cyan-900/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* 1. Brand & Social Section */}
          <div className="space-y-6">
            <Link to="/" className="text-3xl font-black tracking-tighter text-white block">
              STORE<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-500">.</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Experience the future of shopping with our premium collection. Quality meets modern design in every pixel.
            </p>
            
            <div className="flex gap-3">
              {socialLinks.map((item, index) => {
                const SocialIcon = item.Icon;
                return (
                  <a 
                    key={index} 
                    href={item.url} 
                    target="_blank"        
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/20"
                  >
                    <SocialIcon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* 2. Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="hover:text-indigo-400 hover:translate-x-1 transition-all inline-block">Home</Link></li>
              <li><Link to="/shop" className="hover:text-indigo-400 hover:translate-x-1 transition-all inline-block">All Products</Link></li>
              <li><Link to="/my-orders" className="hover:text-indigo-400 hover:translate-x-1 transition-all inline-block">My Orders</Link></li>
              <li><Link to="/profile" className="hover:text-indigo-400 hover:translate-x-1 transition-all inline-block">My Account</Link></li>
            </ul>
          </div>

          {/* 3. Categories */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Categories</h4>
            <ul className="space-y-3 text-sm">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <li key={cat._id}>
                    <Link to={`/shop?category=${cat._id}`} className="hover:text-cyan-400 hover:translate-x-1 transition-all inline-block capitalize">
                      {cat.title}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-slate-500 italic">Loading categories...</li>
              )}
            </ul>
          </div>

          {/* 4. Newsletter */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Stay Updated</h4>
            <p className="text-slate-400 text-sm mb-4">Get the latest news and offers straight to your inbox.</p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 focus:bg-slate-900 transition-all"
                />
              </div>
              <button type="submit" className="group w-full bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-indigo-900/20 active:scale-[0.98] flex items-center justify-center gap-2">
                Subscribe <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
              </button>
            </form>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-slate-500 text-sm">
            © {currentYear} STORE. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link to="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="#" className="hover:text-white transition-colors">Terms</Link>
            <span className="flex items-center gap-1">
              Made with <Heart size={14} className="text-red-500 fill-red-500 animate-pulse" />
              <a 
                href="https://www.linkedin.com/in/ahmed-khaled-765511348?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white hover:text-indigo-400 font-bold transition-colors ml-1"
              >
                Ahmed Khaled
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;