const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "meta-llama/llama-3-8b-instruct";

interface AIRequestOptions {
    systemPrompt: string;
    userPrompt: string;
    maxTokens?: number;
    temperature?: number;
}

export async function callAI({
    systemPrompt,
    userPrompt,
    maxTokens = 1024,
    temperature = 0.7,
}: AIRequestOptions): Promise<string> {
    const response = await fetch(OPENROUTER_API_URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost:3000",
            "X-Title": "AI Resume Builder",
        },
        body: JSON.stringify({
            model: MODEL,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            max_tokens: maxTokens,
            temperature,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            `OpenRouter API error: ${response.status} - ${JSON.stringify(errorData)}`
        );
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || "";
}

export const AI_PROMPTS = {
    generateSummary: {
        system: `You are an expert executive resume writer and career coach. You write highly professional, compelling resume summaries. Output ONLY the summary text — no headings, no labels, no conversational filler. Write in third person or implied first person (no "I"). Keep it to 2-4 sentences.`,
        user: (input: string) =>
            `Write a professional resume summary for someone with the following background:\n\n${input}`,
    },
    improveExperience: {
        system: `You are an expert resume writer specializing in transforming job descriptions into impactful, achievement-oriented bullet points. Use strong action verbs at the start of each line. Quantify results where possible. Output ONLY the bullet points, one per line, prefixed with "•". No headings, no extra text.`,
        user: (input: string) =>
            `Transform this work experience description into 3-5 professional, impact-driven resume bullet points:\n\n${input}`,
    },
    optimizeResume: {
        system: `You are a professional career coach and resume optimization expert. Analyze the resume data and provide specific, actionable suggestions to improve it. Focus on: content gaps, weak descriptions, missing quantifiable achievements, skills alignment, and formatting improvements. Output as a numbered list of concise suggestions. No conversational filler.`,
        user: (input: string) =>
            `Analyze this resume and provide optimization suggestions:\n\n${input}`,
    },
};
