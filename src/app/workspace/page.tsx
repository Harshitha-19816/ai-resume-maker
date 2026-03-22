"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/shared/sidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
    LayoutDashboard, 
    FileText, 
    ArrowRight, 
    Sparkles,
    Zap,
    History
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

const TOOLS = [
    {
        title: "Resume Builder",
        description: "Create professional, ATS-optimized resumes with AI-powered suggestions.",
        icon: FileText,
        href: "/dashboard",
        color: "bg-violet-500/10",
        iconColor: "text-violet-400",
        badge: "Popular"
    }
];

export default function WorkspacePage() {
    const [user, setUser] = useState<User | null>(null);
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data } = await supabase.auth.getUser();
            setUser(data.user);
        };
        getUser();
    }, []);

    return (
        <div className="min-h-screen bg-[#030014] flex">
            <Sidebar />

            <main className="flex-1 overflow-auto">
                <div className="max-w-6xl mx-auto px-6 py-10">
                    {/* Header */}
                    <div className="mb-12">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
                                <LayoutDashboard className="w-5 h-5 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-slate-100">
                                Workspace <span className="text-violet-400">Overview</span>
                            </h1>
                        </div>
                        <p className="text-slate-500 max-w-2xl">
                            Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ""}. Select a tool below to get started with your career growth.
                        </p>
                    </div>

                    {/* Tools Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                        {TOOLS.map((tool) => {
                            const Icon = tool.icon;
                            return (
                                <Link 
                                    key={tool.title} 
                                    href={tool.href}
                                    className="glass-card group p-8 rounded-3xl border border-white/5 hover:border-violet-500/30 transition-all duration-300 relative overflow-hidden"
                                >
                                    <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-violet-500/5 rounded-full blur-[60px] group-hover:bg-violet-500/10 transition-colors" />
                                    
                                    <div className="flex items-start justify-between mb-6">
                                        <div className={`w-14 h-14 rounded-2xl ${tool.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                            <Icon className={`w-7 h-7 ${tool.iconColor}`} />
                                        </div>
                                        {tool.badge && (
                                            <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border border-white/5">
                                                {tool.badge}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-2xl font-bold text-slate-100 mb-3 group-hover:text-violet-400 transition-colors">
                                        {tool.title}
                                    </h3>
                                    <p className="text-slate-400 leading-relaxed mb-8">
                                        {tool.description}
                                    </p>

                                    <div className="flex items-center text-violet-400 font-semibold text-sm gap-2">
                                        Open Tool <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Quick Stats / Recent Activity Placeholder */}
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="glass-card p-6 rounded-2xl border border-white/5 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                                <Zap className="w-6 h-6 text-orange-400" />
                            </div>
                            <div>
                                <div className="text-xl font-bold text-slate-100">AI Tokens</div>
                                <div className="text-xs text-slate-500 uppercase tracking-widest">Unlimited Free Plan</div>
                            </div>
                        </div>
                        <div className="glass-card p-6 rounded-2xl border border-white/5 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-fuchsia-500/10 flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-fuchsia-400" />
                            </div>
                            <div>
                                <div className="text-xl font-bold text-slate-100">{TOOLS.length} Pro Tool</div>
                                <div className="text-xs text-slate-500 uppercase tracking-widest">Always Growing</div>
                            </div>
                        </div>
                        <div className="glass-card p-6 rounded-2xl border border-white/5 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center">
                                <History className="w-6 h-6 text-pink-400" />
                            </div>
                            <div>
                                <div className="text-xl font-bold text-slate-100">History</div>
                                <div className="text-xs text-slate-500 uppercase tracking-widest">Saved Automatically</div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
