"use client";

import { useRouter } from "next/navigation";
import * as Headless from "@headlessui/react";
import NextLink, { type LinkProps } from "next/link";

export const Link = function Link({
	ref,
	...props
}: LinkProps &
	React.ComponentPropsWithoutRef<"a"> & {
		ref?: React.Ref<HTMLAnchorElement>;
	}) {
	const router = useRouter();

	const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
		const href = typeof props.href === "string" ? props.href : null;
		if (href) {
			router.prefetch(href);
		}
		return props.onMouseEnter?.(e);
	};

	return (
		<Headless.DataInteractive>
			<NextLink ref={ref} onMouseEnter={handleMouseEnter} {...props} />
		</Headless.DataInteractive>
	);
};
