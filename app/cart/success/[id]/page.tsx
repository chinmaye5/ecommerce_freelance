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
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
            <div className="max-w-xl w-full text-center">
                <div className="mb-8 flex justify-center">
                    <div className="bg-green-100 p-4 rounded-full text-green-600 animate-bounce">
                        <CheckCircle2 size={64} />
                    </div>
                </div>

                <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Order Confirmed!</h1>
                <p className="text-gray-500 text-lg mb-10 leading-relaxed">
                    Thank you for shopping with <span className="text-green-600 font-bold">Keshava Kiranam</span>.
                    Your order <span className="font-mono text-gray-900 bg-gray-100 px-2 py-0.5 rounded">#{id.slice(-8).toUpperCase()}</span> has been placed successfully.
                </p>

                <div className="bg-white border border-gray-100 rounded-2xl shadow-xl p-8 mb-10 text-left">
                    <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Package size={20} className="text-green-600" /> Next Steps
                    </h3>
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center text-green-600 font-bold flex-shrink-0">1</div>
                            <div>
                                <p className="font-bold text-gray-900">Wait for packing</p>
                                <p className="text-sm text-gray-500">We are currently packing your items. You'll see the status update in your dashboard.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center text-green-600 font-bold flex-shrink-0">2</div>
                            <div>
                                <p className="font-bold text-gray-900">Visit Store</p>
                                <div className="flex items-start gap-1 mt-1">
                                    <MapPin size={14} className="text-gray-400 mt-1" />
                                    <p className="text-sm text-gray-500 italic">Opp Bus stand, Nekkonda Road, Gudur</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href={`/my-orders/invoice/${id}`}
                        className="flex items-center justify-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-black transition-all shadow-lg"
                    >
                        <FileText size={20} /> View Invoice
                    </Link>
                    <Link
                        href="/my-orders"
                        className="flex items-center justify-center gap-2 bg-green-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg"
                    >
                        <Store size={20} /> Track Orders
                    </Link>
                </div>

                <Link href="/" className="inline-block mt-8 text-gray-400 hover:text-green-600 font-bold text-sm flex items-center justify-center gap-2">
                    <ArrowRight size={16} className="rotate-180" /> Continue Shopping
                </Link>
            </div>
        </div>
    );
}
