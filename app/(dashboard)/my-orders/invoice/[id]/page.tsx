"use client";

import { useEffect, useState, use } from "react";
import { Printer, Download, ArrowLeft, Package, Store, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

interface OrderItem {
    productId: string;
    name: string;
    quantity: number;
    price: number;
}

interface Order {
    _id: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    items: OrderItem[];
    totalAmount: number;
    status: string;
    deliveryAddress: string;
    deliveryOption: string;
    createdAt: string;
}

export default function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch(`/api/orders/${id}`);
                const data = await res.json();
                if (res.ok) {
                    setOrder(data);
                }
            } catch (error) {
                console.error("Failed to fetch order:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h1>
                <Link href="/my-orders" className="text-green-600 font-bold flex items-center gap-2">
                    <ArrowLeft size={20} /> Back to My Orders
                </Link>
            </div>
        );
    }

    const subtotal = order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
        <div className="min-h-screen bg-white py-4 px-4 sm:px-6 lg:px-8">
            {/* Top Navigation - Hidden on Print */}
            <div className="max-w-3xl mx-auto mb-6 flex justify-between items-center print:hidden">
                <Link
                    href="/my-orders"
                    className="text-gray-600 hover:text-gray-900 flex items-center gap-2 transition-colors"
                >
                    <ArrowLeft size={18} />
                    <span className="font-medium text-sm">Back</span>
                </Link>
                <div className="flex gap-2">
                    <button
                        onClick={handlePrint}
                        className="bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition shadow-sm"
                    >
                        <Printer size={16} /> Print
                    </button>
                    <button
                        onClick={handlePrint}
                        className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-green-700 transition shadow-sm"
                    >
                        <Download size={16} /> PDF
                    </button>
                </div>
            </div>

            {/* Invoice Paper - Compact Version */}
            <div className="max-w-3xl mx-auto border border-gray-200 rounded-lg overflow-hidden print:border-none print:shadow-none">
                <div className="p-6 sm:p-8">
                    {/* Invoice Header */}
                    <div className="flex justify-between items-start mb-8 gap-4">
                        <div>
                            <h1 className="text-2xl font-black text-gray-900 mb-1 tracking-tight uppercase">Invoice</h1>
                            <p className="text-gray-500 text-xs font-medium">#{order._id.slice(-8).toUpperCase()}</p>
                            <div className="mt-2 text-xs text-gray-400">
                                {new Date(order.createdAt).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                        </div>
                        <div className="text-right flex flex-col items-end max-w-[250px]">
                            <h2 className="text-sm font-black text-green-600 uppercase mb-1">Keshava Kiranam & General Store</h2>
                            <p className="text-[10px] text-gray-500 leading-tight">Opp Bus stand, Nekkonda Road,</p>
                            <p className="text-[10px] text-gray-500 leading-tight">Gudur, Warangal-506134, Telangana</p>
                            <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1"><Phone size={10} /> 9849303230</p>
                            <p className="text-[10px] text-gray-500 flex items-center gap-1"><Mail size={10} /> Keshavakiranam@gmail.com</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 mb-8">
                        <div>
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Customer</h3>
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-gray-900">{order.customerName}</p>
                                <p className="text-xs text-gray-600">{order.customerPhone}</p>
                                <p className="text-xs text-gray-600">{order.customerEmail}</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Shipping</h3>
                            <div className="space-y-1">
                                <p className="text-xs text-gray-600 leading-snug">{order.deliveryAddress}</p>
                                <p className="text-xs font-bold text-green-600 uppercase mt-1">{order.deliveryOption}</p>
                            </div>
                        </div>
                    </div>

                    {/* Items Table - More Compact */}
                    <div className="mb-8">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest pb-3">Item</th>
                                    <th className="text-center py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest pb-3">Price</th>
                                    <th className="text-center py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest pb-3">Qty</th>
                                    <th className="text-right py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest pb-3">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {order.items.map((item, idx) => (
                                    <tr key={idx}>
                                        <td className="py-3">
                                            <p className="font-bold text-gray-900">{item.name}</p>
                                        </td>
                                        <td className="py-3 text-center text-gray-600">₹{item.price}</td>
                                        <td className="py-3 text-center text-gray-600">{item.quantity}</td>
                                        <td className="py-3 text-right font-bold text-gray-900">₹{item.price * item.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Summary */}
                    <div className="flex justify-end pt-4 border-t border-gray-100">
                        <div className="w-full sm:w-48 space-y-2">
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Subtotal</span>
                                <span className="text-gray-900 font-medium">₹{subtotal}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Delivery</span>
                                <span className="text-green-600 font-medium">FREE</span>
                            </div>
                            <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
                                <span className="text-sm font-black text-gray-900 uppercase">Paid Total</span>
                                <span className="text-xl font-black text-green-600">₹{order.totalAmount}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer Note */}
                    <div className="mt-12 pt-6 border-t border-dashed border-gray-100 text-center">
                        <p className="text-gray-400 text-[10px] mb-1 italic">Thank you for your business!</p>
                        <p className="text-[10px] text-gray-300">This is a computer generated invoice.</p>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @media print {
                    body {
                        background-color: white !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                    @page {
                        margin: 1cm;
                    }
                }
            `}</style>
        </div>
    );
}
