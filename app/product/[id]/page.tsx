"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ShoppingCart, ArrowLeft, ShieldCheck, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import ProductCard from "@/components/ProductCard";

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
    variants?: Array<{
        name: string;
        price: number;
        discountedPrice?: number;
        stock: number;
    }>;
}

const ProductPage = () => {
    const params = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [recommendations, setRecommendations] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedVariant, setSelectedVariant] = useState<any>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${params.id}`);
                const data = await res.json();
                setProduct(data);

                // Initialize selected variant
                if (data.hasVariants && data.variants && data.variants.length > 0) {
                    setSelectedVariant(data.variants[0]);
                }

                if (data.category) {
                    const recRes = await fetch(`/api/products?category=${encodeURIComponent(data.category)}`);
                    const recData = await recRes.json();
                    setRecommendations(recData.filter((p: Product) => p._id !== data._id).slice(0, 4));
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) fetchProduct();
    }, [params.id]);

    const currentPrice = selectedVariant ? selectedVariant.price : product?.price || 0;
    const currentDiscountPrice = selectedVariant ? selectedVariant.discountedPrice : product?.discountedPrice;
    const currentStock = selectedVariant ? selectedVariant.stock : product?.stock || 0;

    const addToCart = () => {
        if (!product) return;

        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const variantName = selectedVariant?.name;
        const existingItem = cart.find((item: any) =>
            item.productId === product._id && item.variant === variantName
        );

        if (existingItem) {
            if (existingItem.quantity + 1 > currentStock) {
                toast.error(`Only ${currentStock} items available!`);
                return;
            }
            existingItem.quantity += 1;
        } else {
            cart.push({
                productId: product._id,
                name: product.name,
                price: currentDiscountPrice || currentPrice,
                quantity: 1,
                imageUrl: product.imageUrl,
                unit: selectedVariant ? selectedVariant.name : product.unit,
                variant: variantName,
                isVariant: !!product.hasVariants
            });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        window.dispatchEvent(new Event("cartUpdated"));
        toast.success(`${product.name}${variantName ? ` (${variantName})` : ''} added to cart!`);
    };

    if (loading) return (
        <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
            <div className="flex flex-col md:flex-row gap-12">
                <div className="w-full md:w-1/2 aspect-square bg-gray-100 rounded-xl" />
                <div className="w-full md:w-1/2 space-y-4">
                    <div className="h-4 w-20 bg-gray-100 rounded" />
                    <div className="h-8 w-64 bg-gray-100 rounded" />
                    <div className="h-20 w-full bg-gray-100 rounded" />
                </div>
            </div>
        </div>
    );

    if (!product) return <div className="p-20 text-center font-bold text-gray-400">Product not found.</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
            <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-emerald-600 font-bold mb-12 transition-colors uppercase tracking-widest text-xs group">
                <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 group-hover:border-emerald-100 transition-all">
                    <ArrowLeft size={16} />
                </div>
                Back to Products
            </Link>

            <div className="flex flex-col md:flex-row gap-12 lg:gap-24 mb-32">
                {/* Image Section */}
                <div className="w-full md:w-1/2 product-image-container relative">
                    <div className="aspect-[4/5] bg-white rounded-[3rem] overflow-hidden border border-emerald-50/50 shadow-2xl p-4">
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover rounded-[2.5rem]"
                        />
                    </div>
                    {currentStock <= 0 && (
                        <div className="absolute top-8 right-8 bg-gray-900/90 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest backdrop-blur-md shadow-2xl">
                            Out of Stock
                        </div>
                    )}
                </div>

                {/* Details Section */}
                <div className="w-full md:w-1/2 py-6">
                    <div className="mb-8">
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100/50">{product.category}</span>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mt-8 mb-4 tracking-tight leading-tight">{product.name}</h1>
                        {!product.hasVariants && (
                            <div className="flex items-center gap-2 text-emerald-600/60 font-medium bg-emerald-50/50 w-fit px-4 py-1 rounded-full text-sm">
                                <CheckCircle2 size={14} />
                                Quantity: {product.unit}
                            </div>
                        )}
                    </div>

                    {/* Variant Selector */}
                    {product.hasVariants && product.variants && product.variants.length > 0 && (
                        <div className="mb-10 lg:mb-12">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Available Options</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {product.variants.map((variant) => (
                                    <button
                                        key={variant.name}
                                        onClick={() => setSelectedVariant(variant)}
                                        className={`p-5 rounded-[2rem] border-2 transition-all text-left group/v relative ${selectedVariant?.name === variant.name
                                            ? 'border-emerald-600 bg-emerald-600 text-white shadow-xl shadow-emerald-500/20'
                                            : 'border-gray-100 bg-white hover:border-emerald-200 text-gray-700 shadow-sm'
                                            }`}
                                    >
                                        <div className="font-black text-sm mb-1">{variant.name}</div>
                                        <div className={`text-xs font-bold ${selectedVariant?.name === variant.name ? 'text-emerald-100' : 'text-emerald-600'}`}>
                                            ₹{variant.discountedPrice || variant.price}
                                        </div>
                                        {variant.stock <= 5 && variant.stock > 0 && (
                                            <div className="absolute top-2 right-2 flex gap-1">
                                                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-6 mb-12">
                        {currentDiscountPrice && currentDiscountPrice < currentPrice ? (
                            <div className="flex flex-col">
                                <div className="flex items-center gap-4">
                                    <span className="text-5xl font-black text-gray-900 tracking-tighter">₹{currentDiscountPrice}</span>
                                    <span className="text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl font-black text-xs uppercase tracking-widest border border-emerald-100/50">
                                        Save {Math.round(((currentPrice - currentDiscountPrice) / currentPrice) * 100)}%
                                    </span>
                                </div>
                                <span className="text-gray-400 line-through text-lg font-medium mt-1 ml-1 tracking-tight">Reg: ₹{currentPrice}</span>
                            </div>
                        ) : (
                            <span className="text-5xl font-black text-gray-900 tracking-tighter">₹{currentPrice}</span>
                        )}
                    </div>

                    <div className="space-y-4 mb-12">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Product Information</h3>
                        <p className="text-gray-600 leading-relaxed font-light text-lg">{product.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-12">
                        <div className="flex items-center gap-4 p-5 bg-emerald-50/30 rounded-[2rem] border border-emerald-50">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-50">
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-black text-gray-900 uppercase tracking-wider">Premium Quality</p>
                                <p className="text-[10px] text-gray-500 font-medium">100% Guaranteed</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-5 bg-amber-50/30 rounded-[2rem] border border-amber-50">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-amber-600 shadow-sm border border-amber-50">
                                <CheckCircle2 size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-black text-gray-900 uppercase tracking-wider">Store Pickup</p>
                                <p className="text-[10px] text-gray-500 font-medium">Fast & Convenient</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={addToCart}
                        disabled={currentStock <= 0}
                        className="w-full flex items-center justify-center gap-4 bg-emerald-600 text-white py-6 rounded-[2rem] font-black text-xl hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-600/30 active:scale-95 disabled:opacity-50 disabled:bg-gray-400 group"
                    >
                        <ShoppingCart size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        {currentStock > 0 ? "Add to Cart" : "Out of Stock"}
                    </button>

                    <div className="mt-8 flex items-center justify-center gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">In-Store Pickup only for now</p>
                    </div>
                </div>
            </div>

            {/* Recommendations Section */}
            {recommendations.length > 0 && (
                <div className="border-t border-emerald-50 pt-24 mb-12">
                    <div className="flex justify-between items-end mb-16">
                        <div>
                            <h2 className="text-4xl font-black text-gray-900 tracking-tight">You might also love</h2>
                            <div className="h-1.5 w-24 bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full mt-4"></div>
                        </div>
                        <Link href={`/?category=${product.category}`} className="text-emerald-600 font-black hover:text-emerald-700 transition-colors uppercase tracking-[0.2em] text-[10px] mb-2">View All</Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {recommendations.map(p => (
                            <ProductCard key={p._id} product={p} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductPage;
