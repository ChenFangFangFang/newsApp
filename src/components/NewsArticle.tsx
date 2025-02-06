"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";
import defaultImage from "@/default-news-picture.jpg";
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
			<CardContent className="p-4 sm:p-6">
				{/* News Content Section */}
				<div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-4">
					{/* Image - Hidden on small screens */}
					<div className="sm:w-1/3 max-w-xs sm:block hidden">
						<img
							src={article.urlToImage || defaultImage.src}
							alt={article.title}
							className="w-full h-48 object-cover rounded-md"
						/>
					</div>

					{/* Text Content */}
					<div className="w-full sm:w-2/3 flex flex-col justify-between">
						<div>
							<h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 leading-tight">
								{article.title}
							</h2>

							{/* Source styled as a tag */}
							<p className="mb-2">
								<span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-md text-sm">
									Source: {article.source.name}
								</span>
							</p>

							<p className="text-xs sm:text-sm text-gray-500 mb-2">
								{formatDate(article.publishedAt)}
							</p>

							{/* Shorter description for mobile */}
							<p className="text-gray-600 mb-4 leading-relaxed">
								{window.innerWidth < 640
									? article.description?.slice(0, 80) + "..."
									: article.description || "No description available."}
							</p>
						</div>

						<Button
							variant="outline"
							className="w-full sm:w-32 text-sm py-2"
							onClick={() => window.open(article.url, "_blank")}
						>
							Read More
						</Button>
					</div>
				</div>

				{/* AI Generation Section */}
				<div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
					<div className="flex flex-col gap-3">
						<Input
							type="text"
							placeholder="Enter a prompt..."
							value={customPrompt}
							onChange={(e) => setCustomPrompt(e.target.value)}
							className="w-full px-3 py-2 text-sm"
						/>
						<Button
							onClick={handleGenerateSummary}
							disabled={loading}
							className="w-full sm:w-40 text-sm py-2"
						>
							{loading ? "Generating..." : "Ask AI"}
						</Button>
					</div>

					{summary && (
						<>
							<div className="p-3 mt-4 bg-white rounded border border-gray-200 text-sm leading-relaxed">
								<ReactMarkdown>{summary}</ReactMarkdown>
							</div>
							<div className="flex justify-end mt-2">
								<button
									onClick={() => {
										navigator.clipboard.writeText(summary);
									}}
									className="text-xs px-2 py-1 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 active:bg-gray-300 transition"
								>
									Copy
								</button>
							</div>
						</>
					)}
				</div>
			</CardContent>
		</Card>
	);
};

export default NewsArticle;
