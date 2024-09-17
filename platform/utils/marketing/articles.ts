import glob from "fast-glob";

interface Article {
	title: string;
	description: string;
	author: string;
	date: string;
	image?: string;
}

export interface ArticleWithSlug extends Article {
	slug: string;
}

async function importArticle(
	articleFilename: string,
): Promise<ArticleWithSlug> {
	const { article } = (await import(
		`../../app/(blog)/blog/${articleFilename}`
	)) as {
		default: React.ComponentType;
		article: Article;
	};

	return {
		slug: articleFilename.replace(/(\/page)?\.mdx$/, ""),
		...article,
	};
}

export async function getAllArticles() {
	const articleFilenames = await glob("*/page.mdx", {
		cwd: "./app/(blog)/blog",
	});

	const articles = await Promise.all(articleFilenames.map(importArticle));

	return articles.sort(
		(a, z) => Number(new Date(z.date)) - Number(new Date(a.date)),
	);
}
