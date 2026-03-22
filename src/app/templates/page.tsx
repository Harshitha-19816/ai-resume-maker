"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/shared/navbar";
import { ArrowRight, Eye, Sparkles, FileText } from "lucide-react";
import { useState } from "react";

const TEMPLATES = [
    {
        id: "modern",
        name: "Modern Clean",
        description: "A contemporary design with a gradient header, clean sections, and accent colors. Perfect for creative and tech roles.",
        color: "from-indigo-500 to-purple-500",
        tag: "Popular",
    },
    {
        id: "classic",
        name: "Executive",
        description: "A traditional layout with serif typography and bordered sections. Ideal for senior roles and formal industries.",
        color: "from-slate-600 to-slate-800",
        tag: "Professional",
    },
    {
        id: "minimal",
        name: "Minimal",
        description: "Ultra-clean design with generous whitespace and subtle typography. Great for designers and modern professionals.",
        color: "from-violet-500 to-teal-500",
        tag: "Trending",
    },
    {
        id: "professional",
        name: "Sidebar Pro",
        description: "Two-column layout with a dark sidebar for contact info and skills. Makes a strong visual impression.",
        color: "from-fuchsia-500 to-blue-500",
        tag: "ATS-Friendly",
    },
];

export default function TemplatesPage() {
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-[#030014] noise-overlay">
            <Navbar />

            <section className="pt-28 pb-20 px-4">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-14">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-sm text-slate-400 mb-5">
                            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                            {TEMPLATES.length} Templates Available
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-4">
                            Choose Your{" "}
                            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                                Template
                            </span>
                        </h1>
                        <p className="text-slate-400 max-w-lg mx-auto">
                            Each template is designed to be ATS-friendly and professionally formatted.
                            Pick one and start editing.
                        </p>
                    </div>

                    {/* Template Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {TEMPLATES.map((template) => (
                            <div
                                key={template.id}
                                className="glass-card rounded-2xl overflow-hidden group"
                                onMouseEnter={() => setHoveredId(template.id)}
                                onMouseLeave={() => setHoveredId(null)}
                            >
                                {/* Preview Area */}
                                <div className="relative h-52 overflow-hidden">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${template.color} opacity-15`} />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-28 h-40 bg-white/90 rounded-lg shadow-xl flex flex-col p-3 text-[5px] text-gray-600 leading-tight group-hover:scale-110 transition-transform duration-500">
                                            <div className={`h-5 rounded bg-gradient-to-r ${template.color} mb-2`} />
                                            <div className="h-1.5 bg-gray-200 rounded w-3/4 mb-1" />
                                            <div className="h-1 bg-gray-100 rounded w-full mb-0.5" />
                                            <div className="h-1 bg-gray-100 rounded w-5/6 mb-0.5" />
                                            <div className="h-1 bg-gray-100 rounded w-4/6 mb-2" />
                                            <div className="h-1.5 bg-gray-200 rounded w-1/2 mb-1" />
                                            <div className="h-1 bg-gray-100 rounded w-full mb-0.5" />
                                            <div className="h-1 bg-gray-100 rounded w-3/4" />
                                        </div>
                                    </div>

                                    {/* Tag */}
                                    <span className="absolute top-4 right-4 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-black/40 text-white/80 backdrop-blur-sm">
                                        {template.tag}
                                    </span>

                                    {/* Hover Overlay */}
                                    <div className={`absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 ${hoveredId === template.id ? "opacity-100" : "opacity-0"
                                        }`}>
                                        <Link href="/signup">
                                            <Button className="gap-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white border-0 rounded-xl shadow-lg shadow-violet-500/20">
                                                Use Template <ArrowRight className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-5">
                                    <h3 className="font-semibold text-lg text-slate-100 mb-1 group-hover:text-violet-400 transition-colors">
                                        {template.name}
                                    </h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">
                                        {template.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/5 py-8 px-4">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                            <FileText className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm text-slate-500">AI Resume Studio © 2026</span>
                    </div>
                    <Link href="/dashboard" className="text-sm text-slate-500 hover:text-violet-400 transition-colors">
                        Go to Dashboard →
                    </Link>
                </div>
            </footer>
        </div>
    );
}
