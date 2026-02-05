"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Clock, Package, XCircle, ChevronDown, ChevronUp, User, Phone } from "lucide-react";
import { toast } from "sonner";

interface Order {
    _id: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    totalAmount: number;
    status: string;
    deliveryAddress: string;
    items: any[];
    createdAt: string;
}

const OrderList = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch("/api/orders");
            const data = await res.json();
            setOrders(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            const res = await fetch(`/api/orders/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            if (res.ok) {
                setOrders(orders.map(o => o._id === id ? { ...o, status } : o));
                toast.success(`Order status updated to ${status}`);
            } else {
                toast.error("Failed to update status");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        }
    };

    const statusColors: any = {
        pending: "bg-amber-100 text-amber-700",
        processing: "bg-blue-100 text-blue-700",
        completed: "bg-green-100 text-green-700",
        cancelled: "bg-red-100 text-red-700",
    };

    if (loading) return <div className="p-10 text-center font-bold text-gray-400">Loading orders...</div>;

    return (
        <div className="space-y-4">
            {orders.length === 0 ? (
                <div className="text-center py-20 text-gray-400 font-medium">No orders found.</div>
            ) : (
                orders.map((order) => (
                    <div key={order._id} className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                        <div className="p-4 flex flex-wrap items-center justify-between gap-4 cursor-pointer hover:bg-gray-50 transition"
                            onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                                    <User size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{order.customerName}</h3>
                                    <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <p className="text-xs font-bold text-gray-400 uppercase leading-none mb-1">Total</p>
                                    <p className="font-bold text-gray-900 leading-none">₹{order.totalAmount}</p>
                                </div>

                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${statusColors[order.status]}`}>
                                    {order.status}
                                </span>

                                {expandedOrder === order._id ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                            </div>
                        </div>

                        {expandedOrder === order._id && (
                            <div className="p-6 bg-gray-50 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h4 className="font-bold text-gray-900 border-b border-gray-200 pb-2">Customer Info</h4>
                                    <p className="text-sm flex items-center gap-2"><Phone size={14} className="text-gray-400" /> {order.customerPhone}</p>
                                    <p className="text-sm"><b>Fulfillment:</b> Store Pickup</p>

                                    <div className="pt-4 space-y-2">
                                        <p className="text-xs font-bold text-gray-500 uppercase">Update Status</p>
                                        <div className="flex flex-wrap gap-2">
                                            <button onClick={() => updateStatus(order._id, 'processing')} className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs font-bold hover:bg-blue-700 transition">Pack Order</button>
                                            <button onClick={() => updateStatus(order._id, 'completed')} className="px-3 py-1.5 bg-green-600 text-white rounded-md text-xs font-bold hover:bg-green-700 transition">Ready Pickup</button>
                                            <button onClick={() => updateStatus(order._id, 'cancelled')} className="px-3 py-1.5 bg-red-600 text-white rounded-md text-xs font-bold hover:bg-red-700 transition">Cancel</button>
                                        </div>
                                    </div>
                                    <div className="pt-4">
                                        <a
                                            href={`/my-orders/invoice/${order._id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-green-600 font-bold text-xs flex items-center gap-2 hover:underline"
                                        >
                                            <Package size={14} /> View/Print Invoice
                                        </a>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2">
                                        <Package size={16} /> Order Details
                                    </h4>
                                    {order.items.map((item: any, idx: number) => (
                                        <div key={idx} className="flex justify-between text-sm py-1">
                                            <span>{item.quantity}x {item.name}</span>
                                            <span className="font-bold text-gray-900">₹{item.quantity * item.price}</span>
                                        </div>
                                    ))}
                                    <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-gray-900">
                                        <span>Total</span>
                                        <span>₹{order.totalAmount}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default OrderList;
