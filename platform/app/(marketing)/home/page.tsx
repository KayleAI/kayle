"use client";

import { Button } from "@repo/ui/button";
import { Link } from "@repo/ui/link";
import { useState } from "react";

// Marketing components
import { CTAComponent } from "@/components/marketing/CTA";

export default function KayleLandingPage() {
	return (
		<>
			<HeroComponent />
			<HunterComponent />
			<CTAComponent />
		</>
	);
}

const terminal = `// this is the message you want to moderate
const message = "Hello, world!";

// now create the request
const res = await fetch('https://api.kayle.ai/v1/moderate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <YOUR_API_KEY>'
  },
  body: JSON.stringify({
    type: 'text',
    data: {message},
    from: ['<SENDING_USER>'],
    to: ['<RECEIVING_USER(s)>']
  })
});

// now continue with the response!`;

function HeroComponent() {
	return (
		<div className="relative isolate overflow-hidden bg-gradient-to-b from-emerald-100/20 dark:from-emerald-900/20">
			<div className="mx-auto max-w-7xl pb-24 pt-10 sm:pb-32 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-40">
				<div className="px-6 lg:px-0 lg:pt-4">
					<div className="mx-auto max-w-2xl">
						<div className="max-w-lg">
							<div className="mt-24 sm:mt-32 lg:mt-16">
								<Link
									href="https://go.kayle.ai/waitlist"
									className="inline-flex space-x-6"
								>
									<span className="rounded-full bg-emerald-600/10 px-3 py-1 text-sm font-semibold leading-6 text-emerald-600 ring-1 ring-inset ring-emerald-600/10">
										What’s new
									</span>
									<span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-zinc-600 dark:text-zinc-400">
										<span>Join our waitlist</span>
										<span className="" aria-hidden="true">
											&rarr;
										</span>
									</span>
								</Link>
							</div>
							<h1 className="mt-10 text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 dark: sm:text-6xl">
								Scale safely, affordably.
							</h1>
							<p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
								Content moderation that you know is worth paying for:
								All content types, 150+ languages, and only pay for what you use.
								{/* Later: Give each point their own hero section. */}
								{/* 100% Open-sourced: Know the quality that you're paying for. */}
							</p> 
							<div className="mt-10 flex items-center gap-x-2">
								<Button
									//href={"https://console.kayle.ai"} // Get started
									href={"https://go.kayle.ai/waitlist"}
									color="emerald"
								>
									Join the waitlist
								</Button>
								<Button href="/docs" plain>
									Documentation <span aria-hidden="true">→</span>
								</Button>
							</div>
						</div>
					</div>
				</div>
				{/* TODO: Hero sections for big 3 benefits, KPI/Moderator platform preview and Testimonials. */}
				{/* Hunting terminal */}
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
							<div className="relative px-6 pt-8 sm:pt-16 md:pl-16 md:pr-0">
								<div className="mx-auto max-w-2xl md:mx-0 md:max-w-none">
									<div className="w-screen overflow-hidden rounded-tl-xl bg-zinc-900">
										<div className="flex bg-zinc-800/40 ring-1 ring-white/5">
											<div className="-mb-px flex text-sm font-medium leading-6 text-zinc-400">
												<div className="border-b border-r border-b-white/10 border-r-white/10 bg-zinc-50/5 dark:bg-zinc-950/5 px-4 py-2 text-white">
													moderate.js
												</div>
												<div className="border-r border-zinc-600/10 px-4 py-2">
													app.js
												</div>
											</div>
										</div>
										<div className="px-6 pb-14 pt-6 text-white">
											<pre>{terminal}</pre>
										</div>
									</div>
								</div>
								<div
									className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/10 md:rounded-3xl"
									aria-hidden="true"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-white lg:from-zinc-100 dark:from-zinc-900 dark:lg:from-zinc-950 sm:h-32" />
		</div>
	);
}

function HunterComponent() {
	const [terminalInput, setTerminalInput] = useState("");
	const [terminalOutput, setTerminalOutput] = useState(
		"Awaiting message\n\n\n\n",
	);
	const [isInputDisabled, setIsInputDisabled] = useState(false);

	const handleSubmit = async () => {
		if (terminalInput.trim() === "") {
			return;
		}

		setIsInputDisabled(true);

		setTerminalOutput(`Running test on “${terminalInput}”...\n\n\n\n`);

		const startTime = performance.now();

		// Make POST request to your server endpoint
		const response = await fetch("/api/hunt", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ text: terminalInput }),
		});

		const data = await response.json();

		const timeTaken = Math.round(performance.now() - startTime);

		const output = `Text moderation output for “${terminalInput}”:\nSeverity: ${data.severity || 0}\nViolations: ${data.violations.length > 0 ? data.violations.join(", ") : "None"}\nTime taken: ${timeTaken}ms\n`;
		setTerminalOutput(output);

		setTerminalInput("");

		setIsInputDisabled(false);
	};

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			handleSubmit();
		}
	};

	return (
		<div className="mx-auto py-24 px-6 sm:py-32 lg:px-8">
			<div className="mx-auto max-w-2xl lg:text-center">
				<h2 className="text-lg font-semibold leading-8 tracking-tight text-emerald-600 dark:text-emerald-400">
					Happy Hunting!
				</h2>
				<p className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-100">
					Hunt for words or phrases that violate Kayle’s policy.
				</p>
				<p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
					By using Kayle’s Hunting Terminal, you provide us with valuable data
					that helps us improve our filters.
				</p>
			</div>
			<div className="relative isolate overflow-hidden bg-zinc-900 shadow-2xl rounded-3xl lg:flex lg:gap-x-20 lg:pt-0 mt-8 mx-auto max-w-5xl">
				<div className="mx-auto max-w-2xl md:mx-0 md:max-w-none">
					<div className="w-screen overflow-visible rounded-tl-xl bg-zinc-900">
						<div className="flex bg-zinc-800/40 ring-1 ring-white/5">
							<div className="-mb-px flex text-sm font-medium leading-6 text-zinc-400">
								<div className="border-b border-r border-b-white/10 border-r-white/10 bg-zinc-50/5 dark:bg-zinc-950/5 py-2 px-4 text-white">
									&nbsp;&nbsp;&nbsp;terminal
								</div>
								<div className="border-r border-zinc-600/10 py-2 px-4">
									api.kayle.ai
								</div>
							</div>
						</div>
						{/*<span className="text-amber-300">Current Score: <span id="total_score">0</span></span>*/}
						<div className="pt-6 px-6">
							<pre className="text-white">
								Kayle’s Hunting Terminal
								<br />
								Here you can see whether a message will be flagged by Kayle’s
								filters!
								<br />
								<span className="text-emerald-400">kayle@ai~$:</span> run hunter
								<br />
								{terminalOutput}
								<br />
								<br />
							</pre>
						</div>

						<div className="hidden lg:flex bg-zinc-800/40 ring-1 ring-white/5 max-w-5xl">
							<span>
								<div className="-mb-px flex text-sm font-medium leading-6 text-zinc-400">
									<div className="border-b border-r border-b-white/20 border-r-white/10 bg-zinc-50/5 dark:bg-zinc-950/5 py-2 px-4 text-white">
										&nbsp;&nbsp;&nbsp;Enter your message:
									</div>
								</div>
							</span>

							<div className="-mb-px flex text-sm font-medium leading-6 text-zinc-400 grow">
								<input
									type="text"
									name="terminal_input"
									id="terminal_input"
									maxLength={70}
									required
									value={terminalInput}
									onChange={(e) => setTerminalInput(e.target.value)}
									placeholder="kayle@ai~$:"
									className="border-none bg-transparent grow text-zinc-50 px-4"
									onKeyDown={handleKeyPress}
									disabled={isInputDisabled}
								/>
							</div>

							<button id="terminal_button" onClick={handleSubmit} type="button">
								<div className="-mb-px flex text-sm font-medium leading-6 text-zinc-400">
									<div className="border-b border-l border-b-white/20 border-l-white/10 bg-zinc-50/5 dark:bg-zinc-950/5 py-2 px-4 text-white">
										Submit&nbsp;&nbsp;&nbsp;
									</div>
								</div>
							</button>
						</div>
						<div className="flex lg:hidden bg-zinc-800/40 ring-1 ring-white/5 max-w-4xl">
							<div className="-mb-px flex text-sm font-medium leading-6 text-zinc-400">
								<div className="border-b border-r border-b-white/20 border-r-white/10 bg-zinc-50/5 dark:bg-zinc-950/5 py-2 px-4 text-white">
									&nbsp;&nbsp;&nbsp;This hunt is only available on desktop,
									sorry!
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
