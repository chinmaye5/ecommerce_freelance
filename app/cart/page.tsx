"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, Store, Smartphone, ShieldCheck } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

const CartPage = () => {
    const router = useRouter();
    const { isSignedIn, user } = useUser();
    const [cart, setCart] = useState<any[]>([]);
    const [customerPhone, setCustomerPhone] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCart(savedCart);

        if (user) {
            setCustomerName(user.fullName || "");
        }
    }, [user]);

    const updateQuantity = (productId: string, delta: number) => {
        const updatedCart = cart.map(item => {
            if (item.productId === productId) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        });
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        window.dispatchEvent(new Event("cartUpdated"));
    };

    const removeItem = (productId: string) => {
        const updatedCart = cart.filter(item => item.productId !== productId);
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        window.dispatchEvent(new Event("cartUpdated"));
        toast.info("Item removed from cart");
    };

    const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const checkout = async () => {
        if (!isSignedIn) {
            toast.error("Please login to place an order");
            return;
        }
        if (!customerPhone || !customerName) {
            toast.error("Please fill in your contact details");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: cart,
                    totalAmount,
                    customerName,
                    customerPhone,
                    deliveryAddress: "Store Pickup",
                    deliveryOption: "pickup",
                }),
            });

            const data = await res.json();
            if (res.ok) {
                localStorage.removeItem("cart");
                window.dispatchEvent(new Event("cartUpdated"));
                router.push(`/cart/success/${data._id}`);
            } else {
                toast.error("Failed to place order");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error placing order");
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                <div className="flex justify-center mb-6">
                    <ShoppingBag size={80} className="text-gray-200" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Cart is Empty</h1>
                <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
                <Link href="/" className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition inline-block">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 bg-gray-50">
            <h1 className="text-3xl font-bold text-gray-900 mb-10">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-4">
                    {cart.map((item) => (
                        <div key={item.productId} className="flex gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                            <div className="w-24 h-24 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                            </div>

                            <div className="flex-1 flex flex-col justify-between">
                                <div className="flex justify-between">
                                    <h3 className="font-bold text-gray-900">{item.name}</h3>
                                    <button onClick={() => removeItem(item.productId)} className="text-gray-400 hover:text-red-500 transition">
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <div className="flex justify-between items-end mt-2">
                                    <div className="flex items-center gap-3 bg-gray-100 p-1 rounded-lg">
                                        <button onClick={() => updateQuantity(item.productId, -1)} className="p-1 hover:bg-white rounded transition"><Minus size={14} /></button>
                                        <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.productId, 1)} className="p-1 hover:bg-white rounded transition"><Plus size={14} /></button>
                                    </div>
                                    <p className="font-bold text-gray-900">₹{item.price * item.quantity}</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 rounded-full text-blue-600"><Smartphone size={24} /></div>
                            <div>
                                <p className="font-bold text-gray-900 text-sm">Mobile App & Delivery Coming Soon</p>
                                <p className="text-xs text-gray-500">Only store pickup for now</p>
                            </div>
                        </div>
                        <ShieldCheck className="text-green-500" />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 underline decoration-green-500 underline-offset-4">
                            <Store size={20} className="text-green-600" /> Pickup Details
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Your Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-400"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Phone Number</label>
                                <input
                                    type="tel"
                                    placeholder="Enter phone number"
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-400"
                                    value={customerPhone}
                                    onChange={(e) => setCustomerPhone(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-100 space-y-3">
                            <div className="flex justify-between text-gray-600 text-sm">
                                <span>Subtotal</span>
                                <span>₹{totalAmount}</span>
                            </div>
                            <div className="flex justify-between font-bold text-xl text-gray-900">
                                <span>Total</span>
                                <span>₹{totalAmount}</span>
                            </div>
                        </div>

                        <button
                            onClick={checkout}
                            disabled={loading}
                            className="w-full bg-green-600 text-white py-4 rounded-lg font-bold hover:bg-green-700 transition mt-8 disabled:opacity-50"
                        >
                            {loading ? "Processing..." : "Confirm Order"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
