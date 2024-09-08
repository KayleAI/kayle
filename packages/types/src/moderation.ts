export interface ModerationResult {
	severity?: number;
	violations?: string[];
	pii?: string[];
}

export type ModerationType = "text" | "audio" | "image" | "video" | "document";
