import React from "react";
import { Link } from "react-router-dom";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin, 
  ShoppingBag 
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="bg-secondary/20 border-t">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* 1. Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-primary text-primary-foreground p-1 rounded-md">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <span className="font-bold text-xl">MyStore</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your one-stop shop for everything you need. Quality products, 
              fast shipping, and excellent customer service.
            </p>
            <div className="flex gap-4">
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Twitter className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* 2. Quick Links - Shop */}
          <div>
            <h3 className="font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/shop" className="hover:text-foreground transition-colors">All Products</Link></li>
              <li><Link to="/new-arrivals" className="hover:text-foreground transition-colors">New Arrivals</Link></li>
              <li><Link to="/sale" className="hover:text-foreground transition-colors">Discounts</Link></li>
              <li><Link to="/categories" className="hover:text-foreground transition-colors">Categories</Link></li>
            </ul>
          </div>

          {/* 3. Quick Links - Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-foreground transition-colors">FAQs</Link></li>
              <li><Link to="/shipping" className="hover:text-foreground transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* 4. Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold">Stay Updated</h3>
            <p className="text-sm text-muted-foreground">
              Subscribe to our newsletter to get the latest updates and offers.
            </p>
            <div className="flex gap-2">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-background"
              />
              <Button>Subscribe</Button>
            </div>
            
            <div className="pt-4 space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>support@mystore.com</span>
                </div>
                <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>+1 (555) 123-4567</span>
                </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} MyStore. All rights reserved.</p>
          
          <div className="flex gap-4">
            {/* Payment Icons (Simulated with text/styled divs for now) */}
            <span className="hover:text-foreground cursor-pointer">Terms</span>
            <span className="hover:text-foreground cursor-pointer">Privacy</span>
            <span className="hover:text-foreground cursor-pointer">Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
}