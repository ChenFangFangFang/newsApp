// src/lib/openai.ts
import OpenAI from "openai";
import { rateLimit } from "@/lib/rate-limit";

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export async function generateSummary(
	articleText: string,
	customPrompt: string,
	userId: string
) {
	// Check rate limit (10 requests per hour per user)
	const identifier = `summary_${userId}`;
	const { success } = await rateLimit.check(identifier, 10, "1 h");

	if (!success) {
		throw new Error("Rate limit exceeded. Please try again later.");
	}
	const truncatedArticle = articleText.slice(0, 2000);

	const response = await openai.chat.completions.create({
		model: "gpt-4o-mini",
		messages: [
			{
				role: "system",
				content:
					"You are an intelligent business assistant that can create concise, accurate summaries of news articles and give investment advice. Do not exceed 200 words unless otherwise specified.",
			},
			{
				role: "user",
				content: `${truncatedArticle}\n\nRequest: ${customPrompt}\n\nProvide a brief analysis with main points and market impact.`,
			},
		],
		max_tokens: 300,
		temperature: 0.5, // Lower temperature for more focused responses
		presence_penalty: -0.5, // Encourage focused, concise responses
		frequency_penalty: 0.3, // Discourage repetition
	});

	return response.choices[0]?.message?.content ?? "";
}
