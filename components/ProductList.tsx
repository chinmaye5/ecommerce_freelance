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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="aspect-square bg-gray-100 rounded-xl animate-pulse"></div>
                ))}
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="col-span-full py-20 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="text-gray-400" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No items found</h3>
                <p className="text-gray-500 max-w-sm mx-auto">We couldn't find any products matching your search. Try different keywords or browse all categories.</p>
                <button
                    onClick={() => window.location.href = '/'}
                    className="mt-6 text-green-600 font-bold hover:underline"
                >
                    Clear Filters
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
