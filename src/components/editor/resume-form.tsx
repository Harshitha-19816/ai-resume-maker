"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Plus,
    Trash2,
    Sparkles,
    Loader2,
    X,
    ChevronRight,
    ChevronLeft,
    User,
    Briefcase,
    GraduationCap,
    Wrench,
    Palette,
} from "lucide-react";
import { ResumeData, Experience, Education, Project, Theme, DEFAULT_RESUME_DATA } from "@/types/resume";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

interface ResumeFormProps {
    data: ResumeData;
    onChange: (data: ResumeData) => void;
}

const STEPS = [
    { id: 1, name: "Personal", icon: User },
    { id: 2, name: "Experience", icon: Briefcase },
    { id: 3, name: "Education", icon: GraduationCap },
    { id: 4, name: "Skills & Projects", icon: Wrench },
    { id: 5, name: "Theme", icon: Palette },
];

export default function ResumeForm({ data, onChange }: ResumeFormProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [aiLoading, setAiLoading] = useState<string | null>(null);

    const updatePersonalInfo = (field: string, value: string) => {
        onChange({
            ...data,
            personalInfo: { ...data.personalInfo, [field]: value },
        });
    };

    const updateTheme = (field: keyof Theme, value: string | boolean) => {
        onChange({
            ...data,
            theme: { ...(data.theme || DEFAULT_RESUME_DATA.theme!), [field]: value },
        });
    };

    // Experience methods
    const addExperience = () => {
        const newExp: Experience = {
            id: uuidv4(),
            company: "",
            position: "",
            location: "",
            startDate: "",
            endDate: "",
            current: false,
            description: [""],
        };
        onChange({ ...data, experience: [...data.experience, newExp] });
    };

    const updateExperience = (index: number, field: string, value: unknown) => {
        const updated = [...data.experience];
        updated[index] = { ...updated[index], [field]: value };
        onChange({ ...data, experience: updated });
    };

    const removeExperience = (index: number) => {
        onChange({
            ...data,
            experience: data.experience.filter((_, i) => i !== index),
        });
    };

    const updateExpDescription = (expIndex: number, descIndex: number, value: string) => {
        const updated = [...data.experience];
        const desc = [...updated[expIndex].description];
        desc[descIndex] = value;
        updated[expIndex] = { ...updated[expIndex], description: desc };
        onChange({ ...data, experience: updated });
    };

    const addExpBullet = (expIndex: number) => {
        const updated = [...data.experience];
        updated[expIndex] = {
            ...updated[expIndex],
            description: [...updated[expIndex].description, ""],
        };
        onChange({ ...data, experience: updated });
    };

    const removeExpBullet = (expIndex: number, descIndex: number) => {
        const updated = [...data.experience];
        updated[expIndex] = {
            ...updated[expIndex],
            description: updated[expIndex].description.filter((_, i) => i !== descIndex),
        };
        onChange({ ...data, experience: updated });
    };

    // Education methods
    const addEducation = () => {
        const newEdu: Education = {
            id: uuidv4(),
            institution: "",
            degree: "",
            field: "",
            startDate: "",
            endDate: "",
        };
        onChange({ ...data, education: [...data.education, newEdu] });
    };

    const updateEducation = (index: number, field: string, value: string) => {
        const updated = [...data.education];
        updated[index] = { ...updated[index], [field]: value };
        onChange({ ...data, education: updated });
    };

    const removeEducation = (index: number) => {
        onChange({
            ...data,
            education: data.education.filter((_, i) => i !== index),
        });
    };

    // Projects methods
    const addProject = () => {
        const newProject: Project = {
            id: uuidv4(),
            name: "",
            description: "",
            technologies: [],
            link: "",
        };
        onChange({ ...data, projects: [...data.projects, newProject] });
    };

    const updateProject = (index: number, field: string, value: unknown) => {
        const updated = [...data.projects];
        updated[index] = { ...updated[index], [field]: value };
        onChange({ ...data, projects: updated });
    };

    const removeProject = (index: number) => {
        onChange({
            ...data,
            projects: data.projects.filter((_, i) => i !== index),
        });
    };

    // Skills methods
    const [newSkill, setNewSkill] = useState("");
    const addSkill = () => {
        if (newSkill.trim() && !data.skills.includes(newSkill.trim())) {
            onChange({ ...data, skills: [...data.skills, newSkill.trim()] });
            setNewSkill("");
        }
    };

    const removeSkill = (index: number) => {
        onChange({ ...data, skills: data.skills.filter((_, i) => i !== index) });
    };

    // AI generate summary
    const generateSummary = async () => {
        setAiLoading("summary");
        try {
            const res = await fetch("/api/ai/generate-summary", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    jobTitle: data.experience[0]?.position || data.personalInfo.fullName || "Professional",
                    skills: data.skills.join(", "),
                    experience: `${data.experience.length} roles`,
                }),
            });
            const result = await res.json();
            if (result.summary) {
                updatePersonalInfo("summary", result.summary);
                toast.success("Summary generated!");
            } else {
                toast.error(result.error || "Failed to generate summary");
            }
        } catch {
            toast.error("Failed to generate summary");
        } finally {
            setAiLoading(null);
        }
    };

    // AI improve experience
    const improveExperience = async (expIndex: number) => {
        const exp = data.experience[expIndex];
        const description = exp.description.filter((d) => d.trim()).join(". ");
        if (!description) {
            toast.error("Add some description first to improve");
            return;
        }
        setAiLoading(`exp-${expIndex}`);
        try {
            const res = await fetch("/api/ai/improve-experience", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    description: `${exp.position} at ${exp.company}: ${description}`,
                }),
            });
            const result = await res.json();
            if (result.bulletPoints) {
                updateExperience(expIndex, "description", result.bulletPoints);
                toast.success("Experience improved!");
            } else {
                toast.error(result.error || "Failed to improve experience");
            }
        } catch {
            toast.error("Failed to improve experience");
        } finally {
            setAiLoading(null);
        }
    };

    const inputClass = "bg-white/5 border-white/8 text-slate-100 placeholder:text-slate-600 focus:border-emerald-500/40 focus:ring-emerald-500/20 h-11 rounded-xl";
    const labelClass = "text-slate-500 text-xs uppercase tracking-wider font-medium";

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex items-center gap-2 mb-6 text-slate-100 font-bold text-lg">
                            <User className="w-5 h-5 text-emerald-400" />
                            Personal Information
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 space-y-2">
                                <Label className={labelClass}>Full Name</Label>
                                <Input
                                    value={data.personalInfo.fullName}
                                    onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
                                    placeholder="John Doe"
                                    className={inputClass}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className={labelClass}>Email</Label>
                                <Input
                                    type="email"
                                    value={data.personalInfo.email}
                                    onChange={(e) => updatePersonalInfo("email", e.target.value)}
                                    placeholder="john@example.com"
                                    className={inputClass}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className={labelClass}>Phone</Label>
                                <Input
                                    value={data.personalInfo.phone}
                                    onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                                    placeholder="+1 234 567 8900"
                                    className={inputClass}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className={labelClass}>Location</Label>
                                <Input
                                    value={data.personalInfo.location}
                                    onChange={(e) => updatePersonalInfo("location", e.target.value)}
                                    placeholder="San Francisco, CA"
                                    className={inputClass}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className={labelClass}>Website</Label>
                                <Input
                                    value={data.personalInfo.website || ""}
                                    onChange={(e) => updatePersonalInfo("website", e.target.value)}
                                    placeholder="https://yoursite.com"
                                    className={inputClass}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className={labelClass}>LinkedIn</Label>
                                <Input
                                    value={data.personalInfo.linkedin || ""}
                                    onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
                                    placeholder="linkedin.com/in/..."
                                    className={inputClass}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className={labelClass}>GitHub</Label>
                                <Input
                                    value={data.personalInfo.github || ""}
                                    onChange={(e) => updatePersonalInfo("github", e.target.value)}
                                    placeholder="github.com/..."
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        <Separator className="bg-white/5 my-8" />

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className={labelClass}>Professional Summary</Label>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={generateSummary}
                                    disabled={aiLoading === "summary"}
                                    className="text-xs gap-1.5 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 h-8 px-3 rounded-full"
                                >
                                    {aiLoading === "summary" ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                        <Sparkles className="w-3.5 h-3.5" />
                                    )}
                                    Generate with AI
                                </Button>
                            </div>
                            <Textarea
                                value={data.personalInfo.summary}
                                onChange={(e) => updatePersonalInfo("summary", e.target.value)}
                                placeholder="Briefly describe your professional background..."
                                className="bg-white/5 border-white/8 text-slate-100 min-h-[140px] resize-none leading-relaxed rounded-xl focus:border-emerald-500/40"
                            />
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-2 text-slate-100 font-bold text-lg">
                                <Briefcase className="w-5 h-5 text-emerald-400" />
                                Work Experience
                            </div>
                            <Button variant="outline" size="sm" onClick={addExperience}
                                className="gap-1.5 h-9 border-white/10 text-slate-400 hover:text-white hover:bg-white/5 px-4 rounded-full">
                                <Plus className="w-4 h-4" /> Add Role
                            </Button>
                        </div>
                        <div className="space-y-8">
                            {data.experience.length === 0 && (
                                <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-2xl">
                                    <p className="text-slate-600 text-sm">No work experience added yet.</p>
                                </div>
                            )}
                            {data.experience.map((exp, index) => (
                                <div key={exp.id} className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] space-y-4 relative group">
                                    <Button variant="ghost" size="icon" onClick={() => removeExperience(index)}
                                        className="absolute top-4 right-4 h-8 w-8 text-slate-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className={labelClass}>Position</Label>
                                            <Input value={exp.position}
                                                onChange={(e) => updateExperience(index, "position", e.target.value)}
                                                placeholder="e.g. Senior Software Engineer"
                                                className={inputClass} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className={labelClass}>Company</Label>
                                            <Input value={exp.company}
                                                onChange={(e) => updateExperience(index, "company", e.target.value)}
                                                placeholder="e.g. Google"
                                                className={inputClass} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className={labelClass}>Start Date</Label>
                                            <Input value={exp.startDate}
                                                onChange={(e) => updateExperience(index, "startDate", e.target.value)}
                                                placeholder="Jan 2022"
                                                className={inputClass} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className={labelClass}>End Date</Label>
                                            <Input value={exp.current ? "Present" : exp.endDate}
                                                onChange={(e) => updateExperience(index, "endDate", e.target.value)}
                                                placeholder="Present" disabled={exp.current}
                                                className={inputClass} />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <Label className={labelClass}>Description</Label>
                                            <Button variant="ghost" size="sm"
                                                onClick={() => improveExperience(index)}
                                                disabled={aiLoading === `exp-${index}`}
                                                className="text-[10px] gap-1 text-emerald-400 hover:text-emerald-300 h-6 px-2">
                                                {aiLoading === `exp-${index}` ? (
                                                    <Loader2 className="w-3 h-3 animate-spin" />
                                                ) : (
                                                    <Sparkles className="w-3 h-3" />
                                                )}
                                                Improve with AI
                                            </Button>
                                        </div>
                                        {exp.description.map((desc, dIndex) => (
                                            <div key={dIndex} className="flex gap-2">
                                                <Textarea
                                                    value={desc}
                                                    onChange={(e) => updateExpDescription(index, dIndex, e.target.value)}
                                                    placeholder="Describe your impact and achievements..."
                                                    className="bg-white/5 border-white/5 text-sm text-slate-100 min-h-[44px] resize-none rounded-xl focus:border-emerald-500/40"
                                                    rows={2}
                                                />
                                                <Button variant="ghost" size="icon"
                                                    className="h-9 w-9 shrink-0 text-slate-700 hover:text-white"
                                                    onClick={() => removeExpBullet(index, dIndex)}>
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                        <Button variant="ghost" size="sm"
                                            onClick={() => addExpBullet(index)}
                                            className="text-xs gap-1 h-7 text-slate-600 hover:text-white">
                                            <Plus className="w-3.5 h-3.5" /> Add bullet point
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-2 text-slate-100 font-bold text-lg">
                                <GraduationCap className="w-5 h-5 text-emerald-400" />
                                Education
                            </div>
                            <Button variant="outline" size="sm" onClick={addEducation}
                                className="gap-1.5 h-9 border-white/10 text-slate-400 hover:text-white hover:bg-white/5 px-4 rounded-full">
                                <Plus className="w-4 h-4" /> Add Education
                            </Button>
                        </div>
                        <div className="space-y-6">
                            {data.education.map((edu, index) => (
                                <div key={edu.id} className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] space-y-4 relative group">
                                    <Button variant="ghost" size="icon"
                                        onClick={() => removeEducation(index)}
                                        className="absolute top-4 right-4 h-8 w-8 text-slate-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label className={labelClass}>Institution</Label>
                                            <Input value={edu.institution}
                                                onChange={(e) => updateEducation(index, "institution", e.target.value)}
                                                placeholder="e.g. Stanford University"
                                                className={inputClass} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className={labelClass}>Degree</Label>
                                                <Input value={edu.degree}
                                                    onChange={(e) => updateEducation(index, "degree", e.target.value)}
                                                    placeholder="e.g. Bachelor of Science"
                                                    className={inputClass} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className={labelClass}>Field of Study</Label>
                                                <Input value={edu.field}
                                                    onChange={(e) => updateEducation(index, "field", e.target.value)}
                                                    placeholder="e.g. Computer Science"
                                                    className={inputClass} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className={labelClass}>Start Date</Label>
                                                <Input value={edu.startDate}
                                                    onChange={(e) => updateEducation(index, "startDate", e.target.value)}
                                                    placeholder="2018"
                                                    className={inputClass} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className={labelClass}>End Date</Label>
                                                <Input value={edu.endDate}
                                                    onChange={(e) => updateEducation(index, "endDate", e.target.value)}
                                                    placeholder="2022"
                                                    className={inputClass} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                        <section>
                            <div className="flex items-center gap-2 text-slate-100 font-bold text-lg mb-6">
                                <Wrench className="w-5 h-5 text-emerald-400" />
                                Skills & Technologies
                            </div>
                            <div className="glass-card p-6 rounded-2xl space-y-4">
                                <div className="flex gap-2">
                                    <Input
                                        value={newSkill}
                                        onChange={(e) => setNewSkill(e.target.value)}
                                        placeholder="e.g. React.js"
                                        className={inputClass}
                                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                                    />
                                    <Button variant="outline" onClick={addSkill}
                                        className="shrink-0 h-11 border-white/10 text-slate-400 hover:text-white rounded-xl">
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {data.skills.map((skill, index) => (
                                        <span key={index}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                                            {skill}
                                            <button onClick={() => removeSkill(index)}
                                                className="hover:text-white transition-colors">
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <div className="text-slate-100 font-bold">Projects</div>
                                <Button variant="outline" size="sm" onClick={addProject}
                                    className="gap-1.5 h-8 border-white/10 text-slate-500 hover:text-white rounded-full text-xs">
                                    <Plus className="w-3.5 h-3.5" /> Add Project
                                </Button>
                            </div>
                            <div className="space-y-6">
                                {data.projects.map((project, index) => (
                                    <div key={project.id} className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] space-y-4 group relative">
                                        <Button variant="ghost" size="icon"
                                            onClick={() => removeProject(index)}
                                            className="absolute top-4 right-4 h-7 w-7 text-slate-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <Label className={labelClass}>Project Name</Label>
                                                <Input value={project.name}
                                                    onChange={(e) => updateProject(index, "name", e.target.value)}
                                                    placeholder="e.g. Portfolio"
                                                    className={inputClass} />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className={labelClass}>Link</Label>
                                                <Input value={project.link || ""}
                                                    onChange={(e) => updateProject(index, "link", e.target.value)}
                                                    placeholder="e.g. https://github.com/..."
                                                    className={inputClass} />
                                            </div>
                                            <div className="col-span-2 space-y-1.5">
                                                <Label className={labelClass}>Description</Label>
                                                <Textarea
                                                    value={project.description}
                                                    onChange={(e) => updateProject(index, "description", e.target.value)}
                                                    placeholder="What did you achieve in this project?"
                                                    className="bg-white/5 border-white/8 text-slate-100 min-h-[80px] resize-none rounded-xl focus:border-emerald-500/40"
                                                    rows={3}
                                                />
                                            </div>
                                            <div className="col-span-2 space-y-1.5">
                                                <Label className={labelClass}>Technologies</Label>
                                                <Input value={project.technologies.join(", ")}
                                                    onChange={(e) => updateProject(index, "technologies",
                                                        e.target.value.split(",").map((t) => t.trim()).filter(Boolean))}
                                                    placeholder="e.g. React, Tailwind, Supabase"
                                                    className={inputClass} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                );
            case 5:
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex items-center gap-2 text-slate-100 font-bold text-lg mb-6">
                            <Palette className="w-5 h-5 text-emerald-400" />
                            Theme & Formatting
                        </div>
                        <div className="glass-card p-6 rounded-2xl space-y-6">
                            <div className="space-y-3">
                                <Label className={labelClass}>Font Family</Label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { label: "Sans", value: "font-sans" },
                                        { label: "Serif", value: "font-serif" },
                                        { label: "Mono", value: "font-mono" },
                                    ].map((font) => (
                                        <button
                                            key={font.value}
                                            onClick={() => updateTheme("fontFamily", font.value)}
                                            className={`h-10 rounded-xl text-sm font-medium border transition-colors ${
                                                (data.theme?.fontFamily || "font-sans") === font.value
                                                    ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
                                                    : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                                            }`}
                                        >
                                            {font.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <Label className={labelClass}>Base Font Size</Label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { label: "Small", value: "text-xs" },
                                        { label: "Medium", value: "text-sm" },
                                        { label: "Large", value: "text-base" },
                                    ].map((size) => (
                                        <button
                                            key={size.value}
                                            onClick={() => updateTheme("fontSize", size.value)}
                                            className={`h-10 rounded-xl text-sm font-medium border transition-colors ${
                                                (data.theme?.fontSize || "text-sm") === size.value
                                                    ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
                                                    : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                                            }`}
                                        >
                                            {size.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <Separator className="bg-white/5" />

                            <div className="space-y-3">
                                <Label className={labelClass}>Bullet Point Style</Label>
                                <div className="grid grid-cols-4 gap-3">
                                    {[
                                        { label: "Disc", value: "disc" },
                                        { label: "Circle", value: "circle" },
                                        { label: "Square", value: "square" },
                                        { label: "None", value: "none" },
                                    ].map((style) => (
                                        <button
                                            key={style.value}
                                            onClick={() => updateTheme("bulletStyle", style.value as any)}
                                            className={`h-10 rounded-xl text-sm font-medium border transition-colors ${
                                                (data.theme?.bulletStyle || "disc") === style.value
                                                    ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
                                                    : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                                            }`}
                                        >
                                            {style.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <Separator className="bg-white/5" />

                            <div className="flex items-center justify-between">
                                <div>
                                    <Label className="text-slate-200 block mb-1">Bold Section Headings</Label>
                                    <span className="text-xs text-slate-500">Enable bold text for block headers</span>
                                </div>
                                <button
                                    onClick={() => updateTheme("headingBold", !(data.theme?.headingBold ?? true))}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${
                                        (data.theme?.headingBold ?? true) ? "bg-emerald-500" : "bg-white/10"
                                    }`}
                                >
                                    <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                                        (data.theme?.headingBold ?? true) ? "translate-x-6" : "translate-x-0"
                                    }`} />
                                </button>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#0a0f1e] text-slate-100 overflow-hidden">
            {/* Step Indicator */}
            <div className="px-6 py-8 border-b border-white/5 bg-[#0c1225]/80 backdrop-blur-sm sticky top-0 z-20">
                <div className="flex items-center justify-between relative">
                    {/* Progress Bar */}
                    <div className="absolute top-1/3 left-0 w-full h-0.5 bg-white/5 -translate-y-1/2" />
                    <div
                        className="absolute top-1/3 left-0 h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 -translate-y-1/2 transition-all duration-500 ease-in-out"
                        style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                    />

                    {STEPS.map((step) => {
                        const Icon = step.icon;
                        const isActive = currentStep === step.id;
                        const isCompleted = currentStep > step.id;

                        return (
                            <button
                                key={step.id}
                                onClick={() => setCurrentStep(step.id)}
                                className="relative z-10 flex flex-col items-center gap-3 transition-all duration-300"
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all duration-300 ${isActive
                                        ? "bg-gradient-to-br from-emerald-500 to-cyan-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-110"
                                        : isCompleted
                                            ? "bg-[#0c1225] border-emerald-500 text-emerald-400"
                                            : "bg-[#0c1225] border-white/5 text-slate-600 hover:border-white/10"
                                    }`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${isActive ? "text-emerald-400" : "text-slate-600"
                                    }`}>
                                    {step.name}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Main Form Content */}
            <div className="flex-1 overflow-y-auto px-8 py-10">
                {renderStep()}
                <div className="h-20" />
            </div>

            {/* Step Navigation Footer */}
            <div className="px-8 py-5 border-t border-white/5 bg-[#0a0f1e]/80 backdrop-blur-md flex items-center justify-between sticky bottom-0 z-20">
                <Button variant="ghost"
                    onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
                    disabled={currentStep === 1}
                    className="text-slate-500 hover:text-white hover:bg-white/5 px-6 rounded-full font-semibold">
                    <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                </Button>

                <div className="flex gap-4">
                    {currentStep < STEPS.length ? (
                        <Button
                            onClick={() => setCurrentStep((s) => Math.min(STEPS.length, s + 1))}
                            className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white px-8 rounded-full shadow-lg shadow-emerald-500/20 font-semibold border-0">
                            Next Step <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    ) : (
                        <div className="text-xs text-slate-600 italic flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                            All steps completed
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
