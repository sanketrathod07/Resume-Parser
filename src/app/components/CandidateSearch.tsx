"use client";

import { useState } from "react";

export default function CandidateSearch() {
    const [jobDescription, setJobDescription] = useState("");
    const [candidates, setCandidates] = useState<{
        metadata: any; name: string; score: number
    }[]>([]);

    const searchCandidates = async () => {

        console.log("jobDescription : ", jobDescription)
        try {
            const response = await fetch("/api/search-candidates", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ jobDescription }),
            });

            const data = await response.json();
            console.log("API Response:", data);

            setCandidates(data.candidates || []); // Ensure it's an array
        } catch (error) {
            console.error("Error fetching candidates:", error);
            setCandidates([]); // Avoid undefined
        }
    };

    if (!candidates) return <p>Loading...</p>;


    return (
        <div className="p-4 border rounded-lg shadow-md bg-white">
            <h2 className="text-lg font-semibold mb-2">Find Best Candidates</h2>
            <textarea
                className="w-full p-2 border rounded"
                rows={4}
                placeholder="Enter job description..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
            />
            <button
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                onClick={searchCandidates}
            >
                Search Candidates
            </button>

            {candidates?.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-md font-bold">Top Matches:</h3>
                    <ul className="list-disc pl-4">
                        {candidates.map((candidate, index) => (
                            <li key={index} className="mt-2 p-2 border rounded">
                                <p><strong>Name:</strong> {candidate.metadata.name}</p>
                                <p><strong>Score:</strong> {candidate.score.toFixed(2)}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
