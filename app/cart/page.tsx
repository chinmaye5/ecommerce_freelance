"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, Store, Smartphone, ShieldCheck, Ticket, X } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

const CartPage = () => {
    const router = useRouter();
    const { isSignedIn, user } = useUser();
    const [cart, setCart] = useState<any[]>([]);
    const [customerPhone, setCustomerPhone] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [loading, setLoading] = useState(false);

    // Coupon State
    const [couponCode, setCouponCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
    const [availableCoupons, setAvailableCoupons] = useState<any[]>([]);

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCart(savedCart);

        if (user) {
            setCustomerName(user.fullName || "");
        }
        fetchAvailableCoupons();
    }, [user]);

    const fetchAvailableCoupons = async () => {
        try {
            const res = await fetch(`/api/coupons?activeOnly=true&t=${Date.now()}`, { cache: 'no-store' });
            if (res.ok) {
                const data = await res.json();
                setAvailableCoupons(data);
            }
        } catch (error) {
            console.error("Failed to fetch coupons:", error);
        }
    };

    const updateQuantity = (productId: string, delta: number, variant?: string) => {
        const updatedCart = cart.map(item => {
            if (item.productId === productId && item.variant === variant) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        });
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        window.dispatchEvent(new Event("cartUpdated"));
    };

    const removeItem = (productId: string, variant?: string) => {
        const updatedCart = cart.filter(item => !(item.productId === productId && item.variant === variant));
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        window.dispatchEvent(new Event("cartUpdated"));
        toast.info("Item removed from cart");
    };

    const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const finalTotal = Math.max(0, totalAmount - discount);

    const handleApplyCoupon = async (codeOverride?: string) => {
        const codeToApply = codeOverride || couponCode;
        if (!codeToApply.trim()) return;
        const loadingToast = toast.loading("Verifying coupon...");
        try {
            const res = await fetch("/api/coupons/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: codeToApply, orderTotal: totalAmount }),
            });
            const data = await res.json();

            toast.dismiss(loadingToast);

            if (res.ok && data.valid) {
                setDiscount(data.discountAmount);
                setAppliedCoupon(data.code);
                setCouponCode(data.code);
                toast.success(`Coupon applied! You saved ₹${data.discountAmount}`);
            } else {
                setDiscount(0);
                setAppliedCoupon(null);
                toast.error(data.message || "Invalid coupon");
            }
        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error("Failed to verify coupon");
        }
    };

    const removeCoupon = () => {
        setDiscount(0);
        setAppliedCoupon(null);
        setCouponCode("");
        toast.info("Coupon removed");
    };

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
                    totalAmount: finalTotal,
                    discount,
                    couponCode: appliedCoupon,
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
            <div className="max-w-4xl mx-auto px-4 py-32 text-center">
                <div className="w-32 h-32 bg-emerald-50 rounded-[3rem] flex items-center justify-center mx-auto mb-10 border border-emerald-100 shadow-xl shadow-emerald-900/5">
                    <ShoppingBag size={48} className="text-emerald-300" />
                </div>
                <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Your cart is feeling light</h1>
                <p className="text-gray-500 mb-12 font-light text-lg">Add some fresh goodness to your cart and start your healthy journey!</p>
                <Link href="/" className="bg-emerald-600 text-white px-12 py-5 rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 inline-block">
                    Explore Fresh Items
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
            <div className="mb-16">
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Shopping <span className="text-emerald-600">Cart</span></h1>
                <div className="h-1.5 w-24 bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full mt-4"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                <div className="lg:col-span-2 space-y-6">
                    {cart.map((item) => (
                        <div key={`${item.productId}-${item.variant || 'default'}`} className="group relative flex gap-6 p-6 bg-white rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-500 border border-emerald-50/50">
                            <div className="w-28 h-28 md:w-32 md:h-32 bg-gray-50 rounded-[2rem] overflow-hidden flex-shrink-0 border border-gray-100 p-2">
                                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded-[1.5rem]" />
                            </div>

                            <div className="flex-1 flex flex-col justify-between py-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-black text-gray-900 text-lg md:text-xl group-hover:text-emerald-700 transition-colors leading-tight">{item.name}</h3>
                                        {item.variant && (
                                            <span className="inline-block mt-2 text-[10px] bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-black uppercase tracking-widest border border-emerald-100/50">
                                                {item.variant}
                                            </span>
                                        )}
                                    </div>
                                    <button onClick={() => removeItem(item.productId, item.variant)} className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all active:scale-90">
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <div className="flex justify-between items-center mt-6">
                                    <div className="flex items-center gap-4 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                                        <button onClick={() => updateQuantity(item.productId, -1, item.variant)} className="w-8 h-8 flex items-center justify-center bg-white rounded-xl shadow-sm hover:text-emerald-600 transition-all active:scale-90"><Minus size={14} /></button>
                                        <span className="font-black text-sm w-6 text-center">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.productId, 1, item.variant)} className="w-8 h-8 flex items-center justify-center bg-white rounded-xl shadow-sm hover:text-emerald-600 transition-all active:scale-90"><Plus size={14} /></button>
                                    </div>
                                    <p className="font-black text-gray-900 text-xl tracking-tighter">₹{item.price * item.quantity}</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="p-8 bg-emerald-500 rounded-[2.5rem] shadow-xl shadow-emerald-500/10 flex flex-col md:flex-row items-center justify-between gap-6 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                        <div className="flex items-center gap-5 relative z-10">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 text-emerald-100"><Smartphone size={32} /></div>
                            <div>
                                <p className="font-black text-xl tracking-tight">App Coming Soon</p>
                                <p className="text-emerald-100/80 text-sm font-medium">Get ready for doorstep delivery. <br className="hidden md:block" />Currently accepting store pickups only.</p>
                            </div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/30 relative z-10">
                            <ShieldCheck className="text-emerald-100 animate-pulse" size={24} />
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-white p-8 rounded-[3rem] shadow-2xl shadow-emerald-900/5 border border-emerald-50/50">
                        <h2 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100">
                                <Store size={20} />
                            </div>
                            Pickup Details
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Full Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[1.5rem] outline-none focus:ring-2 focus:ring-emerald-400 transition-all font-medium text-gray-900"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Mobile Number</label>
                                <input
                                    type="tel"
                                    placeholder="Order updates on this number"
                                    className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[1.5rem] outline-none focus:ring-2 focus:ring-emerald-400 transition-all font-medium text-gray-900"
                                    value={customerPhone}
                                    onChange={(e) => setCustomerPhone(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-emerald-50 space-y-6">
                            {/* Coupon Section */}
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 block">Promo Code</label>
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        placeholder="CODE"
                                        className="w-full px-5 py-4 bg-emerald-50/30 border border-emerald-100 rounded-[1.5rem] outline-none focus:ring-2 focus:ring-emerald-400 uppercase font-black text-emerald-700 tracking-widest placeholder:text-emerald-200"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                        disabled={!!appliedCoupon}
                                    />
                                    {appliedCoupon ? (
                                        <button
                                            onClick={removeCoupon}
                                            className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-100 transition-all active:scale-95 border border-red-100"
                                        >
                                            <X size={24} />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleApplyCoupon()}
                                            disabled={!couponCode}
                                            className="px-6 h-14 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all disabled:opacity-30 active:scale-95 shadow-lg"
                                        >
                                            Apply
                                        </button>
                                    )}
                                </div>

                                {appliedCoupon && (
                                    <div className="mt-4 flex items-center gap-2 text-emerald-600 bg-emerald-50/50 p-3 rounded-2xl border border-emerald-100">
                                        <Ticket size={16} className="animate-bounce" />
                                        <span className="text-xs font-black uppercase tracking-widest">Saved extra with {appliedCoupon}</span>
                                    </div>
                                )}

                                {!appliedCoupon && availableCoupons.length > 0 && (
                                    <div className="space-y-3 mt-8">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Hot Coupons For You</p>
                                        <div className="grid gap-3">
                                            {availableCoupons.map((coupon) => {
                                                const isEligible = totalAmount >= coupon.minOrderAmount;
                                                return (
                                                    <button
                                                        key={coupon._id}
                                                        onClick={() => isEligible && handleApplyCoupon(coupon.code)}
                                                        className={`text-left p-4 rounded-[1.5rem] border-2 transition-all relative overflow-hidden group/c ${isEligible
                                                            ? "border-emerald-100 bg-white hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10 cursor-pointer"
                                                            : "border-gray-50 bg-gray-50/50 opacity-50 cursor-not-allowed"
                                                            }`}
                                                        disabled={!isEligible}
                                                    >
                                                        <div className="flex justify-between items-center relative z-10">
                                                            <div>
                                                                <p className={`font-black text-sm uppercase tracking-widest ${isEligible ? 'text-emerald-700' : 'text-gray-400'}`}>{coupon.code}</p>
                                                                <p className="text-[10px] text-gray-500 font-bold mt-1">
                                                                    {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}% SAVINGS` : `₹${coupon.discountValue} FLAT OFF`}
                                                                </p>
                                                            </div>
                                                            {!isEligible && (
                                                                <p className="text-[9px] text-red-400 font-black uppercase tracking-widest">Min Order ₹{coupon.minOrderAmount}</p>
                                                            )}
                                                        </div>
                                                        {isEligible && <div className="absolute top-0 right-0 -mt-4 -mr-4 w-12 h-12 bg-emerald-50 rounded-full group-hover/c:scale-[3] transition-transform duration-500"></div>}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4 py-6 border-y border-gray-50">
                                <div className="flex justify-between text-gray-400 text-sm font-bold uppercase tracking-widest">
                                    <span>Subtotal</span>
                                    <span className="text-gray-900 tracking-tight">₹{totalAmount}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-emerald-600 text-sm font-black uppercase tracking-widest">
                                        <span>Savings</span>
                                        <span className="tracking-tight">-₹{discount}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Payable</p>
                                    <p className="text-4xl font-black text-gray-900 tracking-tighter">₹{finalTotal}</p>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100/50 mb-2">
                                        <div className="w-1 h-1 bg-emerald-600 rounded-full animate-pulse"></div>
                                        Fast Pickup
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={checkout}
                            disabled={loading}
                            className="w-full bg-gray-900 text-white py-6 rounded-[2rem] font-black text-xl hover:bg-black transition-all mt-10 disabled:opacity-50 shadow-2xl shadow-gray-900/10 active:scale-95 group"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-3">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Securing...</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-3">
                                    Confirm Order
                                    <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                                </div>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
