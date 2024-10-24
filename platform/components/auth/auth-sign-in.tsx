"use client";

// UI
import { Field, FieldGroup, Label } from "@repo/ui/fieldset";
import { Input } from "@repo/ui/input";
import { Button } from "@repo/ui/button";
import { Text, TextLink } from "@repo/ui/text";
import { Checkbox } from "@repo/ui/checkbox";

// Icons
import { CheckIcon, LoaderIcon } from "@repo/icons/ui/index";

// Components
import { toast } from "sonner";
import { Mark } from "@/components/logo";

// Auth
import { useAuth } from "@/utils/auth/provider";
import { client } from "@repo/auth/client";

// Functions
import { useCallback, useEffect, useState } from "react";
import { useCaptcha } from "@/utils/captcha/provider";
import { useRouter } from "next/navigation";
import { Link } from "@repo/ui/link";

export function AuthSignIn() {
	const { user } = useAuth();

	// Router
	const router = useRouter();

	// States
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [rememberMe, setRememberMe] = useState(true);
	const [status, setStatus] = useState<
		"pending" | "success" | "idle" | "error"
	>("idle");

	// Captcha
	const { captchaToken, resetCaptcha } = useCaptcha();

	// Handlers
	const handleEmailChange = useCallback(
		(e: any) => setEmail(e.target.value),
		[],
	);

	const handlePasswordChange = useCallback(
		(e: any) => setPassword(e.target.value),
		[],
	);

	const handleSignIn = useCallback(async () => {
		const { error } = await client.signIn.email({
			email,
			password,
			dontRememberMe: !rememberMe,
			callbackURL: "/dashboard",
		});

		if (error) {
			throw error;
		}
	}, [email, password, rememberMe]);

	const handleSubmit = useCallback(
		async (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			setStatus("pending");

			try {
				await handleSignIn();
			} catch (error) {
				setStatus("error");
				console.error(error);
				toast.error("Invalid email or password");
			}

			// TODO: When better-auth supports captcha, we'll need to add it here

			console.log("captchaToken", captchaToken);

			resetCaptcha();

			setStatus("success");
			toast.success(
				"You’ve signed into your account. We’ll redirect you momentarily.",
			);

			router.push("/dashboard");
		},
		[captchaToken, resetCaptcha, router, handleSignIn],
	);

	useEffect(() => {
		resetCaptcha();
	}, [resetCaptcha]);

	useEffect(() => {
		if (user) {
			router.push("/dashboard");
		}
	}, [user, router]);

	return (
		<div className="isolate flex min-h-dvh items-center justify-center p-6 lg:p-8">
			<div className="w-full max-w-md rounded-xl bg-white shadow-md ring-1 ring-black/5">
				<form onSubmit={handleSubmit} className="p-7 sm:p-11 !pb-5">
					<div className="flex items-start">
						<Link href="/" title="Home">
							<Mark className="h-9 fill-black" />
						</Link>
					</div>
					<h1 className="mt-8 text-base/6 font-medium">Welcome back!</h1>
					<p className="mt-1 text-sm/5 text-gray-600">
						Sign in to your account to continue.
					</p>
					<FieldGroup>
						<Field className="mt-8 space-y-3">
							<Label className="text-sm/5 font-medium">Email</Label>
							<Input
								required
								autoFocus
								type="email"
								name="email"
								value={email}
								onChange={handleEmailChange}
							/>
						</Field>
						<Field className="mt-8 space-y-3">
							<Label className="text-sm/5 font-medium">Password</Label>
							<Input
								required
								type="password"
								name="password"
								value={password}
								onChange={handlePasswordChange}
							/>
						</Field>
						<div className="mt-8 flex items-center justify-between text-sm/5">
							<Field className="flex items-center gap-3">
								<Checkbox
									name="remember-me"
									checked={rememberMe}
									onChange={setRememberMe}
								>
									<CheckIcon className="fill-white opacity-0 group-data-[checked]:opacity-100" />
								</Checkbox>
								<Label>Remember me</Label>
							</Field>
							<Link
								href="/forgot-password"
								className="font-medium hover:text-gray-600"
							>
								Forgot password?
							</Link>
						</div>
					</FieldGroup>
					<div className="mt-8">
						<Button
							type="submit"
							className="w-full"
							disabled={status === "pending" || status === "success"}
						>
							{(status === "pending" || status === "success") && (
								<LoaderIcon className="size-5 animate-spin mr-2" />
							)}
							Sign in
						</Button>
					</div>
					<div className="mt-2 w-full text-center">
						<Text>
							<TextLink href="/sso">Sign in with SSO</TextLink>
						</Text>
					</div>
				</form>
				<div className="m-1.5 rounded-lg bg-gray-50 py-4 text-center text-sm/5 ring-1 ring-black/5">
					<Text className="font-medium">
						No account? <TextLink href="/sign-up">Sign up</TextLink>
					</Text>
				</div>
			</div>
		</div>
	);
}
