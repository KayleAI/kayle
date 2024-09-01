import nextMDX from "@next/mdx";

import { recmaPlugins } from "./mdx/recma.mjs";
import { rehypePlugins } from "./mdx/rehype.mjs";
import { remarkPlugins } from "./mdx/remark.mjs";
import withSearch from "./mdx/search.mjs";

const withMDX = nextMDX({
	extension: /\.mdx?$/,
	options: {
		remarkPlugins,
		rehypePlugins,
		recmaPlugins,
	},
});

/** @type {import('next').NextConfig} */
const nextConfig = {
	pageExtensions: ["js", "jsx", "ts", "tsx", "mdx"],
	transpilePackages: [
		"@repo/icons",
		"@repo/ui",
		"@repo/db",
		"@repo/comm",
		"@repo/config",
	],
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/i,
			use: ["@svgr/webpack"],
		});

		return config;
	},
	experimental: {
		turbo: {
			rules: {
				"*.svg": {
					loaders: ["@svgr/webpack"],
					as: "*.js",
				},
			},
		},
		outputFileTracingIncludes: {
			"/**/*": ["./app/(docs)/docs/**/*.mdx"],
		},
	},
};

export default withSearch(withMDX(nextConfig));
