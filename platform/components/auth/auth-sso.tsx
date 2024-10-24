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

export function AuthSSO() {
	const { user } = useAuth();

	// Router
	const router = useRouter();

	// States
	const [email, setEmail] = useState("");
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

	const handleSSO = useCallback(async () => {
		console.log("handleSSO", email);
		toast.info("SSO is not supported yet.");
	}, [email]);

	const handleSubmit = useCallback(
		async (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			setStatus("pending");

			await handleSSO();

			// TODO: When better-auth supports captcha, we'll need to add it here

			console.log("captchaToken", captchaToken);

			resetCaptcha();

			setStatus("success");
		},
		[captchaToken, resetCaptcha, handleSSO],
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
					<h1 className="mt-8 text-base/6 font-medium">Sign in with SSO</h1>
					<p className="mt-1 text-sm/5 text-gray-600">
						Sign in using your company email.
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
						<Field>
							<Button
								type="submit"
								className="w-full"
								disabled={status === "pending" || status === "success"}
							>
								{(status === "pending" || status === "success") && (
									<LoaderIcon className="size-5 animate-spin mr-2" />
								)}
								Sign in with SSO
							</Button>
						</Field>
					</FieldGroup>
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
