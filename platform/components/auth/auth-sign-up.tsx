"use client";

// UI
import { Field, FieldGroup, Label, Description } from "@repo/ui/fieldset";
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

export function AuthSignUp() {
	const { user } = useAuth();

	// Router
	const router = useRouter();

	// States
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [rememberMe, setRememberMe] = useState(false);
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

	const handleSignUp = useCallback(async () => {
		const { error } = await client.signUp.email({
			email,
			password,
			name: "",
			callbackURL: "/verify-email",
		});

		if (error) {
			throw error;
		}
	}, [email, password]);

	const handleSubmit = useCallback(
		async (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			setStatus("pending");

			try {
				await handleSignUp();
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
		},
		[captchaToken, resetCaptcha, handleSignUp],
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
				<form onSubmit={handleSubmit} className="p-7 sm:p-11">
					<div className="flex items-start">
						<Link href="/" title="Home">
							<Mark className="h-9 fill-black" />
						</Link>
					</div>
					<h1 className="mt-8 text-base/6 font-medium">Create your account</h1>
					<p className="mt-1 text-sm/5 text-gray-600">Sign up to continue.</p>
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
							<Description>We will send you a verification email.</Description>
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
							<Description>You must keep your password safe.</Description>
						</Field>
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
							Sign up
						</Button>
					</div>
				</form>
				<div className="m-1.5 rounded-lg bg-gray-50 py-4 text-center text-sm/5 ring-1 ring-black/5">
					<Text className="font-medium">
						Already have an account?{" "}
						<TextLink href="/sign-in">Sign in</TextLink>
					</Text>
				</div>
			</div>
		</div>
	);
}
