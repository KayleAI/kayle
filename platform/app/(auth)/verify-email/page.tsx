import { AuthVerifyEmailPanel } from "@/components/auth/auth-verify-email";

export default async function VerifyEmailPage() {
	return (
		<div className="min-h-screen flex justify-center items-center">
			<AuthVerifyEmailPanel />
		</div>
	);
}
