"use client";

import type { ArticleWithSlug } from "@/utils/marketing/articles";
import { formatDate } from "@/utils/marketing/formatDate";
import { AuthorAbout } from "@/components/blog/AuthorAbout";
import { authors } from "@repo/config/authors";

export function ArticleLayout({
	article,
	children,
}: Readonly<{
	article: ArticleWithSlug;
	children: React.ReactNode;
}>) {
	return (
		<main className="mx-auto w-full max-w-4xl px-4 lg:px-8 py-16 lg:py-32">
			<article>
				<header className="flex flex-col mt-8 lg:mt-0">
					<h1 className="mt-6 text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
						{article.title}
					</h1>
					<time
						dateTime={article.date}
						className="order-first flex items-center text-base/6 sm:text-sm/6 text-zinc-500 dark:text-zinc-400"
					>
						<span className="h-4 w-0.5 rounded-full bg-zinc-500 dark:bg-zinc-400" />
						<span className="ml-3">{formatDate(article.date)}</span>
					</time>
					<AuthorAbout
						className="mt-8"
						author={authors.find((author) => author.id === article.author)}
					/>
				</header>
				<div className="mt-8 prose dark:prose-invert" data-mdx-content>
					{children}
				</div>
			</article>
		</main>
	);
}
