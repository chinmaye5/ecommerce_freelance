"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Clock, XCircle, ShoppingBag, Package, Store } from "lucide-react";
import Link from "next/link";

interface Order {
    _id: string;
    totalAmount: number;
    status: string;
    deliveryAddress: string;
    deliveryOption: string;
    items: any[];
    createdAt: string;
}

const MyOrdersPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch("/api/orders/my-orders");
                const data = await res.json();
                setOrders(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const statusConfig: any = {
        pending: { color: "text-amber-600 bg-amber-50", icon: <Clock size={16} />, label: "Pending" },
        processing: { color: "text-blue-600 bg-blue-50", icon: <Package size={16} />, label: "Packing" },
        completed: { color: "text-green-600 bg-green-50", icon: <CheckCircle2 size={16} />, label: "Ready for Pickup" },
        cancelled: { color: "text-red-600 bg-red-50", icon: <XCircle size={16} />, label: "Cancelled" },
    };

    if (loading) return (
        <div className="max-w-7xl mx-auto px-4 py-20 animate-pulse">
            <div className="h-40 bg-gray-100 rounded-xl mb-6"></div>
            <div className="h-40 bg-gray-100 rounded-xl mb-6"></div>
        </div>
    );

    if (orders.length === 0) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                <ShoppingBag size={64} className="text-gray-200 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">No orders found</h1>
                <p className="text-gray-500 mb-8">You haven't placed any orders yet.</p>
                <Link href="/" className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition inline-block">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

            <div className="space-y-6">
                {orders.map((order) => {
                    const config = statusConfig[order.status] || statusConfig.pending;
                    return (
                        <div key={order._id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-4 md:p-6 bg-gray-50/50 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Order Date</p>
                                    <p className="font-bold text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Total Amount</p>
                                    <p className="font-bold text-gray-900">₹{order.totalAmount}</p>
                                </div>
                                <div className={`flex items-center gap-2 px-3 py-1 rounded-full font-bold text-xs uppercase ${config.color}`}>
                                    {config.icon} {config.label}
                                </div>
                            </div>

                            <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Store size={18} className="text-green-600" /> Store Pickup Location
                                    </h4>
                                    <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        Visit our store to collect your items once the status is marked as <b>Ready for Pickup</b>.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="text-sm font-bold text-gray-900 mb-4">Ordered Items</h4>
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-sm">
                                            <p className="text-gray-600 truncate max-w-[200px]">
                                                <span className="font-bold text-gray-900 mr-2">{item.quantity}x</span> {item.name}
                                            </p>
                                            <p className="font-bold text-gray-900">₹{item.price * item.quantity}</p>
                                        </div>
                                    ))}
                                    <div className="pt-4 border-t border-dashed border-gray-200 mt-4 flex justify-between items-center">
                                        <Link
                                            href={`/my-orders/invoice/${order._id}`}
                                            className="text-green-600 font-bold text-sm flex items-center gap-2 hover:underline"
                                        >
                                            <Package size={16} /> View Invoice
                                        </Link>
                                        <p className="text-xs text-gray-400">ID: {order._id.slice(-8).toUpperCase()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MyOrdersPage;
