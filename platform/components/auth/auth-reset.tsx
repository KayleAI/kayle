"use client";

import { createClient } from "utils/supabase/client";
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
import { Text, TextLink } from "@repo/ui/text";
import { useState } from "react";
import { useCaptcha } from "@/utils/captcha/CaptchaProvider";
import { toast } from "sonner";
import {
	type BetterErrorMessagesType,
	betterErrorMessages,
} from "./better-error-messages";
import { LoaderIcon } from "@repo/icons/ui/index";

export function AuthResetPanel() {
	const supabase = createClient();
	const [email, setEmail] = useState("");
	const [status, setStatus] = useState<
		"pending" | "success" | "idle" | "error"
	>("idle");
	const { captchaToken, resetCaptcha } = useCaptcha();

	resetCaptcha();

	return (
		<form
			className="max-w-md mx-auto border border-zinc-950/10 dark:border-white/10 px-4 py-6 rounded-lg w-full"
			onSubmit={async (e: any) => {
				e.preventDefault();
				setStatus("pending");

				const { error } = await supabase.auth.resetPasswordForEmail(email, {
					captchaToken: captchaToken,
					redirectTo: `${window.location.origin}/auth/change-password`,
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

				resetCaptcha();

				setTimeout(() => {
					setStatus("success");
					toast.info(
						"If an account with that email exists, an email with a link to reset your password has been sent.",
					);
				}, 2000);
			}}
		>
			<Fieldset>
				<Legend>Reset your password</Legend>
				<Text>
					Enter your email address and we’ll send you a link to reset your
					password.{" "}
					<TextLink href={"/sign-in"}>Remembered your password?</TextLink>
				</Text>
				<FieldGroup>
					<Field>
						<Label>Email</Label>
						<Input
							name="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<Description>
							Enter the email address associated with your account.
						</Description>
					</Field>
					<Field>
						<Button
							type="submit"
							className="w-full"
							color="dark/white"
							disabled={(status === "pending" || status === "success")}
						>
							{(status === "pending" || status === "success") && (
								<LoaderIcon className="size-5 animate-spin" />
							)}
							Send reset link
						</Button>
					</Field>
				</FieldGroup>
			</Fieldset>
		</form>
	);
}
