// Next
import { notFound } from "next/navigation";

// Components
import { AuthSignIn } from "@/components/auth/auth-sign-in";
import { AuthSignUp } from "@/components/auth/auth-sign-up";
import { AuthSSO } from "@/components/auth/auth-sso";
import { GradientBackground } from "@/components/gradient";

const ComponentsByType = {
	/*"forgot-password": <AuthResetPanel />,
	"change-password": <AuthResetChangePanel />,*/
	"sign-in": <AuthSignIn />,
	"sign-up": <AuthSignUp />,
	/*"verify-email": <AuthVerifyEmailPanel />,*/
	sso: <AuthSSO />,
};

export default async function AuthType({
	params,
}: {
	readonly params: Promise<{
		readonly type: string;
	}>;
}) {
	const { type } = await params;
	const Component =
		ComponentsByType[type as keyof typeof ComponentsByType] ?? notFound();

	return (
		<main className="overflow-hidden bg-gray-50">
			<GradientBackground />
			{Component}
		</main>
	);
}
