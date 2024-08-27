export const IS_PRODUCTION = process.env.NODE_ENV === "production";

export const NEXT_PUBLIC_APP_URL = IS_PRODUCTION
	? "https://kayle.ai"
	: "http://localhost:3000";
