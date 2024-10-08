"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import { DocsFooter } from "@/components/docs/Footer";
import { Header } from "@/components/docs/Header";
import { Logo } from "@/components/docs/Logo";
import { Navigation } from "@/components/docs/Navigation";
import {
	type Section,
	SectionProvider,
} from "@/components/docs/SectionProvider";

function Sidebar() {
	return (
		<motion.header
			layoutScroll
			className="contents lg:pointer-events-none lg:fixed lg:inset-0 lg:z-40 lg:flex"
		>
			<div className="contents lg:pointer-events-auto lg:block lg:w-72 lg:overflow-y-auto lg:border-r lg:border-zinc-900/10 lg:px-6 lg:pb-8 lg:pt-4 xl:w-80 lg:dark:border-white/10">
				<div className="hidden lg:flex">
					<Link href="/" aria-label="Home">
						<Logo className="h-6" />
					</Link>
				</div>
				<Header />
				<Navigation className="hidden lg:mt-10 lg:block" />
			</div>
		</motion.header>
	);
}

export function Layout({
	children,
	allSections,
}: {
	readonly children: React.ReactNode;
	readonly allSections: Record<string, Array<Section>>;
}) {
	const pathname = usePathname();

	return (
		<SectionProvider sections={allSections[pathname] ?? []}>
			<Sidebar />
			<div className="h-full lg:ml-72 xl:ml-80">
				<div className="relative flex h-full flex-col px-4 pt-14 sm:px-6 lg:px-8">
					<main className="flex-auto">{children}</main>
					<DocsFooter />
				</div>
			</div>
		</SectionProvider>
	);
}
