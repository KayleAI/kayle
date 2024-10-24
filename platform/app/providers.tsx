"use client";

// Auth
import AuthProvider, { useAuth } from "@/utils/auth/provider";

// Captcha
import { Captcha, CaptchaProvider } from "@/utils/captcha/provider";

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
				<ThemeProvider attribute="class" disableTransitionOnChange enableSystem>
					{children}
					<Toaster />
					<AnalyticsProvider />
				</ThemeProvider>
			</AuthProvider>
			<Captcha invisible />
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
	const { user } = useAuth();

	const clientId = process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID;

	if (!clientId) {
		return null;
	}

	return (
		<OpenPanelComponent
			clientId={clientId}
			profileId={user?.id ?? ""}
			trackOutgoingLinks
			trackHashChanges
			trackScreenViews
			trackAttributes
		/>
	);
}
