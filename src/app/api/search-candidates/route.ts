import { NextRequest, NextResponse } from "next/server";
import { index } from "../../lib/pinecone";
import { getEmbedding } from "../../lib/embedding";
import { QueryResponse, RecordMetadata } from "@pinecone-database/pinecone";

interface Candidate {
    name: string;
    score: number;
}

// API handler for POST requests
export async function POST(req: NextRequest) {

    try {
        const { jobDescription } = await req.json();
        console.log("Job description:", jobDescription);
        console.log("Pinecone index:", index);

        if (!jobDescription) {
            return NextResponse.json({ error: "Job description is required" }, { status: 400 });
        }

        const jobEmbedding = await getEmbedding(jobDescription);
        console.log("Generated job embedding:", jobEmbedding);


        const results: QueryResponse<RecordMetadata> = await index.query({
            vector: jobEmbedding,
            topK: 5,
            includeMetadata: true,
        });

        const candidates: Candidate[] = results.matches.map((match) => ({
            name: (match.metadata?.name as string) || "Unknown",
            score: match.score ?? 0,
        }));

        return NextResponse.json({ candidates }, { status: 200 });

    } catch (error) {
        console.error("Error searching candidates:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
