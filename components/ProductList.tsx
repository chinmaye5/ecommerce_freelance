"use client";

import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { Search } from "lucide-react";

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
    stock: number;
    unit: string;
    discountedPrice?: number;
}

const ProductList = ({ category, search }: { category?: string; search?: string }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                let url = "/api/products?";
                if (category) url += `category=${encodeURIComponent(category)}&`;
                if (search) url += `search=${encodeURIComponent(search)}&`;

                const res = await fetch(url);
                const data = await res.json();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [category, search]);

    if (loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="aspect-[4/5] bg-gray-100 rounded-[2.5rem] animate-pulse"></div>
                ))}
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border border-emerald-50 shadow-xl shadow-emerald-900/5">
                <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                    <Search className="text-emerald-300" size={32} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">No Items Found</h3>
                <p className="text-gray-500 max-w-sm mx-auto font-light">We searched everywhere but couldn't find matches. Try refreshing or using different keywords.</p>
                <button
                    onClick={() => window.location.href = '/'}
                    className="mt-8 bg-emerald-50 text-emerald-600 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-100 transition-all active:scale-95"
                >
                    Clear All Filters
                </button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
                <ProductCard key={product._id} product={product} />
            ))}
        </div>
    );
};

export default ProductList;
