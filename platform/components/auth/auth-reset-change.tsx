"use client";

import { createClient } from "@repo/db/client";
import {
	Description,
	Field,
	FieldGroup,
	Fieldset,
	Label,
	Legend,
} from "@repo/ui/fieldset";
import { Input } from "@repo/ui/input";
import { Button } from "@repo/ui/button";
import { Text } from "@repo/ui/text";
import { useState } from "react";
import { toast } from "sonner";
import {
	type BetterErrorMessagesType,
	betterErrorMessages,
} from "./better-error-messages";
import { useRouter } from "next/navigation";
import { LoaderIcon } from "@repo/icons/ui/index";

export function AuthResetChangePanel() {
	const router = useRouter();
	const supabase = createClient();
	const [password, setPassword] = useState("");
	const [status, setStatus] = useState<
		"pending" | "success" | "idle" | "error"
	>("idle");

	return (
		<form
			className="max-w-md mx-auto border border-zinc-950/10 dark:border-white/10 px-4 py-6 rounded-lg w-full"
			onSubmit={async (e: any) => {
				e.preventDefault();
				setStatus("pending");

				const { error } = await supabase.auth.updateUser({
					password: password,
				});

				if (error) {
					setStatus("error");
					console.error(error);
					toast.error(
						betterErrorMessages[
							error.message as keyof BetterErrorMessagesType
						] ?? error.message,
					);
					return;
				}

				setStatus("success");
				toast.success(
					"We’ve updated your password. You can now log in with your new password.",
				);

				setTimeout(() => {
					router.push("/sign-in");
				}, 1000);
			}}
		>
			<Fieldset>
				<Legend>Change your password</Legend>
				<Text>Enter your new password.</Text>
				<FieldGroup>
					<Field>
						<Label>Password</Label>
						<Input
							name="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<Description>
							Passwords must be at least 8 characters long.
						</Description>
					</Field>
					<Field>
						<Button
							type="submit"
							className="w-full"
							color="dark/white"
							disabled={status === "pending" || status === "success"}
						>
							{(status === "pending" || status === "success") && (
								<LoaderIcon className="size-5 animate-spin" />
							)}
							Change password
						</Button>
					</Field>
				</FieldGroup>
			</Fieldset>
		</form>
	);
}
