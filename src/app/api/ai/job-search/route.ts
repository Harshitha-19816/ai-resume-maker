import { NextResponse } from "next/server";
import FirecrawlApp from '@mendable/firecrawl-js';

export async function POST(req: Request) {
    try {
        const { role, location } = await req.json();

        if (!role) {
            return NextResponse.json({ error: "Job role is required" }, { status: 400 });
        }

        const apiKey = process.env.FIRECRAWL_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "Firecrawl API key is missing" }, { status: 500 });
        }

        const app = new FirecrawlApp({ apiKey });

        const query = `${role} jobs in ${location || 'remote'}`;
        
        // Search using Firecrawl
        const searchResult = await app.search(query, {
            limit: 5,
            scrapeOptions: {
                formats: ['markdown' as any],
            }
        }) as any;

        if (!searchResult.success) {
            throw new Error(searchResult.error || "Firecrawl search failed");
        }

        const jobs = (searchResult.data || []).map((item: any) => ({
            title: item.title || role,
            company: item.metadata?.ogSiteName || item.metadata?.source || "Company",
            location: location || "Remote",
            link: item.url,
            description: item.description || ""
        }));

        return NextResponse.json({ results: jobs });

    } catch (error: any) {
        console.error("Job Search API Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
