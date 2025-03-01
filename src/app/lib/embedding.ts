import axios from "axios";

export async function getEmbedding(text: string): Promise<number[]> {
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
        throw new Error("Missing Google API key");
    }

    console.log("Using Google API Key:", apiKey);

    const url = `https://generativelanguage.googleapis.com/v1beta/models/textembedding-gecko:embedText?key=${apiKey}`;

    try {
        const response = await axios.post(
            url,
            { text },
            { headers: { "Content-Type": "application/json" } }
        );

        console.log("Embedding Response:", response.data);

        return response.data.embedding;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error("Axios Error fetching embedding:", error.response?.data || error.message);
        } else if (error instanceof Error) {
            console.error("General Error:", error.message);
        } else {
            console.error("Unexpected error:", error);
        }

        throw new Error("Failed to get embedding");
    }
}
