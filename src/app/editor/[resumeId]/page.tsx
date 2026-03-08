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

export default function EditorPage() {
    const params = useParams();
    const router = useRouter();
    const resumeId = params.resumeId as string;
    const supabase = createClient();

    const [resumeData, setResumeData] = useState<ResumeData>(DEFAULT_RESUME_DATA);
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

        setResumeData((data.resume_data as ResumeData) || DEFAULT_RESUME_DATA);
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
            await supabase
                .from("resumes")
                .update({
                    resume_data: data as unknown as Record<string, unknown>,
                    template,
                })
                .eq("id", resumeId);
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
                setExporting(false);
                return;
            }

            const printWindow = window.open("", "_blank");
            if (!printWindow) {
                toast.error("Please allow pop-ups to export PDF");
                setExporting(false);
                return;
            }

            const stylesheets = Array.from(document.styleSheets)
                .map((sheet) => {
                    try {
                        return Array.from(sheet.cssRules)
                            .map((rule) => rule.cssText)
                            .join("\n");
                    } catch {
                        return "";
                    }
                })
                .join("\n");

            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>${title || "Resume"}</title>
                    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
                    <style>
                        ${stylesheets}
                        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                        @page { size: A4; margin: 0; }
                        body { margin: 0; padding: 0; background: white; }
                        #print-resume { width: 210mm; min-height: 297mm; margin: 0 auto; }
                    </style>
                </head>
                <body>
                    <div id="print-resume">${element.outerHTML}</div>
                </body>
                </html>
            `);
            printWindow.document.close();

            printWindow.onload = () => {
                setTimeout(() => {
                    printWindow.print();
                    printWindow.close();
                }, 500);
            };

            setTimeout(() => {
                try { printWindow.print(); printWindow.close(); } catch { /* */ }
            }, 2000);

            toast.success("Print dialog opened! Select 'Save as PDF'.");
        } catch {
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
                toast.info(result.suggestions, { duration: 10000, description: "AI Suggestions" });
            } else {
                toast.error(result.error || "Failed to optimize");
            }
        } catch {
            toast.error("Failed to optimize resume");
        } finally {
            setOptimizing(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const { data: { user } } = await supabase.auth.getUser();
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

        const { data: { publicUrl } } = supabase.storage
            .from("resume-assets")
            .getPublicUrl(filePath);

        setResumeData({
            ...resumeData,
            personalInfo: { ...resumeData.personalInfo, profileImage: publicUrl },
        });

        await supabase.from("images").insert({ user_id: user.id, image_url: publicUrl });
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
        } else if (!current.is_public && current.public_slug) {
            navigator.clipboard.writeText(
                `${window.location.origin}/share/${current.public_slug}`
            );
            toast.success("Resume is now public! Link copied.");
        } else {
            toast.success("Resume is now private.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#060918] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#060918]">
            {/* Toolbar */}
            <header className="sticky top-0 z-50 border-b border-white/5 glass px-4 h-14 flex items-center justify-between gap-4 no-print">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-400" />
                        <input
                            value={title}
                            onChange={(e) => saveTitle(e.target.value)}
                            className="bg-transparent border-none text-sm font-medium text-slate-100 focus:outline-none w-48 placeholder:text-slate-600"
                        />
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        {saving ? (
                            <><Loader2 className="w-3 h-3 animate-spin" /> Saving...</>
                        ) : (
                            <><Check className="w-3 h-3 text-emerald-500" /> Saved</>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Select value={template} onValueChange={(v) => setTemplate(v as ResumeTemplate)}>
                        <SelectTrigger className="w-36 h-8 text-xs bg-white/5 border-white/10 text-slate-300 rounded-lg">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="glass border-white/10 text-slate-300">
                            <SelectItem value="modern">Modern Clean</SelectItem>
                            <SelectItem value="classic">Executive</SelectItem>
                            <SelectItem value="minimal">Minimal</SelectItem>
                            <SelectItem value="professional">Sidebar Pro</SelectItem>
                        </SelectContent>
                    </Select>

                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />

                    <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}
                        className="h-8 text-xs gap-1 border-white/10 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg">
                        <Upload className="w-3 h-3" /> Photo
                    </Button>

                    <Button variant="outline" size="sm" onClick={optimizeResume} disabled={optimizing}
                        className="h-8 text-xs gap-1 border-white/10 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg">
                        {optimizing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3 text-emerald-400" />}
                        AI Optimize
                    </Button>

                    <Button variant="outline" size="sm" onClick={togglePublic}
                        className="h-8 text-xs gap-1 border-white/10 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg">
                        <Share2 className="w-3 h-3" /> Share
                    </Button>

                    <Button variant="outline" size="sm" onClick={manualSave} disabled={saving}
                        className="h-8 text-xs gap-1 border-white/10 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg">
                        <Save className="w-3 h-3" /> Save
                    </Button>

                    <Button size="sm" onClick={exportPDF} disabled={exporting}
                        className="h-8 text-xs gap-1 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white border-0 rounded-lg">
                        {exporting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
                        PDF
                    </Button>
                </div>
            </header>

            {/* Editor Layout */}
            <div className="flex-1 flex overflow-hidden">
                <div className="w-[480px] border-r border-white/5 bg-[#0a0f1e] overflow-y-auto">
                    <ResumeForm data={resumeData} onChange={setResumeData} />
                </div>
                <div className="flex-1 overflow-auto bg-[#080d1a] p-8 flex justify-center">
                    <div className="transform scale-[0.65] origin-top">
                        <ResumePreview data={resumeData} template={template} />
                    </div>
                </div>
            </div>
        </div>
    );
}
