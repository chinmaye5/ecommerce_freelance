import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";
import Link from "next/link";

const Footer = () => {
    return (
        <footer className="bg-emerald-950 text-white overflow-hidden relative">
            {/* Subtle Gradient Overlay */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-600"></div>

            <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-16">
                    {/* Store Info */}
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center gap-3 mb-8">
                            <div className="bg-white p-1.5 rounded-xl">
                                <img src="/logo.png" alt="Keshava Kiranam Logo" className="w-8 h-8 object-contain" />
                            </div>
                            <span className="text-xl font-black tracking-tight leading-tight">
                                Keshava Kiranam
                            </span>
                        </Link>
                        <p className="text-emerald-100/60 text-sm leading-relaxed mb-8 font-light">
                            Your trusted destination for the freshest groceries and daily essentials.
                            We bring the farm to your doorstep with quality you can taste.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Instagram, Twitter].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 bg-emerald-900 border border-emerald-800 rounded-xl flex items-center justify-center text-emerald-400 hover:text-white hover:bg-emerald-600 hover:border-emerald-500 transition-all group active:scale-90">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 mb-8">Navigation</h4>
                        <ul className="space-y-4">
                            {['Shop Home', 'Track Orders', 'View Cart', 'All Products'].map((item, i) => (
                                <li key={i}>
                                    <Link href="#" className="text-emerald-100/60 hover:text-emerald-400 text-sm transition-colors font-medium flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-emerald-800 rounded-full transition-all group-hover:w-2 group-hover:bg-emerald-400"></span>
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Policies */}
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 mb-8">Our Standards</h4>
                        <ul className="space-y-4">
                            {['Privacy Policy', 'Terms of Service', 'Return Policy', 'Fulfillment Info'].map((item, i) => (
                                <li key={i}>
                                    <Link href="#" className="text-emerald-100/60 hover:text-emerald-400 text-sm transition-colors font-medium flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-emerald-800 rounded-full transition-all group-hover:w-2 group-hover:bg-emerald-400"></span>
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 mb-8">Visit Us</h4>
                        <ul className="space-y-6">
                            <li className="flex gap-4 text-sm">
                                <div className="w-10 h-10 bg-emerald-900/50 rounded-xl flex items-center justify-center shrink-0 border border-emerald-800">
                                    <MapPin size={18} className="text-emerald-500" />
                                </div>
                                <span className="text-emerald-100/60 leading-relaxed font-light">
                                    Opp Bus stand, Nekkonda Road,<br />Gudur, Warangal-506134,<br />Telangana
                                </span>
                            </li>
                            <li className="flex items-center gap-4 text-sm">
                                <div className="w-10 h-10 bg-emerald-900/50 rounded-xl flex items-center justify-center shrink-0 border border-emerald-800">
                                    <Phone size={18} className="text-emerald-500" />
                                </div>
                                <span className="text-emerald-100/60 font-light">9849303230</span>
                            </li>
                            <li className="flex items-center gap-4 text-sm">
                                <div className="w-10 h-10 bg-emerald-900/50 rounded-xl flex items-center justify-center shrink-0 border border-emerald-800">
                                    <Mail size={18} className="text-emerald-500" />
                                </div>
                                <span className="text-emerald-100/60 font-light truncate">Keshavakiranam@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-20 pt-10 border-t border-emerald-900 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-emerald-100/40 text-[10px] font-bold uppercase tracking-widest">
                        © {new Date().getFullYear()} Keshava Kiranam. Sourced Sustainably.
                    </p>
                    <div className="flex items-center gap-6">
                        <p className="text-emerald-100/40 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                            Store Status: Open
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
