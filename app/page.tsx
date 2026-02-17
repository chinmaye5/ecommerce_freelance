"use client";

import { useState } from "react";
import ProductList from "@/components/ProductList";
import CategoryFilter from "@/components/CategoryFilter";
import { Search, ShoppingBasket, Truck, ShieldCheck } from "lucide-react";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="bg-[#fafafa] flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-950 py-16 md:py-24 px-4">
        {/* Subtle Background Elements */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-3xl md:text-6xl font-extrabold text-white mb-6 md:mb-8 tracking-tight leading-tight">
            Freshness Delivered to <br className="hidden md:block" />
            <span className="text-emerald-400">Your Doorstep</span>
          </h1>
          <p className="text-emerald-50/80 text-lg md:text-xl mb-8 md:mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Discover a wide variety of fresh groceries and daily essentials,
            sourced with care and delivered with love.
          </p>

          <div className="max-w-2xl mx-auto relative group mb-8">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-700/50 group-focus-within:text-emerald-600 transition-colors" size={24} />
            <input
              type="text"
              placeholder="Search for fresh items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 md:py-5 rounded-2xl bg-white/95 backdrop-blur-sm text-gray-900 border-none shadow-2xl outline-none focus:ring-4 focus:ring-emerald-500/20 text-lg transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => window.location.href = '/offers'}
              className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-2xl font-bold text-base md:text-lg transition-all shadow-xl shadow-amber-500/20 hover:scale-105 inline-flex items-center gap-2 group"
            >
              <span>View Special Offers</span>
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="max-w-7xl mx-auto w-full px-4 -mt-10 mb-12 relative z-20">
        <div className="bg-white grid grid-cols-3 gap-2 md:gap-8 p-4 md:p-10 rounded-3xl shadow-2xl shadow-emerald-900/5 border border-emerald-50">
          <div className="flex flex-col md:flex-row items-center lg:items-center gap-1 md:gap-5 p-1 text-center md:text-left">
            <div className="bg-emerald-50 p-2 md:p-4 rounded-xl md:rounded-2xl text-emerald-600 shadow-sm border border-emerald-100/50">
              <ShoppingBasket className="w-5 h-5 md:w-8 md:h-8" />
            </div>
            <div>
              <p className="font-black text-gray-900 text-[8.5px] md:text-lg leading-tight">Wide Variety</p>
              <p className="text-[6.5px] md:text-sm text-gray-500 font-black md:mt-1 uppercase tracking-tighter">1000+ Handpicked Items</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center lg:items-center gap-1 md:gap-5 p-1 text-center md:text-left md:border-x border-gray-100">
            <div className="bg-amber-50 p-2 md:p-4 rounded-xl md:rounded-2xl text-amber-600 shadow-sm border border-amber-100/50">
              <Truck className="w-5 h-5 md:w-8 md:h-8" />
            </div>
            <div>
              <p className="font-black text-gray-900 text-[8.5px] md:text-lg leading-tight">Self Pickup</p>
              <p className="text-[6.5px] md:text-sm text-gray-500 font-black md:mt-1 uppercase tracking-tighter">Quick & Hassle-free</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center lg:items-center gap-1 md:gap-5 p-1 text-center md:text-left">
            <div className="bg-blue-50 p-2 md:p-4 rounded-xl md:rounded-2xl text-blue-600 shadow-sm border border-blue-100/50">
              <ShieldCheck className="w-5 h-5 md:w-8 md:h-8" />
            </div>
            <div>
              <p className="font-black text-gray-900 text-[8.5px] md:text-lg leading-tight">Quality Checked</p>
              <p className="text-[6.5px] md:text-sm text-gray-500 font-black md:mt-1 uppercase tracking-tighter">100% Freshness</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 py-8 flex flex-col md:flex-row gap-12">
        {/* Filter */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-24">
            <h3 className="font-bold text-gray-900 text-xl mb-6 px-1 flex items-center gap-2">
              <div className="w-2 h-6 bg-emerald-500 rounded-full"></div>
              Categories
            </h3>
            <CategoryFilter
              selectedCategory={selectedCategory}
              onSelect={setSelectedCategory}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                {searchQuery ? `Results for "${searchQuery}"` : selectedCategory || "Featured Products"}
              </h2>
              <div className="h-1.5 w-24 bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full mt-3"></div>
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors text-sm"
              >
                Clear Search
              </button>
            )}
          </div>

          <ProductList category={selectedCategory} search={searchQuery} />
        </div>
      </div>

      {/* Pickup Reminder */}
      <div className="bg-emerald-900 py-12 border-y border-emerald-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-emerald-800/50 rounded-full border border-emerald-700/50 text-emerald-300 mb-4 animate-pulse">
            <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
            <p className="text-sm font-bold uppercase tracking-widest">Coming Soon</p>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Mobile App is on the way!</h2>
          <p className="text-emerald-100/70 max-w-xl mx-auto">
            We're building something special for you. For now, enjoy our quick and easy
            store pickup service for all your orders.
          </p>
        </div>
      </div>
    </div>
  );
}
