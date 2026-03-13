"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Sidebar } from "@/components/shared/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, Briefcase, MapPin, ExternalLink, History } from "lucide-react";
import { toast } from "sonner";

interface JobResult {
    company: string;
    title: string;
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
    const [jobs, setJobs] = useState<JobResult[]>([]);
    const [history, setHistory] = useState<SearchHistory[]>([]);
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
        setJobs([]);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            const response = await fetch("/api/job-search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role, location }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to search jobs");
            }

            if (!data.jobs || data.jobs.length === 0) {
                toast.info("No jobs found matching your criteria.");
                setLoading(false);
                return;
            }

            setJobs(data.jobs);
            toast.success(`Found ${data.jobs.length} jobs!`);

            // Save history
            const { data: dbData, error } = await supabase
                .from("jobs_search_history")
                .insert({
                    user_id: user.id,
                    role,
                    location: location || 'Anywhere',
                    results: data.jobs
                })
                .select()
                .single();

            if (!error && dbData) {
                setHistory([dbData, ...history]);
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
                    <div className="mb-10 text-center">
                        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 flex items-center justify-center">
                            <Search className="w-8 h-8 text-cyan-500" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-100 mb-2">
                            AI Job Search
                        </h1>
                        <p className="text-slate-500 text-sm max-w-lg mx-auto">
                            Uses Firecrawl to scrape live job boards and summarize the best matches using AI.
                        </p>
                    </div>

                    <div className="glass-card rounded-2xl p-6 mb-10 border border-white/5 flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <Input
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                placeholder="Job Role (e.g. Frontend Developer)"
                                className="pl-10 bg-white/5 border-white/10 text-slate-100 placeholder:text-slate-600 h-12 rounded-xl"
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            />
                        </div>
                        <div className="flex-1 relative">
                            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <Input
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Location (e.g. Remote, New York)"
                                className="pl-10 bg-white/5 border-white/10 text-slate-100 placeholder:text-slate-600 h-12 rounded-xl"
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            />
                        </div>
                        <Button
                            onClick={handleSearch}
                            disabled={loading || !role.trim()}
                            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white h-12 px-8 rounded-xl border-0 shadow-lg shadow-cyan-500/20 font-semibold md:w-auto w-full"
                        >
                            {loading ? (
                                <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Searching...</>
                            ) : (
                                <><Search className="w-4 h-4 mr-2" /> Find Jobs</>
                            )}
                        </Button>
                    </div>

                    {jobs.length > 0 && (
                        <div className="mb-12">
                            <h2 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
                                <SparklesIcon /> Matches Found
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {jobs.map((job, idx) => (
                                    <div key={idx} className="glass-card p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold text-slate-100 text-lg pr-4">{job.title}</h3>
                                            <a href={job.link} target="_blank" rel="noreferrer" className="text-cyan-400 hover:text-cyan-300 p-1 hover:bg-cyan-500/10 rounded-lg shrink-0 transition-colors">
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                                            <span className="flex items-center gap-1">
                                                <Briefcase className="w-3.5 h-3.5" /> {job.company}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-3.5 h-3.5" /> {job.location}
                                            </span>
                                        </div>
                                        <p className="text-slate-500 text-sm mt-auto">
                                            {job.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {history.length > 0 && jobs.length === 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                                <History className="w-5 h-5 text-slate-400" /> Recent Searches
                            </h3>
                            <div className="space-y-3">
                                {history.map(record => (
                                    <div key={record.id} className="glass-card rounded-xl p-4 border border-white/5 flex items-center justify-between">
                                        <div>
                                            <span className="font-semibold text-slate-200">{record.role}</span>
                                            {record.location && <span className="text-slate-400 text-sm ml-2">in {record.location}</span>}
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-xs text-slate-500 px-2 py-1 bg-white/5 rounded-md">
                                                {record.results?.length || 0} results
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setRole(record.role);
                                                    setLocation(record.location !== 'Anywhere' ? record.location : '');
                                                    setJobs(record.results || []);
                                                }}
                                                className="text-xs text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 h-7 px-3"
                                            >
                                                View
                                            </Button>
                                        </div>
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

function SparklesIcon() {
    return (
        <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
    );
}
