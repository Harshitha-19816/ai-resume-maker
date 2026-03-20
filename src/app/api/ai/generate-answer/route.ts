import { callAI, AI_PROMPTS } from "@/lib/ai/openrouter";
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

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
        const { question, resumeData } = body;

        if (!question || !resumeData) {
            return NextResponse.json(
                { error: "Question and resume data are required" },
                { status: 400 }
            );
        }

        const input = `Candidate Context:\nRole: ${resumeData.experience?.[0]?.position || "Professional"}\nSkills: ${resumeData.skills?.join(", ") || "None specified"}\n\nQuestion: ${question}`;

        const answer = await callAI({
            systemPrompt: AI_PROMPTS.generateAnswer.system,
            userPrompt: AI_PROMPTS.generateAnswer.user(input),
            maxTokens: 1000,
        });

        return NextResponse.json({ answer });
    } catch (error) {
        console.error("Generate answer error:", error);
        return NextResponse.json(
            { error: "Failed to generate answer" },
            { status: 500 }
        );
    }
}
