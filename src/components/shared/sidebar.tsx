"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, LayoutDashboard, Palette, LogOut, UserCircle, ShieldAlert } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const SIDEBAR_LINKS = [
    { icon: LayoutDashboard, label: "Workspace", href: "/workspace" },
    { icon: FileText, label: "Resume Builder", href: "/dashboard" },
    { icon: UserCircle, label: "Profile", href: "/profile" },
    { icon: ShieldAlert, label: "Admin Panel", href: "/admin" },
];

export function Sidebar() {
    const pathname = usePathname();
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = "/";
    };

    return (
        <aside className="hidden md:flex w-64 flex-col glass border-r border-white/5 p-5 shrink-0 min-h-screen">
            <Link href="/" className="flex items-center gap-2 mb-10">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-slate-100 uppercase tracking-wider">
                    AI Tools <span className="text-violet-400">Hub</span>
                </span>
            </Link>

            <nav className="flex-1 space-y-1">
                {SIDEBAR_LINKS.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href || (pathname.startsWith(`${link.href}/`) && link.href !== '/');
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive
                                ? "bg-violet-500/10 text-violet-400"
                                : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {link.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t border-white/5 pt-4 mt-4">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:text-red-400 hover:bg-red-500/5 w-full transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
