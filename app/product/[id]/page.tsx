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
}

const ProductPage = () => {
    const params = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [recommendations, setRecommendations] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${params.id}`);
                const data = await res.json();
                setProduct(data);

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

    const addToCart = () => {
        if (!product) return;
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const existingItem = cart.find((item: any) => item.productId === product._id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                productId: product._id,
                name: product.name,
                price: product.price,
                quantity: 1,
                imageUrl: product.imageUrl,
                unit: product.unit
            });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        window.dispatchEvent(new Event("cartUpdated"));
        toast.success(`${product.name} added to cart!`);
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
        <div className="max-w-7xl mx-auto px-4 py-12">
            <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-green-600 font-medium mb-12">
                <ArrowLeft size={18} /> Back to Products
            </Link>

            <div className="flex flex-col md:flex-row gap-12 lg:gap-20 mb-20 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                {/* Image Section */}
                <div className="w-full md:w-1/2 bg-gray-50 rounded-xl overflow-hidden border border-gray-50">
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Details Section */}
                <div className="w-full md:w-1/2 py-4">
                    <div className="mb-6">
                        <span className="text-sm font-bold text-green-600 uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full">{product.category}</span>
                        <h1 className="text-4xl font-bold text-gray-900 mt-4 mb-2">{product.name}</h1>
                        <p className="text-gray-500 font-medium">Quantity: {product.unit}</p>
                    </div>

                    <div className="flex items-center gap-4 mb-8">
                        <span className="text-4xl font-bold text-gray-900">₹{product.price}</span>
                        <span className="text-gray-400 line-through text-lg">₹{Math.round(product.price * 1.2)}</span>
                        <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded font-bold text-sm">Save 20%</span>
                    </div>

                    <div className="mb-10 text-gray-600 transition-all">
                        <h3 className="font-bold text-gray-900 mb-2">About this product</h3>
                        <p className="leading-relaxed">{product.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-10">
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <ShieldCheck className="text-green-600" size={24} />
                            <span className="text-sm font-bold text-gray-700">Highest Quality</span>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <CheckCircle2 className="text-blue-600" size={24} />
                            <span className="text-sm font-bold text-gray-700">Store Pickup</span>
                        </div>
                    </div>

                    <button
                        onClick={addToCart}
                        disabled={product.stock <= 0}
                        className="w-full flex items-center justify-center gap-3 bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition disabled:opacity-50"
                    >
                        <ShoppingCart size={22} />
                        {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                    </button>

                    <p className="text-center text-xs text-gray-400 mt-4 font-medium uppercase tracking-widest italic">Pickup available at store location</p>
                </div>
            </div>

            {/* Recommendations Section */}
            {recommendations.length > 0 && (
                <div className="border-t border-gray-100 pt-16">
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-2xl font-bold text-gray-900">Related Products</h2>
                        <Link href={`/?category=${product.category}`} className="text-green-600 font-bold hover:underline">View All</Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
