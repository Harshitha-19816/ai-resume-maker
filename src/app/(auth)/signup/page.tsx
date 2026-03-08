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
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const getPasswordStrength = () => {
        if (!password) return 0;
        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return Math.min(strength, 4);
    };

    const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
    const strengthColors = ["", "bg-red-500", "bg-amber-500", "bg-cyan-500", "bg-emerald-500"];
    const strength = getPasswordStrength();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (error) {
                toast.error(error.message);
            } else {
                toast.success("Account created! Redirecting...");
                router.push("/dashboard");
            }
        } catch {
            toast.error("Could not connect to server. Please try again.");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#060918] flex">
            {/* Left Panel — Brand */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <div className="aurora-hero absolute inset-0" />
                <div className="absolute top-[20%] left-[10%] w-80 h-80 bg-emerald-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[20%] right-[10%] w-60 h-60 bg-cyan-500/8 rounded-full blur-[100px]" />

                <div className="relative flex flex-col justify-center px-16 z-10">
                    <Link href="/" className="flex items-center gap-2.5 mb-12">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <FileText className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-2xl text-slate-100">
                            AI Resume <span className="text-emerald-400">Studio</span>
                        </span>
                    </Link>

                    <h2 className="text-4xl font-bold text-slate-100 leading-tight mb-4">
                        Start building
                        <br />
                        <span className="text-emerald-400">standout resumes.</span>
                    </h2>
                    <p className="text-slate-400 mb-10 max-w-sm leading-relaxed">
                        Create your free account and start crafting professional resumes in minutes with AI.
                    </p>

                    <div className="space-y-3">
                        {FEATURES.map((feature) => (
                            <div key={feature} className="flex items-center gap-3">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
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
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                                <FileText className="w-4.5 h-4.5 text-white" />
                            </div>
                            <span className="font-bold text-xl text-slate-100">
                                AI Resume <span className="text-emerald-400">Studio</span>
                            </span>
                        </Link>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-slate-100 mb-2">Create your account</h1>
                        <p className="text-slate-500 text-sm">Start building professional resumes for free</p>
                    </div>

                    <div className="glass-card rounded-2xl p-7">
                        <form onSubmit={handleSignup} className="space-y-5">
                            <div className="space-y-2">
                                <Label className="text-slate-400 text-sm">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@example.com"
                                        className="pl-10 bg-white/5 border-white/8 text-slate-100 placeholder:text-slate-600 focus:border-emerald-500/40 focus:ring-emerald-500/20 h-12 rounded-xl"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-slate-400 text-sm">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                                    <Input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="pl-10 bg-white/5 border-white/8 text-slate-100 placeholder:text-slate-600 focus:border-emerald-500/40 focus:ring-emerald-500/20 h-12 rounded-xl"
                                        required
                                    />
                                </div>
                                {/* Password strength bar */}
                                {password && (
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="flex gap-1 flex-1">
                                            {[1, 2, 3, 4].map((level) => (
                                                <div
                                                    key={level}
                                                    className={`h-1 flex-1 rounded-full transition-all ${strength >= level ? strengthColors[strength] : "bg-white/10"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-[11px] text-slate-500">{strengthLabels[strength]}</span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-slate-400 text-sm">Confirm Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                                    <Input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="pl-10 bg-white/5 border-white/8 text-slate-100 placeholder:text-slate-600 focus:border-emerald-500/40 focus:ring-emerald-500/20 h-12 rounded-xl"
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white h-12 rounded-xl border-0 shadow-lg shadow-emerald-500/20 font-semibold text-base"
                            >
                                {loading ? (
                                    <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Creating account...</>
                                ) : (
                                    <>Create Account <ArrowRight className="ml-2 w-4 h-4" /></>
                                )}
                            </Button>
                        </form>
                    </div>

                    <p className="mt-6 text-center text-slate-500 text-sm">
                        Already have an account?{" "}
                        <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold">
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
