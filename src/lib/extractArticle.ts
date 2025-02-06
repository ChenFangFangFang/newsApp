import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

/**
 * Extracts and returns the readable text content from a given article URL.
 * @param {string} articleUrl - The URL of the article to fetch.
 * @returns {Promise<string>} - The extracted article content.
 * @throws {Error} - Throws an error if fetching or parsing fails.
 */
export async function extractArticleContent(
	articleUrl: string
): Promise<string> {
	if (!articleUrl) {
		throw new Error("Article URL is required");
	}

	const response = await fetch(articleUrl);
	if (!response.ok) {
		throw new Error(`Failed to fetch: ${response.statusText}`);
	}

	const html = await response.text();
	const dom = new JSDOM(html, { url: articleUrl });
	const reader = new Readability(dom.window.document);
	const article = reader.parse();

	if (!article?.textContent) {
		throw new Error("Failed to extract article content");
	}

	return article.textContent.trim();
}
