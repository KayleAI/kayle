"use client";

import { Heading, Subheading } from "@/components/ui/heading";
import { Divider } from "@/components/ui/divider";
import { Text } from "@/components/ui/text";

export function PageHeading({
	title = "",
	description = "",
	children,
}: {
	readonly title: string | React.ReactNode;
	readonly description: string;
	readonly children?: React.ReactNode;
}) {
	return (
		<>
			<div className="flex w-full flex-wrap items-end justify-between gap-4">
				<div className="flex flex-col">
					<Heading>{title}</Heading>
					<Text>{description}</Text>
				</div>
				<div className="flex gap-4">{children}</div>
			</div>
			<Divider className="my-6" />
		</>
	);
}

export function PageSubheading({
	title = "",
	level = 2,
	description = "",
	children,
}: {
	readonly title: string | React.ReactNode;
	readonly level?: 2 | 3 | 4 | 5 | 6;
	readonly description: string;
	readonly children?: React.ReactNode;
}) {
	return (
		<>
			<div className="flex w-full flex-wrap items-end justify-between gap-4">
				<div className="flex flex-col">
					<Subheading level={level}>{title}</Subheading>
					<Text>{description}</Text>
				</div>
				<div className="flex gap-4">{children}</div>
			</div>
			<Divider className="my-6" soft />
		</>
	);
}
