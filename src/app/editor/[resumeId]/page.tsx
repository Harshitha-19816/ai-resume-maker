"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
    ResumeData,
    ResumeTemplate,
    DEFAULT_RESUME_DATA,
} from "@/types/resume";
import ResumeForm from "@/components/editor/resume-form";
import ResumePreview from "@/components/resume/resume-preview";
import { useAutosave } from "@/hooks/use-autosave";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    FileText,
    ArrowLeft,
    Download,
    Share2,
    Sparkles,
    Loader2,
    Check,
    Upload,
    Save,
} from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function EditorPage() {
    const params = useParams();
    const router = useRouter();
    const resumeId = params.resumeId as string;
    const supabase = createClient();

    const [resumeData, setResumeData] =
        useState<ResumeData>(DEFAULT_RESUME_DATA);
    const [template, setTemplate] = useState<ResumeTemplate>("modern");
    const [title, setTitle] = useState("Untitled Resume");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [optimizing, setOptimizing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchResume = useCallback(async () => {
        const { data, error } = await supabase
            .from("resumes")
            .select("*")
            .eq("id", resumeId)
            .single();

        if (error || !data) {
            toast.error("Resume not found");
            router.push("/dashboard");
            return;
        }

        setResumeData(
            (data.resume_data as ResumeData) || DEFAULT_RESUME_DATA
        );
        setTemplate((data.template as ResumeTemplate) || "modern");
        setTitle(data.title);
        setLoading(false);
    }, [resumeId, supabase, router]);

    useEffect(() => {
        fetchResume();
    }, [fetchResume]);

    const saveResume = useCallback(
        async (data: ResumeData) => {
            setSaving(true);
            const { error } = await supabase
                .from("resumes")
                .update({
                    resume_data: data as unknown as Record<string, unknown>,
                    template,
                })
                .eq("id", resumeId);

            if (error) {
                console.error("Save error:", error);
            }
            setSaving(false);
        },
        [resumeId, supabase, template]
    );

    useAutosave(resumeData, saveResume, 2000);

    const saveTitle = async (newTitle: string) => {
        setTitle(newTitle);
        await supabase
            .from("resumes")
            .update({ title: newTitle })
            .eq("id", resumeId);
    };

    const manualSave = async () => {
        setSaving(true);
        await supabase
            .from("resumes")
            .update({
                resume_data: resumeData as unknown as Record<string, unknown>,
                template,
                title,
            })
            .eq("id", resumeId);
        setSaving(false);
        toast.success("Resume saved!");
    };

    const exportPDF = async () => {
        setExporting(true);
        try {
            const element = document.getElementById("resume-preview");
            if (!element) {
                toast.error("Preview not found");
                return;
            }

            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: "#ffffff",
            });

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${title || "resume"}.pdf`);
            toast.success("PDF exported!");
        } catch (error) {
            console.error("PDF export error:", error);
            toast.error("Failed to export PDF");
        } finally {
            setExporting(false);
        }
    };

    const optimizeResume = async () => {
        setOptimizing(true);
        try {
            const res = await fetch("/api/ai/optimize-resume", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resumeData }),
            });
            const result = await res.json();
            if (result.suggestions) {
                toast.info(result.suggestions, {
                    duration: 10000,
                    description: "AI Optimization Suggestions",
                });
            } else {
                toast.error(result.error || "Failed to optimize");
            }
        } catch {
            toast.error("Failed to optimize resume");
        } finally {
            setOptimizing(false);
        }
    };

    const handleImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const fileExt = file.name.split(".").pop();
        const filePath = `${user.id}/${resumeId}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from("resume-assets")
            .upload(filePath, file, { upsert: true });

        if (uploadError) {
            toast.error("Failed to upload image");
            return;
        }

        const {
            data: { publicUrl },
        } = supabase.storage.from("resume-assets").getPublicUrl(filePath);

        setResumeData({
            ...resumeData,
            personalInfo: {
                ...resumeData.personalInfo,
                profileImage: publicUrl,
            },
        });

        await supabase.from("images").insert({
            user_id: user.id,
            image_url: publicUrl,
        });

        toast.success("Image uploaded!");
    };

    const togglePublic = async () => {
        const { data: current } = await supabase
            .from("resumes")
            .select("is_public, public_slug")
            .eq("id", resumeId)
            .single();

        if (!current) return;

        const { error } = await supabase
            .from("resumes")
            .update({ is_public: !current.is_public })
            .eq("id", resumeId);

        if (error) {
            toast.error("Failed to update sharing");
        } else {
            if (!current.is_public && current.public_slug) {
                navigator.clipboard.writeText(
                    `${window.location.origin}/share/${current.public_slug}`
                );
                toast.success("Resume is now public! Link copied.");
            } else {
                toast.success("Resume is now private.");
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#0a0a0f]">
            {/* Toolbar */}
            <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0f]/90 backdrop-blur-xl px-4 h-14 flex items-center justify-between gap-4 no-print">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/5"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-violet-400" />
                        <input
                            value={title}
                            onChange={(e) => saveTitle(e.target.value)}
                            className="bg-transparent border-none text-sm font-medium text-white focus:outline-none focus:ring-0 w-48"
                        />
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        {saving ? (
                            <>
                                <Loader2 className="w-3 h-3 animate-spin" /> Saving...
                            </>
                        ) : (
                            <>
                                <Check className="w-3 h-3 text-green-500" /> Saved
                            </>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Select
                        value={template}
                        onValueChange={(v) => setTemplate(v as ResumeTemplate)}
                    >
                        <SelectTrigger className="w-40 h-8 text-xs bg-white/5 border-white/10 text-gray-300">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1a1a2e] border-white/10 text-gray-300">
                            <SelectItem value="modern">Modern Clean</SelectItem>
                            <SelectItem value="classic">Executive</SelectItem>
                            <SelectItem value="minimal">Minimal</SelectItem>
                            <SelectItem value="professional">Sidebar Pro</SelectItem>
                        </SelectContent>
                    </Select>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                    />
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs gap-1 border-white/10 text-gray-300 hover:text-white hover:bg-white/5"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Upload className="w-3 h-3" /> Photo
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs gap-1 border-white/10 text-gray-300 hover:text-white hover:bg-white/5"
                        onClick={optimizeResume}
                        disabled={optimizing}
                    >
                        {optimizing ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                            <Sparkles className="w-3 h-3 text-violet-400" />
                        )}
                        AI Optimize
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs gap-1 border-white/10 text-gray-300 hover:text-white hover:bg-white/5"
                        onClick={togglePublic}
                    >
                        <Share2 className="w-3 h-3" /> Share
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs gap-1 border-white/10 text-gray-300 hover:text-white hover:bg-white/5"
                        onClick={manualSave}
                        disabled={saving}
                    >
                        <Save className="w-3 h-3" /> Save Draft
                    </Button>

                    <Button
                        size="sm"
                        className="h-8 text-xs gap-1 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white border-0"
                        onClick={exportPDF}
                        disabled={exporting}
                    >
                        {exporting ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                            <Download className="w-3 h-3" />
                        )}
                        Download PDF
                    </Button>
                </div>
            </header>

            {/* Editor Layout */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel - Form */}
                <div className="w-[480px] border-r border-white/5 bg-[#0e0e16] overflow-y-auto">
                    <ResumeForm data={resumeData} onChange={setResumeData} />
                </div>

                {/* Right Panel - Preview */}
                <div className="flex-1 overflow-auto bg-[#12121a] p-8 flex justify-center">
                    <div className="transform scale-[0.65] origin-top">
                        <ResumePreview data={resumeData} template={template} />
                    </div>
                </div>
            </div>
        </div>
    );
}
