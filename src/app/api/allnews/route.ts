import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { NewsResponse } from "@/lib/types/news";

export async function GET(request: NextRequest) {
	try {
		console.log("all news api is running");
		const { searchParams } = new URL(request.url);
		const query = searchParams.get("q") || "technology";
		const page = parseInt(searchParams.get("page") || "1");
		const pageSize = parseInt(searchParams.get("pageSize") || "30");
		const sortBy = searchParams.get("sortBy") || "publishedAt";
		const language = searchParams.get("language") || "en";

		const cacheKey = `everything-${query}-${page}-${pageSize}-${sortBy}-${language}`;
		const cachedNews = await prisma.newsCache.findUnique({
			where: { key: cacheKey },
		});

		if (
			cachedNews &&
			Date.now() - cachedNews.createdAt.getTime() < 15 * 60 * 1000
		) {
			return NextResponse.json(
				JSON.parse(cachedNews.data as string) as NewsResponse
			);
		}

		const baseUrl = process.env.NEWS_BASE_URL;
		const apiUrl = new URL("https://newsapi.org/v2/everything");
		apiUrl.searchParams.append("apiKey", process.env.NEWS_API_KEY!);
		apiUrl.searchParams.append("q", query);
		apiUrl.searchParams.append("page", page.toString());
		apiUrl.searchParams.append("pageSize", pageSize.toString());
		apiUrl.searchParams.append("sortBy", sortBy);
		apiUrl.searchParams.append("language", language);

		const response = await fetch(apiUrl);
		console.log("news response: ", response);
		if (!response.ok) throw new Error(`NewsAPI error: ${response.statusText}`);

		const newsData: NewsResponse = await response.json();

		const filteredData: NewsResponse = {
			...newsData,
			articles: newsData.articles.filter(
				(article) =>
					article.description?.trim() !== "" && article.description !== "null"
			),
			totalResults: newsData.articles.length,
		};

		await prisma.newsCache.upsert({
			where: { key: cacheKey },
			create: {
				key: cacheKey,
				data: JSON.stringify(filteredData),
				createdAt: new Date(),
			},
			update: {
				data: JSON.stringify(filteredData),
				createdAt: new Date(),
			},
		});

		return NextResponse.json(filteredData);
	} catch (error) {
		console.error("News API error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch news" },
			{ status: 500 }
		);
	}
}
