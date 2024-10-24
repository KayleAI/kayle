import { ImageResponse } from "next/og";

export const runtime = "edge";

const getMonaSansRegular = async () => {
	const response = await fetch(
		new URL("@/fonts/MonaSans-Regular.ttf", import.meta.url),
	);
	const monaSans = await response.arrayBuffer();

	return monaSans;
};

const getMonaSansSemiBold = async () => {
	const response = await fetch(
		new URL("@/fonts/MonaSans-SemiBold.ttf", import.meta.url),
	);
	const monaSans = await response.arrayBuffer();

	return monaSans;
};

/**
 * @name Docs OG Template
 */
export async function GET() {
	return new ImageResponse(
		<div // NOSONAR
			tw="flex flex-col items-center justify-center w-full h-full bg-zinc-50 text-zinc-900 p-4 text-[90px]"
			style={{ fontFamily: "Mona Sans Regular" }}
		>
			<div // NOSONAR
				tw=""
				style={{ fontFamily: "Mona Sans SemiBold" }}
			>
				Kayle
			</div>
			<div // NOSONAR
				tw="mt-4 text-[32px] text-zinc-700 text-center"
			>
				Content Moderation made Simple.
			</div>
			<div // NOSONAR
				tw="mt-8 bg-emerald-400 rounded-full px-20 py-8 text-[40px] text-black shadow-2xl border-[4px] border-emerald-500 text-black/90"
			>
				Get started now &rarr;
			</div>
		</div>,
		{
			width: 1200,
			height: 630,
			headers: {
				"Cache-Control": "public, max-age=3600, immutable",
			},
			fonts: [
				{
					name: "Mona Sans",
					data: await getMonaSansRegular(),
				},
				{
					name: "Mona Sans SemiBold",
					data: await getMonaSansSemiBold(),
				},
			],
		},
	);
}
