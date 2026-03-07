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

        const { description } = await request.json();

        if (!description) {
            return NextResponse.json(
                { error: "Experience description is required" },
                { status: 400 }
            );
        }

        const improved = await callAI({
            systemPrompt: AI_PROMPTS.improveExperience.system,
            userPrompt: AI_PROMPTS.improveExperience.user(description),
        });

        const bulletPoints = improved
            .split("\n")
            .map((line: string) => line.replace(/^[•\-\*]\s*/, "").trim())
            .filter((line: string) => line.length > 0);

        return NextResponse.json({ bulletPoints });
    } catch (error) {
        console.error("Improve experience error:", error);
        return NextResponse.json(
            { error: "Failed to improve experience" },
            { status: 500 }
        );
    }
}
