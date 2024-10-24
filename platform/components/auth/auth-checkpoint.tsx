// UI
import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";

// Icons
import { LoaderIcon } from "@repo/icons/ui/index";

export function AuthCheckpointLoading() {
	return (
		<main className="flex flex-col items-center justify-center h-screen">
			<div className="max-w-xs mx-auto border border-zinc-950/10 dark:border-white/10 px-4 py-6 rounded-lg w-full">
				<Heading>Security Checkpoint</Heading>
				<Text>
					We’re ensuring that you are permitted to access this resource.
				</Text>
				<div className="flex items-center justify-center w-full h-28">
					<LoaderIcon className="size-12 animate-spin" />
				</div>
			</div>
			<footer className="absolute bottom-0 w-full h-16 flex items-center justify-center">
				<Text>Please wait while we authorise your request.</Text>
			</footer>
		</main>
	);
}

export function AuthCheckpointRedirecting() {
	return (
		<main className="flex flex-col items-center justify-center h-screen">
			<div className="max-w-xs mx-auto border border-zinc-950/10 dark:border-white/10 px-4 py-6 rounded-lg w-full">
				<Heading>Security Checkpoint Redirect</Heading>
				<Text>Please wait while we redirect you to the next step.</Text>
				<div className="flex items-center justify-center w-full h-28">
					<LoaderIcon className="size-12 animate-spin" />
				</div>
			</div>
			<footer className="absolute bottom-0 w-full h-16 flex items-center justify-center">
				<Text>
					To prevent unauthorised access, we need to authenticate you.
				</Text>
			</footer>
		</main>
	);
}
