import type { MDXComponents } from "mdx/types";

import * as mdxComponents from "@/components/mdx/mdx";

export function useMDXComponents(components: MDXComponents) {
	return {
		...components,
		...mdxComponents,
	};
}
