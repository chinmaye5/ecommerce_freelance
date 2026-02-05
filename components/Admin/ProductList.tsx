"use client";

import { useState, useEffect } from "react";
import { Edit, Trash2, Package, Tag } from "lucide-react";

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

const AdminProductList = ({ onEdit }: { onEdit: (product: Product) => void }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch("/api/products");
            const data = await res.json();
            setProducts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        try {
            const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
            if (res.ok) {
                setProducts(products.filter((p) => p._id !== id));
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="p-12 text-center text-gray-500">Loading products...</div>;

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 text-xs font-bold text-gray-400 uppercase">Product</th>
                            <th className="p-4 text-xs font-bold text-gray-400 uppercase">Category</th>
                            <th className="p-4 text-xs font-bold text-gray-400 uppercase">Price</th>
                            <th className="p-4 text-xs font-bold text-gray-400 uppercase">Stock</th>
                            <th className="p-4 text-xs font-bold text-gray-400 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {products.map((product) => (
                            <tr key={product._id} className="hover:bg-gray-50/50 transition">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <img src={product.imageUrl} alt={product.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                                        <div>
                                            <p className="font-bold text-gray-900">{product.name}</p>
                                            <p className="text-xs text-gray-500">{product.unit}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                                        <Tag size={12} />
                                        {product.category}
                                    </span>
                                </td>
                                <td className="p-4 font-bold text-gray-900">₹{product.price}</td>
                                <td className="p-4">
                                    <span className={`font-medium ${product.stock <= 5 ? "text-red-600" : "text-gray-600"}`}>
                                        {product.stock} {product.unit}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => onEdit(product)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => deleteProduct(product._id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-12 text-center text-gray-400 italic">No products found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminProductList;
