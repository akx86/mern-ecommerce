import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Heart } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/10 pt-16 pb-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-900/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="text-2xl font-black tracking-tighter text-white">
              STORE<span className="text-indigo-500">.</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Experience the future of shopping with our premium collection. Quality meets modern design.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors"><Twitter size={20} /></a>
              <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors"><Linkedin size={20} /></a>
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="text-white font-bold mb-6">Shop</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link to="/shop" className="hover:text-indigo-400 transition-colors">All Products</Link></li>
              <li><Link to="/shop?category=electronics" className="hover:text-indigo-400 transition-colors">Electronics</Link></li>
              <li><Link to="/shop?category=fashion" className="hover:text-indigo-400 transition-colors">Fashion</Link></li>
              <li><Link to="/cart" className="hover:text-indigo-400 transition-colors">My Cart</Link></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="text-white font-bold mb-6">Support</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link to="#" className="hover:text-indigo-400 transition-colors">Help Center</Link></li>
              <li><Link to="#" className="hover:text-indigo-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:text-indigo-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-bold mb-6">Stay Updated</h4>
            <div className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 transition-all"
              />
              <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-lg shadow-indigo-900/20">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">© 2024 STORE. All rights reserved.</p>
          <p className="text-slate-500 text-sm flex items-center gap-1">
            Made with <Heart size={14} className="text-red-500 fill-red-500" /> Ahmed Khaled
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;