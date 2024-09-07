"use client";

// UI
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Code } from "@repo/ui/text";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

// Utils
import clsx from "clsx";
import { useState } from "react";

const options = [
	{
		id: "text",
		name: "Moderate Text",
		placeholder: "Type a message",
	},
	{
		id: "audio",
		name: "Moderate Audio",
		placeholder: "Upload an audio file",
	},
	{
		id: "image",
		name: "Moderate an Image",
		placeholder: "Upload an image",
		disabled: false,
	},
];

export function DemoTerminal() {
	return (
		<div className="relative isolate mx-auto max-w-7xl p-2 lg:px-8">
			<TabGroup>
				<TabList className="flex gap-4 overflow-x-scroll">
					{options.map(({ id, name, disabled }) => (
						<Tab
							key={id}
							disabled={disabled}
							className="group relative min-w-fit rounded-full py-1 px-3 text-sm/6 font-semibold text-black dark:text-white focus:outline-none data-[selected]:bg-black/10 dark:data-[selected]:bg-white/10 dark:data-[hover]:bg-white/5 data-[hover]:bg-black/5 dark:data-[selected]:data-[hover]:bg-white/10 data-[selected]:data-[hover]:bg-black/10 data-[focus]:outline-1 dark;data-[focus]:outline-white data-[focus]:outline-black disabled:cursor-not-allowed"
						>
							{disabled ? (
								<div className="absolute inset-0 rounded-full hidden group-hover:block backdrop-blur-[1px] bg-black/50 text-white py-1 px-2">
									<p>Coming soon</p>
								</div>
							) : null}
							<p
								className="data-[disabled]:text-black/50 dark:data-[disabled]:text-white/50"
								data-disabled={disabled}
							>
								{name}
							</p>
						</Tab>
					))}
				</TabList>
				<TabPanels className="mt-3">
					{options.map(({ id, placeholder }) => (
						<TabPanel
							key={id}
							className="rounded-xl bg-black/5 dark:bg-white/5 p-3"
						>
							<ModerateDemo
								type={id as "text" | "audio" | "image"}
								placeholder={placeholder}
							/>
						</TabPanel>
					))}
				</TabPanels>
			</TabGroup>
		</div>
	);
}

export function ModerateResult({
	result = {
		severity: 0,
		violations: [],
	},
}: {
	readonly result: {
		severity: number;
		violations: string[];
	} | null;
}) {
	return (
		<div
			className={clsx(
				"flex flex-col gap-2 bg-white/5 px-[calc(theme(spacing[3.5])-1px)] py-[calc(theme(spacing[2.5])-1px)] sm:px-[calc(theme(spacing[3])-1px)] sm:py-[calc(theme(spacing[1.5])-1px)]",
				"border border-zinc-950/10 data-[hover]:border-zinc-950/20 dark:border-white/10 dark:data-[hover]:border-white/20 rounded-lg min-h-28",
			)}
		>
			{result ? (
				<pre>{JSON.stringify(result, null, 2)}</pre>
			) : (
				<pre>ready to moderate</pre>
			)}
		</div>
	);
}

export function ModerateDemo({
	type,
	placeholder,
}: {
	readonly type: "text" | "audio" | "image";
	readonly placeholder: string;
}) {
	// State Management
	const [status, setStatus] = useState<
		"idle" | "loading" | "success" | "error"
	>("idle");
	const [input, setInput] = useState<string | File>("");

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (type === "text") {
			setInput(e.target.value);
		} else if (e?.target?.files?.[0]) {
			setInput(e.target.files[0]);
		}
	};

	const [lastModerationTime, setLastModerationTime] = useState<number | null>(
		null,
	);
	const [response, setResponse] = useState<{
		severity: number;
		violations: string[];
	} | null>(null);

	const handleSubmit = async () => {
		if (status !== "idle") return;

		if (type === "text") {
			if ((input as string).length === 0) return;
		}

		try {
			setStatus("loading");
			const start = performance.now();
			const result = await getDemoResponse({ input, type });
			if (result?.error) {
				throw new Error(result.error);
			}
			setResponse(result?.data);
			setLastModerationTime(
				Number(((performance.now() - start) / 1000).toFixed(2)),
			);
			setStatus("success");
		} catch (error) {
			console.error(error);
			setStatus("error");
		}

		setTimeout(() => {
			setStatus("idle");
		}, 2500);
	};

	return (
		<div>
			<ModerateResult result={response} />
			<div className="mt-2 flex flex-row gap-2">
				<Input
					autoComplete="off"
					type={type === "text" ? "text" : "file"}
					value={type === "text" ? (input as string) : undefined}
					placeholder={placeholder}
					onChange={handleInputChange}
					onKeyDown={(e) => {
						if (e.key === "Enter" && type === "text") {
							handleSubmit();
						}
					}}
					accept={
						type === "audio"
							? "audio/*"
							: type === "image"
								? "image/*"
								: undefined
					}
				/>
				<Button
					color="amber"
					onClick={handleSubmit}
					disabled={status !== "idle"}
				>
					Moderate
				</Button>
			</div>
			<div className="mt-2 flex flex-row gap-2">
				{status === "idle" ? (
					<Badge>
						Press <Code>Moderate</Code> when ready.
					</Badge>
				) : null}
				{status === "loading" ? (
					<Badge color="amber">Moderating...</Badge>
				) : null}
				{status === "success" ? (
					<Badge color="green">Check above for results</Badge>
				) : null}
				{status === "error" ? (
					<Badge color="red">Something went wrong!</Badge>
				) : null}
				{lastModerationTime ? <Badge>Last: {lastModerationTime}s</Badge> : null}
			</div>
		</div>
	);
}

async function getDemoResponse({
	input,
	type,
}: {
	readonly input: string | File;
	readonly type: "text" | "audio" | "image";
}) {
	try {
		if (input instanceof File) {
			const buffer = await input.arrayBuffer();
			const base64 = btoa(
				new Uint8Array(buffer).reduce(
					(data, byte) => data + String.fromCharCode(byte),
					"",
				),
			);
			input = `data:${input.type};base64,${base64}`;
		}

		const response = await fetch("/api/demo", {
			method: "POST",
			body: JSON.stringify({ input, type }),
		});

		return {
			data: await response.json(),
			error: null,
		};
	} catch (error) {
		console.error("Error in getDemoResponse:", error);
		return {
			error: "An error occurred while calling the Kayle API",
			data: null,
		};
	}
}
