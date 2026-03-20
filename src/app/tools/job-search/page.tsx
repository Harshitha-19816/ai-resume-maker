"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/shared/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, MapPin, Building2, ExternalLink, History, Briefcase, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface JobResult {
    title: string;
    company: string;
    location: string;
    link: string;
    description: string;
}

interface SearchHistory {
    id: string;
    role: string;
    location: string;
    results: JobResult[];
    created_at: string;
}

export default function JobSearchPage() {
    const [role, setRole] = useState("");
    const [location, setLocation] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<JobResult[]>([]);
    const [history, setHistory] = useState<SearchHistory[]>([]);
    const [pageLoading, setPageLoading] = useState(true);

    const supabase = createClient();

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from("jobs_search_history")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (!error && data) {
            setHistory(data);
        }
        setPageLoading(false);
    };

    const handleSearch = async () => {
        if (!role.trim()) {
            toast.error("Please enter a job role");
            return;
        }

        setLoading(true);
        setResults([]);

        try {
            const response = await fetch("/api/ai/job-search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role, location }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to find jobs");
            }

            setResults(data.results);
            toast.success(`Found ${data.results.length} job opportunities!`);

            // Save to DB
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: dbData, error } = await supabase
                    .from("jobs_search_history")
                    .insert({
                        user_id: user.id,
                        role,
                        location,
                        results: data.results
                    })
                    .select()
                    .single();

                if (!error && dbData) {
                    setHistory([dbData, ...history]);
                }
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
                <div className="max-w-5xl mx-auto px-6 py-10">
                    <div className="mb-10">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                                <Search className="w-6 h-6 text-purple-400" />
                            </div>
                            <h1 className="text-3xl font-bold text-slate-100">AI Job Search</h1>
                        </div>
                        <p className="text-slate-500 text-sm">
                            Powered by Firecrawl — Search the web for your next career move.
                        </p>
                    </div>

                    {/* Search Form */}
                    <div className="glass-card rounded-2xl p-6 mb-10 border border-white/5">
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Job Role</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                                    <Input
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        placeholder="e.g. Senior Frontend Developer"
                                        className="bg-white/5 border-white/10 text-slate-100 placeholder:text-slate-600 h-12 pl-11 rounded-xl"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                                    <Input
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="e.g. Remote, San Francisco"
                                        className="bg-white/5 border-white/10 text-slate-100 placeholder:text-slate-600 h-12 pl-11 rounded-xl"
                                    />
                                </div>
                            </div>
                        </div>
                        <Button
                            onClick={handleSearch}
                            disabled={loading || !role.trim()}
                            className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white h-12 rounded-xl border-0 shadow-lg shadow-purple-500/20 font-bold text-base"
                        >
                            {loading ? (
                                <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Crawling job sites...</>
                            ) : (
                                <><Search className="w-5 h-5 mr-2" /> Search Opportunities</>
                            )}
                        </Button>
                    </div>

                    {/* Results */}
                    {results.length > 0 && (
                        <div className="space-y-6 mb-12">
                            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2 px-2">
                                <Sparkles className="w-5 h-5 text-amber-400" />
                                Top Matches
                            </h2>
                            <div className="grid gap-4">
                                {results.map((job, i) => (
                                    <div key={i} className="glass-card rounded-2xl p-6 border border-white/5 hover:border-purple-500/30 transition-all group">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-slate-100 group-hover:text-purple-400 transition-colors mb-1">
                                                    {job.title}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-slate-400">
                                                    <span className="flex items-center gap-1.5">
                                                        <Building2 className="w-4 h-4 text-slate-600" />
                                                        {job.company}
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <MapPin className="w-4 h-4 text-slate-600" />
                                                        {job.location}
                                                    </span>
                                                </div>
                                                {job.description && (
                                                    <p className="mt-3 text-sm text-slate-500 line-clamp-2 italic">
                                                        "{job.description}"
                                                    </p>
                                                )}
                                            </div>
                                            <a 
                                                href={job.link} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="shrink-0"
                                            >
                                                <Button className="w-full md:w-auto bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl px-6">
                                                    Apply Now <ExternalLink className="w-4 h-4 ml-2" />
                                                </Button>
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* History */}
                    {history.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-slate-400 mb-4 px-2 flex items-center gap-2">
                                <History className="w-4 h-4" /> Recent Searches
                            </h3>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {history.map(item => (
                                    <button 
                                        key={item.id}
                                        onClick={() => {
                                            setRole(item.role);
                                            setLocation(item.location || "");
                                            setResults(item.results);
                                        }}
                                        className="glass-card text-left p-4 rounded-xl border border-white/5 hover:bg-white/5 transition-colors group"
                                    >
                                        <div className="font-bold text-slate-200 group-hover:text-purple-400 transition-colors truncate mb-1">
                                            {item.role}
                                        </div>
                                        <div className="text-xs text-slate-500 flex items-center gap-1">
                                            <MapPin className="w-3 h-3" /> {item.location || "Remote"}
                                        </div>
                                        <div className="mt-3 text-[10px] text-slate-600 flex items-center justify-between">
                                            <span>{item.results.length} results</span>
                                            <span>{new Date(item.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
