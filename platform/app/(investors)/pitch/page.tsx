// Metadata
import type { Metadata } from "next";
import { GenerateSEO } from "@/components/marketing/GenerateSEO";

// Components
import PitchSlides from "./page.client";

export const metadata: Metadata = GenerateSEO({
	title: "Pitch Deck",
	description: "Investors allow us to continue building Kayle.",
	url: "https://kayle.ai/pitch",
});

export default function PitchDeck() {
	return <PitchSlides />;
}
