"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Sidebar } from "@/components/shared/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Plus,
    FileText,
    MoreVertical,
    Trash2,
    Share2,
    Copy,
    Loader2,
    LogOut,
    Eye,
    EyeOff,
    Sparkles,
    Clock,
    Globe,
} from "lucide-react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface Resume {
    id: string;
    title: string;
    template: string;
    created_at: string;
    updated_at: string;
    is_public: boolean;
    public_slug: string;
}

export default function DashboardPage() {
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newTitle, setNewTitle] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [creating, setCreating] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        fetchResumes();
        // Safety timeout — never show spinner for more than 10 seconds
        const timeout = setTimeout(() => {
            setLoading((prev) => {
                if (prev) setError("Loading is taking too long. Please refresh.");
                return false;
            });
        }, 10000);
        return () => clearTimeout(timeout);
    }, []);

    const fetchResumes = async () => {
        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser();

            if (authError) {
                setError("Authentication failed. Please sign in again.");
                setLoading(false);
                return;
            }

            if (!user) {
                setLoading(false);
                router.push("/login");
                return;
            }

            setUserEmail(user.email || "");

            const { data, error: fetchError } = await supabase
                .from("resumes")
                .select("*")
                .eq("user_id", user.id)
                .order("updated_at", { ascending: false });

            if (fetchError) {
                setError("Failed to load resumes.");
            } else if (data) {
                setResumes(data);
            }
        } catch {
            setError("Could not connect to server.");
        } finally {
            setLoading(false);
        }
    };

    const createResume = async () => {
        if (!newTitle.trim()) return;
        setCreating(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const slug = uuidv4().slice(0, 8);
        const { data, error } = await supabase
            .from("resumes")
            .insert({ user_id: user.id, title: newTitle.trim(), public_slug: slug })
            .select()
            .single();

        if (!error && data) {
            toast.success("Resume created!");
            setDialogOpen(false);
            setNewTitle("");
            router.push(`/editor/${data.id}`);
        } else {
            toast.error("Failed to create resume");
        }
        setCreating(false);
    };

    const deleteResume = async (id: string) => {
        const { error } = await supabase.from("resumes").delete().eq("id", id);
        if (!error) {
            setResumes(resumes.filter((r) => r.id !== id));
            toast.success("Resume deleted");
        } else {
            toast.error("Failed to delete");
        }
    };

    const togglePublic = async (id: string, isPublic: boolean) => {
        const { error } = await supabase
            .from("resumes")
            .update({ is_public: !isPublic })
            .eq("id", id);
        if (!error) {
            setResumes(resumes.map((r) => (r.id === id ? { ...r, is_public: !isPublic } : r)));
            toast.success(!isPublic ? "Resume is now public" : "Resume is now private");
        }
    };

    const copyShareLink = (slug: string) => {
        navigator.clipboard.writeText(`${window.location.origin}/share/${slug}`);
        toast.success("Share link copied!");
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/");
    };

    const publicCount = resumes.filter((r) => r.is_public).length;
    const lastEdited = resumes[0]?.updated_at
        ? new Date(resumes[0].updated_at).toLocaleDateString()
        : "—";

    if (loading) {
        return (
            <div className="min-h-screen bg-[#030014] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#030014] flex items-center justify-center">
                <div className="text-center max-w-md px-6">
                    <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-red-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-slate-100 mb-2">Something went wrong</h2>
                    <p className="text-slate-500 text-sm mb-6">{error}</p>
                    <div className="flex gap-3 justify-center">
                        <Button onClick={() => { setError(null); setLoading(true); fetchResumes(); }}
                            className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white border-0 rounded-xl">
                            Try Again
                        </Button>
                        <Button variant="outline" onClick={() => router.push("/login")}
                            className="border-slate-700 text-slate-400 hover:text-white rounded-xl">
                            Sign In
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#030014] flex">
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="max-w-5xl mx-auto px-6 py-10">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-100">
                                Welcome back{userEmail ? `, ${userEmail.split("@")[0]}` : ""}
                            </h1>
                            <p className="text-slate-500 text-sm mt-1">
                                Manage your resumes and create new ones
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="gap-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-400 hover:to-fuchsia-400 text-white border-0 rounded-xl shadow-md shadow-violet-500/20 font-semibold">
                                        <Plus className="w-4 h-4" /> New Resume
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="glass border-white/10 text-slate-100 rounded-2xl">
                                    <DialogHeader>
                                        <DialogTitle className="text-slate-100">Create New Resume</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4 pt-2">
                                        <Input
                                            value={newTitle}
                                            onChange={(e) => setNewTitle(e.target.value)}
                                            placeholder="Resume title..."
                                            className="bg-white/5 border-white/10 text-slate-100 placeholder:text-slate-600 h-11 rounded-xl"
                                            onKeyDown={(e) => e.key === "Enter" && createResume()}
                                        />
                                        <Button
                                            onClick={createResume}
                                            disabled={creating || !newTitle.trim()}
                                            className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white border-0 rounded-xl"
                                        >
                                            {creating && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                                            Create Resume
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                            {/* Mobile logout */}
                            <Button
                                variant="outline"
                                onClick={handleLogout}
                                className="md:hidden gap-2 border-slate-700 text-slate-500 hover:text-white rounded-xl"
                            >
                                <LogOut className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-3 gap-4 mb-10">
                        {[
                            { label: "Total Resumes", value: resumes.length, icon: FileText, color: "text-violet-400" },
                            { label: "Public", value: publicCount, icon: Globe, color: "text-fuchsia-400" },
                            { label: "Last Edited", value: lastEdited, icon: Clock, color: "text-amber-400" },
                        ].map((stat) => {
                            const Icon = stat.icon;
                            return (
                                <div key={stat.label} className="glass-card rounded-xl p-4">
                                    <div className="flex items-center gap-3">
                                        <Icon className={`w-5 h-5 ${stat.color}`} />
                                        <div>
                                            <div className="text-xl font-bold text-slate-100">{stat.value}</div>
                                            <div className="text-[11px] text-slate-500 uppercase tracking-wider">{stat.label}</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Resume Grid */}
                    {resumes.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 flex items-center justify-center">
                                <FileText className="w-10 h-10 text-violet-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-slate-100 mb-2">No resumes yet</h2>
                            <p className="text-slate-500 mb-6 text-sm">
                                Create your first resume or browse templates
                            </p>
                            <div className="flex gap-3 justify-center">
                                <Button
                                    onClick={() => setDialogOpen(true)}
                                    className="gap-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white border-0 rounded-xl"
                                >
                                    <Plus className="w-4 h-4" /> Create Resume
                                </Button>
                                <Link href="/templates">
                                    <Button variant="outline" className="gap-2 border-slate-700 text-slate-400 hover:text-white rounded-xl">
                                        <Sparkles className="w-4 h-4" /> Browse Templates
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {resumes.map((resume) => (
                                <div
                                    key={resume.id}
                                    className="glass-card rounded-2xl overflow-hidden group"
                                >
                                    <Link href={`/editor/${resume.id}`} className="block p-5">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center">
                                                <FileText className="w-5 h-5 text-violet-400" />
                                            </div>
                                            {resume.is_public ? (
                                                <span className="px-2 py-0.5 text-[10px] font-semibold uppercase rounded-full bg-violet-500/10 text-violet-400 tracking-wider">
                                                    Public
                                                </span>
                                            ) : (
                                                <span className="px-2 py-0.5 text-[10px] font-semibold uppercase rounded-full bg-slate-500/10 text-slate-500 tracking-wider">
                                                    Private
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="font-semibold text-slate-100 text-lg mb-1 group-hover:text-violet-400 transition-colors">
                                            {resume.title}
                                        </h3>
                                        <p className="text-xs text-slate-600">
                                            {resume.template || "modern"} · Updated{" "}
                                            {new Date(resume.updated_at).toLocaleDateString()}
                                        </p>
                                    </Link>

                                    <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between">
                                        <div className="flex gap-1">
                                            <Button
                                                variant="ghost" size="sm"
                                                className="h-7 px-2 text-xs text-slate-500 hover:text-white hover:bg-white/5 gap-1"
                                                onClick={() => togglePublic(resume.id, resume.is_public)}
                                            >
                                                {resume.is_public ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                                {resume.is_public ? "Private" : "Public"}
                                            </Button>
                                            {resume.is_public && (
                                                <Button
                                                    variant="ghost" size="sm"
                                                    className="h-7 px-2 text-xs text-slate-500 hover:text-white hover:bg-white/5 gap-1"
                                                    onClick={() => copyShareLink(resume.public_slug)}
                                                >
                                                    <Copy className="w-3 h-3" /> Copy Link
                                                </Button>
                                            )}
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-white">
                                                    <MoreVertical className="w-3.5 h-3.5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="glass border-white/10 text-slate-300">
                                                <DropdownMenuItem onClick={() => copyShareLink(resume.public_slug)} className="gap-2 hover:bg-white/5">
                                                    <Share2 className="w-3.5 h-3.5" /> Share
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => deleteResume(resume.id)} className="gap-2 text-red-400 hover:bg-red-500/10 focus:text-red-400">
                                                    <Trash2 className="w-3.5 h-3.5" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
