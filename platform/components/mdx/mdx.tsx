"use client";

import { useEffect, useRef, useState } from "react";
import Image, { type ImageProps } from "next/image";
import Link from "next/link";
import clsx from "clsx";

import { Feedback } from "@/components/docs/Feedback";
import { Heading } from "@/components/docs/Heading";
import { Prose } from "@/components/docs/Prose";

export { Button } from "@/components/docs/Button";
export { CodeGroup, Code as code, Pre as pre } from "@/components/docs/Code";

import { FormattedDate } from "@/components/changelog/FormattedDate";

export const a = Link;

type ImagePropsWithOptionalAlt = Omit<ImageProps, "alt"> & { alt?: string };

export const img = function Img(props: ImagePropsWithOptionalAlt) {
	return (
		<div className="relative mt-8 overflow-hidden rounded-xl bg-zinc-50 dark:bg-zinc-900 [&+*]:mt-8">
			<Image
				alt=""
				sizes="(min-width: 1280px) 36rem, (min-width: 1024px) 45vw, (min-width: 640px) 32rem, 95vw"
				{...props}
			/>
			<div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-zinc-900/10 dark:ring-white/10" />
		</div>
	);
};

export const h2 = function H2(
	props: Omit<React.ComponentPropsWithoutRef<typeof Heading>, "level">,
) {
	return <Heading level={2} {...props} />;
};

function ContentWrapper({
	className,
	...props
}: Readonly<React.ComponentPropsWithoutRef<"div">>) {
	return (
		<div className="mx-auto max-w-7xl px-6 lg:flex lg:px-8">
			<div className="lg:ml-96 lg:flex lg:w-full lg:justify-end lg:pl-32">
				<div
					className={clsx(
						"mx-auto max-w-lg lg:mx-0 lg:w-0 lg:max-w-xl lg:flex-auto",
						className,
					)}
					{...props}
				/>
			</div>
		</div>
	);
}

function ArticleHeader({
	id,
	date,
}: { readonly id: string; readonly date: string | Date }) {
	return (
		<header className="relative mb-10 xl:mb-0">
			<div className="pointer-events-none absolute left-[max(-0.5rem,calc(50%-18.625rem))] top-0 z-50 flex h-4 items-center justify-end gap-x-2 lg:left-0 lg:right-[calc(max(2rem,50%-38rem)+40rem)] lg:min-w-[32rem] xl:h-8">
				<Link href={`#${id}`} className="inline-flex">
					<FormattedDate
						date={date}
						className="hidden xl:pointer-events-auto xl:block xl:text-2xs/4 xl:font-medium xl:text-white/50"
					/>
				</Link>
				<div className="h-[0.0625rem] w-3.5 bg-zinc-400 lg:-mr-3.5 xl:mr-0 xl:bg-zinc-300" />
			</div>
			<ContentWrapper>
				<div className="flex">
					<Link href={`#${id}`} className="inline-flex">
						<FormattedDate
							date={date}
							className="text-2xs/4 font-medium text-zinc-500 xl:hidden dark:text-white/50"
						/>
					</Link>
				</div>
			</ContentWrapper>
		</header>
	);
}

export const article = function Article({
	id,
	date,
	children,
}: {
	readonly id: string;
	readonly date: string | Date;
	readonly children: React.ReactNode;
}) {
	const heightRef = useRef<React.ElementRef<"div">>(null);
	const [heightAdjustment, setHeightAdjustment] = useState(0);

	useEffect(() => {
		if (!heightRef.current) {
			return;
		}

		const observer = new window.ResizeObserver(() => {
			if (!heightRef.current) {
				return;
			}
			const { height } = heightRef.current.getBoundingClientRect();
			const nextMultipleOf8 = 8 * Math.ceil(height / 8);
			setHeightAdjustment(nextMultipleOf8 - height);
		});

		observer.observe(heightRef.current);

		// skipcq: JS-0045 - this is fine
		return () => {
			observer.disconnect();
		};
	}, []);

	return (
		<article
			id={id}
			className="scroll-mt-16"
			style={{ paddingBottom: `${heightAdjustment}px` }}
		>
			<div ref={heightRef}>
				<ArticleHeader id={id} date={date} />
				<ContentWrapper className="typography" data-mdx-content>
					{children}
				</ContentWrapper>
			</div>
		</article>
	);
};

export function wrapper({ children }: { readonly children: React.ReactNode }) {
	return (
		<article className="flex h-full flex-col pb-10 pt-16">
			<Prose className="flex-auto">{children}</Prose>
			<footer className="mx-auto mt-16 w-full max-w-2xl lg:max-w-5xl">
				<Feedback />
			</footer>
		</article>
	);
}

function InfoIcon(props: Readonly<React.ComponentPropsWithoutRef<"svg">>) {
	return (
		<svg viewBox="0 0 16 16" aria-hidden="true" {...props}>
			<circle cx="8" cy="8" r="8" strokeWidth="0" />
			<path
				fill="none"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="1.5"
				d="M6.75 7.75h1.5v3.5"
			/>
			<circle cx="8" cy="4" r=".5" fill="none" />
		</svg>
	);
}

export function Note({ children }: { readonly children: React.ReactNode }) {
	return (
		<div className="my-6 flex gap-2.5 rounded-2xl border border-emerald-500/20 bg-emerald-50/50 p-4 leading-6 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/5 dark:text-emerald-200 dark:[--tw-prose-links-hover:theme(colors.emerald.300)] dark:[--tw-prose-links:theme(colors.white)]">
			<InfoIcon className="mt-1 h-4 w-4 flex-none fill-emerald-500 stroke-white dark:fill-emerald-200/20 dark:stroke-emerald-200" />
			<div className="[&>:first-child]:mt-0 [&>:last-child]:mb-0">
				{children}
			</div>
		</div>
	);
}

export function Warn({ children }: { readonly children: React.ReactNode }) {
	return (
		<div className="my-6 flex gap-2.5 rounded-2xl border border-amber-500/20 bg-amber-50/50 p-4 leading-6 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/5 dark:text-amber-200 dark:[--tw-prose-links-hover:theme(colors.amber.300)] dark:[--tw-prose-links:theme(colors.white)]">
			<InfoIcon className="mt-1 h-4 w-4 flex-none fill-amber-500 stroke-white dark:fill-amber-200/20 dark:stroke-amber-200" />
			<div className="[&>:first-child]:mt-0 [&>:last-child]:mb-0">
				{children}
			</div>
		</div>
	);
}

export function Row({ children }: { readonly children: React.ReactNode }) {
	return (
		<div className="grid grid-cols-1 items-start gap-x-16 gap-y-10 xl:max-w-none xl:grid-cols-2">
			{children}
		</div>
	);
}

export function Col({
	children,
	sticky = false,
}: {
	readonly children: React.ReactNode;
	readonly sticky?: boolean;
}) {
	return (
		<div
			className={clsx(
				"[&>:first-child]:mt-0 [&>:last-child]:mb-0",
				sticky && "xl:sticky xl:top-24",
			)}
		>
			{children}
		</div>
	);
}

export function Properties({
	children,
}: { readonly children: React.ReactNode }) {
	return (
		<div className="my-6">
			<ul className="m-0 max-w-[calc(theme(maxWidth.lg)-theme(spacing.8))] list-none divide-y divide-zinc-900/5 p-0 dark:divide-white/5">
				{children}
			</ul>
		</div>
	);
}

export function Property({
	name,
	children,
	type,
	defaultValue,
}: {
	readonly name: string;
	readonly children: React.ReactNode;
	readonly type?: string;
	readonly defaultValue?: string;
}) {
	return (
		<li className="m-0 px-0 py-4 first:pt-0 last:pb-0">
			<dl className="m-0 flex flex-wrap items-center gap-x-3 gap-y-2">
				<dt className="sr-only">Name</dt>
				<dd>
					<code>{name}</code>
				</dd>
				{type && (
					<>
						<dt className="sr-only">Type</dt>
						<dd className="font-mono text-xs text-zinc-400 dark:text-zinc-500">
							{type}
						</dd>
					</>
				)}
				{defaultValue && (
					<>
						<dt className="sr-only">Default</dt>
						<dd className="font-mono text-xs text-zinc-400 dark:text-zinc-500">
							default: {defaultValue}
						</dd>
					</>
				)}
				<dt className="sr-only">Description</dt>
				<dd className="w-full flex-none [&>:first-child]:mt-0 [&>:last-child]:mb-0">
					{children}
				</dd>
			</dl>
		</li>
	);
}
