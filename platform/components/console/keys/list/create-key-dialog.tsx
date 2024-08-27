"use client";

// UI
import { Button } from "@repo/ui/button";
import {
	Dialog,
	DialogActions,
	DialogBody,
	DialogDescription,
	DialogTitle,
} from "@repo/ui/dialog";
import {
	Description,
	Field,
	FieldGroup,
	Fieldset,
	Label,
} from "@repo/ui/fieldset";
import { Input } from "@repo/ui/input";
import { Listbox, ListboxLabel, ListboxOption } from "@repo/ui/listbox";
import clsx from "clsx";

// State
import { useQueryState, parseAsBoolean } from "nuqs";
import { useState } from "react";

// Router
import { useRouter } from "next/navigation";
import { useOrg } from "@/utils/auth/OrgProvider";
import { createApiKey } from "@/actions/keys/create-api-key";

// Hooks
import { useClipboard } from "@mantine/hooks";
import { toast } from "sonner";
import { CopyIcon } from "@repo/icons/ui/index";

export default function CreateKeyDialog() {
	const orgs = useOrg();

	const clipboard = useClipboard({ timeout: 500 });

	const [isOpen, setIsOpen] = useQueryState(
		"create",
		parseAsBoolean.withDefault(false),
	);

	const org_id = orgs?.activeOrg?.id;
	const [testMode, setTestMode] = useQueryState("environment", {
		defaultValue: "test",
	});
	const [keyName, setKeyName] = useQueryState("name", {
		defaultValue: "my-new-api-key",
	});

	const [keyCreatedSecret, setKeyCreatedSecret] = useState<string>("false"); // This will be a string when the key is created and the key secret will be stored here

	const router = useRouter();

	const handleClose = () => {
		setIsOpen(null);
		setTimeout(() => {
			setKeyName("my-new-api-key");
			setTestMode("test");
			setKeyCreatedSecret("false");
		}, 200);
	};

	const copyToClipboard = () => {
		clipboard.copy(keyCreatedSecret);
		toast.info("Copied to clipboard");
	};

	return (
		<>
			<Button type="button" onClick={() => setIsOpen(true)}>
				Create API Key
			</Button>
			<Dialog open={isOpen} onClose={handleClose} size="2xl">
				<DialogTitle>
					{keyCreatedSecret === "false" ? "Create API Key" : "API Key Created!"}
				</DialogTitle>
				<DialogDescription>
					{keyCreatedSecret === "false"
						? "Create a new API key to access the Kayle Engine."
						: "You will not be able to see this key again."}
				</DialogDescription>
				<DialogBody>
					{keyCreatedSecret === "false" ? (
						<Fieldset>
							<FieldGroup>
								<Field>
									<Label htmlFor="key_name">Key Name</Label>
									<Description>
										Use a descriptive name to identify this key.
									</Description>
									<Input
										name="key_name"
										id="key_name"
										value={keyName}
										onChange={(e) => {
											setKeyName(e.target.value);
										}}
									/>
								</Field>
								<Field>
									<Label htmlFor="environment">Key Environment</Label>
									<Description>
										Note that you will be charged for usage in production mode.
									</Description>
									<Listbox
										name="environment"
										defaultValue={testMode}
										onChange={(e) => {
											setTestMode(e);
										}}
									>
										<ListboxOption value="live">
											<ListboxLabel>Production Mode</ListboxLabel>
										</ListboxOption>
										<ListboxOption value="test">
											<ListboxLabel>Test Mode</ListboxLabel>
										</ListboxOption>
									</Listbox>
								</Field>
							</FieldGroup>
						</Fieldset>
					) : (
						<Field>
							<Label htmlFor="secret_key">Secret Key</Label>
							<Description>
								This is your secret key. Store it securely.
							</Description>
							<div className="relative flex items-center gap-2 mt-2">
								<Input
									name="secret_key"
									defaultValue={keyCreatedSecret}
									disabled
									id="secret_key"
								/>
								<Button
									outline
									onClick={copyToClipboard}
									className="h-11 sm:h-9"
								>
									<CopyIcon
										className={clsx(
											"size-5 sm:size-4",
											clipboard.copied && "text-green-500 dark:text-green-300",
										)}
									/>
								</Button>
							</div>
						</Field>
					)}
				</DialogBody>
				<DialogActions>
					{keyCreatedSecret === "false" && (
						<Button plain onClick={handleClose}>
							Cancel
						</Button>
					)}
					<Button
						onClick={async () => {
							if (keyCreatedSecret === "false") {
								if (!org_id) {
									alert("No organization.");
									return;
								}

								const { data: keyData, error: keyError } = await createApiKey({
									name: keyName,
									testMode: testMode === "test",
									orgId: org_id,
								});

								if (keyError) {
									alert(keyError);
									return;
								}

								if (keyData?.keys) {
									setKeyCreatedSecret(keyData.keys.key);
									router.refresh();
								} else {
									alert("Failed to create key.");
								}

								return;
							}
							handleClose();
						}}
					>
						{keyCreatedSecret === "false"
							? "Create Key"
							: "I’ve saved my secret key!"}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
