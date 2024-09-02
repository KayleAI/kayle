"use client";

import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Link } from "@repo/ui/link";

import { join } from "@repo/comm/newsletter";

import { Kayle } from "@repo/icons/ui/index";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import clsx from "clsx";
import { getKayleStatus } from "@/actions/status/get-kayle-status";

const navigation = {
	solutions: [
		{ name: "Text & Audio Moderation", href: "#" },
		{ name: "Image & Video Moderation", href: "#" },
		{ name: "Document Moderation", href: "#" },
	],
	developer: [
		{ name: "Documentation", href: "/docs" },
		{ name: "API Reference", href: "/docs" },
		{ name: "API Status", href: "https://status.kayle.ai", ping: true },
		{ name: "Changelog", href: "/changelog" },
	],
	company: [
		{ name: "About", href: "#" },
		{ name: "Blog", href: "#" },
		{ name: "Contact us", href: "/contact" },
	],
	legal: [
		{ name: "Privacy Policy", href: "/privacy" },
		{ name: "Terms of Service", href: "/terms" },
		{ name: "Security Policy", href: "/security" },
	],
	social: [
		{
			name: "X",
			href: "https://go.kayle.ai/x",
			icon: (props: any) => (
				<svg viewBox="0 0 20 20" aria-hidden="true" {...props}>
					<title>X</title>
					<path d="M11.1527 8.92804L16.2525 3H15.044L10.6159 8.14724L7.07919 3H3L8.34821 10.7835L3 17H4.20855L8.88474 11.5643L12.6198 17H16.699L11.1524 8.92804H11.1527ZM9.49748 10.8521L8.95559 10.077L4.644 3.90978H6.50026L9.97976 8.88696L10.5216 9.66202L15.0446 16.1316H13.1883L9.49748 10.8524V10.8521Z" />
				</svg>
			),
		},
		{
			name: "GitHub",
			href: "https://git.new/kayle",
			icon: (props: any) => (
				<svg viewBox="0 0 20 20" aria-hidden="true" {...props}>
					<title>GitHub</title>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M10 1.667c-4.605 0-8.334 3.823-8.334 8.544 0 3.78 2.385 6.974 5.698 8.106.417.075.573-.182.573-.406 0-.203-.011-.875-.011-1.592-2.093.397-2.635-.522-2.802-1.002-.094-.246-.5-1.005-.854-1.207-.291-.16-.708-.556-.01-.567.656-.01 1.124.62 1.281.876.75 1.292 1.948.93 2.427.705.073-.555.291-.93.531-1.143-1.854-.213-3.791-.95-3.791-4.218 0-.929.322-1.698.854-2.296-.083-.214-.375-1.09.083-2.265 0 0 .698-.224 2.292.876a7.576 7.576 0 0 1 2.083-.288c.709 0 1.417.096 2.084.288 1.593-1.11 2.291-.875 2.291-.875.459 1.174.167 2.05.084 2.263.53.599.854 1.357.854 2.297 0 3.278-1.948 4.005-3.802 4.219.302.266.563.78.563 1.58 0 1.143-.011 2.061-.011 2.35 0 .224.156.491.573.405a8.365 8.365 0 0 0 4.11-3.116 8.707 8.707 0 0 0 1.567-4.99c0-4.721-3.73-8.545-8.334-8.545Z"
					/>
				</svg>
			),
		},
		{
			name: "Discord",
			href: "https://go.kayle.ai/discord",
			icon: (props: any) => (
				<svg viewBox="0 0 20 20" aria-hidden="true" {...props}>
					<title>Discord</title>
					<path d="M16.238 4.515a14.842 14.842 0 0 0-3.664-1.136.055.055 0 0 0-.059.027 10.35 10.35 0 0 0-.456.938 13.702 13.702 0 0 0-4.115 0 9.479 9.479 0 0 0-.464-.938.058.058 0 0 0-.058-.027c-1.266.218-2.497.6-3.664 1.136a.052.052 0 0 0-.024.02C1.4 8.023.76 11.424 1.074 14.782a.062.062 0 0 0 .024.042 14.923 14.923 0 0 0 4.494 2.272.058.058 0 0 0 .064-.02c.346-.473.654-.972.92-1.496a.057.057 0 0 0-.032-.08 9.83 9.83 0 0 1-1.404-.669.058.058 0 0 1-.029-.046.058.058 0 0 1 .023-.05c.094-.07.189-.144.279-.218a.056.056 0 0 1 .058-.008c2.946 1.345 6.135 1.345 9.046 0a.056.056 0 0 1 .059.007c.09.074.184.149.28.22a.058.058 0 0 1 .023.049.059.059 0 0 1-.028.046 9.224 9.224 0 0 1-1.405.669.058.058 0 0 0-.033.033.056.056 0 0 0 .002.047c.27.523.58 1.022.92 1.495a.056.056 0 0 0 .062.021 14.878 14.878 0 0 0 4.502-2.272.055.055 0 0 0 .016-.018.056.056 0 0 0 .008-.023c.375-3.883-.63-7.256-2.662-10.246a.046.046 0 0 0-.023-.021Zm-9.223 8.221c-.887 0-1.618-.814-1.618-1.814s.717-1.814 1.618-1.814c.908 0 1.632.821 1.618 1.814 0 1-.717 1.814-1.618 1.814Zm5.981 0c-.887 0-1.618-.814-1.618-1.814s.717-1.814 1.618-1.814c.908 0 1.632.821 1.618 1.814 0 1-.71 1.814-1.618 1.814Z" />
				</svg>
			),
		},
	],
};

function SocialLink({
	href,
	icon: Icon,
	children,
}: {
	href: string;
	icon: React.ComponentType<{ className?: string }>;
	children: React.ReactNode;
}) {
	return (
		<Link href={href} className="group">
			<span className="sr-only">{children}</span>
			<Icon className="h-5 w-5 fill-zinc-700 transition group-hover:fill-zinc-900 dark:group-hover:fill-zinc-500" />
		</Link>
	);
}

export function Footer({
	className = "",
}: {
	className?: string;
}) {
	const [kayleStatus, setKayleStatus] = useState<
		"okay" | "degraded" | "down" | "pending"
	>("pending");
	const [email, setEmail] = useState("");
	const [submissionState, setSubmissionState] = useState<
		"idle" | "loading" | "success" | "error" | "email-error"
	>("idle");

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const form = e.currentTarget;
		const email = form["email-address"].value;

		await join({
			email: email,
			audienceId: "b23a5d3b-c8de-4d2e-b73b-b726b8f20ec4",
		});
	};

	useEffect(() => {
		getKayleStatus().then((status) => setKayleStatus(status));
	}, []);

	return (
		<footer aria-labelledby="footer-heading">
			<h2 id="footer-heading" className="sr-only">
				Footer
			</h2>
			<div
				className={clsx(
					"mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32",
					className,
				)}
			>
				<div className="xl:grid xl:grid-cols-3 xl:gap-8">
					<Kayle className={"size-10"} />
					<div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
						<div className="md:grid md:grid-cols-2 md:gap-8">
							<div>
								<h3 className="text-sm font-semibold leading-6 text-zinc-900 dark:text-zinc-100">
									Solutions
								</h3>
								<ul className="mt-6 gap-y-4">
									{navigation.solutions.map((item) => (
										<li key={item.name}>
											<Link
												href={item.href}
												className="text-sm leading-6 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-300"
											>
												{item.name}
											</Link>
										</li>
									))}
								</ul>
							</div>
							<div className="mt-10 md:mt-0">
								<h3 className="text-sm font-semibold leading-6 text-zinc-900 dark:text-zinc-100">
									For Developers
								</h3>
								<ul className="mt-6 gap-y-4">
									{navigation.developer.map((item) => {
										return (
											<li key={item.name}>
												<Link
													href={item.href}
													className="text-sm leading-6 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-300 flex"
												>
													{item.name}
													{item.ping && (
														<span className="relative ml-1 mt-1 flex h-2 w-2">
															<span
																className={clsx(
																	"absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
																	kayleStatus === "okay" && "bg-emerald-400",
																	kayleStatus === "degraded" && "bg-amber-400",
																	kayleStatus === "down" && "bg-red-400",
																)}
															/>
															<span
																className={clsx(
																	"relative inline-flex h-2 w-2 rounded-full",
																	kayleStatus === "okay" && "bg-emerald-500",
																	kayleStatus === "degraded" && "bg-amber-500",
																	kayleStatus === "down" && "bg-red-500",
																)}
															/>
														</span>
													)}
												</Link>
											</li>
										);
									})}
								</ul>
							</div>
						</div>
						<div className="md:grid md:grid-cols-2 md:gap-8">
							<div>
								<h3 className="text-sm font-semibold leading-6 text-zinc-900 dark:text-zinc-100">
									Company
								</h3>
								<ul className="mt-6 gap-y-4">
									{navigation.company.map((item) => (
										<li key={item.name}>
											<Link
												href={item.href}
												className="text-sm leading-6 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-300"
											>
												{item.name}
											</Link>
										</li>
									))}
								</ul>
							</div>
							<div className="mt-10 md:mt-0">
								<h3 className="text-sm font-semibold leading-6 text-zinc-900 dark:text-zinc-100">
									Legal
								</h3>
								<ul className="mt-6 gap-y-4">
									{navigation.legal.map((item) => (
										<li key={item.name}>
											<Link
												href={item.href}
												className="text-sm leading-6 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-300"
											>
												{item.name}
											</Link>
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>
				</div>
				<div className="mt-16 border-t border-zinc-900/10 dark:border-zinc-50/10 pt-8 sm:mt-20 lg:mt-24 lg:flex lg:items-center lg:justify-between">
					<div>
						<h3 className="text-sm font-semibold leading-6 text-zinc-900 dark:text-zinc-100">
							Join our newsletter
						</h3>
						<p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
							Stay up to date with the latest news and updates.
						</p>
					</div>
					<form
						className="mt-6 flex sm:max-w-md lg:mt-0 flex-col sm:flex-row"
						onSubmit={handleSubmit}
					>
						<label htmlFor="email-address" className="sr-only">
							Email address
						</label>
						<Input
							type="email"
							name="email-address"
							id="email-address"
							invalid={submissionState === "email-error"}
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							autoComplete="email"
							required
							className="w-full"
							placeholder="Enter your email"
						/>
						<div className="mt-4 sm:ml-4 sm:mt-0 sm:flex-shrink-0 w-full sm:w-fit">
							<Button
								className="w-full sm:w-auto !cursor-pointer"
								color="emerald"
								onClick={async () =>
									toast.promise(
										new Promise((resolve, reject) => {
											setSubmissionState("loading");
											setTimeout(async () => {
												if (!email?.includes("@")) {
													setSubmissionState("email-error");
													return reject(new Error("Invalid email address."));
												}

												const success = await join({
													email: email,
													audienceId: "b23a5d3b-c8de-4d2e-b73b-b726b8f20ec4",
												});

												if (!success) {
													setSubmissionState("error");
													return reject(new Error("Something went wrong."));
												}

												setSubmissionState("success"); // wait a lil’ so it feels like it’s doing something
												return resolve(true);
											}, 300);
										}),
										{
											loading: "Signing you up...",
											success: "You’re all set! 🎉",
											error: "Something went wrong. Please try again.",
										},
									)
								}
								disabled={submissionState === "loading"}
							>
								Join
							</Button>
						</div>
					</form>
				</div>
				<div className="mt-8 border-t border-zinc-900/10 dark:border-zinc-50/10 pt-8 md:flex md:items-center md:justify-between">
					<div className="flex gap-x-6 md:order-2">
						{navigation.social.map((item) => (
							<SocialLink key={item.name} href={item.href} icon={item.icon}>
								{item.name}
							</SocialLink>
						))}
					</div>
					<p className="mt-8 text-xs leading-5 text-zinc-600 dark:text-zinc-400 md:order-1 md:mt-0">
						&copy; Copyright {new Date().getFullYear()} Kayle. All rights
						reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
