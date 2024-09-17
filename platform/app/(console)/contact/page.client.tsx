"use client";

import { Button } from "@repo/ui/button";
import { Heading } from "@repo/ui/heading";

import {
	Description,
	Field,
	FieldGroup,
	Fieldset,
	Label,
	Legend,
} from "@repo/ui/fieldset";
import { Text, TextLink } from "@repo/ui/text";
import { Textarea } from "@repo/ui/textarea";
import React, { useRef, useState } from "react";
import { toast } from "sonner";

import { captureContactForm } from "@repo/comm/contact";

export default function ContactPageClient() {
	const formRef = useRef<HTMLFormElement>(null);
	const [submissionState, setSubmissionState] = useState<
		"idle" | "loading" | "success" | "error" | "email-error"
	>("idle");
	const [message, setMessage] = useState("");

	const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
		setMessage(e.target.value);

	const handleSubmit = React.useCallback(
		(e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();

			toast.promise(
				new Promise((resolve, reject) => {
					setSubmissionState("loading");
					setTimeout(async () => {
						const { success, error } = await captureContactForm({
							message,
						});

						if (error && !success) {
							setSubmissionState("error");
							return reject(new Error(error));
						}

						setSubmissionState("success");
						return resolve(true);
					}, 500);
				}),
				{
					loading: "Sending message...",
					success: "Thanks for reaching out! We’ll get back to you soon.",
					error: (error) => `${error.message}`.replace("Error: ", ""),
				},
			);
		},
		[message],
	);

	return (
		<div>
			<div className="flex w-full flex-wrap items-end justify-between gap-4 border-b border-zinc-950/10 pb-6 dark:border-white/10">
				<Heading>Contact the Kayle team</Heading>
				<div className="flex gap-4">
					<Button href="/" outline>
						Head back
					</Button>
				</div>
			</div>
			<form className="my-8" ref={formRef} onSubmit={handleSubmit}>
				<Fieldset>
					<Legend>Contact Us</Legend>
					<Text>
						Have a question or need help? Send us a message and we’ll get back
						to you as soon as possible.
					</Text>
					<FieldGroup>
						<Field>
							<Label>Your Message</Label>
							<Textarea
								required
								name="message"
								value={message}
								onChange={handleTextChange}
								disabled={submissionState === "loading"}
							/>
							<Description>
								Say hello, ask a question, or share your{" "}
								<TextLink href="/feedback">feedback</TextLink>.
							</Description>
						</Field>
						<Field>
							<Button type="submit" disabled={submissionState === "loading"}>
								Send Message
							</Button>
						</Field>
					</FieldGroup>
				</Fieldset>
			</form>
		</div>
	);
}
