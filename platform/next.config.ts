// Sentry
import { withSentryConfig } from "@sentry/nextjs";

// MDX
import nextMDX from "@next/mdx";
import { recmaPlugins } from "./mdx/recma.mjs";
import { rehypePlugins } from "./mdx/rehype.mjs";
import { remarkPlugins } from "./mdx/remark.mjs";
import withSearch from "./mdx/search.mjs";

// Types
import type { NextConfig } from "next";

const withMDX = nextMDX({
	extension: /\.mdx?$/,
	options: {
		remarkPlugins,
		rehypePlugins,
		recmaPlugins,
	},
});

const nextConfig: NextConfig = {
	pageExtensions: ["js", "jsx", "ts", "tsx", "mdx"],
	transpilePackages: [
		"@repo/icons",
		"@repo/ui",
		"@repo/db",
		"@repo/comm",
		"@repo/config",
		"@repo/auth",
	],
	webpack(config: any) {
		config.module.rules.push({
			test: /\.svg$/i,
			use: ["@svgr/webpack"],
		});

		return config;
	},
	outputFileTracingIncludes: {
		"/**/*": ["./app/(docs)/docs/**/*.mdx", "./app/(blog)/blog/**/*.mdx"],
	},
};

export default withSentryConfig(withSearch(withMDX(nextConfig)), {
	// For all available options, see:
	// https://github.com/getsentry/sentry-webpack-plugin#options

	org: "kayle-inc",
	project: "platform",

	// Only print logs for uploading source maps in CI
	silent: !process.env.CI,

	// For all available options, see:
	// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

	// Upload a larger set of source maps for prettier stack traces (increases build time)
	widenClientFileUpload: true,

	// Automatically annotate React components to show their full name in breadcrumbs and session replay
	reactComponentAnnotation: {
		enabled: true,
	},

	// Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
	// This can increase your server load as well as your hosting bill.
	// Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
	// side errors will fail.
	tunnelRoute: "/monitoring",

	// Hides source maps from generated client bundles
	hideSourceMaps: true,

	// Automatically tree-shake Sentry logger statements to reduce bundle size
	disableLogger: true,

	// Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
	// See the following for more information:
	// https://docs.sentry.io/product/crons/
	// https://vercel.com/docs/cron-jobs
	automaticVercelMonitors: true,
});
