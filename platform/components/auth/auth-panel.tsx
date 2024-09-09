"use client";

import { createClient } from "@repo/db/client";

// UI
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

// UX
import { LoaderIcon } from "@repo/icons/ui/index";
import { toast } from "sonner";
import {
	type BetterErrorMessagesType,
	betterErrorMessages,
} from "./better-error-messages";

// Config
import { NEXT_PUBLIC_APP_URL } from "@repo/config/env";

// Auth
import { useAuth } from "@/utils/auth/AuthProvider";

// Functions
import { useCallback, useEffect, useState } from "react";
import { useCaptcha } from "@/utils/captcha/CaptchaProvider";
import { useRouter } from "next/navigation";

const FormFields = ({
	signIn,
	email,
	password,
	handleEmailChange,
	handlePasswordChange,
	status,
}: {
	readonly signIn: boolean;
	readonly email: string;
	readonly password: string;
	readonly handleEmailChange: (e: any) => void;
	readonly handlePasswordChange: (e: any) => void;
	readonly status: "pending" | "success" | "idle" | "error";
}) => (
	<FieldGroup>
		<Field>
			<Label>Email</Label>
			<Input
				name="email"
				type="email"
				value={email}
				onChange={handleEmailChange}
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
				onChange={handlePasswordChange}
			/>
			{!signIn ? (
				<Description>
					A super secret password that only you should know.
				</Description>
			) : (
				<Description>
					Forgot your password?{" "}
					<TextLink href="/forgot-password">Get help signing in.</TextLink>
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
	</FieldGroup>
);

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

	const handleEmailChange = useCallback(
		(e: any) => setEmail(e.target.value),
		[],
	);

	const handlePasswordChange = useCallback(
		(e: any) => setPassword(e.target.value),
		[],
	);

	const handleSignIn = useCallback(async () => {
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
			options: {
				captchaToken,
			},
		});

		if (error) {
			setStatus("error");
			console.error(error);
			toast.error("Invalid email or password");
		}
	}, [email, password, captchaToken, supabase.auth.signInWithPassword]);

	const handleSignUp = useCallback(async () => {
		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				captchaToken,
				emailRedirectTo: `${NEXT_PUBLIC_APP_URL}/sign-in`,
			},
		});

		if (error) {
			setStatus("error");
			console.error(error);
			toast.error(
				betterErrorMessages[error.message as keyof BetterErrorMessagesType] ??
					error.message,
			);
		}
	}, [email, password, captchaToken, supabase.auth.signUp]);

	const handleSubmit = useCallback(
		async (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			setStatus("pending");

			if (signIn) {
				await handleSignIn();
			}

			if (!signIn) {
				await handleSignUp();
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
		},
		[signIn, resetCaptcha, updateAuth, router, handleSignIn, handleSignUp],
	);

	useEffect(() => {
		resetCaptcha();
	}, [resetCaptcha]);

	return (
		<form
			className="max-w-md mx-auto border border-zinc-950/10 dark:border-white/10 px-4 py-6 rounded-lg w-full"
			onSubmit={handleSubmit}
		>
			<Fieldset>
				<Legend>
					{signIn ? "Sign in to your account" : "Create an account"}
				</Legend>
				<Text>
					{signIn
						? "Sign in to your account to continue. If you don’t have an account, you can create one"
						: "Create an account to continue. If you already have an account, you can sign in"}{" "}
					<TextLink href={signIn ? "/sign-up" : "/sign-in"}>here</TextLink>.
				</Text>
				<FormFields
					status={status}
					signIn={signIn}
					email={email}
					password={password}
					handleEmailChange={handleEmailChange}
					handlePasswordChange={handlePasswordChange}
				/>
			</Fieldset>
		</form>
	);
}
