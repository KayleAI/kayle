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
import { Text } from "@repo/ui/text";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { Input } from "@repo/ui/input";
import { useAuth } from "@/utils/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { signout } from "@/utils/auth/signout";

export default function Settings() {
	const supabase = createClient();

	const user = useAuth();
	const router = useRouter();

	const formRef = useRef<HTMLFormElement>(null);
	const [name, setName] = useState<string>(user?.data?.name || "");
	const [submissionState, setSubmissionState] = useState<
		"idle" | "loading" | "success" | "error"
	>("idle");

	useEffect(() => {
		setName(user?.data?.name || "");
	}, [user?.data?.name]);

	return (
		<>
			<div className="flex w-full flex-wrap items-end justify-between gap-4 border-b border-zinc-950/10 pb-6 dark:border-white/10">
				<Heading>Settings</Heading>
				<div className="flex gap-4">
					<Button outline href={"/org/_/settings"}>
						Looking for organisation settings?
					</Button>
					<Button
						onClick={async () => {
							await signout();
							router.push("/sign-out");
						}}
					>
						Sign out
					</Button>
				</div>
			</div>
			<form
				className="my-8"
				ref={formRef}
				onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
					e.preventDefault();

					toast.promise(
						new Promise((resolve, reject) => {
							setSubmissionState("loading");
							setTimeout(async () => {
								const { error } = await supabase
									.from("users")
									.update({
										name: name,
									})
									.eq("id", user?.data?.id);

								if (error) {
									setSubmissionState("error");
									return reject(new Error(error.message));
								}

								setSubmissionState("success");
								return resolve(true);
							}, 500);
						}),
						{
							loading: "Updating profile...",
							success: "Your profile has been updated!",
							error: (error) =>
								`Error: ${error.message}`.replace("Error: Error: ", ""),
						},
					);

					router.refresh();
				}}
			>
				<Fieldset>
					<Legend>Profile</Legend>
					<Text>Update your profile information.</Text>
					<FieldGroup>
						<Field>
							<Label>Name</Label>
							<Input
								required
								name="name"
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								disabled={submissionState === "loading"}
							/>
							<Description>What should we call you?</Description>
						</Field>
						<Field>
							<Button type="submit" disabled={submissionState === "loading"}>
								Update profile
							</Button>
						</Field>
					</FieldGroup>
				</Fieldset>
			</form>
		</>
	);
}
