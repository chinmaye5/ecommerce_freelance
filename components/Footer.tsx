import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";
import Link from "next/link";

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Store Info */}
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <img src="/logo.png" alt="Keshava Kiranam Logo" className="w-10 h-10 object-contain rounded" />
                            <span className="text-lg font-bold tracking-tight text-gray-900 leading-tight">
                                Keshava Kiranam
                            </span>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6">
                            Your one-stop destination for fresh groceries, daily essentials, and premium general items. Quality you can trust, delivered with care.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-green-600 transition-colors">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-green-600 transition-colors">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-green-600 transition-colors">
                                <Twitter size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">Quick Links</h4>
                        <ul className="space-y-4">
                            <li><Link href="/" className="text-gray-500 hover:text-green-600 text-sm transition-colors font-medium">Shop Home</Link></li>
                            <li><Link href="/my-orders" className="text-gray-500 hover:text-green-600 text-sm transition-colors font-medium">Track Orders</Link></li>
                            <li><Link href="/cart" className="text-gray-500 hover:text-green-600 text-sm transition-colors font-medium">View Cart</Link></li>
                            <li><Link href="/#products" className="text-gray-500 hover:text-green-600 text-sm transition-colors font-medium">All Products</Link></li>
                        </ul>
                    </div>

                    {/* Policies */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">Store Policies</h4>
                        <ul className="space-y-4">
                            <li><Link href="#" className="text-gray-500 hover:text-green-600 text-sm transition-colors font-medium">Privacy Policy</Link></li>
                            <li><Link href="#" className="text-gray-500 hover:text-green-600 text-sm transition-colors font-medium">Terms of Service</Link></li>
                            <li><Link href="#" className="text-gray-500 hover:text-green-600 text-sm transition-colors font-medium">Return Policy</Link></li>
                            <li><Link href="#" className="text-gray-500 hover:text-green-600 text-sm transition-colors font-medium">Fulfillment Info</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex gap-3 text-sm">
                                <MapPin size={18} className="text-green-600 shrink-0" />
                                <span className="text-gray-500 leading-relaxed font-medium">
                                    Opp Bus stand, Nekkonda Road,<br />Gudur, Warangal-506134,<br />Telangana
                                </span>
                            </li>
                            <li className="flex items-center gap-3 text-sm">
                                <Phone size={18} className="text-green-600 shrink-0" />
                                <span className="text-gray-500 font-medium">9849303230</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm">
                                <Mail size={18} className="text-green-600 shrink-0" />
                                <span className="text-gray-500 font-medium truncate">Keshavakiranam@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-xs font-medium">
                        © {new Date().getFullYear()} Keshava Kiranam. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest"></span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
