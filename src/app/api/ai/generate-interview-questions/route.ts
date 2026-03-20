import { callAI, AI_PROMPTS } from "@/lib/ai/openrouter";
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ResumeData } from "@/types/resume";

export async function POST(request: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const resumeData = body.resumeData as ResumeData;

        if (!resumeData) {
            return NextResponse.json(
                { error: "Resume data is required" },
                { status: 400 }
            );
        }

        const input = `
Role/Title: ${resumeData.experience?.[0]?.position || resumeData.personalInfo?.summary || "Professional"}
Skills: ${resumeData.skills?.join(", ") || "Not specified"}
Experience: ${JSON.stringify(resumeData.experience?.map(e => ({
            role: e.position,
            company: e.company,
            description: e.description
        }))) || "Not specified"}
Projects: ${JSON.stringify(resumeData.projects?.map(p => ({
            name: p.name,
            tech: p.technologies,
            description: p.description
        }))) || "Not specified"}
        `.trim();

        const jsonResponse = await callAI({
            systemPrompt: AI_PROMPTS.generateInterviewPractice.system,
            userPrompt: AI_PROMPTS.generateInterviewPractice.user(input),
            maxTokens: 1500,
        });

        try {
            // Attempt to parse the response as JSON. In case the LLM wrapped it in markdown or appended conversational text, try to extract just the JSON.
            let cleanJsonString = jsonResponse.trim();
            
            // Extract json block if it has markdown formatting
            const jsonMatch = cleanJsonString.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
            if (jsonMatch && jsonMatch[1]) {
                 cleanJsonString = jsonMatch[1];
            } else {
                 // Try to find the first { and last } to strip conversational intro/outro
                 const firstBrace = cleanJsonString.indexOf('{');
                 const lastBrace = cleanJsonString.lastIndexOf('}');
                 if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
                      cleanJsonString = cleanJsonString.substring(firstBrace, lastBrace + 1);
                 }
            }

            const questions = JSON.parse(cleanJsonString);

            // Validate that we received an object with the required keys
            if (
                !Array.isArray(questions.beginnerQuestions) ||
                !Array.isArray(questions.intermediateQuestions) ||
                !Array.isArray(questions.advancedQuestions) ||
                !Array.isArray(questions.codingQuestions)
            ) {
                throw new Error("Invalid output structure");
            }

            return NextResponse.json({ questions });
        } catch (parseError) {
            console.error("Failed to parse AI output:", jsonResponse);
            return NextResponse.json(
                { error: "Failed to parse interview questions format." },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Generate interview questions error:", error);
        return NextResponse.json(
            { error: "Failed to generate interview questions" },
            { status: 500 }
        );
    }
}
