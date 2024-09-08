import CreateNewOrganisation from "@/components/console/orgs/create-org";
import { Button } from "@repo/ui/button";
import { PageHeading } from "@repo/ui/page-heading";

export default function CreateOrgPage() {
	return (
		<div>
			<PageHeading title="Create new organisation" description="">
				<Button href="/contact">Contact sales</Button>
			</PageHeading>
			<CreateNewOrganisation />
		</div>
	);
}
