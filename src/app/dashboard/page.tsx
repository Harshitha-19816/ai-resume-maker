"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
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
} from "lucide-react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import Navbar from "@/components/shared/navbar";

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
    const [newTitle, setNewTitle] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [creating, setCreating] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        fetchResumes();
    }, []);

    const fetchResumes = async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
            router.push("/login");
            return;
        }

        const { data, error } = await supabase
            .from("resumes")
            .select("*")
            .eq("user_id", user.id)
            .order("updated_at", { ascending: false });

        if (!error && data) {
            setResumes(data);
        }
        setLoading(false);
    };

    const createResume = async () => {
        if (!newTitle.trim()) return;
        setCreating(true);
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const slug = uuidv4().slice(0, 8);
        const { data, error } = await supabase
            .from("resumes")
            .insert({
                user_id: user.id,
                title: newTitle.trim(),
                public_slug: slug,
            })
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
            setResumes(
                resumes.map((r) =>
                    r.id === id ? { ...r, is_public: !isPublic } : r
                )
            );
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

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0f]">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 py-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-white">My Resumes</h1>
                        <p className="text-gray-500 mt-1">
                            Create, edit and manage your resumes
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white border-0 shadow-lg shadow-violet-500/20">
                                    <Plus className="w-4 h-4" /> New Resume
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-[#1a1a2e] border-white/10 text-white">
                                <DialogHeader>
                                    <DialogTitle className="text-white">
                                        Create New Resume
                                    </DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 pt-2">
                                    <Input
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                        placeholder="Resume title..."
                                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                                        onKeyDown={(e) => e.key === "Enter" && createResume()}
                                    />
                                    <Button
                                        onClick={createResume}
                                        disabled={creating || !newTitle.trim()}
                                        className="w-full bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white border-0"
                                    >
                                        {creating && (
                                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                        )}
                                        Create Resume
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                        <Button
                            variant="outline"
                            onClick={handleLogout}
                            className="gap-2 border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
                        >
                            <LogOut className="w-4 h-4" /> Sign Out
                        </Button>
                    </div>
                </div>

                {/* Resume Grid */}
                {resumes.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-500/10 to-blue-500/10 flex items-center justify-center">
                            <FileText className="w-10 h-10 text-violet-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-white mb-2">
                            No resumes yet
                        </h2>
                        <p className="text-gray-500 mb-6">
                            Create your first resume or browse templates
                        </p>
                        <div className="flex gap-3 justify-center">
                            <Button
                                onClick={() => setDialogOpen(true)}
                                className="gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white border-0"
                            >
                                <Plus className="w-4 h-4" /> Create Resume
                            </Button>
                            <Link href="/templates">
                                <Button
                                    variant="outline"
                                    className="gap-2 border-white/10 text-gray-300 hover:text-white hover:bg-white/5"
                                >
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
                                className="group rounded-2xl border border-white/5 bg-[#12121a] hover:border-violet-500/20 transition-all duration-300 overflow-hidden"
                            >
                                {/* Card Body */}
                                <Link href={`/editor/${resume.id}`} className="block p-5">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 flex items-center justify-center">
                                            <FileText className="w-5 h-5 text-violet-400" />
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {resume.is_public ? (
                                                <span className="px-2 py-0.5 text-[10px] font-semibold uppercase rounded-full bg-green-500/10 text-green-400 tracking-wider">
                                                    Public
                                                </span>
                                            ) : (
                                                <span className="px-2 py-0.5 text-[10px] font-semibold uppercase rounded-full bg-gray-500/10 text-gray-500 tracking-wider">
                                                    Private
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <h3 className="font-semibold text-white text-lg mb-1 group-hover:text-violet-300 transition-colors">
                                        {resume.title}
                                    </h3>
                                    <p className="text-xs text-gray-600">
                                        Template: {resume.template || "modern"} · Updated{" "}
                                        {new Date(resume.updated_at).toLocaleDateString()}
                                    </p>
                                </Link>

                                {/* Card Footer */}
                                <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between">
                                    <div className="flex gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 px-2 text-xs text-gray-500 hover:text-white hover:bg-white/5 gap-1"
                                            onClick={() =>
                                                togglePublic(resume.id, resume.is_public)
                                            }
                                        >
                                            {resume.is_public ? (
                                                <EyeOff className="w-3 h-3" />
                                            ) : (
                                                <Eye className="w-3 h-3" />
                                            )}
                                            {resume.is_public ? "Private" : "Public"}
                                        </Button>
                                        {resume.is_public && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 px-2 text-xs text-gray-500 hover:text-white hover:bg-white/5 gap-1"
                                                onClick={() => copyShareLink(resume.public_slug)}
                                            >
                                                <Copy className="w-3 h-3" /> Copy Link
                                            </Button>
                                        )}
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-gray-500 hover:text-white hover:bg-white/5"
                                            >
                                                <MoreVertical className="w-3.5 h-3.5" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="bg-[#1a1a2e] border-white/10 text-gray-300">
                                            <DropdownMenuItem
                                                onClick={() => copyShareLink(resume.public_slug)}
                                                className="gap-2 hover:bg-white/5 focus:bg-white/5"
                                            >
                                                <Share2 className="w-3.5 h-3.5" /> Share
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => deleteResume(resume.id)}
                                                className="gap-2 text-red-400 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-400"
                                            >
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
        </div>
    );
}
