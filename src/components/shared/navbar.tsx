"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NAV_LINKS = [
    { href: "/", label: "Home" },
    { href: "/templates", label: "Templates" },
    { href: "/workspace", label: "Workspace" },
    { href: "/dashboard", label: "My Resumes" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const supabase = createClient();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const checkUser = async () => {
            const { data } = await supabase.auth.getUser();
            setUser(data.user);
        };
        checkUser();

        // Optional: listen for auth changes
        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setUser(session?.user || null);
            }
        );

        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

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
                    <span className="font-bold text-lg text-slate-100 tracking-tight uppercase">
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
                    {user ? (
                        <>
                            <Link href="/workspace">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-sm font-medium px-4 h-9 rounded-xl transition-all text-slate-400 hover:text-slate-100 hover:bg-white/5"
                                >
                                    Workspace
                                </Button>
                            </Link>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center cursor-pointer shadow-md shadow-emerald-500/20 text-white font-semibold flex-shrink-0 border border-white/10 hover:border-white/30 transition-all">
                                        {user.email?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="glass border-white/10 text-slate-300 w-48 mt-2 rounded-xl">
                                    <div className="px-2 py-2 text-xs text-slate-500 truncate mb-1 border-b border-white/5">{user.email}</div>
                                    <DropdownMenuItem onClick={() => window.location.href = '/workspace'} className="gap-2 hover:bg-white/5 cursor-pointer rounded-lg mx-1 mt-1">
                                        <LayoutDashboard className="w-4 h-4" /> Workspace
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => window.location.href = '/dashboard'} className="gap-2 hover:bg-white/5 cursor-pointer rounded-lg mx-1">
                                        <FileText className="w-4 h-4" /> Resumes
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleLogout} className="gap-2 text-red-400 hover:bg-red-500/10 focus:text-red-400 cursor-pointer rounded-lg mx-1 mb-1">
                                        <LogOut className="w-4 h-4" /> Sign Out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <>
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
                        </>
                    )}
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
                            {user ? (
                                <>
                                    <div className="px-3 py-2 text-xs text-slate-500 truncate border-b border-white/5 mb-1">{user.email}</div>
                                    <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                                        <Button variant="ghost" className="w-full justify-start text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-xl gap-2">
                                            <LayoutDashboard className="w-4 h-4" /> Dashboard
                                        </Button>
                                    </Link>
                                    <Button onClick={() => { handleLogout(); setMobileOpen(false); }} variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl gap-2">
                                        <LogOut className="w-4 h-4" /> Sign Out
                                    </Button>
                                </>
                            ) : (
                                <>
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
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
