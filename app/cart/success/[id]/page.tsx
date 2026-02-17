"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Package, ArrowRight, ShoppingBag, FileText, MapPin, Store } from "lucide-react";
import confetti from "canvas-confetti";

export default function OrderSuccessPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [order, setOrder] = useState<any>(null);

    useEffect(() => {
        // Simple confetti burst
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        // Fetch order details for display
        fetch(`/api/orders/${id}`).then(res => res.json()).then(data => setOrder(data));

        return () => clearInterval(interval);
    }, [id]);

    return (
        <div className="min-h-[90vh] flex items-center justify-center px-4 py-20 relative overflow-hidden bg-[#fafafa]">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-600"></div>
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl"></div>

            <div className="max-w-xl w-full text-center relative z-10">
                <div className="mb-10 flex justify-center">
                    <div className="w-24 h-24 bg-emerald-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-emerald-500/40 animate-bounce">
                        <CheckCircle2 size={48} />
                    </div>
                </div>

                <h1 className="text-5xl font-black text-gray-900 mb-6 tracking-tighter">Order Confirmed!</h1>
                <p className="text-gray-500 text-lg mb-12 leading-relaxed font-light">
                    Thank you for choosing <span className="text-emerald-600 font-black">Keshava Kiranam</span>.
                    Your order <span className="font-black text-gray-900 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-100">#{id.slice(-8).toUpperCase()}</span> is being prepared with care.
                </p>

                <div className="bg-white border border-emerald-50/50 rounded-[3rem] shadow-2xl shadow-emerald-900/5 p-10 mb-12 text-left relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>

                    <h3 className="font-black text-gray-900 mb-10 flex items-center gap-3 relative z-10">
                        <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 border border-emerald-100">
                            <Package size={20} />
                        </div>
                        Quick Pickup Steps
                    </h3>

                    <div className="space-y-10 relative z-10">
                        <div className="flex gap-6">
                            <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-black text-xs flex-shrink-0 shadow-lg shadow-emerald-600/20">1</div>
                            <div>
                                <p className="font-black text-gray-900 uppercase tracking-widest text-[10px] mb-1">Preparation</p>
                                <p className="font-bold text-gray-900 text-lg">Wait for packing</p>
                                <p className="text-sm text-gray-500 font-medium">We're meticulously packing your fresh picks. Watch your status in the dashboard.</p>
                            </div>
                        </div>
                        <div className="flex gap-6">
                            <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-black text-xs flex-shrink-0 shadow-lg shadow-emerald-600/20">2</div>
                            <div>
                                <p className="font-black text-gray-400 uppercase tracking-widest text-[10px] mb-1">Fulfillment</p>
                                <p className="font-bold text-gray-900 text-lg">Visit Our Store</p>
                                <div className="flex items-center gap-2 mt-2 bg-gray-50 p-3 rounded-2xl w-fit border border-gray-100">
                                    <MapPin size={16} className="text-emerald-600" />
                                    <p className="text-[10px] text-gray-700 font-black uppercase tracking-widest">Gudur, Warangal-506134</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-5 justify-center mb-12">
                    <Link
                        href={`/my-orders/invoice/${id}`}
                        className="flex items-center justify-center gap-3 bg-gray-900 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-900/10 active:scale-95 group"
                    >
                        <FileText size={20} className="group-hover:scale-110 transition-transform" />
                        View Invoice
                    </Link>
                    <Link
                        href="/my-orders"
                        className="flex items-center justify-center gap-3 bg-emerald-600 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 group"
                    >
                        <Store size={20} className="group-hover:scale-110 transition-transform" />
                        Track Order
                    </Link>
                </div>

                <Link href="/" className="inline-flex items-center justify-center gap-3 text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em] hover:text-emerald-700 transition-all group">
                    <ArrowRight size={16} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
}
