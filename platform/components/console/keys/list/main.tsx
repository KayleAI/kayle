"use client";

// UI
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@repo/ui/table";
import { Code, Strong, Text } from "@repo/ui/text";
import { Heading } from "@repo/ui/heading";

// Auth
import { OrgArea } from "@/components/auth/org-area";

// Components
import CreateKeyDialog from "./create-key-dialog";

export function ListKeys({
	keys,
	loading,
	orgId,
}: {
	readonly keys: any;
	readonly loading: boolean;
	readonly orgId: string;
}) {
	return (
		<OrgArea authRequired acceptRoles={["Owner", "Admin", "Developer"]}>
			<div className="flex flex-col gap-y-8">
				<div className="flex w-full flex-wrap items-end justify-between gap-4 border-b border-zinc-950/10 pb-6 dark:border-white/10">
					<Heading>API Keys</Heading>
					<div className="flex gap-4">
						<CreateKeyDialog />
					</div>
				</div>
				<Table bleed dense striped>
					<TableHead>
						<TableRow>
							<TableHeader>Key ID</TableHeader>
							<TableHeader>Key Name</TableHeader>
							<TableHeader>Key Hint</TableHeader>
							<TableHeader>Environment</TableHeader>
							<TableHeader align="right">Actions</TableHeader>
						</TableRow>
					</TableHead>
					<TableBody>
						{keys?.map((key: any) => {
							return (
								<TableRow
									key={key.id}
									href={`/developers/keys/${key.id}?orgId=${orgId}`}
								>
									<TableCell className="">
										<Text>{key.id}</Text>
									</TableCell>
									<TableCell className="font-medium">{key.name}</TableCell>
									<TableCell className="font-medium">
										<Code>{key.start}</Code>
									</TableCell>
									<TableCell>
										{key.environment === "test" ? (
											<Badge color="amber">Testing</Badge>
										) : (
											<Badge color="emerald">Production</Badge>
										)}
									</TableCell>
									<TableCell align="right">
										<Button href={`/developers/keys/${key.id}?orgId=${orgId}`}>
											View Details
										</Button>
									</TableCell>
								</TableRow>
							);
						})}
						{!loading && keys.length === 0 && (
							<TableRow>
								<TableCell colSpan={5} className="text-center">
									<Text>
										No keys found. <Strong>Create one now!</Strong>
									</Text>
								</TableCell>
							</TableRow>
						)}
						{loading && (
							<TableRow>
								<TableCell colSpan={5} className="text-center">
									<Text>Loading...</Text>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</OrgArea>
	);
}
