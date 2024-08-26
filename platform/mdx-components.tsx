import type { MDXComponents } from "mdx/types";

import * as mdxComponents from "components/changelog/mdx";

export function useMDXComponents(components: MDXComponents) {
	return {
		...components,
		...mdxComponents,
	};
}
