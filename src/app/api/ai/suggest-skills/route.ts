import { NextResponse } from "next/server";
import { generateSkillSuggestions } from "@/lib/ai/openrouter";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { jobTitle, experienceContext, educationContext, existingSkills } = body;

        if (!jobTitle) {
            return NextResponse.json(
                { error: "Insufficient profile data to suggest skills." },
                { status: 400 }
            );
        }

        const suggestedSkills = await generateSkillSuggestions(
            jobTitle,
            experienceContext,
            educationContext,
            existingSkills
        );

        return NextResponse.json({ skills: suggestedSkills });
    } catch (error) {
        console.error("Suggest Skills Error:", error);
        return NextResponse.json(
            { error: "Failed to generate skill suggestions." },
            { status: 500 }
        );
    }
}
