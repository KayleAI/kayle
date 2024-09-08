"use client";

import { Field, FieldGroup, Fieldset, Legend } from "@repo/ui/fieldset";
import { Button } from "@repo/ui/button";
import { Strong, Text } from "@repo/ui/text";

import { useState } from "react";
import { useQueryState } from "nuqs";
import { createClient } from "@repo/db/client";
import { toast } from "sonner";
import { LoaderIcon } from "@repo/icons/ui/index";

export function AuthVerifyEmailPanel() {
	const supabase = createClient();
	const [email] = useQueryState("email", {
		defaultValue: "",
	});
	const [status, setStatus] = useState<
		"pending" | "success" | "idle" | "error"
	>("idle");
	const handleSubmit = async () => {
		setStatus("pending");

		const { error } = await supabase.auth.resend({
			type: "signup",
			email: email,
		});

		if (error) {
			setStatus("error");
			toast.error(
				`An error occurred while resending the email: ${error.message}`,
			);
		} else {
			setStatus("success");
			toast.success("Email sent successfully");
		}

		setTimeout(() => {
			setStatus("idle");
		}, 60000);
	}

	return (
		<div className="max-w-md mx-auto border border-zinc-950/10 dark:border-white/10 px-4 py-6 rounded-lg w-full">
			<Fieldset>
				<Legend>Verify your email</Legend>
				<Text>
					We’ve sent an email to <Strong>{email}</Strong> with a link to verify
					your account.
				</Text>
				<FieldGroup>
					<Field>
						<Button
							type="submit"
							className="w-full"
							color="dark/white"
							disabled={status === "pending" || status === "success"}
							onClick={handleSubmit}
						>
							{(status === "pending" || status === "success") && (
								<LoaderIcon className="size-5 animate-spin" />
							)}
							{status === "pending" ? "Resending..." : "Resend email"}
						</Button>
					</Field>
				</FieldGroup>
			</Fieldset>
		</div>
	);
}
