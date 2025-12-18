import React from "react";
import { getAllProducts } from "@/services/productService";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import ProductCard from '@/components/layout/ProductCard';
import {ProductCardSkeleton} from '@/components/layout/ProductCard';

function Shop (){

    const [searchParams] = useSearchParams();
    const page = parseInt(searchParams.get('page')) || 1;
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';

    const {
        data,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey : ['products', page, search, category],
        queryFn : () => getAllProducts({page, limit: 12, search, category}),
        placeholderData: (previosData) => previosData, 

    });
   
   const products = data?.data?.products || [];
    if(isError) return (
        <div className="text-center text-red-500 py-10">
            Error: {error.message}
        </div>
    )
    return (
      <div className="container mx-auto p-4 min-h-screen">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-2">New Arrivals</h1>
            <p className="text-slate-500 mb-10">Discover the latest fashion trends & styles.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {isLoading ? (
                    Array.from({ length: 8 }).map((_, index) => (
                        <ProductCardSkeleton key={index} />
                    ))
                ):(
                products.length > 0 ? (
                    products.map((product) => (
                        <ProductCard 
                            key={product._id} 
                            title={product.title || product.name} 
                            price={product.price}
                            image={product.imageCover || product.image} 
                            category={product.category?.name}
                            rating={product.ratingsAverage}
                            isNew={true} 
                        />
                    ))
                ) : (
                    <div className="col-span-full text-center py-20 text-slate-500">
                        Products Not Found
                    </div>
                )
            )}

            </div>
        </div>
    );
    
}
export default Shop;