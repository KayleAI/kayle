"use client";

import { Avatar } from "@repo/ui/avatar";
import { Subheading } from "@repo/ui/heading";
import { Link } from "@repo/ui/link";
import { Text } from "@repo/ui/text";
import clsx from "clsx";

export interface Author {
	id: string;
	name: string;
	image?: string;
	about?: string;
	github?: string;
	twitter?: string;
	initials: string;
	role: string;
}

export function AuthorAbout({
	author,
	className,
}: { readonly author?: Author; className?: string }) {
	if (!author) return null;

	return (
		<div className={clsx("flex items-center gap-x-3", className)}>
			<Avatar
				src={author?.image ?? undefined}
				className="rounded-full size-12"
				initials={!author.image ? author.initials : undefined}
			/>
			<div className="flex flex-col">
				<div className="flex flex-row items-center gap-x-2">
					<Subheading level={3}>{author.name}</Subheading>
					{author.twitter && (
						<Link href={author.twitter} target="_blank" className="group">
							<svg
								viewBox="0 0 20 20"
								aria-hidden="true"
								className="size-5 fill-zinc-700 transition group-hover:fill-zinc-900 dark:group-hover:fill-zinc-500"
							>
								<title>X</title>
								<path d="M11.1527 8.92804L16.2525 3H15.044L10.6159 8.14724L7.07919 3H3L8.34821 10.7835L3 17H4.20855L8.88474 11.5643L12.6198 17H16.699L11.1524 8.92804H11.1527ZM9.49748 10.8521L8.95559 10.077L4.644 3.90978H6.50026L9.97976 8.88696L10.5216 9.66202L15.0446 16.1316H13.1883L9.49748 10.8524V10.8521Z" />
							</svg>
						</Link>
					)}
					{author.github && (
						<Link href={author.github} target="_blank" className="group">
							<svg
								viewBox="0 0 20 20"
								aria-hidden="true"
								className="size-5 fill-zinc-700 transition group-hover:fill-zinc-900 dark:group-hover:fill-zinc-500"
							>
								<title>GitHub</title>
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M10 1.667c-4.605 0-8.334 3.823-8.334 8.544 0 3.78 2.385 6.974 5.698 8.106.417.075.573-.182.573-.406 0-.203-.011-.875-.011-1.592-2.093.397-2.635-.522-2.802-1.002-.094-.246-.5-1.005-.854-1.207-.291-.16-.708-.556-.01-.567.656-.01 1.124.62 1.281.876.75 1.292 1.948.93 2.427.705.073-.555.291-.93.531-1.143-1.854-.213-3.791-.95-3.791-4.218 0-.929.322-1.698.854-2.296-.083-.214-.375-1.09.083-2.265 0 0 .698-.224 2.292.876a7.576 7.576 0 0 1 2.083-.288c.709 0 1.417.096 2.084.288 1.593-1.11 2.291-.875 2.291-.875.459 1.174.167 2.05.084 2.263.53.599.854 1.357.854 2.297 0 3.278-1.948 4.005-3.802 4.219.302.266.563.78.563 1.58 0 1.143-.011 2.061-.011 2.35 0 .224.156.491.573.405a8.365 8.365 0 0 0 4.11-3.116 8.707 8.707 0 0 0 1.567-4.99c0-4.721-3.73-8.545-8.334-8.545Z"
								/>
							</svg>
						</Link>
					)}
				</div>
				<Text>{author.about}</Text>
			</div>
		</div>
	);
}
