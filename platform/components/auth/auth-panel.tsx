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
import { Divider } from "@repo/ui/divider"; // NOSONAR
import { useState } from "react";
import { useCaptcha } from "@/utils/captcha/CaptchaProvider";
import { toast } from "sonner";
import {
	type BetterErrorMessagesType,
	betterErrorMessages,
} from "./better-error-messages";
import { LoaderIcon } from "@repo/icons/ui/index";
import { useRouter } from "next/navigation";
import { useAuth } from "utils/auth/AuthProvider";

export function AuthPanel({
	signIn = false,
}: {
	readonly signIn?: boolean;
}) {
	const { updateAuth } = useAuth();
	const router = useRouter();
	const supabase = createClient();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
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

				if (signIn) {
					const { error } = await supabase.auth.signInWithPassword({
						email: email,
						password: password,
						options: {
							captchaToken: captchaToken,
						},
					});

					if (error) {
						setStatus("error");
						console.error(error);
						toast.error("Invalid email or password");
						return;
					}
				}

				if (!signIn) {
					const { error } = await supabase.auth.signUp({
						email: email,
						password: password,
						options: {
							captchaToken: captchaToken,
						},
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
				}

				resetCaptcha();

				setStatus("success");
				toast.success(
					signIn
						? "You have successfully signed in. Redirecting..."
						: "We’ve sent you an email with a link to verify your account.",
				);

				await updateAuth();

				if (signIn) {
					router.push("/dashboard");
					return;
				}

				router.push("/verify-email");
			}}
		>
			<Fieldset>
				<Legend>
					{signIn ? "Sign in to your account" : "Create an account"}
				</Legend>
				<Text>
					{signIn
						? "Sign in to your account to continue. If you don’t have an account, you can create one"
						: "Create an account to continue. If you already have an account, you can sign in"}{" "}
					<TextLink href={signIn ? "/sign-up" : "/sign-in"}>
						here
					</TextLink>
					.
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
						{!signIn && (
							<Description>
								We’ll never share your email with anyone else.
							</Description>
						)}
					</Field>
					<Field>
						<Label>Password</Label>
						<Input
							name="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						{!signIn ? (
							<Description>
								A super secret password that only you should know.
							</Description>
						) : (
							<Description>
								Forgot your password?{" "}
								<TextLink href="/forgot-password">
									Get help signing in.
								</TextLink>
							</Description>
						)}
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
							Sign {signIn ? "in" : "up"}
						</Button>
					</Field>
					{/*<Field>
						<Divider />
					</Field>
					<Field>
						<Button
							color="zinc"
							className="w-full"
							onClick={async () => {
								const { data, error } = await supabase.auth.signInWithOAuth({
									provider: "google",
									options: {
										scopes: "email profile",
									},
								});

								if (error) {
									console.error(error);
									return;
								}

								console.log(data);
							}}
						>
							Continue with Google
						</Button>
					</Field>*/}
				</FieldGroup>
			</Fieldset>
		</form>
	);
}
