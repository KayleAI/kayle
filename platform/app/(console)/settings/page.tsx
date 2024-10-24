// UI
import { Button } from "@repo/ui/button";
import { PageHeading } from "@repo/ui/page-heading";

// Components
import { SettingsPage } from "@/components/console/settings/settings-page";

export default function Settings() {
	return (
		<div>
			<PageHeading title="Settings" description="Manage your account settings.">
				<Button outline href={"/org/_/settings"}>
					Looking for organisation settings?
				</Button>
				<Button href="/sign-out">Sign out</Button>
			</PageHeading>
			<SettingsPage />
		</div>
	);
}
