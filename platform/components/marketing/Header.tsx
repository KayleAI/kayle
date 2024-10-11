"use client";

import { Fragment, useRef } from "react";
import { Link } from "@repo/ui/link";
import { usePathname } from "next/navigation";
import {
	Popover,
	PopoverButton,
	PopoverBackdrop,
	PopoverPanel,
	Transition,
	TransitionChild,
} from "@headlessui/react";
import clsx from "clsx";

import { Kayle } from "@repo/icons/ui/index";

import { Container } from "@/components/marketing/Container";

const navigation = [
	//{ name: 'About', href: '/about' },
	{ name: "Blog", href: "/blog", newTab: false },
	{ name: "Docs", href: "/docs", newTab: false },
	{ name: "Demo", href: "/demo", newTab: false },
	//{ name: 'Pricing', href: '/pricing' },
	{ name: "Investors", href: "/pitch" },
];

function CloseIcon(props: Readonly<React.ComponentPropsWithoutRef<"svg">>) {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
			<path
				d="m17.25 6.75-10.5 10.5M6.75 6.75l10.5 10.5"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

function ChevronDownIcon(
	props: Readonly<React.ComponentPropsWithoutRef<"svg">>,
) {
	return (
		<svg viewBox="0 0 8 6" aria-hidden="true" {...props}>
			<path
				d="M1.75 1.75 4 4.25l2.25-2.5"
				fill="none"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

function MobileNavItem({
	href,
	newTab = false,
	children,
}: {
	readonly href: string;
	readonly newTab?: boolean;
	readonly children: React.ReactNode;
}) {
	return (
		<li>
			<PopoverButton
				as={Link}
				href={href}
				className="block py-2"
				target={newTab ? "_blank" : undefined}
			>
				{children}
			</PopoverButton>
		</li>
	);
}

function MobileNavContent({
	ref,
}: {
	readonly ref: React.RefObject<HTMLDivElement>;
}) {
	return (
		<PopoverPanel
			focus
			ref={ref}
			className="fixed inset-x-4 top-8 z-50 origin-top rounded-3xl bg-white p-8 ring-1 ring-neutral-900/5 dark:bg-neutral-900 dark:ring-neutral-800"
		>
			<div className="flex flex-row-reverse items-center justify-between">
				<PopoverButton aria-label="Close menu" className="-m-1 p-1">
					<CloseIcon className="h-6 w-6 text-neutral-500 dark:text-neutral-400" />
				</PopoverButton>
				<h2 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
					Navigation
				</h2>
			</div>
			<nav className="mt-6">
				<ul className="-my-2 divide-y divide-neutral-100 text-base text-neutral-800 dark:divide-neutral-100/5 dark:text-neutral-300">
					{navigation.map((item) => (
						<MobileNavItem
							key={item.href}
							href={item.href}
							newTab={item?.newTab ?? false}
						>
							{item.name}
						</MobileNavItem>
					))}
				</ul>
			</nav>
		</PopoverPanel>
	);
}

function MobileNavigation(
	props: Readonly<React.ComponentPropsWithoutRef<typeof Popover>>,
) {
	const ref = useRef<React.ElementRef<"div">>(null);

	return (
		<Popover {...props}>
			<PopoverButton className="group flex items-center rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-neutral-800 shadow-lg shadow-neutral-800/5 ring-1 ring-neutral-900/5 backdrop-blur dark:bg-neutral-800/90 dark:text-neutral-200 dark:ring-white/10 dark:hover:ring-white/20">
				Menu
				<ChevronDownIcon className="ml-3 h-auto w-2 stroke-neutral-500 group-hover:stroke-neutral-700 dark:group-hover:stroke-neutral-400" />
			</PopoverButton>
			<Transition>
				<TransitionChild
					as={Fragment}
					enter="duration-150 ease-out"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="duration-150 ease-in"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<PopoverBackdrop className="fixed inset-0 z-50 bg-neutral-800/40 backdrop-blur-sm dark:bg-black/80" />
				</TransitionChild>
				<TransitionChild
					as={Fragment}
					enter="duration-150 ease-out"
					enterFrom="opacity-0 scale-95"
					enterTo="opacity-100 scale-100"
					leave="duration-150 ease-in"
					leaveFrom="opacity-100 scale-100"
					leaveTo="opacity-0 scale-95"
				>
					<MobileNavContent ref={ref} />
				</TransitionChild>
			</Transition>
		</Popover>
	);
}

function NavItem({
	href,
	newTab = false,
	children,
}: {
	readonly href: string;
	readonly newTab?: boolean;
	readonly children: React.ReactNode;
}) {
	const isActive = usePathname() === href;

	return (
		<li>
			<Link
				href={href}
				className={clsx(
					"relative block px-3 py-2 transition",
					isActive
						? "text-emerald-500 dark:text-emerald-400"
						: "hover:text-emerald-500 dark:hover:text-emerald-400",
				)}
				target={newTab ? "_blank" : undefined}
			>
				{children}
				{isActive && (
					<span className="absolute inset-x-1 -bottom-px h-px bg-gradient-to-r from-emerald-500/0 via-emerald-500/40 to-emerald-500/0 dark:from-emerald-400/0 dark:via-emerald-400/40 dark:to-emerald-400/0" />
				)}
			</Link>
		</li>
	);
}

function DesktopNavigation(
	props: Readonly<React.ComponentPropsWithoutRef<"nav">>,
) {
	return (
		<nav {...props}>
			<ul className="flex rounded-full bg-white/90 px-3 text-sm font-medium text-neutral-800 shadow-lg shadow-neutral-800/5 ring-1 ring-neutral-900/5 backdrop-blur dark:bg-neutral-800/90 dark:text-neutral-200 dark:ring-white/10">
				{navigation.map((item) => (
					<NavItem
						key={item.href}
						href={item.href}
						newTab={item?.newTab || false}
					>
						{item.name}
					</NavItem>
				))}
			</ul>
		</nav>
	);
}

function LoginButton() {
	return (
		<Link
			//href="https://console.kayle.ai" // Login &rarr;
			href="https://go.kayle.ai/waitlist"
			target="_blank"
			className="group rounded-full bg-white/90 text-sm font-medium text-neutral-800 dark:text-neutral-200 px-3 py-2 shadow-lg shadow-neutral-800/5 ring-1 ring-neutral-900/5 backdrop-blur transition dark:bg-neutral-800/90 dark:ring-white/10 dark:hover:ring-white/20 flex flex-row justify-center items-center gap-x-1 hover:text-emerald-500 dark:hover:text-emerald-400"
		>
			Join the waitlist
		</Link>
	);
}

function LogoContainer({
	className,
	...props
}: Readonly<React.ComponentPropsWithoutRef<"div">>) {
	return (
		<div
			className={clsx(
				className,
				"h-10 w-10 rounded-full bg-white/90 p-0.5 shadow-lg shadow-neutral-800/5 ring-1 ring-neutral-900/5 backdrop-blur dark:bg-neutral-800/90 dark:ring-white/10",
			)}
			{...props}
		/>
	);
}

function Logo({
	large = false,
	className,
	...props
}: Omit<React.ComponentPropsWithoutRef<typeof Link>, "href"> & {
	large?: boolean;
}) {
	return (
		<Link
			href="/"
			aria-label="Home"
			className={clsx(className, "pointer-events-auto")}
			{...props}
		>
			<Kayle
				className={clsx(
					"rounded-full object-cover", //bg-neutral-100 dark:bg-neutral-800
					large ? "h-16 w-16" : "h-9 w-9",
				)}
			/>
		</Link>
	);
}

function HeaderContent() {
	return (
		<Container
			className="top-[var(--header-top,theme(spacing.6))] w-full"
			style={{
				position:
					"var(--header-inner-position)" as React.CSSProperties["position"],
			}}
		>
			<div className="relative flex gap-4">
				<div className="flex flex-1">
					<LogoContainer>
						<Logo />
					</LogoContainer>
				</div>
				<div className="flex flex-1 justify-end md:justify-center">
					<MobileNavigation className="pointer-events-auto md:hidden" />
					<DesktopNavigation className="pointer-events-auto hidden md:block" />
				</div>
				<div className="flex justify-end md:flex-1">
					<div className="pointer-events-auto">
						<LoginButton />
					</div>
				</div>
			</div>
		</Container>
	);
}

export function Header() {
	const headerRef = useRef<React.ElementRef<"div">>(null);
	const logoRef = useRef<React.ElementRef<"div">>(null);

	return (
		<header
			className="fixed pointer-events-none flex flex-none flex-col w-full"
			style={{
				zIndex: 9999,
			}}
		>
			<div
				ref={logoRef}
				className="order-last mt-[calc(theme(spacing.16)-theme(spacing.3))]"
			/>
			<div
				ref={headerRef}
				className="top-0 z-10 h-16 pt-6"
				style={{
					position: "var(--header-position)" as React.CSSProperties["position"],
				}}
			>
				<HeaderContent />
			</div>
		</header>
	);
}
