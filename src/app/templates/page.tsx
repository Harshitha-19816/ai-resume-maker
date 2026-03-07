"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { SAMPLE_RESUME_DATA } from "@/lib/sample-data";
import { ResumeTemplate } from "@/types/resume";
import ResumePreview from "@/components/resume/resume-preview";
import { Button } from "@/components/ui/button";
import {
    FileText,
    ArrowRight,
    Check,
    Loader2,
    Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import Navbar from "@/components/shared/navbar";

const TEMPLATES: {
    id: ResumeTemplate;
    name: string;
    description: string;
    tag?: string;
}[] = [
        {
            id: "modern",
            name: "Modern Clean",
            description:
                "Standard ATS-friendly layout with clean lines. Perfect for most corporate roles.",
            tag: "Popular",
        },
        {
            id: "classic",
            name: "Executive Professional",
            description:
                "Bold, heavy serif headers with centered name. Ideal for senior management positions.",
        },
        {
            id: "minimal",
            name: "Tech Minimalist",
            description:
                "Compact, clean layout designed for software engineers and IT professionals.",
        },
        {
            id: "professional",
            name: "Sidebar Professional",
            description:
                "Two-column layout with dark sidebar. Great for creative and technical roles.",
            tag: "New",
        },
    ];

export default function TemplatesPage() {
    const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate | null>(null);
    const [creating, setCreating] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleUseTemplate = async (templateId: ResumeTemplate) => {
        setCreating(true);
        setSelectedTemplate(templateId);

        try {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                router.push("/login");
                return;
            }

            const slug = uuidv4().slice(0, 8);
            const { data, error } = await supabase
                .from("resumes")
                .insert({
                    user_id: user.id,
                    title: `${TEMPLATES.find((t) => t.id === templateId)?.name || "New"} Resume`,
                    template: templateId,
                    public_slug: slug,
                })
                .select()
                .single();

            if (error) {
                toast.error("Failed to create resume. Please sign in first.");
                router.push("/login");
            } else if (data) {
                toast.success("Resume created with template!");
                router.push(`/editor/${data.id}`);
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setCreating(false);
            setSelectedTemplate(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f]">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-16 pb-12 px-4 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute top-20 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="max-w-6xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium mb-6">
                        <Sparkles className="w-3.5 h-3.5" />
                        Choose Your Design
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] mb-4">
                        Resume{" "}
                        <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            Templates
                        </span>
                    </h1>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        Professional, ATS-optimized templates designed to make your resume stand out. Click any template to start building.
                    </p>
                </div>
            </section>

            {/* Templates Grid */}
            <section className="px-4 pb-20">
                <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {TEMPLATES.map((template) => (
                        <div
                            key={template.id}
                            className="group relative rounded-2xl bg-[#12121a] border border-white/5 overflow-hidden hover:border-violet-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-violet-500/5"
                        >
                            {/* Tag */}
                            {template.tag && (
                                <div className="absolute top-3 right-3 z-20 px-2.5 py-0.5 rounded-full bg-violet-500 text-white text-[10px] font-bold uppercase tracking-wider">
                                    {template.tag}
                                </div>
                            )}

                            {/* Template Preview */}
                            <div className="relative h-[320px] overflow-hidden bg-gray-950 border-b border-white/5">
                                <div className="absolute inset-0 flex items-start justify-center pt-3 px-3">
                                    <div className="transform scale-[0.28] origin-top w-[210mm]">
                                        <ResumePreview
                                            data={SAMPLE_RESUME_DATA}
                                            template={template.id}
                                        />
                                    </div>
                                </div>

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#12121a] via-transparent to-transparent opacity-60" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-sm">
                                    <Button
                                        onClick={() => handleUseTemplate(template.id)}
                                        disabled={creating}
                                        className="bg-violet-600 hover:bg-violet-500 text-white gap-2 shadow-xl shadow-violet-500/25 px-6"
                                    >
                                        {creating && selectedTemplate === template.id ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                Select Template <ArrowRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-5">
                                <h3 className="font-semibold text-white text-lg mb-1.5">
                                    {template.name}
                                </h3>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    {template.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="px-4 pb-20">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="p-10 rounded-3xl bg-gradient-to-br from-violet-600/10 via-blue-600/5 to-cyan-600/5 border border-violet-500/10">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                            Can&apos;t decide?
                        </h2>
                        <p className="text-gray-400 mb-6">
                            Start with any template — you can switch between them anytime in the editor.
                        </p>
                        <Link href="/dashboard">
                            <Button className="bg-violet-600 hover:bg-violet-500 text-white gap-2 px-8 py-5 shadow-lg shadow-violet-500/20">
                                Go to Dashboard <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/5 py-8 px-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FileText className="w-4 h-4" />
                        <span>ResumeAI © 2026</span>
                    </div>
                    <p className="text-sm text-gray-600">
                        Built with Next.js, Supabase & AI
                    </p>
                </div>
            </footer>
        </div>
    );
}
