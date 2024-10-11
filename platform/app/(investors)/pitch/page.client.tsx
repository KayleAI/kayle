"use client";

// Hooks
import { parseAsString, useQueryState } from "nuqs";
import { useHotkeys, useClipboard } from "@mantine/hooks";

// SWR
import useSWR from "swr";
import fetcher from "@/utils/fetcher";

// UI
import clsx from "clsx";
import { Heading, Subheading } from "@repo/ui/heading";
import { Text, TextLink } from "@repo/ui/text";
import { Button } from "@repo/ui/button";

// Icons
import { LoaderIcon, CheckIcon, CopyIcon } from "@repo/icons/ui/index";

// React
import { useEffect, useCallback, useRef } from "react";

// Components
import { AnimatedNumber } from "@/components/marketing/animated-number";

// Toaster
import { toast } from "sonner";

export const slides = [
	{
		id: 1,
		slug: "introduction",
		title: "Introduction",
		slide: IntroductionSlide,
	},
	{
		id: 2,
		slug: "live",
		title: "Live Stats",
		slide: LiveStatsSlide,
	},
];

export default function PitchSlides() {
	const [slide, setSlide] = useQueryState(
		"slide",
		parseAsString.withDefault("introduction"),
	);

	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!slides.find((s) => s.slug === slide)) {
			setSlide("introduction");
		}
	}, [slide, setSlide]);

	useEffect(() => {
		const currentSlideIndex = slides.findIndex((s) => s.slug === slide);
		if (currentSlideIndex !== -1 && containerRef.current) {
			containerRef.current.scrollTo({
				left: containerRef.current.clientWidth * currentSlideIndex,
				behavior: "smooth",
			});
		}
	}, [slide]);

	return (
		<main>
			<div
				className="flex flex-row overflow-x-hidden snap-x snap-mandatory"
				ref={containerRef}
			>
				{slides.map((s) => (
					<SlidePage key={s.id} active={slide === s.slug}>
						<SlideHeader title={s.title} />
						<div className="py-6">
							<s.slide />
						</div>
					</SlidePage>
				))}
			</div>
			<SlideMenu />
		</main>
	);
}

export function SlideHeader({ title }: Readonly<{ title: string }>) {
	return (
		<header className="flex flex-row justify-between items-center pointer-events-auto">
			<Subheading>{title}</Subheading>
			<div className="flex flex-row gap-4">
				<Text>
					<TextLink href="https://go.kayle.ai/investors-meeting">
						book a call
					</TextLink>
				</Text>
				<Text>
					<TextLink href="/">kayle.ai</TextLink>
				</Text>
			</div>
		</header>
	);
}

export function SlidePage({
	children,
	active,
}: Readonly<{ children: React.ReactNode; active: boolean }>) {
	return (
		<div
			className={clsx(
				"min-h-screen w-screen flex-shrink-0 snap-start pointer-events-none",
				active && "",
			)}
		>
			<div className="m-6">{children}</div>
		</div>
	);
}

export function SlideMenu() {
	const clipboard = useClipboard({ timeout: 500 });
	const [slide, setSlide] = useQueryState(
		"slide",
		parseAsString.withDefault("introduction"),
	);

	const currentSlide = slides.find((s) => s.slug === slide);

	const previousSlide = useCallback(() => {
		if (currentSlide && currentSlide.id > 1) {
			setSlide(slides?.[currentSlide?.id - 2]?.slug ?? "introduction");
		}
	}, [currentSlide, setSlide]);

	const nextSlide = useCallback(() => {
		if (currentSlide && currentSlide.id < slides.length) {
			setSlide(slides?.[currentSlide?.id]?.slug ?? "introduction");
		}
	}, [currentSlide, setSlide]);

	useHotkeys([
		["ArrowLeft", previousSlide],
		["ArrowRight", nextSlide],
	]);

	const copyLinkToPitchDeck = useCallback(() => {
		clipboard.copy("https://kayle.ai/pitch");
		toast.success("Copied link to pitch deck");
	}, [clipboard]);

	return (
		<div className="absolute bottom-0 left-0 right-0 w-full pointer-events-none flex justify-center items-center h-36">
			<div className="flex justify-between items-center pointer-events-auto bg-white/50 dark:bg-zinc-950/80 dark:lg:bg-zinc-900/50 rounded-2xl p-4 shadow-lg min-w-96 w-fit backdrop-blur-sm gap-4">
				<Button
					outline
					disabled={currentSlide?.id === 1}
					onClick={previousSlide}
				>
					&larr; Previous Slide
				</Button>
				<Button plain onClick={copyLinkToPitchDeck}>
					<CopyIcon className="size-4" />
					Share Pitch Deck
				</Button>
				<Button
					outline
					disabled={currentSlide?.id === slides.length}
					onClick={nextSlide}
				>
					Next Slide &rarr;
				</Button>
			</div>
		</div>
	);
}

export function SlideNotFound() {
	return (
		<section id="slide-not-found">
			<Heading>Hmm... This slide doesn’t exist.</Heading>
			<Text>Are you sure you have the right URL?</Text>
		</section>
	);
}

export function IntroductionSlide() {
	return (
		<section id="introduction">
			<Heading>Kayle’s Pitch Deck</Heading>
			<Text>
				Our competitors are large, complex, and expensive. We are a simple,
				affordable, and scalable alternative.
			</Text>
		</section>
	);
}

export function LiveStatsSlide() {
	const { data, isValidating } = useSWR("/api/pitch", {
		fetcher,
		refreshInterval: 30000,
	});

	return (
		<section id="live">
			<div className="flex flex-col">
				<Heading>Kayle Stats in Real-Time</Heading>
				<Text>Here are some of the cool stuff we’ve achieved.</Text>
			</div>
			<div className="grid grid-cols-3 gap-4 mt-4">
				<div className="col-span-2 row-span-2 grid grid-cols-2 gap-4">
					<StatsCard
						id="waitlist"
						stat={data?.waitlistSignups ?? 0}
						isLoading={isValidating}
					/>
					<StatsCard
						id="github"
						stat={data?.githubStars ?? 0}
						isLoading={isValidating}
					/>
					<StatsCard
						id="customers"
						stat={data?.customers ?? 0}
						isLoading={isValidating}
					/>
					<StatsCard
						id="moderations"
						stat={data?.moderations ?? 0}
						isLoading={isValidating}
					/>
				</div>
				<div className="col-span-1 row-span-2 border border-zinc-200 dark:border-zinc-800 rounded-md p-4">
					<Subheading>Kayle in Beta</Subheading>
					<Text>
						Kayle is currently in beta and we’re working on getting more
						customers.
					</Text>
				</div>
			</div>
		</section>
	);
}

const stats = {
	waitlist: {
		title: "Waitlisted users",
		description: "We’re building a waitlist of people who want to use Kayle.",
	},
	github: {
		title: "GitHub stars",
		description: "Our goal is to create a great community around Kayle.",
	},
	customers: {
		title: "Customers",
		description: "This is the number of customers who are using Kayle.",
	},
	moderations: {
		title: "Moderations",
		description:
			"This is how many times Kayle has been used for moderations.",
	},
};

function StatsCard({
	id,
	stat,
	isLoading,
}: Readonly<{ id: string; stat: number; isLoading: boolean }>) {
	let formattedStat = stat;
	let suffix = "";
	const { title, description } = stats[id as keyof typeof stats];

	if (stat) {
		if (stat >= 1000000000) {
			suffix = "B";
			formattedStat = Math.floor(stat / 1000000000);
		} else if (stat >= 1000000) {
			suffix = "M";
			formattedStat = Math.floor(stat / 1000000);
		} else if (stat >= 1000) {
			suffix = "K";
			formattedStat = Math.floor(stat / 1000);
		}
	}

	return (
		<div className="relative flex flex-col gap-1 p-4 border border-zinc-200 dark:border-zinc-800 rounded-md w-full h-80 items-center">
			<Subheading>{title}</Subheading>
			<Text className="text-center">{description}</Text>
			<div className="text-7xl md:text-8xl lg:text-9xl font-bold flex-1 flex items-center">
				{!stat && isLoading ? (
					<div className="w-16 h-20 bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-md" />
				) : (
					<AnimatedNumber start={0} end={formattedStat} />
				)}
				{suffix}
			</div>
			<div className="absolute bottom-0 flex flex-col items-center p-4">
				{isLoading ? (
					<LoaderIcon className="size-4 animate-spin-reverse text-zinc-400 dark:text-zinc-600" />
				) : (
					<CheckIcon className="size-4 text-zinc-400 dark:text-zinc-600" />
				)}
			</div>
		</div>
	);
}
