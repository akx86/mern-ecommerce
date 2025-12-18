import React, { useState } from "react";
import { Link } from "react-router-dom"; // أو a tag لو مش بتستخدم react-router
import { 
  Menu, 
  Search, 
  ShoppingBag, 
  User, 
  X, 
  Heart 
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // رقم وهمي لعناصر السلة للتجربة
  const cartCount = 3; 

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "New Arrivals", href: "/new-arrivals" },
    { name: "On Sale", href: "/sale" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* 1. Logo & Mobile Menu */}
        <div className="flex items-center gap-2">
          {/* Mobile Menu Trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="text-left text-xl font-bold">MyStore</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 py-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="text-lg font-medium hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
                <Separator />
                <div className="flex flex-col gap-2">
                   <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground">Log In</Link>
                   <Link to="/register" className="text-sm text-muted-foreground hover:text-foreground">Create Account</Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground p-1 rounded-md">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <span className="font-bold text-xl hidden sm:inline-block">MyStore</span>
          </Link>
        </div>

        {/* 2. Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* 3. Search Bar (Desktop) */}
        <div className="hidden md:flex items-center flex-1 max-w-sm ml-4 relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8 bg-secondary/50 border-none focus-visible:ring-1"
            />
        </div>

        {/* 4. Actions (Icons) */}
        <div className="flex items-center gap-2">
          
          {/* Mobile Search Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Wishlist (Optional) */}
           <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Heart className="h-5 w-5" />
          </Button>

          {/* Cart with Badge */}
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] rounded-full"
              >
                {cartCount}
              </Badge>
            )}
          </Button>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Orders</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Mobile Search Bar Expand */}
      {isSearchOpen && (
         <div className="md:hidden border-t p-4 bg-background">
             <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-8 w-full"
                  autoFocus
                />
            </div>
         </div>
      )}
    </header>
  );
}