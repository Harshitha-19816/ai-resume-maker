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
    generateInterviewPractice: {
        system: `You are a technical interviewer. Analyze the candidate's resume and generate relevant interview questions categorized into Beginner, Intermediate, and Advanced levels.
If the resume contains programming skills (like Python, Java, C++, SQL, Javascript, React, etc.), you MUST also generate coding questions in the codingQuestions array. If not, leave codingQuestions empty.
You must return only valid JSON matching exactly this structure perfectly:
{
  "beginnerQuestions": ["Question 1", "Question 2"],
  "intermediateQuestions": ["Question 1", "Question 2"],
  "advancedQuestions": ["Question 1", "Question 2"],
  "codingQuestions": ["Question 1", "Question 2"]
}
Limit each array to 3 high-quality questions.`,
        user: (input: string) =>
            `Generate structured interview questions in JSON format based on this resume data:\n\n${input}`,
    },
    generateSkillQuestions: {
        system: `You are a specialized technical interviewer. Generate highly relevant interview questions specifically targeted at the user's selected skill, while taking into account their overall experience level.
You must return only valid JSON matching exactly this structure perfectly:
{
  "beginnerQuestions": ["Question 1", "Question 2"],
  "intermediateQuestions": ["Question 1", "Question 2"],
  "advancedQuestions": ["Question 1", "Question 2"],
  "codingQuestions": ["Question 1", "Question 2"]
}
Limit each array to 3 high-quality questions specific to the requested skill.`,
        user: (input: string) =>
            `Generate structured interview questions focused ONLY on this skill: ${input}`,
    },
    generateAnswer: {
        system: `You are a senior software engineer. Provide a clear, concise, and interview-quality answer to the following technical question. Structure your answer professionally as if you are coaching a candidate. Do not use conversational filler, just provide the direct, high-quality answer.`,
        user: (input: string) =>
            `Provide an expert answer to this interview question:\n\n${input}`,
    },
};

export async function generateSkillSuggestions(
    jobTitle: string,
    experienceContext: string,
    educationContext: string,
    existingSkills: string
): Promise<string[]> {
    const prompt = `Based on the following profile, suggest 8-10 highly relevant and in-demand skills (technical, tools, and soft skills).
Ensure the suggestions do NOT include these existing skills: ${existingSkills || 'None'}.

Target Role / Job Title: ${jobTitle}
Experience Context: ${experienceContext || 'None'}
Education Context: ${educationContext || 'None'}

Return ONLY a valid JSON array of strings. Example: ["React", "TypeScript", "Agile"]. Do NOT wrap in markdown \`\`\`json block.`;

    const response = await callAI({
        systemPrompt: "You are an expert career coach. You only output valid JSON arrays.",
        userPrompt: prompt,
        temperature: 0.6
    });

    try {
        let cleanJson = response.trim();
        if (cleanJson.startsWith("```json")) {
            cleanJson = cleanJson.substring(7, cleanJson.length - 3).trim();
        } else if (cleanJson.startsWith("```")) {
            cleanJson = cleanJson.substring(3, cleanJson.length - 3).trim();
        }
        return JSON.parse(cleanJson);
    } catch {
        // Fallback string parsing
        return response
            .split(/[\n,]/)
            .map(s => s.replace(/^[-\*\•\d\.\s"\[\]]+/, '').replace(/["\]]+$/, '').trim())
            .filter(Boolean);
    }
}
