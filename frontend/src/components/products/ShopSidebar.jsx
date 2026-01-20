import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getAllCategories } from "@/services/categoryService";

const ShopSidebar = ({ onClose }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: categoryData, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getAllCategories, 
  });

  const categories = categoryData?.data?.categories || [];
  const [priceRange, setPriceRange] = useState([1000]); 

  useEffect(() => {
    const currentPrice = searchParams.get("maxPrice");
    if (currentPrice) {
      setPriceRange([Number(currentPrice)]);
    }
  }, [searchParams]);
 
  const handlePriceCommit = (value) => {
    const params = new URLSearchParams(searchParams);
    params.set("maxPrice", value[0]); 
    params.set("page", 1); 
    setSearchParams(params);
    
    if (onClose) onClose(); 
  };

  const handleCategoryChange = (categoryId) => {
    const params = new URLSearchParams(searchParams);
    const currentCategory = params.get("category");
    if (currentCategory === categoryId) {
      params.delete("category"); 
    } else {
      params.set("category", categoryId); 
      params.set("page", 1);
    }
    setSearchParams(params);

    if (onClose) onClose();
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      const params = new URLSearchParams(searchParams);
      const searchValue = e.target.value;
      if (searchValue) {
        params.set("search", searchValue); 
        params.set("page", 1);
      } else {
        params.delete("search");
      }
      setSearchParams(params);

      if (onClose) onClose();
    }
  };

  const handleReset = () => {
      setSearchParams({});
      if (onClose) onClose();
  }

  return (
    <aside className="w-full md:w-[280px] md:sticky md:top-24 h-fit p-1 md:p-6 md:border md:border-white/5 md:rounded-2xl md:bg-slate-900/40 md:backdrop-blur-xl md:shadow-2xl md:shadow-black/20 transition-all duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg text-white">Filters</h3>
        <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleReset} 
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs transition-colors h-8 px-2"
        >
          Reset All
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6 group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-hover:text-indigo-400 transition-colors duration-300" />
        <Input 
          placeholder="Search..." 
          className="pl-9 bg-slate-950/50 border-white/10 text-slate-200 placeholder:text-slate-600 focus-visible:ring-indigo-500/50 hover:bg-slate-900/80 rounded-xl transition-all h-10 text-sm"
          onKeyDown={handleSearch} 
          defaultValue={searchParams.get('search')}
        />
      </div>

      <Accordion type="multiple" defaultValue={["category", "price"]} className="w-full">
        
        {/* 1. Categories Section */}
        <AccordionItem value="category" className="border-b border-white/5 mb-4">
          <AccordionTrigger className="text-sm font-semibold text-slate-200 hover:text-white hover:no-underline py-3">
            Categories
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
              {isLoading ? (
                <p className="text-xs text-slate-500">Loading...</p>
              ) : (
                categories.map((cat) => (
                  <div key={cat._id} className="flex items-center space-x-3 group">
                    <Checkbox 
                      id={cat._id} 
                      checked={searchParams.get('category') === cat._id}
                      onCheckedChange={() => handleCategoryChange(cat._id)}
                      className="border-white/20 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 text-white w-4 h-4 rounded" 
                    />
                    <label 
                      htmlFor={cat._id} 
                      className="text-sm font-medium cursor-pointer text-slate-400 group-hover:text-white transition-colors capitalize"
                    >
                      {cat.title}
                    </label>
                  </div>
                ))
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* 2. Price Section */}
        <AccordionItem value="price" className="border-none">
          <AccordionTrigger className="text-sm font-semibold text-slate-200 hover:text-white hover:no-underline py-3">
            Price Range
          </AccordionTrigger>
          <AccordionContent className="pt-6 px-1">
            
            <Slider
              value={priceRange}          
              max={5000}                  
              step={10}                   
              onValueChange={setPriceRange} 
              onValueCommit={handlePriceCommit} 
              className="mb-6 cursor-pointer"
            />

            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span className="bg-slate-800/80 px-2.5 py-1 rounded-md border border-white/5">$0</span>
              <span className="bg-slate-800/80 px-2.5 py-1 rounded-md border border-white/5 text-indigo-300">
                ${priceRange[0]}
              </span>
            </div>
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </aside>
  );
};

export default ShopSidebar;