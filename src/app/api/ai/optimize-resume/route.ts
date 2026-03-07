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

        const { resumeData } = await request.json();

        if (!resumeData) {
            return NextResponse.json(
                { error: "Resume data is required" },
                { status: 400 }
            );
        }

        const suggestions = await callAI({
            systemPrompt: AI_PROMPTS.optimizeResume.system,
            userPrompt: AI_PROMPTS.optimizeResume.user(JSON.stringify(resumeData, null, 2)),
            maxTokens: 1500,
        });

        return NextResponse.json({ suggestions });
    } catch (error) {
        console.error("Optimize resume error:", error);
        return NextResponse.json(
            { error: "Failed to optimize resume" },
            { status: 500 }
        );
    }
}
