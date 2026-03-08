"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const NAV_LINKS = [
    { href: "/", label: "Home" },
    { href: "/templates", label: "Templates" },
    { href: "/dashboard", label: "My Resumes" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl transition-all duration-500 ${scrolled
                    ? "glass rounded-2xl shadow-lg shadow-black/20"
                    : "bg-transparent"
                }`}
        >
            <div className="flex items-center justify-between h-14 px-6">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 group shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow">
                        <FileText className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-lg text-slate-100 tracking-tight">
                        AI Resume <span className="text-emerald-400">Studio</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-1">
                    {NAV_LINKS.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link key={link.href} href={link.href}>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`text-sm font-medium px-4 h-9 rounded-xl transition-all ${isActive
                                            ? "text-emerald-400 bg-emerald-500/10"
                                            : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
                                        }`}
                                >
                                    {link.label}
                                </Button>
                            </Link>
                        );
                    })}
                </div>

                {/* CTA */}
                <div className="hidden md:flex items-center gap-3">
                    <Link href="/login">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-sm text-slate-400 hover:text-slate-100 hover:bg-white/5 h-9 px-4 rounded-xl"
                        >
                            Sign In
                        </Button>
                    </Link>
                    <Link href="/signup">
                        <Button
                            size="sm"
                            className="text-sm bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white border-0 h-9 px-5 rounded-xl shadow-md shadow-emerald-500/20 font-semibold"
                        >
                            Get Started
                        </Button>
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="md:hidden text-slate-400 hover:text-white p-1"
                >
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden glass rounded-b-2xl border-t border-white/5 px-6 pb-6 pt-2 animate-in slide-in-from-top-2 duration-200">
                    <div className="flex flex-col gap-1">
                        {NAV_LINKS.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-colors ${isActive
                                            ? "text-emerald-400 bg-emerald-500/10"
                                            : "text-slate-400 hover:text-white hover:bg-white/5"
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                        <div className="border-t border-white/5 mt-2 pt-3 flex flex-col gap-2">
                            <Link href="/login" onClick={() => setMobileOpen(false)}>
                                <Button variant="ghost" className="w-full justify-center text-slate-400 hover:text-white rounded-xl">
                                    Sign In
                                </Button>
                            </Link>
                            <Link href="/signup" onClick={() => setMobileOpen(false)}>
                                <Button className="w-full justify-center bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl border-0">
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
