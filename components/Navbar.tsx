"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ShoppingBag, Menu, X, Settings } from "lucide-react";
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
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <img src="/logo.png" alt="Keshava Kiranam Logo" className="w-8 h-8 object-contain rounded" />
                    <span className="text-xl font-bold tracking-tight text-gray-900">Keshava Kiranam</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/" className={`text-sm font-medium ${pathname === "/" ? "text-green-600" : "text-gray-600 hover:text-gray-900"}`}>
                        Home
                    </Link>
                    <Link href="/my-orders" className={`text-sm font-medium ${pathname === "/my-orders" ? "text-green-600" : "text-gray-600 hover:text-gray-900"}`}>
                        My Orders
                    </Link>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-5">
                    {isAdmin && (
                        <Link href="/admin" className="text-gray-500 hover:text-gray-900">
                            <Settings size={20} />
                        </Link>
                    )}

                    <Link href="/cart" className="relative p-2 text-gray-600 hover:text-gray-900">
                        <ShoppingBag size={22} />
                        {cartCount > 0 && (
                            <span className="absolute top-0 right-0 bg-green-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    <div className="h-6 w-px bg-gray-200 hidden md:block"></div>

                    {isSignedIn ? (
                        <UserButton afterSignOutUrl="/" />
                    ) : (
                        <SignInButton mode="modal">
                            <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition">
                                Sign In
                            </button>
                        </SignInButton>
                    )}

                    <button className="md:hidden p-1 text-gray-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-b border-gray-100 p-4 space-y-3">
                    <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-600 font-medium">Home</Link>
                    <Link href="/my-orders" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-600 font-medium">My Orders</Link>
                    {isAdmin && (
                        <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-600 font-medium">Admin Dashboard</Link>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
