"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ResumeDropzone } from "components/ResumeDropzone";
import Link from "next/link";
import { readPdf } from "lib/parse-resume-from-pdf/read-pdf";
import { TextItems } from "lib/parse-resume-from-pdf/types";

const defaultFileUrl = "resume-example/laverne-resume.pdf";

export default function ApplyPage() {
    const router = useRouter();
    const [fileUrl, setFileUrl] = useState(defaultFileUrl);
    const [textItems, setTextItems] = useState<TextItems>([]);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        linkedin: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Redirect to resume parser with file URL as query param
        router.push(`/resume-parser?fileUrl=${encodeURIComponent(fileUrl)}`);
    };

    useEffect(() => {
        async function test() {
            const textItems = await readPdf(fileUrl);
            setTextItems(textItems);
        }
        test();
    }, [fileUrl]);

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6">
            <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
                <h1 className="text-2xl font-bold text-gray-800">Candidate Application</h1>
                <form className="mt-4 flex flex-col gap-4" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="rounded-md border px-4 py-2"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="rounded-md border px-4 py-2"
                    />
                    <input
                        type="url"
                        name="linkedin"
                        placeholder="LinkedIn URL"
                        value={formData.linkedin}
                        onChange={handleInputChange}
                        required
                        className="rounded-md border px-4 py-2"
                    />
                    <ResumeDropzone
                        onFileUrlChange={(fileUrl) => setFileUrl(fileUrl || defaultFileUrl)}
                        playgroundView={true}
                    />
                    <button type="submit" className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white">
                        Submit & Proceed
                    </button>
                </form>
            </div>
        </main>
    );
}
