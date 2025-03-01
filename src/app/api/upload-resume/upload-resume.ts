import { index } from "../../lib/pinecone";
import { getEmbedding } from "../../lib/embedding";

export default async function handler(req: { method: string; body: { resumeId: any; resumeText: any; candidateName: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; end: { (): any; new(): any; }; json: { (arg0: { message: string; }): void; new(): any; }; }; }) {
    if (req.method !== "POST") return res.status(405).end();

    const { resumeId, resumeText, candidateName } = req.body;
    const embedding = await getEmbedding(resumeText);

    await index.upsert([
        {
            id: resumeId,
            values: embedding,
            metadata: { name: candidateName },
        },
    ]);

    res.status(200).json({ message: "Resume stored successfully" });
}
