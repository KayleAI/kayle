"use client";

import { Button } from "@repo/ui/button";

import {
	Description,
	Field,
	FieldGroup,
	Fieldset,
	Label,
	Legend,
} from "@repo/ui/fieldset";
import { Listbox, ListboxOption, ListboxLabel } from "@repo/ui/listbox";
import { Text } from "@repo/ui/text";
import { Textarea } from "@repo/ui/textarea";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { captureFeedback } from "@repo/comm/feedback";
import { PageHeading } from "@repo/ui/page-heading";

export default function Feedback() {
	const formRef = useRef<HTMLFormElement>(null);
	const [feedbackType, setFeedbackType] = useState<string>("feature");
	const [submissionState, setSubmissionState] = useState<
		"idle" | "loading" | "success" | "error" | "email-error"
	>("idle");
	const [feedback, setFeedback] = useState("");

	return (
		<div>
			<PageHeading title="Share Feedback with the Kayle team" description="">
				<Button href="/" outline>
					Go back to Dashboard
				</Button>
			</PageHeading>
			<form
				className="my-8"
				ref={formRef}
				onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
					e.preventDefault();

					toast.promise(
						new Promise((resolve, reject) => {
							setSubmissionState("loading");
							setTimeout(async () => {
								const { success, error } = await captureFeedback({
									feedback,
									feedbackType,
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
							loading: "Sending feedback...",
							success: "Awesome! Thanks for sharing your feedback!",
							error: (error) =>
								`Error: ${error.message}`.replace("Error: Error: ", ""),
						},
					);
				}}
			>
				<Fieldset>
					<Legend>Feedback</Legend>
					<Text>How can we make Kayle better?</Text>
					<FieldGroup>
						<Field>
							<Label>Feedback Type</Label>
							<Listbox
								name="type"
								defaultValue="feature"
								value={feedbackType}
								onChange={setFeedbackType}
								disabled={submissionState === "loading"}
							>
								<ListboxOption value="feature">
									<ListboxLabel>New Feature</ListboxLabel>
								</ListboxOption>
								<ListboxOption value="bug">
									<ListboxLabel>Bug Report</ListboxLabel>
								</ListboxOption>
								<ListboxOption value="other">
									<ListboxLabel>Other</ListboxLabel>
								</ListboxOption>
							</Listbox>
							<Description>What kind of feedback are you sharing?</Description>
						</Field>
						<Field>
							<Label>Your Feedback</Label>
							<Textarea
								required
								name="feedback"
								value={feedback}
								onChange={(e) => setFeedback(e.target.value)}
								disabled={submissionState === "loading"}
							/>
							<Description>Please share your feedback here.</Description>
						</Field>
						<Field>
							<Button type="submit" disabled={submissionState === "loading"}>
								Send Feedback
							</Button>
						</Field>
					</FieldGroup>
				</Fieldset>
			</form>
		</div>
	);
}
