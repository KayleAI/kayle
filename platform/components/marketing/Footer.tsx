"use client";

import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";

import { join } from "@repo/comm/newsletter";

import { Kayle } from "@repo/icons/ui/index";
import { useState } from "react";
import { toast } from "sonner";

const navigation = {
	solutions: [
		{ name: "Text & Audio Moderation", href: "#" },
		{ name: "Image & Video Moderation", href: "#" },
		{ name: "Document Moderation", href: "#" },
	],
	developer: [
		{ name: "Documentation", href: "/docs" },
		{ name: "API Reference", href: "/docs" },
		{ name: "API Status", href: "https://status.kayle.ai" },
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
			href: "#",
			icon: (props: any) => (
				<svg fill="currentColor" viewBox="0 0 24 24" {...props}>
					<title>X</title>
					<path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z" />
				</svg>
			),
		},
		{
			name: "GitHub",
			href: "https://github.com/KayleAI",
			icon: (props: any) => (
				<svg fill="currentColor" viewBox="0 0 24 24" {...props}>
					<title>GitHub</title>
					<path
						fillRule="evenodd"
						d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
						clipRule="evenodd"
					/>
				</svg>
			),
		},
	],
};

export function Footer() {
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

	return (
		<footer aria-labelledby="footer-heading">
			<h2 id="footer-heading" className="sr-only">
				Footer
			</h2>
			<div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
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
											<a
												href={item.href}
												className="text-sm leading-6 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-300"
											>
												{item.name}
											</a>
										</li>
									))}
								</ul>
							</div>
							<div className="mt-10 md:mt-0">
								<h3 className="text-sm font-semibold leading-6 text-zinc-900 dark:text-zinc-100">
									For Developers
								</h3>
								<ul className="mt-6 gap-y-4">
									{navigation.developer.map((item) => (
										<li key={item.name}>
											<a
												href={item.href}
												className="text-sm leading-6 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-300"
											>
												{item.name}
											</a>
										</li>
									))}
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
											<a
												href={item.href}
												className="text-sm leading-6 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-300"
											>
												{item.name}
											</a>
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
											<a
												href={item.href}
												className="text-sm leading-6 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-300"
											>
												{item.name}
											</a>
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
							<a
								key={item.name}
								href={item.href}
								className="text-zinc-600 hover:text-zinc-500 dark:text-zinc-400 dark:hover:text-zinc-300"
							>
								<span className="sr-only">{item.name}</span>
								<item.icon className="h-6 w-6" aria-hidden="true" />
							</a>
						))}
					</div>
					<p className="mt-8 text-xs leading-5 text-zinc-600 dark:text-zinc-400 md:order-1 md:mt-0">
						&copy; 2024 Kayle. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
