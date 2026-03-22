"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Sidebar } from "@/components/shared/sidebar";
import { Button } from "@/components/ui/button";
import { UserCircle, Mail, Calendar, Loader2 } from "lucide-react";

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
            } else {
                setUser(user);
            }
            setLoading(false);
        };
        fetchUser();
    }, [router, supabase]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#030014] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#030014] flex">
            <Sidebar />

            <main className="flex-1 overflow-auto">
                <div className="max-w-3xl mx-auto px-6 py-10">
                    <div className="mb-10 text-center md:text-left flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center">
                            <UserCircle className="w-8 h-8 text-violet-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-100">
                                User Profile
                            </h1>
                            <p className="text-slate-500 text-sm">
                                Manage your account settings and preferences.
                            </p>
                        </div>
                    </div>

                    <div className="glass-card rounded-2xl p-8 border border-white/5 space-y-8">
                        {/* Account Details */}
                        <div>
                            <h2 className="text-lg font-semibold text-slate-200 mb-4 border-b border-white/10 pb-2">Account Details</h2>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-slate-400" />
                                    <div>
                                        <p className="text-sm font-medium text-slate-300">Email Address</p>
                                        <p className="text-slate-500 text-sm">{user.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-5 h-5 text-slate-400" />
                                    <div>
                                        <p className="text-sm font-medium text-slate-300">Account Created</p>
                                        <p className="text-slate-500 text-sm">{new Date(user.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Subscription Tier (Placeholder) */}
                        <div>
                            <h2 className="text-lg font-semibold text-slate-200 mb-4 border-b border-white/10 pb-2">Subscription Context</h2>
                            <div className="glass bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 rounded-xl p-5 border border-violet-500/20">
                                <h3 className="font-semibold text-violet-400 mb-1">AI Pro Plan (Active)</h3>
                                <p className="text-slate-400 text-sm mb-4">You currently have unlimited access to AI templates, YouTube Summarizer, and job search parsing.</p>
                                <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-xl">
                                    Manage Subscription
                                </Button>
                            </div>
                        </div>

                        {/* Authentication Info */}
                        <div>
                             <h2 className="text-lg font-semibold text-slate-200 mb-4 border-b border-white/10 pb-2">Security</h2>
                             <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-300">Current Sign In Method</p>
                                    <p className="text-slate-500 text-sm capitalize">{user.app_metadata.provider || 'Email / Password'}</p>
                                </div>
                                <Button variant="destructive" className="rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20">
                                    Reset Password
                                </Button>
                             </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
