import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ResumeData, ResumeTemplate } from "@/types/resume";
import ResumePreview from "@/components/resume/resume-preview";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Sparkles } from "lucide-react";

interface SharePageProps {
    params: Promise<{ slug: string }>;
}

export default async function SharePage({ params }: SharePageProps) {
    const { slug } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: resume, error } = await supabase
        .from("resumes")
        .select("*")
        .eq("public_slug", slug)
        .eq("is_public", true)
        .single();

    if (error || !resume) {
        notFound();
    }

    const resumeData = resume.resume_data as ResumeData;
    const template = (resume.template as ResumeTemplate) || "modern";

    return (
        <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
            {/* Background Orbs */}
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

            <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5 px-6 h-16 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                        <FileText className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h1 className="text-sm font-bold text-white leading-tight">
                            {resumeData.personalInfo.fullName || "Resume"}
                        </h1>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                            Shared via ResumeAI
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Link href="/">
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 border-white/10 text-gray-300 hover:text-white hover:bg-white/5 rounded-full h-9 px-4 text-xs font-semibold"
                        >
                            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                            Build your own
                        </Button>
                    </Link>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto py-12 px-4 flex justify-center relative z-10 custom-scrollbar">
                <div className="transform scale-[0.75] sm:scale-90 md:scale-100 origin-top transition-transform duration-500 bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] rounded-sm">
                    <ResumePreview data={resumeData} template={template} />
                </div>
            </main>

            <footer className="py-6 border-t border-white/5 text-center shrink-0 relative z-10">
                <p className="text-gray-600 text-[11px] font-medium tracking-wide">
                    RESUMEAI — AI-POWERED PROFESSIONAL RESUME BUILDER
                </p>
            </footer>
        </div>
    );
}
