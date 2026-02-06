"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Ticket, Percent, DollarSign } from "lucide-react";
import { toast } from "sonner";

const CouponManager = () => {
    const [coupons, setCoupons] = useState<any[]>([]);
    const [newCoupon, setNewCoupon] = useState({
        code: "",
        discountType: "PERCENTAGE",
        discountValue: 0,
        minOrderAmount: 0
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            const res = await fetch("/api/coupons");
            const data = await res.json();
            setCoupons(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            setCoupons([]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/coupons", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newCoupon),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Coupon created successfully");
                setNewCoupon({
                    code: "",
                    discountType: "PERCENTAGE",
                    discountValue: 0,
                    minOrderAmount: 0
                });
                fetchCoupons();
            } else {
                toast.error(data.error || "Failed to create coupon");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this coupon?")) return;

        try {
            const res = await fetch(`/api/coupons/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Coupon deleted");
                fetchCoupons();
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <Plus size={18} className="text-green-600" />
                            Add Coupon
                        </h3>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Code</label>
                            <input
                                required
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border border-gray-100 focus:ring-2 focus:ring-green-500 outline-none transition uppercase"
                                value={newCoupon.code}
                                onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                                placeholder="WELCOME10"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Type</label>
                                <select
                                    className="w-full px-4 py-2 rounded-lg border border-gray-100 focus:ring-2 focus:ring-green-500 outline-none transition"
                                    value={newCoupon.discountType}
                                    onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value })}
                                >
                                    <option value="PERCENTAGE">Percentage (%)</option>
                                    <option value="FLAT">Flat (₹)</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Value</label>
                                <input
                                    required
                                    type="number"
                                    min="0"
                                    max={newCoupon.discountType === "PERCENTAGE" ? "100" : undefined}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-100 focus:ring-2 focus:ring-green-500 outline-none transition"
                                    value={newCoupon.discountValue}
                                    onChange={(e) => {
                                        let val = Number(e.target.value);
                                        if (newCoupon.discountType === "PERCENTAGE" && val > 100) val = 100;
                                        setNewCoupon({ ...newCoupon, discountValue: val });
                                    }}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Min Order Amount (₹)</label>
                            <input
                                required
                                type="number"
                                min="0"
                                className="w-full px-4 py-2 rounded-lg border border-gray-100 focus:ring-2 focus:ring-green-500 outline-none transition"
                                value={newCoupon.minOrderAmount}
                                onChange={(e) => setNewCoupon({ ...newCoupon, minOrderAmount: Number(e.target.value) })}
                            />
                        </div>

                        <button
                            disabled={loading}
                            className="w-full bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 transition disabled:opacity-50"
                        >
                            {loading ? "Adding..." : "Add Coupon"}
                        </button>
                    </form>
                </div>
            </div>

            <div className="md:col-span-2">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {/* Desktop Table */}
                    <table className="w-full hidden md:table">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left p-4 text-xs font-bold text-gray-400 uppercase">Code</th>
                                <th className="text-left p-4 text-xs font-bold text-gray-400 uppercase">Discount</th>
                                <th className="text-left p-4 text-xs font-bold text-gray-400 uppercase">Min Order</th>
                                <th className="text-right p-4 text-xs font-bold text-gray-400 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {coupons.map((coupon) => (
                                <tr key={coupon._id} className="hover:bg-gray-50/50 transition">
                                    <td className="p-4 font-medium text-gray-900 flex items-center gap-2">
                                        <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                                            <Ticket size={16} />
                                        </div>
                                        {coupon.code}
                                    </td>
                                    <td className="p-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            {coupon.discountType === 'PERCENTAGE' ? <Percent size={14} /> : <DollarSign size={14} />}
                                            {coupon.discountValue}
                                            {coupon.discountType === 'PERCENTAGE' ? '% OFF' : ' OFF'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-500">₹{coupon.minOrderAmount}</td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => handleDelete(coupon._id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {coupons.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-400 italic">No coupons created yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Mobile Cards */}
                    <div className="md:hidden divide-y divide-gray-100">
                        {coupons.map((coupon) => (
                            <div key={coupon._id} className="p-4">
                                <div className="flex items-center justify-between gap-4 mb-2">
                                    <div className="font-medium text-gray-900 flex items-center gap-2">
                                        <div className="p-1.5 bg-purple-50 rounded-md text-purple-600">
                                            <Ticket size={14} />
                                        </div>
                                        {coupon.code}
                                    </div>
                                    <button
                                        onClick={() => handleDelete(coupon._id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                <div className="pl-9 flex gap-4 text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                        {coupon.discountType === 'PERCENTAGE' ? <Percent size={14} /> : <DollarSign size={14} />}
                                        {coupon.discountValue}{coupon.discountType === 'PERCENTAGE' ? '%' : ''}
                                    </span>
                                    <span>Min: ₹{coupon.minOrderAmount}</span>
                                </div>
                            </div>
                        ))}
                        {coupons.length === 0 && (
                            <div className="p-8 text-center text-gray-400 italic">No coupons created yet.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CouponManager;
