"use client";

import React, { useId, useState } from "react";

import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { join } from "@repo/comm/newsletter";
import { toast } from "sonner";

export function ChangelogNewsletterForm() {
	const id = useId();
	const [email, setEmail] = useState("");
	const [submissionState, setSubmissionState] = useState<
		"idle" | "loading" | "success" | "error" | "email-error"
	>("idle");

	const handleClick = React.useCallback(
		() =>
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
					error: (error) => `${error.message}`,
				},
			),
		[email],
	);

	const handleChange = React.useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
		[],
	);

	return (
		<div className="flex flex-col gap-y-4 my-8">
			<label htmlFor={id} className="sr-only">
				Email address
			</label>
			<Input
				required
				type="email"
				autoComplete="email"
				name="email"
				id={id}
				invalid={submissionState === "email-error"}
				value={email}
				onChange={handleChange}
				placeholder="Email address"
				className="w-full"
			/>
			<Button
				color="emerald"
				className="!cursor-pointer"
				onClick={handleClick}
				disabled={submissionState === "loading"}
			>
				Stay in the loop
			</Button>
		</div>
	);
}
