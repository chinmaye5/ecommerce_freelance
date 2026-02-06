
"use client";

import Link from "next/link";
import { Plus, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { useState, useMemo } from "react";

interface Variant {
    name: string;
    price: number;
    discountedPrice?: number;
    stock: number;
}

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
    hasVariants?: boolean;
    variants?: Variant[];
}

const ProductCard = ({ product }: { product: Product }) => {
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
        product.hasVariants && product.variants && product.variants.length > 0
            ? product.variants[0]
            : null
    );

    const currentPrice = useMemo(() => {
        if (selectedVariant) return selectedVariant.price;
        return product.price;
    }, [product, selectedVariant]);

    const currentDiscountPrice = useMemo(() => {
        if (selectedVariant) return selectedVariant.discountedPrice;
        return product.discountedPrice;
    }, [product, selectedVariant]);

    const currentStock = useMemo(() => {
        if (selectedVariant) return selectedVariant.stock;
        return product.stock;
    }, [product, selectedVariant]);

    const addToCart = (e: React.MouseEvent) => {
        e.preventDefault();

        if (product.hasVariants && !selectedVariant) {
            toast.error("Please select an option");
            return;
        }

        const cart = JSON.parse(localStorage.getItem("cart") || "[]");

        let existingItemIndex = -1;

        if (product.hasVariants && selectedVariant) {
            // Find item matching both ID and Variant Name
            existingItemIndex = cart.findIndex((item: any) =>
                item.productId === product._id && item.variant === selectedVariant.name
            );
        } else {
            existingItemIndex = cart.findIndex((item: any) =>
                item.productId === product._id && !item.variant
            );
        }

        if (existingItemIndex > -1) {
            if (cart[existingItemIndex].quantity + 1 > currentStock) {
                toast.error(`Only ${currentStock} items available in stock!`);
                return;
            }
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push({
                productId: product._id,
                name: product.name,
                price: currentDiscountPrice || currentPrice,
                originalPrice: currentPrice, // Store original for future ref
                quantity: 1,
                imageUrl: product.imageUrl,
                unit: product.unit,
                variant: selectedVariant?.name, // Add variant to cart item
                isVariant: !!product.hasVariants
            });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        window.dispatchEvent(new Event("cartUpdated"));
        toast.success(`${product.name} ${selectedVariant ? `(${selectedVariant.name})` : ''} added to cart!`);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col h-full group overflow-hidden">
            <Link href={`/product/${product._id}`} className="block relative aspect-square overflow-hidden bg-gray-50 border-b border-gray-50">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                {currentStock <= 0 && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-[2px]">
                        <span className="bg-gray-800 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">Out of Stock</span>
                    </div>
                )}
                {currentDiscountPrice && currentDiscountPrice < currentPrice && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                        {Math.round(((currentPrice - currentDiscountPrice) / currentPrice) * 100)}% OFF
                    </div>
                )}
            </Link>

            <div className="p-4 flex flex-col flex-1">
                <div className="mb-3">
                    <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest mb-1">{product.category}</p>
                    <Link href={`/product/${product._id}`} className="block">
                        <h3 className="font-bold text-gray-900 line-clamp-2 hover:text-green-600 transition-colors">
                            {product.name}
                        </h3>
                    </Link>
                </div>

                {/* Variant Selector */}
                {product.hasVariants && product.variants && (
                    <div className="mb-4">
                        <div className="relative">
                            <select
                                className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 px-3 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer font-medium"
                                value={selectedVariant?.name}
                                onChange={(e) => {
                                    const v = product.variants?.find(v => v.name === e.target.value);
                                    if (v) setSelectedVariant(v);
                                }}
                            >
                                {product.variants.map(v => (
                                    <option key={v.name} value={v.name}>
                                        {v.name} - ₹{v.discountedPrice || v.price}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                )}

                <div className="mt-auto flex items-center justify-between">
                    <div>
                        {currentDiscountPrice && currentDiscountPrice < currentPrice ? (
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-400 line-through">₹{currentPrice}</span>
                                <span className="text-xl font-bold text-green-700 leading-none">₹{currentDiscountPrice}</span>
                            </div>
                        ) : (
                            <p className="text-xl font-bold text-gray-900 leading-none mb-1">₹{currentPrice}</p>
                        )}
                        <p className="text-[10px] text-gray-500 font-medium">
                            {product.hasVariants ? selectedVariant?.name : `per ${product.unit}`}
                        </p>
                    </div>
                    <button
                        onClick={addToCart}
                        disabled={currentStock <= 0}
                        className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors disabled:opacity-50 disabled:bg-gray-200 shadow-lg shadow-green-100"
                    >
                        <Plus size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
