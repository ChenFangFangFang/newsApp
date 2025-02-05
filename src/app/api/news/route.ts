import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { NewsResponse } from "@/lib/types/news";

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const country = searchParams.get("country") || "us";
		const page = parseInt(searchParams.get("page") || "2");
		const pageSize = parseInt(searchParams.get("pageSize") || "30");

		const category = "business";
		// Generate cache key
		const cacheKey = `news-${country}-${category}-${page}-${pageSize}`;
		const cachedNews = await prisma.newsCache.findUnique({
			where: { key: cacheKey },
		});
		if (
			cachedNews &&
			Date.now() - cachedNews.createdAt.getTime() < 15 * 60 * 1000
		) {
			return NextResponse.json(cachedNews.data as unknown as NewsResponse);
		}
		// Fetch fresh data
		const baseUrl = process.env.NEWAS_BASE_URL;
		const apiUrl = new URL(`${baseUrl}/top-headlines`);
		apiUrl.searchParams.append("apiKey", process.env.NEWS_API_KEY!);
		apiUrl.searchParams.append("country", country);
		if (category) apiUrl.searchParams.append("category", category);
		apiUrl.searchParams.append("page", page.toString());
		apiUrl.searchParams.append("pageSize", pageSize.toString());

		const response = await fetch(apiUrl, { next: { revalidate: 900 } });
		if (!response.ok) throw new Error(`NewsAPI error: ${response.statusText}`);

		const newsData: NewsResponse = await response.json();

		// Update cache
		const filterdData: NewsResponse = {
			...newsData,
			articles: newsData.articles.filter(
				(articel) =>
					articel.description != null &&
					articel.description.trim() !== "" &&
					articel.description !== "null"
			),
			totalResults: newsData.articles.filter(
				(article) =>
					article.description != null &&
					article.description.trim() !== "" &&
					article.description !== "null"
			).length,
		};

		await prisma.newsCache.upsert({
			where: { key: cacheKey },
			create: {
				key: cacheKey,
				data: JSON.parse(JSON.stringify(filterdData)),
				createdAt: new Date(),
			},
			update: {
				data: JSON.parse(JSON.stringify(filterdData)),
				createdAt: new Date(),
			},
		});
		return NextResponse.json(filterdData);
	} catch (error) {
		console.error("News API error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch news" },
			{ status: 500 }
		);
	}
}
