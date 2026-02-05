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
        <div className="flex flex-row md:flex-col gap-2 overflow-x-auto no-scrollbar md:overflow-visible pb-2 md:pb-0">
            <button
                onClick={() => onSelect("")}
                className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-between whitespace-nowrap md:whitespace-normal border ${selectedCategory === ""
                        ? "bg-green-600 text-white border-green-600 shadow-sm"
                        : "bg-white text-gray-600 border-gray-200 hover:border-green-600 hover:text-green-600"
                    }`}
            >
                All Products
                <ChevronRight size={14} className="hidden md:block opacity-50" />
            </button>

            {categories.map((cat) => (
                <button
                    key={cat._id}
                    onClick={() => onSelect(cat.name)}
                    className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-between whitespace-nowrap md:whitespace-normal border ${selectedCategory === cat.name
                            ? "bg-green-600 text-white border-green-600 shadow-sm"
                            : "bg-white text-gray-600 border-gray-200 hover:border-green-600 hover:text-green-600"
                        }`}
                >
                    {cat.name}
                    <ChevronRight size={14} className="hidden md:block opacity-50" />
                </button>
            ))}
        </div>
    );
};

export default CategoryFilter;
