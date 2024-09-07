// SEO
import { GenerateSEO } from "@/components/marketing/GenerateSEO";

// Utils
import {
	type ArticleWithSlug,
	getAllArticles,
} from "@/utils/marketing/articles";
import { formatDate } from "@/utils/marketing/formatDate";

// UI
import { Subheading } from "@repo/ui/heading";
import { Link } from "@repo/ui/link";
import { Text } from "@repo/ui/text";
import Image from "next/image";

export const metadata = GenerateSEO({
	title: "Our Blog",
	description: "Everything content moderation, all in one place.",
	url: "https://kayle.ai/blog",
});

function Article({ article }: { article: ArticleWithSlug }) {
	console.log(article.image);

	return (
		<Link href={`/blog/${article.slug}`} className="group w-full">
			<article className="flex flex-1 flex-col gap-2 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800 rounded-lg p-4 transition-colors duration-300 w-full h-full">
				{article.image ? (
					<Image
						src={article.image}
						alt={article.title}
						width={1920}
						height={1080}
						className="rounded-md w-full h-auto ring-1 ring-zinc-100 dark:ring-zinc-700"
					/>
				) : null // TODO: It would be nice to have a default image here
				}
				<div className="flex flex-row gap-x-2 mt-auto">
					<Subheading level={3}>{article.title}</Subheading>
					<Text>•</Text>
					<Text>
						<time dateTime={article.date}>{formatDate(article.date)}</time>
					</Text>
				</div>
				<Text className="line-clamp-2">{article.description}</Text>
			</article>
		</Link>
	);
}

export default async function Blog() {
	const articles = await getAllArticles();

	return (
		<main>
			<div className="relative isolate overflow-hidden bg-gradient-to-b from-emerald-100/20 dark:from-emerald-900/20">
				<div className="mx-auto max-w-7xl pb-24 pt-10 sm:pb-32 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-40">
					<div className="px-6 lg:px-0 lg:pt-4">
						<div className="mx-auto max-w-2xl">
							<div className="max-w-lg">
								<h1 className="mt-10 text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-5xl">
									Our Blog
								</h1>
								<Text className="mt-6">
									Kayle is a content moderation platform that helps you moderate
									content easier than ever before.
								</Text>
							</div>
						</div>
					</div>
					<div className="mt-20 sm:mt-24 md:mx-auto md:max-w-2xl lg:mx-0 lg:mt-0 lg:w-screen">
						<div
							className="absolute inset-y-0 right-1/2 -z-10 -mr-10 w-[200%] skew-x-[-30deg] bg-white lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950 shadow-xl shadow-emerald-600/10 ring-1 ring-emerald-500 md:-mr-20 lg:-mr-36"
							aria-hidden="true"
						/>
						<div className="shadow-lg md:rounded-3xl">
							<div className="bg-emerald-500 [clip-path:inset(0)] md:[clip-path:inset(0_round_theme(borderRadius.3xl))]">
								<div
									className="absolute -inset-y-px left-1/2 -z-10 ml-10 w-[200%] skew-x-[-30deg] bg-emerald-100 opacity-20 ring-1 ring-inset ring-white md:ml-20 lg:ml-36"
									aria-hidden="true"
								/>
							</div>
						</div>
					</div>
				</div>
				<div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-white lg:from-zinc-100 dark:from-zinc-900 dark:lg:from-zinc-950 sm:h-32" />
			</div>
			<div className="mx-auto max-w-7xl">
				<div className="md:border-l md:border-zinc-100 px-2 md:px-6 md:dark:border-zinc-700/40">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
						{articles.map((article) => (
							<Article key={article.slug} article={article} />
						))}
					</div>
				</div>
			</div>
		</main>
	);
}
