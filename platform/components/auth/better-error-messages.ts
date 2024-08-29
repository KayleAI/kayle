export const betterErrorMessages = {
	"User already registered": "You already have an account. Please sign in.",
	"Invalid email or password":
		"Your email or password is incorrect. Please try again.",
	"Password should be at least 8 characters.":
		"Your password must be at least 6 characters long.",
	"Email rate limit exceeded":
		"You have submitted too many requests in a short period of time. Please try again later.",
	"captcha protection: request disallowed (timeout-or-duplicate)":
		"For security reasons, we have blocked your request. Refresh the page and try again.",
};

export type BetterErrorMessagesType = typeof betterErrorMessages;
