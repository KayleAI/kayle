"use client";

import { Container } from "@/components/marketing/Container";
import type { BlogWithSlug } from "@/utils/marketing/blogs";
import { formatDate } from "@/utils/marketing/formatDate";

export function BlogLayout({
	blog,
	children,
}: {
	readonly blog: BlogWithSlug;
	readonly children: React.ReactNode;
}) {
	return (
		<Container className="mt-16 lg:mt-32">
			<div className="xl:relative">
				<div className="mx-auto max-w-2xl">
					<article>
						<header className="flex flex-col">
							<h1 className="mt-6 text-4xl font-bold tracking-tight text-neutral-800 sm:text-5xl dark:text-neutral-100">
								{blog.title}
							</h1>
							<time
								dateTime={blog.date}
								className="order-first flex items-center text-base text-neutral-400 dark:text-neutral-500"
							>
								<span className="h-4 w-0.5 rounded-full bg-neutral-200 dark:bg-neutral-500" />
								<span className="ml-3">{formatDate(blog.date)}</span>
							</time>
						</header>
						<main className="prose dark:prose-invert mt-8" data-mdx-content>
							{children}
						</main>
					</article>
				</div>
			</div>
		</Container>
	);
}
