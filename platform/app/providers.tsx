"use client";

// Auth
import AuthProvider, { useAuth } from "@/utils/auth/AuthProvider";
import OrgProvider from "@/utils/auth/OrgProvider";

// Captcha
import { CaptchaProvider } from "@/utils/captcha/CaptchaProvider";

// Themes
import { ThemeProvider, useTheme } from "next-themes";

// Sonner
import { Toaster as Sonner } from "sonner";

// Openpanel
import { OpenPanelComponent } from "@openpanel/nextjs";

export function Providers({
	children,
}: {
	readonly children: React.ReactNode;
}) {
	return (
		<CaptchaProvider>
			<AuthProvider>
				<OrgProvider>
					<ThemeProvider
						attribute="class"
						disableTransitionOnChange
						enableSystem
					>
						{children}
						<Toaster />
						<AnalyticsProvider />
					</ThemeProvider>
				</OrgProvider>
			</AuthProvider>
		</CaptchaProvider>
	);
}

export function Toaster() {
	const { resolvedTheme } = useTheme();

	if (!resolvedTheme) return null;

	return (
		<Sonner richColors theme={resolvedTheme === "dark" ? "dark" : "light"} />
	);
}

export function AnalyticsProvider() {
	const { data } = useAuth();

	return (
		<OpenPanelComponent
			clientId={process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID!}
			profileId={data?.id ?? ""}
			trackOutgoingLinks
			trackHashChanges
			trackScreenViews
			trackAttributes
		/>
	);
}
