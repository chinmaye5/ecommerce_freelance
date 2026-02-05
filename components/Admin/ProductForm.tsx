"use client";

import { useState, useEffect } from "react";
import { X, Upload, Save } from "lucide-react";

interface ProductFormProps {
    onClose: () => void;
    onSuccess: () => void;
    initialData?: any;
}

const ProductForm = ({ onClose, onSuccess, initialData }: ProductFormProps) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        imageUrl: "",
        category: "",
        stock: "",
        unit: "kg",
    });
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }

        const fetchCategories = async () => {
            const res = await fetch("/api/categories");
            const data = await res.json();
            setCategories(data);
        };
        fetchCategories();
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = initialData ? `/api/products/${initialData._id}` : "/api/products";
            const method = initialData ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    price: Number(formData.price),
                    stock: Number(formData.stock),
                }),
            });

            if (res.ok) {
                onSuccess();
            } else {
                alert("Failed to save product");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-gray-900">
                        {initialData ? "Edit Product" : "Add New Product"}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Product Name</label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. Basmati Rice"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Category</label>
                            <select
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Price (INR)</label>
                            <input
                                required
                                type="number"
                                placeholder="0.00"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2 text-gray-700 flex gap-4">
                            <div className="flex-1 space-y-2">
                                <label className="text-sm font-semibold">Stock</label>
                                <input
                                    required
                                    type="number"
                                    placeholder="0"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                />
                            </div>
                            <div className="flex-1 space-y-2">
                                <label className="text-sm font-semibold">Unit</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="kg, pc, pkt"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                                    value={formData.unit}
                                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Image URL</label>
                        <input
                            required
                            type="url"
                            placeholder="https://example.com/image.jpg"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition font-mono text-sm"
                            value={formData.imageUrl}
                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        />
                        <p className="text-xs text-gray-500 italic">No upload needed. Just paste a direct image link.</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Description</label>
                        <textarea
                            required
                            rows={4}
                            placeholder="Tell customers about this product..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition resize-none"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="flex gap-4 pt-4 sticky bottom-0 bg-white">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-4 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-2 px-12 py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition shadow-lg shadow-green-200 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? "Saving..." : (
                                <>
                                    <Save size={20} />
                                    {initialData ? "Update Product" : "Save Product"}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;
