import { AuthPanel } from "@/components/auth/auth-panel";

export default function SignInPage() {
	return (
		<div className="min-h-screen flex justify-center items-center">
			<AuthPanel signIn />
		</div>
	);
}
