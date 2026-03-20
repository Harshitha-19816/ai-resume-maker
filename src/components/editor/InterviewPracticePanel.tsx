"use client";

import { useState } from "react";
import { ResumeData } from "@/types/resume";
import { Button } from "@/components/ui/button";
import {
    Loader2,
    Sparkles,
    MessageSquare,
    Code,
    Brain,
    Layers,
    Target,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface QuestionSets {
    beginnerQuestions: string[];
    intermediateQuestions: string[];
    advancedQuestions: string[];
    codingQuestions: string[];
}

interface QuestionWithAnswer {
    question: string;
    answer: string | null;
    loading: boolean;
}

interface InterviewPracticePanelProps {
    resumeData: ResumeData;
}

export default function InterviewPracticePanel({
    resumeData,
}: InterviewPracticePanelProps) {
    const [loading, setLoading] = useState(false);
    const [skillLoading, setSkillLoading] = useState(false);
    const [selectedSkill, setSelectedSkill] = useState<string>("");
    
    // Using mapping object to easily update individual questions
    const [beginner, setBeginner] = useState<QuestionWithAnswer[]>([]);
    const [intermediate, setIntermediate] = useState<QuestionWithAnswer[]>([]);
    const [advanced, setAdvanced] = useState<QuestionWithAnswer[]>([]);
    const [coding, setCoding] = useState<QuestionWithAnswer[]>([]);

    const formatQuestions = (questions: string[] | undefined): QuestionWithAnswer[] => {
        if (!questions) return [];
        return questions.map(q => ({ question: q, answer: null, loading: false }));
    };

    const handleGenerate = async (url: string, body: any, isSkill: boolean = false) => {
        const setLoader = isSkill ? setSkillLoading : setLoading;
        setLoader(true);
        setBeginner([]);
        setIntermediate([]);
        setAdvanced([]);
        setCoding([]);

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || "Failed to generate questions");
            }

            const result = await res.json();

            if (result.questions) {
                setBeginner(formatQuestions(result.questions.beginnerQuestions));
                setIntermediate(formatQuestions(result.questions.intermediateQuestions));
                setAdvanced(formatQuestions(result.questions.advancedQuestions));
                setCoding(formatQuestions(result.questions.codingQuestions));
                
                toast.success(isSkill 
                    ? `Questions generated for ${selectedSkill}!` 
                    : "Interview questions generated successfully!"
                );
            } else {
                throw new Error("Invalid response format");
            }
        } catch (error: any) {
            console.error("AI Error:", error);
            toast.error(error.message || "Something went wrong generating questions.");
        } finally {
            setLoader(false);
        }
    };

    const generateGeneralQuestions = () => {
        handleGenerate("/api/ai/generate-interview-questions", { resumeData });
    };

    const generateSkillQuestions = () => {
        if (!selectedSkill) {
            toast.error("Please select a skill first.");
            return;
        }
        handleGenerate("/api/ai/generate-skill-questions", { selectedSkill, resumeData }, true);
    };

    const generateAnswer = async (
        sectionName: "beginner" | "intermediate" | "advanced" | "coding",
        index: number,
        questionText: string
    ) => {
        // Find correct setter and getter
        const stateMap = {
            beginner: { get: beginner, set: setBeginner },
            intermediate: { get: intermediate, set: setIntermediate },
            advanced: { get: advanced, set: setAdvanced },
            coding: { get: coding, set: setCoding },
        };
        
        const target = stateMap[sectionName];
        
        // Set loading state for this specific question
        const newArr = [...target.get];
        newArr[index] = { ...newArr[index], loading: true };
        target.set(newArr);

        try {
            const res = await fetch("/api/ai/generate-answer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: questionText, resumeData }),
            });

            if (!res.ok) throw new Error("Failed to generate answer");
            const result = await res.json();

            // Update array with answer
            const finalArr = [...target.get];
            finalArr[index] = { ...finalArr[index], answer: result.answer, loading: false };
            target.set(finalArr);
            
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate answer.");
            
            // Revert loading state
            const revertArr = [...target.get];
            revertArr[index] = { ...revertArr[index], loading: false };
            target.set(revertArr);
        }
    };

    const hasQuestions = beginner.length > 0 || intermediate.length > 0 || advanced.length > 0 || coding.length > 0;

    const renderQuestionCard = (
        q: QuestionWithAnswer, 
        index: number, 
        difficultyLabel: string, 
        badgeColor: string, 
        sectionName: "beginner" | "intermediate" | "advanced" | "coding"
    ) => {
        return (
            <div key={index} className="bg-[#0f1525] border border-white/5 rounded-2xl p-5 mb-4 hover:border-white/10 transition-colors">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${badgeColor}`}>
                                {difficultyLabel}
                            </span>
                        </div>
                        <p className="text-slate-200 text-sm font-medium leading-relaxed">
                            {q.question}
                        </p>
                    </div>
                </div>

                {!q.answer && (
                    <div className="mt-4 flex justify-end">
                        <Button
                            size="sm"
                            onClick={() => generateAnswer(sectionName, index, q.question)}
                            disabled={q.loading}
                            className="h-8 text-xs bg-white/5 hover:bg-emerald-500/10 hover:text-emerald-400 text-slate-300 border border-white/10"
                        >
                            {q.loading ? (
                                <><Loader2 className="w-3 h-3 mr-2 animate-spin" /> Thinking...</>
                            ) : (
                                <><Brain className="w-3 h-3 mr-2 text-emerald-500" /> Generate Answer</>
                            )}
                        </Button>
                    </div>
                )}

                {q.answer && (
                    <div className="mt-4 pt-4 border-t border-white/5">
                        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                            <Sparkles className="w-3 h-3" /> AI Suggested Answer
                        </div>
                        <div className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap pl-4 border-l-2 border-emerald-500/30">
                            {q.answer}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderSection = (title: string, icon: React.ReactNode, qList: QuestionWithAnswer[], difficultyLabel: string, badgeColor: string, sectionName: "beginner" | "intermediate" | "advanced" | "coding") => {
        if (!qList || qList.length === 0) return null;
        return (
            <div className="mb-8">
                <div className="flex items-center gap-2 text-emerald-400 font-bold mb-4 pb-2 border-b border-white/5">
                    {icon}
                    <h3>{title}</h3>
                </div>
                <div>
                    {qList.map((q, i) => renderQuestionCard(q, i, difficultyLabel, badgeColor, sectionName))}
                </div>
            </div>
        );
    };

    return (
        <div className="w-[210mm] mx-auto mt-12 bg-[#0a0f1e] border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col mb-8 border-b border-white/5 pb-8 space-y-6">
                <div>
                    <div className="flex items-center gap-3 text-2xl font-bold text-slate-100 mb-2">
                        <Target className="w-8 h-8 text-emerald-400 p-1.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20" />
                        AI Interview Practice
                    </div>
                    <p className="text-slate-400 text-sm">
                        Simulate full interviews or drill down into specific skills. Ask the AI for answer hints when you get stuck.
                    </p>
                </div>
                
                <div className="flex flex-col md:flex-row gap-4">
                    <Button
                        onClick={generateGeneralQuestions}
                        disabled={loading || skillLoading}
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white border-0 shadow-lg shadow-emerald-500/20 gap-2 h-11 rounded-xl font-semibold transition-all hover:scale-[1.02]"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Layers className="w-4 h-4" />}
                        Generate Full Mock Interview
                    </Button>

                    <div className="flex flex-1 items-center gap-2">
                        <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                            <SelectTrigger className="flex-1 h-11 bg-white/5 border-white/10 text-slate-300 rounded-xl">
                                <SelectValue placeholder="Select a skill..." />
                            </SelectTrigger>
                            <SelectContent className="glass border-white/10 text-slate-300 max-h-[300px]">
                                {(resumeData.skills || []).map((skill, i) => (
                                    <SelectItem key={i} value={skill}>{skill}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button
                            onClick={generateSkillQuestions}
                            disabled={!selectedSkill || loading || skillLoading}
                            variant="outline"
                            className="bg-white/5 border-white/10 hover:bg-white/10 hover:text-white text-slate-300 h-11 rounded-xl px-4"
                        >
                            {skillLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Drill Skill"}
                        </Button>
                    </div>
                </div>
            </div>

            {(loading || skillLoading) && (
                <div className="flex flex-col items-center justify-center py-16 space-y-4 text-emerald-500">
                    <Loader2 className="w-10 h-10 animate-spin" />
                    <p className="text-slate-400 text-sm animate-pulse">Analyzing context & tailoring questions...</p>
                </div>
            )}

            {hasQuestions && !(loading || skillLoading) && (
                <div className="relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {renderSection("Warm-up & Foundations", <Brain className="w-5 h-5" />, beginner, "Beginner", "bg-emerald-500/20 text-emerald-400", "beginner")}
                    {renderSection("Core Competencies", <Layers className="w-5 h-5" />, intermediate, "Intermediate", "bg-blue-500/20 text-blue-400", "intermediate")}
                    {renderSection("Advanced & Architectural", <Target className="w-5 h-5" />, advanced, "Advanced", "bg-purple-500/20 text-purple-400", "advanced")}
                    {renderSection("Coding & Algorithms", <Code className="w-5 h-5" />, coding, "Coding", "bg-orange-500/20 text-orange-400", "coding")}
                </div>
            )}
            
            {!hasQuestions && !(loading || skillLoading) && (
                <div className="text-center py-16 border-2 border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
                    <Sparkles className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                    <h3 className="text-slate-300 font-medium mb-2">Ready for your interview?</h3>
                    <p className="text-slate-500 text-sm max-w-md mx-auto">
                        Generate a general mock interview based on your full resume, or select a specific skill above to drill down into technical specifics.
                    </p>
                </div>
            )}
        </div>
    );
}
