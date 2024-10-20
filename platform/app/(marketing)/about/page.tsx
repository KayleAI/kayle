// SEO
import { GenerateSEO } from "@/components/marketing/GenerateSEO";

// UI
import { Text } from "@repo/ui/text";

export const metadata = GenerateSEO({
	title: "About",
	description:
		"Kayle is a complete and open-source content moderation solution for platforms.",
	url: "https://kayle.ai/about",
});

export default function AboutPage() {
	return (
		<main>
			<div className="relative isolate overflow-hidden bg-gradient-to-b from-emerald-100/20 dark:from-emerald-900/20">
				<div className="mx-auto max-w-7xl pb-24 pt-10 sm:pb-32 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-40">
					<div className="px-6 lg:px-0 lg:pt-4">
						<div className="mx-auto max-w-2xl">
							<div className="max-w-lg">
								<h1 className="mt-10 text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-5xl">
									About Kayle
								</h1>
								<Text className="mt-6">
									Kayle is a complete and open-source content moderation
									solution built for businesses and platforms.
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
		</main>
	);
}
