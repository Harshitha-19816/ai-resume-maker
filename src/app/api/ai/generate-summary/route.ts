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

        const { jobTitle, skills, experience } = await request.json();

        if (!jobTitle) {
            return NextResponse.json(
                { error: "Job title is required" },
                { status: 400 }
            );
        }

        const input = `Job Title: ${jobTitle}\nKey Skills: ${skills || "Not specified"}\nYears of Experience: ${experience || "Not specified"}`;

        const summary = await callAI({
            systemPrompt: AI_PROMPTS.generateSummary.system,
            userPrompt: AI_PROMPTS.generateSummary.user(input),
        });

        return NextResponse.json({ summary });
    } catch (error) {
        console.error("Generate summary error:", error);
        return NextResponse.json(
            { error: "Failed to generate summary" },
            { status: 500 }
        );
    }
}
