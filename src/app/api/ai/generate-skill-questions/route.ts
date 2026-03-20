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
        const selectedSkill = body.selectedSkill;

        if (!selectedSkill) {
            return NextResponse.json(
                { error: "Skill is required" },
                { status: 400 }
            );
        }

        const jsonResponse = await callAI({
            systemPrompt: AI_PROMPTS.generateSkillQuestions.system,
            userPrompt: AI_PROMPTS.generateSkillQuestions.user(selectedSkill),
            maxTokens: 1500,
        });

        try {
            let cleanJsonString = jsonResponse.trim();
            const jsonMatch = cleanJsonString.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
            if (jsonMatch && jsonMatch[1]) {
                 cleanJsonString = jsonMatch[1];
            } else {
                 const firstBrace = cleanJsonString.indexOf('{');
                 const lastBrace = cleanJsonString.lastIndexOf('}');
                 if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
                      cleanJsonString = cleanJsonString.substring(firstBrace, lastBrace + 1);
                 }
            }

            const questions = JSON.parse(cleanJsonString);

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
        console.error("Generate skill questions error:", error);
        return NextResponse.json(
            { error: "Failed to generate skill questions" },
            { status: 500 }
        );
    }
}
