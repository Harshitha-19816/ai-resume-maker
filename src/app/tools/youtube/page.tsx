"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Sidebar } from "@/components/shared/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Youtube, Play, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from 'react-markdown';

interface SummaryRecord {
    id: string;
    video_url: string;
    summary: string;
    created_at: string;
}

export default function YouTubeSummaryPage() {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [summaries, setSummaries] = useState<SummaryRecord[]>([]);
    const [currentSummary, setCurrentSummary] = useState<string | null>(null);
    const [pageLoading, setPageLoading] = useState(true);

    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push("/login");
            return;
        }

        const { data, error } = await supabase
            .from("youtube_summaries")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (!error && data) {
            setSummaries(data);
        }
        setPageLoading(false);
    };

    const handleSummarize = async () => {
        if (!url.trim()) {
            toast.error("Please enter a YouTube URL");
            return;
        }

        if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
            toast.error("Please enter a valid YouTube URL");
            return;
        }

        setLoading(true);
        setCurrentSummary(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            const response = await fetch("/api/ai/youtube-summary", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to generate summary");
            }

            setCurrentSummary(data.summary);
            toast.success("Summary generated!");

            // Save to DB
            const { data: dbData, error } = await supabase
                .from("youtube_summaries")
                .insert({
                    user_id: user.id,
                    video_url: url,
                    summary: data.summary
                })
                .select()
                .single();

            if (!error && dbData) {
                setSummaries([dbData, ...summaries]);
            }
        } catch (error: any) {
            toast.error(error.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) {
        return (
            <div className="min-h-screen bg-[#060918] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#060918] flex">
            <Sidebar />

            <main className="flex-1 overflow-auto">
                <div className="max-w-4xl mx-auto px-6 py-10">
                    <div className="mb-10 text-center">
                        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-red-500/10 to-rose-500/10 flex items-center justify-center shadow-lg shadow-red-500/20">
                            <Youtube className="w-8 h-8 text-red-500" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-100 mb-2 uppercase tracking-tight">
                            AI YouTube <span className="text-red-500">Summarizer</span>
                        </h1>
                        <p className="text-slate-500 text-sm">
                            Paste a YouTube video link to extract key insights and summaries instantly.
                        </p>
                    </div>

                    <div className="glass-card rounded-2xl p-6 mb-10 border border-white/5 flex gap-3">
                        <div className="flex-1">
                            <Input
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://www.youtube.com/watch?v=..."
                                className="bg-white/5 border-white/10 text-slate-100 placeholder:text-slate-600 h-12 rounded-xl"
                                onKeyDown={(e) => e.key === "Enter" && handleSummarize()}
                            />
                        </div>
                        <Button
                            onClick={handleSummarize}
                            disabled={loading || !url.trim()}
                            className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white h-12 px-6 rounded-xl border-0 shadow-lg shadow-red-500/20 font-semibold"
                        >
                            {loading ? (
                                <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Processing</>
                            ) : (
                                <><Play className="w-4 h-4 mr-2" /> Summarize</>
                            )}
                        </Button>
                    </div>

                    {currentSummary && (
                        <div className="glass-card rounded-3xl p-8 mb-10 border border-white/5 bg-gradient-to-br from-slate-900/50 to-slate-800/20">
                            <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                                <h2 className="text-xl font-bold text-slate-100 uppercase tracking-wide">Summary Result</h2>
                            </div>
                            <div className="prose prose-invert max-w-none prose-emerald prose-headings:text-slate-100 prose-p:text-slate-300 prose-li:text-slate-300">
                                <ReactMarkdown>{currentSummary}</ReactMarkdown>
                            </div>
                        </div>
                    )}

                    {summaries.length > 0 && !currentSummary && (
                        <div>
                            <h3 className="text-lg font-semibold text-slate-100 mb-4 px-2 uppercase tracking-wider opacity-60">Recent Summaries</h3>
                            <div className="grid gap-4">
                                {summaries.map(record => (
                                    <div key={record.id} className="glass-card rounded-2xl p-6 border border-white/5 hover:border-red-500/20 transition-all">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Youtube className="w-4 h-4 text-red-500" />
                                            <a href={record.video_url} target="_blank" rel="noreferrer" className="text-sm text-emerald-400 hover:underline truncate">
                                                {record.video_url}
                                            </a>
                                            <span className="text-xs text-slate-600 ml-auto">
                                                {new Date(record.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="prose prose-invert max-w-none prose-sm prose-emerald opacity-80 line-clamp-4">
                                            <ReactMarkdown>{record.summary}</ReactMarkdown>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setCurrentSummary(record.summary)}
                                            className="mt-4 text-xs text-slate-400 hover:text-white hover:bg-white/5 rounded-lg"
                                        >
                                            View Full Summary
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
