import { NextRequest, NextResponse } from "next/server";
import { generateSummary } from "@/lib/openai";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { extractArticleContent } from "@/lib/extractArticle";

export async function POST(request: NextRequest) {
	try {
		const token = request.cookies.get("token")?.value;
		if (!token) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		const payload = await verifyToken(token);
		if (!payload || !payload.id) {
			return NextResponse.json({ error: "Invalid token" }, { status: 401 });
		}
		const {
			articleUrl,
			customPrompt,
		}: { articleUrl: string; customPrompt: string } = await request.json();
		if (!articleUrl) {
			return NextResponse.json(
				{ error: "Artical URL is required" },
				{ status: 400 }
			);
		}
		if (!customPrompt) {
			return NextResponse.json(
				{ error: "Custom prompt is required" },
				{ status: 400 }
			);
		}
		const articleText = await extractArticleContent(articleUrl);

		if (!articleText) {
			return NextResponse.json({ error: "Failed to fetch article content" });
		}
		console.log("articleText: ", articleText);
		const summary =
			(await generateSummary(articleText, customPrompt, payload.id)) ?? "";

		const savedSummary = await prisma.articleSummary.create({
			data: {
				userId: payload.id,
				articleUrl,
				summary,
			},
		});
		return NextResponse.json({ summary: savedSummary });
	} catch (error: unknown) {
		if (
			error instanceof Error &&
			error.message.includes("Rate limit exceeded")
		) {
			return NextResponse.json({ error: error.message }, { status: 429 });
		}
		console.error("Summary error:", error);
		return NextResponse.json(
			{ error: "Failed to generate summary" },
			{ status: 500 }
		);
	}
}
