"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tag, Percent, Flame, ArrowLeft } from "lucide-react";

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    discountedPrice?: number;
    imageUrl: string;
    category: string;
    stock: number;
    unit: string;
    isOnOffer: boolean;
}

export default function OffersPage() {
    const router = useRouter();
    const [offers, setOffers] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const res = await fetch("/api/offers");
                const data = await res.json();
                setOffers(data);
            } catch (error) {
                console.error("Error fetching offers:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOffers();
    }, []);

    const calculateDiscount = (price: number, discountedPrice?: number) => {
        if (!discountedPrice) return 0;
        return Math.round(((price - discountedPrice) / price) * 100);
    };

    return (
        <div className="min-h-screen bg-[#fafafa]">
            {/* Header */}
            <div className="bg-gradient-to-br from-amber-500 via-orange-600 to-red-700 py-16 md:py-24 px-4 shadow-2xl relative overflow-hidden">
                {/* Subtle Background Elements */}
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <button
                        onClick={() => router.push("/")}
                        className="mb-8 flex items-center gap-2 text-white/80 hover:text-white transition-all group uppercase tracking-[0.2em] text-[10px] font-black"
                    >
                        <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 group-hover:bg-white/20 transition-all">
                            <ArrowLeft size={16} />
                        </div>
                        Back to Shop
                    </button>

                    <div className="text-center">
                        <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full mb-8 border border-white/20">
                            <Flame className="text-amber-300 animate-pulse" size={20} />
                            <span className="text-white font-black text-xs uppercase tracking-widest">Unmissable Savings</span>
                        </div>

                        <h1 className="text-4xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-tight drop-shadow-2xl">
                            Special <span className="text-amber-300">Offers</span>
                        </h1>
                        <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
                            Premium products at exclusive prices. Discover handpicked deals
                            designed to bring you the best value for your daily essentials.
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                {loading ? (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Curating Deals...</p>
                    </div>
                ) : offers.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-[3rem] shadow-2xl shadow-emerald-900/5 border border-emerald-50 max-w-2xl mx-auto">
                        <div className="w-24 h-24 bg-emerald-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-emerald-100">
                            <Tag className="text-emerald-300" size={48} />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">No Offers Today</h2>
                        <p className="text-gray-500 mb-10 font-light">We're working on some exciting new deals. Check back soon for premium savings!</p>
                        <button
                            onClick={() => router.push("/")}
                            className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
                        >
                            Browse All Products
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <h2 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-4">
                                    Today&apos;s <span className="text-emerald-600">Hot Deals</span>
                                </h2>
                                <div className="h-1.5 w-24 bg-gradient-to-r from-amber-500 to-orange-400 rounded-full mt-4"></div>
                            </div>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
                                {offers.length} Premium Offers Available
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {offers.map((product) => {
                                const discount = calculateDiscount(product.price, product.discountedPrice);
                                const finalPrice = product.discountedPrice || product.price;
                                const isOutOfStock = product.stock === 0;

                                return (
                                    <div
                                        key={product._id}
                                        onClick={() => !isOutOfStock && router.push(`/product/${product._id}`)}
                                        className={`group bg-white rounded-[2.5rem] p-3 shadow-sm hover:shadow-2xl transition-all duration-500 border border-emerald-50/50 flex flex-col relative h-full ${!isOutOfStock ? "cursor-pointer" : "opacity-75"}`}
                                    >
                                        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-gray-50 mb-4">
                                            <img
                                                src={product.imageUrl}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />

                                            {/* Offer Badges */}
                                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                                <div className="bg-amber-500 text-white px-3 py-1.5 rounded-full font-black text-[10px] shadow-lg flex items-center gap-1 uppercase tracking-widest animate-pulse">
                                                    <Flame size={12} />
                                                    Deal
                                                </div>
                                                {discount > 0 && (
                                                    <div className="bg-white text-emerald-700 px-3 py-1.5 rounded-full font-black text-xs shadow-lg border border-emerald-100">
                                                        {discount}% OFF
                                                    </div>
                                                )}
                                            </div>

                                            {isOutOfStock && (
                                                <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-[2px]">
                                                    <span className="bg-gray-900 text-white px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-2xl">
                                                        Out of Stock
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="px-4 pb-4 flex flex-col flex-1">
                                            <div className="mb-4">
                                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2 block">
                                                    {product.category}
                                                </span>
                                                <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 leading-snug group-hover:text-emerald-700 transition-colors">
                                                    {product.name}
                                                </h3>
                                            </div>

                                            <div className="mt-auto pt-4 border-t border-emerald-50/50 flex items-center justify-between">
                                                <div className="flex flex-col">
                                                    {product.discountedPrice ? (
                                                        <>
                                                            <span className="text-xs text-gray-400 line-through font-medium">
                                                                ₹{product.price}
                                                            </span>
                                                            <span className="text-2xl font-black text-emerald-700 tracking-tighter">
                                                                ₹{finalPrice}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="text-2xl font-black text-gray-900 tracking-tighter">
                                                            ₹{finalPrice}
                                                        </span>
                                                    )}
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">per {product.unit}</span>
                                                </div>

                                                <div className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100/50">
                                                    Stock: {product.stock}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
