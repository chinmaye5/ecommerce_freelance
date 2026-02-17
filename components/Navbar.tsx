"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ShoppingBag, Menu, X, Settings, ChevronDown } from "lucide-react";
import { UserButton, useUser, SignInButton } from "@clerk/nextjs";

const Navbar = () => {
    const pathname = usePathname();
    const { user, isSignedIn } = useUser();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const updateCartCount = () => {
            const cart = JSON.parse(localStorage.getItem("cart") || "[]");
            const count = cart.reduce((acc: number, item: any) => acc + item.quantity, 0);
            setCartCount(count);
        };

        updateCartCount();
        window.addEventListener("cartUpdated", updateCartCount);
        return () => window.removeEventListener("cartUpdated", updateCartCount);
    }, []);

    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkAdmin = async () => {
            if (!user) return;
            const email = user.emailAddresses[0]?.emailAddress;
            const superAdmin = email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

            if (superAdmin) {
                setIsAdmin(true);
            } else {
                try {
                    // We only check api if not super admin to save a call for the main user
                    const res = await fetch("/api/check-admin");
                    const data = await res.json();
                    if (data.isAdmin) setIsAdmin(true);
                } catch (e) {
                    console.error("Admin check failed", e);
                }
            }
        };

        if (isSignedIn) checkAdmin();
    }, [user, isSignedIn]);

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-emerald-50/50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 md:gap-3 group">
                    <div className="p-1 rounded-xl group-hover:scale-110 transition-transform flex-shrink-0">
                        <img src="/logo.png" alt="Keshava Kiranam Logo" className="w-12 h-12 md:w-10 md:h-10 object-contain" />
                    </div>
                    <span className="text-lg md:text-2xl font-black tracking-tighter text-gray-900 group-hover:text-emerald-700 transition-colors leading-tight">Keshava Kiranam</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-10">
                    <Link href="/" className={`text-sm font-bold tracking-wide uppercase ${pathname === "/" ? "text-emerald-600" : "text-gray-500 hover:text-emerald-600"} transition-colors`}>
                        Home
                    </Link>
                    <Link href="/offers" className={`text-sm font-bold tracking-wide uppercase flex items-center gap-1 ${pathname === "/offers" ? "text-amber-600" : "text-gray-500 hover:text-amber-600"} transition-colors`}>
                        <span className="text-base">🔥</span> Offers
                    </Link>
                    <Link href="/my-orders" className={`text-sm font-bold tracking-wide uppercase ${pathname === "/my-orders" ? "text-emerald-600" : "text-gray-500 hover:text-emerald-600"} transition-colors`}>
                        My Orders
                    </Link>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    {isAdmin && (
                        <Link href="/admin" className="p-2.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
                            <Settings size={22} />
                        </Link>
                    )}

                    <Link href="/cart" className="group relative p-2.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
                        <ShoppingBag size={24} className="group-hover:scale-110 transition-transform" />
                        {cartCount > 0 && (
                            <span className="absolute top-1 right-1 bg-emerald-600 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm group-hover:scale-110 transition-transform">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    <div className="h-8 w-px bg-gray-100 hidden md:block mx-1"></div>

                    {isSignedIn ? (
                        <div className="scale-110">
                            <UserButton afterSignOutUrl="/" />
                        </div>
                    ) : (
                        <SignInButton mode="modal">
                            <button className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95">
                                Sign In
                            </button>
                        </SignInButton>
                    )}

                    <button className="md:hidden p-2 text-gray-500 hover:bg-gray-50 rounded-xl transition-all" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 p-6 space-y-4 animate-in slide-in-from-top-4 duration-300">
                    <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between py-3 text-gray-900 font-bold border-b border-gray-50">
                        Home <ChevronDown size={14} className="-rotate-90 text-gray-300" />
                    </Link>
                    <Link href="/offers" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between py-3 text-amber-600 font-bold border-b border-gray-50">
                        Offers <ChevronDown size={14} className="-rotate-90 text-amber-300" />
                    </Link>
                    <Link href="/my-orders" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between py-3 text-gray-900 font-bold border-b border-gray-50">
                        My Orders <ChevronDown size={14} className="-rotate-90 text-gray-300" />
                    </Link>
                    {isAdmin && (
                        <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between py-3 text-emerald-600 font-bold">
                            Admin Dashboard <Settings size={18} />
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
