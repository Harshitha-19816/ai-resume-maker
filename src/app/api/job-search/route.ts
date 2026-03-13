import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { role, location } = await req.json();

        if (!role) {
            return NextResponse.json({ error: "Job role is required" }, { status: 400 });
        }

        const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;
        if (!FIRECRAWL_API_KEY) {
            return NextResponse.json({ error: "Firecrawl API key is missing. Please add FIRECRAWL_API_KEY to your env variables." }, { status: 500 });
        }

        const searchQuery = `${role} jobs ${location ? `in ${location}` : ''} site:lever.co OR site:greenhouse.io OR site:workday.com`;

        const firecrawlRes = await fetch("https://api.firecrawl.dev/v1/search", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${FIRECRAWL_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query: searchQuery,
                pageOptions: {
                    fetchPageContent: true
                }
            })
        });

        if (!firecrawlRes.ok) {
            const errorData = await firecrawlRes.text();

            // Fallback for Firecrawl if Search is not supported or needs a different endpoint format
            // Try to extract just based on a manual search link
            return NextResponse.json({ error: "Firecrawl API failed", details: errorData }, { status: 500 });
        }

        const firecrawlData = await firecrawlRes.json();
        const documents = firecrawlData.data || [];
        const combinedContent = documents
            .slice(0, 3)
            .map((doc: any) => `URL: ${doc.url}\nTitle: ${doc.title}\nContent: ${doc.markdown}`)
            .join("\n\n---\n\n");

        if (!combinedContent) {
            return NextResponse.json({ jobs: [] });
        }

        const GROQ_API_KEY = process.env.GROQ_API_KEY;
        const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

        if (!GROQ_API_KEY && !OPENROUTER_API_KEY) {
            return NextResponse.json({ error: "No LLM API keys configured." }, { status: 500 });
        }

        const systemPrompt = `You are a helpful AI assistant that extracts job listings from raw web search markdown data.
Please extract a list of jobs with the following information for each:
- Company
- Job Title
- Location
- Apply Link (or URL where the job was found)
- Short description (1 sentence)

Format your output strictly as a JSON array of objects. Example:
[
  {
    "company": "Google",
    "title": "Software Engineer",
    "location": "Remote",
    "link": "https://careers.google.com/...",
    "description": "Develop and maintain core search infrastructure."
  }
]
Do not return any other text, just the raw JSON array. Make sure the JSON is valid. If no jobs are found, return an empty array [].`;

        let jobsList: any[] = [];

        const llmBody = {
            model: GROQ_API_KEY ? "llama-3.3-70b-versatile" : "meta-llama/llama-3.1-8b-instruct:free",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Raw Data:\n\n${combinedContent.slice(0, 15000)}` }
            ],
            temperature: 0.1
        };

        const llmHeaders: any = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${GROQ_API_KEY || OPENROUTER_API_KEY}`
        };

        if (OPENROUTER_API_KEY && !GROQ_API_KEY) {
            llmHeaders["HTTP-Referer"] = "http://localhost:3000";
            llmHeaders["X-Title"] = "AI Resume Maker";
        }

        const llmUrl = GROQ_API_KEY
            ? "https://api.groq.com/openai/v1/chat/completions"
            : "https://openrouter.ai/api/v1/chat/completions";

        const response = await fetch(llmUrl, {
            method: "POST",
            headers: llmHeaders,
            body: JSON.stringify(llmBody)
        });

        if (!response.ok) {
            const errBody = await response.text();
            return NextResponse.json({ error: "LLM API failed", details: errBody }, { status: 500 });
        }

        const data = await response.json();

        try {
            const rawContent = data.choices[0].message.content;
            const jsonStr = rawContent.substring(
                rawContent.indexOf('['),
                rawContent.lastIndexOf(']') + 1
            );
            jobsList = JSON.parse(jsonStr);
        } catch (e) {
            console.error("Failed to parse JSON from LLM: ", data.choices[0].message.content);
            jobsList = [];
        }

        return NextResponse.json({ jobs: jobsList });

    } catch (error: any) {
        console.error("Job Search API Error:", error);
        return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
    }
}
