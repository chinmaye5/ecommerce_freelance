"use client";

import { useEffect, useState } from "react";
import { DollarSign, Package, ShoppingBag, Users, TrendingUp, AlertCircle } from "lucide-react";

const DashboardStats = () => {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalProducts: 0,
        pendingOrders: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app, this would be a single API call
        const fetchStats = async () => {
            try {
                const [ordersRes, productsRes] = await Promise.all([
                    fetch("/api/orders"),
                    fetch("/api/products")
                ]);

                if (!ordersRes.ok || !productsRes.ok) throw new Error("Failed to fetch data");

                const ordersData = await ordersRes.json();
                const productsData = await productsRes.json();

                const orders = Array.isArray(ordersData) ? ordersData : [];
                const products = Array.isArray(productsData) ? productsData : [];

                const totalRevenue = orders
                    .filter((o: any) => o.status === "completed")
                    .reduce((acc: number, o: any) => acc + o.totalAmount, 0);

                const pendingOrders = orders.filter((o: any) => o.status === "pending").length;

                setStats({
                    totalRevenue,
                    totalOrders: orders.length,
                    totalProducts: products.length,
                    pendingOrders,
                });
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        { label: "Total Revenue", value: `₹${stats.totalRevenue}`, icon: DollarSign, color: "text-green-600", bg: "bg-green-100" },
        { label: "Total Orders", value: stats.totalOrders.toString(), icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-100" },
        { label: "Total Products", value: stats.totalProducts.toString(), icon: Package, color: "text-purple-600", bg: "bg-purple-100" },
        { label: "Pending Orders", value: stats.pendingOrders.toString(), icon: AlertCircle, color: "text-orange-600", bg: "bg-orange-100" },
    ];

    if (loading) return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse"></div>)}
    </div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-xl ${stat.bg}`}>
                            <stat.icon size={24} className={stat.color} />
                        </div>
                        <TrendingUp size={20} className="text-gray-300" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DashboardStats;
