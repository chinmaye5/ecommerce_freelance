"use client";

import { useState } from "react";
import ProductList from "@/components/ProductList";
import CategoryFilter from "@/components/CategoryFilter";
import { Search, ShoppingBasket, Truck, ShieldCheck } from "lucide-react";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="bg-gray-50 flex flex-col min-h-screen">
      {/* Search & Hero */}
      <div className="bg-green-600 py-12 px-4 shadow-inner">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
            Order from a wide range of fresh items and pick up when order is ready
          </h1>
          <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto font-medium">
            Shop from our wide range of items and daily essentials.
          </p>

          <div className="max-w-2xl mx-auto relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-white text-gray-900 border-none shadow-lg outline-none focus:ring-2 focus:ring-green-400 text-lg transition-all"
            />
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="max-w-7xl mx-auto w-full px-4 -mt-6">
        <div className="bg-white grid grid-cols-1 md:grid-cols-3 gap-4 p-6 rounded-2xl shadow-md border border-gray-100">
          <div className="flex items-center gap-4 p-2 justify-center">
            <div className="bg-green-50 p-3 rounded-full text-green-600"><ShoppingBasket size={24} /></div>
            <div>
              <p className="font-bold text-gray-900">Wide Variety</p>
              <p className="text-xs text-gray-500">1000+ Fresh items</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-2 justify-center border-y md:border-y-0 md:border-x border-gray-100">
            <div className="bg-orange-50 p-3 rounded-full text-orange-600"><Truck size={24} /></div>
            <div>
              <p className="font-bold text-gray-900">Self Pickup</p>
              <p className="text-xs text-gray-500">Fast & Convenient</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-2 justify-center">
            <div className="bg-blue-50 p-3 rounded-full text-blue-600"><ShieldCheck size={24} /></div>
            <div>
              <p className="font-bold text-gray-900">Quality Checked</p>
              <p className="text-xs text-gray-500">100% Guaranteed</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 py-12 flex flex-col md:flex-row gap-8">
        {/* Filter */}
        <div className="w-full md:w-64 flex-shrink-0">
          <h3 className="font-bold text-gray-900 mb-4 px-1">Categories</h3>
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="mb-8 overflow-hidden">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              {searchQuery ? `Results for "${searchQuery}"` : selectedCategory || "Featured Products"}
            </h2>
            <div className="h-1 w-20 bg-green-500 rounded-full mt-2"></div>
          </div>

          <ProductList category={selectedCategory} search={searchQuery} />
        </div>
      </div>

      {/* Pickup Reminder */}
      <div className="bg-blue-50 py-8 border-y border-blue-100 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-blue-800 font-semibold flex items-center justify-center gap-2">
            🚀 APP COMING SOON - Only Store Pickup Available for now.
          </p>
        </div>
      </div>
    </div>
  );
}
