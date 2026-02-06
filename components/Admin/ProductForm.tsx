"use client";

import { useState, useEffect } from "react";
import { X, Upload, Save, Plus } from "lucide-react";

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
        discountedPrice: "",
        imageUrl: "",
        category: "",
        stock: "",
        unit: "kg",
        hasVariants: false,
        variants: [] as any[],
    });
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                hasVariants: initialData.hasVariants || false,
                variants: initialData.variants || []
            });
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
                    discountedPrice: formData.discountedPrice ? Number(formData.discountedPrice) : undefined,
                    stock: Number(formData.stock),
                    variants: formData.hasVariants ? formData.variants.map(v => ({
                        ...v,
                        price: Number(v.price),
                        discountedPrice: v.discountedPrice ? Number(v.discountedPrice) : undefined,
                        stock: Number(v.stock)
                    })) : []
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

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Discounted Price (Optional)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                                    value={formData.discountedPrice || ""}
                                    onChange={(e) => setFormData({ ...formData, discountedPrice: e.target.value })}
                                />
                                {formData.price && formData.discountedPrice && Number(formData.price) > Number(formData.discountedPrice) && (
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
                                        {Math.round(((Number(formData.price) - Number(formData.discountedPrice)) / Number(formData.price)) * 100)}% OFF
                                    </span>
                                )}
                            </div>
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

                    <div className="pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 mb-4">
                            <input
                                type="checkbox"
                                id="hasVariants"
                                className="w-4 h-4 text-green-600 rounded focus:ring-green-500 border-gray-300"
                                checked={formData.hasVariants}
                                onChange={(e) => {
                                    const checked = e.target.checked;
                                    setFormData(prev => {
                                        if (checked && (!prev.variants || prev.variants.length === 0)) {
                                            // Initialize with one empty variant
                                            return {
                                                ...prev,
                                                hasVariants: true,
                                                variants: [{
                                                    name: "",
                                                    price: "",
                                                    discountedPrice: "",
                                                    stock: ""
                                                }]
                                            };
                                        }
                                        return {
                                            ...prev,
                                            hasVariants: checked
                                        };
                                    });
                                }}
                            />
                            <label htmlFor="hasVariants" className="font-bold text-gray-900 select-none cursor-pointer">
                                This product has multiple options (e.g., sizes, weights)
                            </label>
                        </div>

                        {formData.hasVariants && (
                            <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <p className="text-sm font-semibold text-gray-700 mb-2">Product Options (Sizes/Quantities)</p>
                                {formData.variants && formData.variants.length > 0 ? (
                                    <>
                                        {formData.variants.map((variant, index) => (
                                            <div key={index} className="grid grid-cols-12 gap-3 items-start relative animate-in fade-in slide-in-from-top-2">
                                                <div className="col-span-3">
                                                    <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Option Name</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        placeholder="e.g. 1kg"
                                                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 outline-none focus:border-green-500"
                                                        value={variant.name || ""}
                                                        onChange={(e) => {
                                                            const newVariants = [...formData.variants];
                                                            newVariants[index].name = e.target.value;
                                                            setFormData({ ...formData, variants: newVariants });
                                                        }}
                                                    />
                                                </div>
                                                <div className="col-span-3">
                                                    <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Price</label>
                                                    <input
                                                        type="number"
                                                        required
                                                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 outline-none focus:border-green-500"
                                                        value={variant.price || ""}
                                                        onChange={(e) => {
                                                            const newVariants = [...formData.variants];
                                                            newVariants[index].price = e.target.value;
                                                            setFormData({ ...formData, variants: newVariants });
                                                        }}
                                                    />
                                                </div>
                                                <div className="col-span-3">
                                                    <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Discount Price</label>
                                                    <input
                                                        type="number"
                                                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 outline-none focus:border-green-500"
                                                        value={variant.discountedPrice || ""}
                                                        onChange={(e) => {
                                                            const newVariants = [...formData.variants];
                                                            newVariants[index].discountedPrice = e.target.value;
                                                            setFormData({ ...formData, variants: newVariants });
                                                        }}
                                                    />
                                                </div>
                                                <div className="col-span-2">
                                                    <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Stock</label>
                                                    <input
                                                        type="number"
                                                        required
                                                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 outline-none focus:border-green-500"
                                                        value={variant.stock || ""}
                                                        onChange={(e) => {
                                                            const newVariants = [...formData.variants];
                                                            newVariants[index].stock = e.target.value;
                                                            setFormData({ ...formData, variants: newVariants });
                                                        }}
                                                    />
                                                </div>
                                                <div className="col-span-1 pt-6 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (formData.variants.length === 1) return;
                                                            const newVariants = formData.variants.filter((_, i) => i !== index);
                                                            setFormData({ ...formData, variants: newVariants });
                                                        }}
                                                        className="text-red-500 hover:bg-red-50 p-1 rounded transition"
                                                        disabled={formData.variants.length === 1}
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <p className="text-sm text-gray-500 italic">Click the button below to add your first option.</p>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setFormData({
                                        ...formData,
                                        variants: [...(formData.variants || []), { name: "", price: "", discountedPrice: "", stock: "" }]
                                    })}
                                    className="w-full py-2 px-4 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition flex items-center justify-center gap-2"
                                >
                                    <Plus size={18} /> Add Option
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4 pt-4 sticky bottom-0 bg-white border-t border-gray-100">
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
