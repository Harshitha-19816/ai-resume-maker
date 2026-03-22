"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Mail, Lock, Loader2, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const FEATURES = [
    "AI-powered content generation",
    "4 professional templates",
    "ATS-optimized formatting",
    "One-click PDF export",
];

export default function SignupPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleGoogleSignup = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (error) {
                toast.error(error.message);
                setLoading(false);
            }
        } catch {
            toast.error("Could not connect to server. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#030014] flex">
            {/* Left Panel — Brand */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <div className="aurora-hero absolute inset-0" />
                <div className="absolute top-[20%] left-[10%] w-80 h-80 bg-violet-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[20%] right-[10%] w-60 h-60 bg-fuchsia-500/8 rounded-full blur-[100px]" />

                <div className="relative flex flex-col justify-center px-16 z-10">
                    <Link href="/" className="flex items-center gap-2.5 mb-12">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
                            <FileText className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-2xl text-slate-100 uppercase tracking-wider">
                            AI Resume <span className="text-violet-400">Studio</span>
                        </span>
                    </Link>

                    <h2 className="text-4xl font-bold text-slate-100 leading-tight mb-4">
                        Start building
                        <br />
                        <span className="text-violet-400">standout resumes.</span>
                    </h2>
                    <p className="text-slate-400 mb-10 max-w-sm leading-relaxed">
                        Create your free account and start crafting professional resumes in minutes with AI.
                    </p>

                    <div className="space-y-3">
                        {FEATURES.map((feature) => (
                            <div key={feature} className="flex items-center gap-3">
                                <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                                <span className="text-sm text-slate-400">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Panel — Form */}
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-[420px]">
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-2">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                                <FileText className="w-4.5 h-4.5 text-white" />
                            </div>
                            <span className="font-bold text-xl text-slate-100">
                                AI Resume <span className="text-violet-400">Studio</span>
                            </span>
                        </Link>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-slate-100 mb-2">Create your account</h1>
                        <p className="text-slate-500 text-sm">Start building professional resumes for free</p>
                    </div>

                    <div className="glass-card rounded-2xl p-7 flex flex-col items-center py-10">
                        <div className="text-center mb-6">
                            <h3 className="text-lg font-bold text-slate-100 mb-1">Join the Studio</h3>
                            <p className="text-sm text-slate-400">Continue with Google to create your free account.</p>
                        </div>
                        
                        <Button
                            type="button"
                            disabled={loading}
                            onClick={handleGoogleSignup}
                            className="w-full bg-white hover:bg-slate-50 text-slate-900 border-0 h-14 rounded-xl shadow-lg font-semibold text-base transition-all"
                        >
                            {loading ? (
                                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Redirecting...</>
                            ) : (
                                <>
                                    <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                                        <path
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            fill="#34A853"
                                        />
                                        <path
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            fill="#EA4335"
                                        />
                                    </svg>
                                    Continue with Google
                                </>
                            )}
                        </Button>
                    </div>

                    <p className="mt-6 text-center text-slate-500 text-sm">
                        Already have an account?{" "}
                        <Link href="/login" className="text-violet-400 hover:text-violet-300 font-semibold">
                            Sign in
                        </Link>
                    </p>

                    <p className="mt-4 text-center text-slate-600 text-[11px]">
                        By creating an account, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </div>
            </div>
        </div>
    );
}
