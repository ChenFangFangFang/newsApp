"use client";
import React, { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import NewsArticle from "@/components/NewsArticle";
const MAX_WIDTH = "max-w-5xl";
interface Article {
	title: string;
	description: string;
	url: string;
	urlToImage?: string;
	publishedAt: string;
	source: { name: string };
}

const NewsDisplay = () => {
	const [news, setNews] = useState<{ articles: Article[] } | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchNews = async () => {
			try {
				// const res = await fetch("/api/news?category=business");
				const res = await fetch("/api/allnews");

				if (!res.ok) throw new Error("Network error");
				const data = await res.json();
				setNews(data);
			} catch {
				setError("Error fetching news");
			} finally {
				setLoading(false);
			}
		};

		fetchNews();
	}, []);

	return (
		<div className="min-h-screen bg-gray-50">
			<NavBar />

			<div className={`${MAX_WIDTH} mx-auto px-4 py-6`}>
				{loading && <p className="text-center py-8">Loading news...</p>}
				{error && <p className="text-center text-red-500 py-8">{error}</p>}
				{news?.articles?.map((article, index) => (
					<NewsArticle key={index} article={article} />
				))}
			</div>
		</div>
	);
};

export default NewsDisplay;
