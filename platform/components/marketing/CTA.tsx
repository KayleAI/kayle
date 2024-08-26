import { Button } from "@repo/ui/button";

export function CTAComponent() {
	return (
		<div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
			<div className="relative isolate overflow-hidden bg-zinc-900 dark:bg-zinc-900/30 px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
				<h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
					Get started with Kayle today
				</h2>
				<p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-zinc-300">
					Keep your platform safe for everyone without needing to build and
					manage a moderation team.
				</p>
				<div className="mt-10 flex items-center justify-center gap-x-6">
					<Button href="/sign-in">Get started</Button>
					<Button href="/docs" plain className="!text-white">
						See the docs <span aria-hidden="true">→</span>
					</Button>
				</div>
				<svg
					viewBox="0 0 1024 1024"
					className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
					aria-hidden="true"
				>
					<circle
						cx={512}
						cy={512}
						r={512}
						fill="url(#827591b1-ce8c-4110-b064-7cb85a0b1217)"
						fillOpacity="0.7"
					/>
					<defs>
						<radialGradient id="827591b1-ce8c-4110-b064-7cb85a0b1217">
							<stop stopColor="#10b981" />
							<stop offset={1} stopColor="#10b981" />
						</radialGradient>
					</defs>
				</svg>
			</div>
		</div>
	);
}
