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
import { Text } from "@repo/ui/text";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { createClient } from "@repo/db/client";
import { Input } from "@repo/ui/input";
import { useAuth } from "@/utils/auth/provider";
import { useRouter } from "next/navigation";

export function SettingsPage() {
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

	const handleSubmit = useCallback(
		(e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();

			toast.promise(
				new Promise((resolve, reject) => {
					setSubmissionState("loading");
					setTimeout(async () => {
						const { error } = await supabase
							.from("users")
							.update({
								name,
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
		},
		[supabase, user?.data?.id, router, name],
	);

	const handleChangeName = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setName(e.target.value);
		},
		[],
	);

	return (
		<form className="my-8" ref={formRef} onSubmit={handleSubmit}>
			<Fieldset>
				<Legend>Profile</Legend>
				<Text>Update your profile information.</Text>
				<ProfileSection
					name={name}
					handleChangeName={handleChangeName}
					submissionState={submissionState}
				/>
			</Fieldset>
		</form>
	);
}

function ProfileSection({
	name,
	handleChangeName,
	submissionState,
}: {
	readonly name: string;
	readonly handleChangeName: (e: React.ChangeEvent<HTMLInputElement>) => void;
	readonly submissionState: "idle" | "loading" | "success" | "error";
}) {
	return (
		<FieldGroup>
			<Field>
				<Label>Name</Label>
				<Input
					required
					name="name"
					type="text"
					value={name}
					onChange={handleChangeName}
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
	);
}
