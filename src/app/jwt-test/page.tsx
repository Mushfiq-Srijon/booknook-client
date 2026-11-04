
"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function JwtTestPage() {
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);

    async function testJwt() {
        setLoading(true);
        setResult("Requesting JWT...");

        try {
            const { data, error } = await authClient.token();

            if (error || !data?.token) {
                setResult(
                    `JWT generation failed: ${error?.message || "No token returned."}`
                );
                return;
            }

            setResult("JWT generated. Testing Express verification...");

            const response = await fetch("http://localhost:5000/api/auth/me", {
                headers: {
                    Authorization: `Bearer ${data.token}`,
                },
            });

            const responseData = await response.json();

            setResult(
                `HTTP Status: ${response.status}\n\n${JSON.stringify(
                    responseData,
                    null,
                    2
                )}`
            );
        } catch (error) {
            setResult(
                error instanceof Error ? error.message : "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="mx-auto max-w-2xl px-5 py-16">
            <h1 className="text-2xl font-bold text-[#243d32]">
                BookNook JWT Test
            </h1>

            <p className="mt-3 text-sm text-gray-600">
                Generate a Better Auth JWT and verify it through the Express backend.
            </p>

            <button
                onClick={testJwt}
                disabled={loading}
                className="primary-button mt-6 disabled:opacity-50"
            >
                {loading ? "Testing..." : "Test JWT Authentication"}
            </button>

            {result && (
                <pre className="mt-6 overflow-x-auto whitespace-pre-wrap rounded-lg bg-gray-100 p-4 text-sm text-gray-800">
                    {result}
                </pre>
            )}
        </main>
    );
}
