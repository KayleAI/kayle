export const hate = ["hate", "hate-racism", "hate-sexism", "hate-religion"];

export const violence = [
	"violence",
	"violence-threats",
	"violence-extreme",
	"extremism",
	"terrorism",
];

export const suicide = ["self-harm", "suicide", "self-harm-glorification"];

export const pii = [
	"pii-sensitive",
	"pii-financial",
	"pii-health",
	"pii-contact",
	"pii-location",
];

export const profanity = ["profanity", "profanity-slurs"];

export const sexual = [
	"sexual",
	"sexual-nudity",
	"sexual-explicit",
	"sexual-violence",
	"sexual-suggestive",
	"child-exploitation",
	"csam",
];

export const harmful = ["bullying", "harassment", "stalking", "doxxing"];

export const deceptive = [
	"misinformation-health",
	"misinformation-political",
	"misinformation-science",
	"fraud",
	"scams",
];

export const illegal = [
	"illegal-drugs",
	"illegal-weapons",
	"illegal-gambling",
	"trafficking",
	"piracy",
];

export const other = ["spam", "impersonation"];

export const violations = [
	...hate,
	...violence,
	...suicide,
	...pii,
	...profanity,
	...sexual,
	...harmful,
	...deceptive,
	...illegal,
	...other,
] as const;
