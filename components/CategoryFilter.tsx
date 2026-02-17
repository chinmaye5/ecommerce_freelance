"use client";

import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";

interface Category {
    _id: string;
    name: string;
}

const CategoryFilter = ({ selectedCategory, onSelect }: {
    selectedCategory: string;
    onSelect: (cat: string) => void
}) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("/api/categories");
                const data = await res.json();
                setCategories(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    if (loading) return <div className="space-y-2">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />)}
    </div>;

    return (
        <div className="flex flex-row md:flex-col gap-3 overflow-x-auto no-scrollbar md:overflow-visible pb-4 md:pb-0">
            <button
                onClick={() => onSelect("")}
                className={`px-5 py-3.5 rounded-2xl text-sm font-bold transition-all flex items-center justify-between whitespace-nowrap md:whitespace-normal border-2 ${selectedCategory === ""
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-xl shadow-emerald-600/20 active:scale-95"
                    : "bg-white text-gray-500 border-gray-100/80 hover:border-emerald-200 hover:text-emerald-700 hover:bg-emerald-50/30"
                    }`}
            >
                All Products
                <div className={`p-1 rounded-full ${selectedCategory === "" ? "bg-emerald-500" : "bg-gray-100 group-hover:bg-emerald-100"} transition-colors hidden md:block`}>
                    <ChevronRight size={14} className={selectedCategory === "" ? "text-white" : "text-gray-400"} />
                </div>
            </button>

            {categories.map((cat) => (
                <button
                    key={cat._id}
                    onClick={() => onSelect(cat.name)}
                    className={`px-5 py-3.5 rounded-2xl text-sm font-bold transition-all flex items-center justify-between whitespace-nowrap md:whitespace-normal border-2 ${selectedCategory === cat.name
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-xl shadow-emerald-600/20 active:scale-95"
                        : "bg-white text-gray-500 border-gray-100/80 hover:border-emerald-200 hover:text-emerald-700 hover:bg-emerald-50/30"
                        }`}
                >
                    {cat.name}
                    <div className={`p-1 rounded-full ${selectedCategory === cat.name ? "bg-emerald-500" : "bg-gray-100 group-hover:bg-emerald-100"} transition-colors hidden md:block`}>
                        <ChevronRight size={14} className={selectedCategory === cat.name ? "text-white" : "text-gray-400"} />
                    </div>
                </button>
            ))}
        </div>
    );
};

export default CategoryFilter;
