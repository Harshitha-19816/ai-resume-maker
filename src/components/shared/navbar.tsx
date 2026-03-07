"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    const navLinks = [
        { href: "/", label: "HOME" },
        { href: "/templates", label: "TEMPLATES" },
        { href: "/dashboard", label: "MY RESUMES" },
    ];

    return (
        <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                            <FileText className="w-4.5 h-4.5 text-white" />
                        </div>
                        <span className="font-bold text-xl text-white tracking-tight">
                            Resume<span className="text-violet-400">AI</span>
                        </span>
                    </Link>

                    {/* Nav Links */}
                    <div className="hidden sm:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wider transition-colors ${isActive(link.href)
                                        ? "text-white bg-white/10"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Sign In */}
                    <Link href="/login">
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-white/10 text-gray-300 hover:text-white hover:bg-white/5 gap-2"
                        >
                            Sign In
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
