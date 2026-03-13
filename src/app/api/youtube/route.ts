import { NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";

export async function POST(req: Request) {
    try {
        const { url } = await req.json();

        if (!url) {
            return NextResponse.json({ error: "YouTube URL is required" }, { status: 400 });
        }

        // 1. Fetch transcript
        let transcriptResponse;
        try {
            transcriptResponse = await YoutubeTranscript.fetchTranscript(url);
        } catch (error: any) {
            return NextResponse.json({ error: "Failed to fetch transcript. The video might not have closed captions enabled." }, { status: 400 });
        }

        const textTranscript = transcriptResponse.map(t => t.text).join(' ');

        // 2. Call LLM for Summarization
        // Using Groq or OpenRouter if available
        const GROQ_API_KEY = process.env.GROQ_API_KEY;
        const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

        if (!GROQ_API_KEY && !OPENROUTER_API_KEY) {
            return NextResponse.json({ error: "No LLM API keys configured. Please add GROQ_API_KEY or OPENROUTER_API_KEY." }, { status: 500 });
        }

        const systemPrompt = `You are an expert content summarizer. Summarize the provided YouTube video transcript. Format your response exactly as follows, using Markdown:
        
### Key Points
- Point 1
- Point 2

### Bullet Summary
- Detail 1
- Detail 2

### Short Explanation
A brief 2-3 sentence explanation of the entire video.`;

        let summaryText = "";

        if (GROQ_API_KEY) {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: `Transcript:\n\n${textTranscript.slice(0, 15000)}` } // slice to avoid huge inputs
                    ],
                    temperature: 0.5
                })
            });

            if (!response.ok) {
                const errorData = await response.text();
                return NextResponse.json({ error: "LLM API failed", details: errorData }, { status: 500 });
            }

            const data = await response.json();
            summaryText = data.choices[0].message.content;

        } else if (OPENROUTER_API_KEY) {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost:3000",
                    "X-Title": "AI Resume Maker"
                },
                body: JSON.stringify({
                    model: "meta-llama/llama-3.1-8b-instruct:free",
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: `Transcript:\n\n${textTranscript.slice(0, 15000)}` }
                    ],
                    temperature: 0.5
                })
            });

            if (!response.ok) {
                const errorData = await response.text();
                return NextResponse.json({ error: "LLM API failed", details: errorData }, { status: 500 });
            }

            const data = await response.json();
            summaryText = data.choices[0].message.content;
        }

        return NextResponse.json({ summary: summaryText });

    } catch (error: any) {
        console.error("YouTube Summarizer API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
