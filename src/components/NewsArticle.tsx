"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";

interface Article {
	title: string;
	description: string;
	url: string;
	urlToImage?: string;
	publishedAt: string;
	source: { name: string };
}

const NewsArticle = ({ article }: { article: Article }) => {
	const [customPrompt, setCustomPrompt] = useState("");
	const [summary, setSummary] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};
	const handleGenerateSummary = async () => {
		if (!customPrompt.trim()) {
			alert("Please enter a prompt.");
			return;
		}

		setLoading(true);
		setSummary(null);
		try {
			const token = localStorage.getItem("authToken");
			const res = await fetch("/api/summary", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Cookie: `token=${token}`,
				},
				credentials: "include",
				body: JSON.stringify({ articleUrl: article.url, customPrompt }),
			});

			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.error || "Failed to generate summary.");
			}
			const data = await res.json();
			setSummary(data.summary?.summary || "No summary available.");
		} catch (error) {
			setSummary(
				error instanceof Error ? error.message : "Failed to generate summary."
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Card className="mb-6 shadow-md">
			<CardContent className="p-6">
				{/* News Content Section */}
				<div className="flex gap-6 mb-6">
					<div className="w-1/3 max-w-xs">
						<img
							src={article.urlToImage || "/api/placeholder/400/300"}
							alt={article.title}
							className="w-full h-48 object-cover rounded-md"
						/>
					</div>
					<div className="w-2/3 flex flex-col justify-between">
						<div>
							<h2 className="text-xl font-semibold text-gray-800 mb-3">
								{article.title}
							</h2>
							<p className="text-l font-semibold text-gray-800 mb-3">
								Source: {article.source.name}
							</p>
							<p className="text-sm text-gray-500 mb-3">
								{formatDate(article.publishedAt)}
							</p>

							<p className="text-gray-600 mb-4">
								{article.description || "No description available."}
							</p>
						</div>
						<Button
							variant="outline"
							className="w-32"
							onClick={() => window.open(article.url, "_blank")}
						>
							Read More
						</Button>
					</div>
				</div>

				{/* AI Generation Section */}
				<div className="bg-gray-50 p-4 rounded-lg">
					<div className="flex gap-4 mb-4">
						<Input
							type="text"
							placeholder="Enter your prompt for AI analysis..."
							value={customPrompt}
							onChange={(e) => setCustomPrompt(e.target.value)}
							className="flex-1"
						/>
						<Button
							onClick={handleGenerateSummary}
							disabled={loading}
							className="w-40"
						>
							{loading ? "Generating..." : "Generate Analysis"}
						</Button>
					</div>

					{summary && (
						<div className="p-4 bg-white rounded border border-gray-200 prose prose-sm max-w-none">
							<ReactMarkdown>{summary}</ReactMarkdown>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
};

export default NewsArticle;
