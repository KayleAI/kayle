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
import { useCallback, useEffect, useState } from "react";

// Router
import { useRouter } from "next/navigation";
import { useOrg } from "@/utils/auth/OrgProvider";
import { createApiKey } from "@/actions/keys/create-api-key";

// Hooks
import { useClipboard } from "@mantine/hooks";
import { toast } from "sonner";
import { CopyIcon } from "@repo/icons/ui/index";

const KeyNameField = ({
	keyName,
	changeKeyName,
}: { keyName: string; changeKeyName: (e: any) => void }) => (
	<Field>
		<Label htmlFor="key_name">Key Name</Label>
		<Description>Use a descriptive name to identify this key.</Description>
		<Input
			name="key_name"
			id="key_name"
			value={keyName}
			onChange={changeKeyName}
		/>
	</Field>
);

const EnvironmentField = ({
	testMode,
	changeTestMode,
}: { testMode: string; changeTestMode: (e: any) => void }) => (
	<Field>
		<Label htmlFor="environment">Key Environment</Label>
		<Description>
			Note that you will be charged for usage in production mode.
		</Description>
		<Listbox
			name="environment"
			defaultValue={testMode}
			onChange={changeTestMode}
		>
			<ListboxOption value="live">
				<ListboxLabel>Production Mode</ListboxLabel>
			</ListboxOption>
			<ListboxOption value="test">
				<ListboxLabel>Test Mode</ListboxLabel>
			</ListboxOption>
		</Listbox>
	</Field>
);

function CreateKeyForm({
	keyName,
	testMode,
	changeKeyName,
	changeTestMode,
}: {
	readonly keyName: string;
	readonly testMode: string;
	readonly changeKeyName: (e: any) => void;
	readonly changeTestMode: (e: any) => void;
}) {
	return (
		<Fieldset>
			<FieldGroup>
				<KeyNameField keyName={keyName} changeKeyName={changeKeyName} />
				<EnvironmentField testMode={testMode} changeTestMode={changeTestMode} />
			</FieldGroup>
		</Fieldset>
	);
}

export default function CreateKeyDialog() {
	const orgs = useOrg();

	const clipboard = useClipboard({ timeout: 2000 });
	const envClipboard = useClipboard({ timeout: 2000 });

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

	const [keyCreatedSecret, setKeyCreatedSecret] = useState<string>("false");
	const [hiddenKey, setHiddenKey] = useState<string>("");

	const [isKeyRevealed, setIsKeyRevealed] = useState(false);

	const toggleKeyVisibility = useCallback(() => {
		setIsKeyRevealed(!isKeyRevealed);
	}, [isKeyRevealed]);

	useEffect(() => {
		if (keyCreatedSecret !== "false") {
			setHiddenKey(keyCreatedSecret.replace(/./g, "•"));
		}
	}, [keyCreatedSecret]);

	const router = useRouter();

	const copyToClipboard = useCallback(() => {
		clipboard.copy(keyCreatedSecret);
		toast.info("Copied to clipboard");
	}, [clipboard, keyCreatedSecret]);

	const copyEnvToClipboard = useCallback(() => {
		envClipboard.copy(`KAYLE_API_KEY=${keyCreatedSecret}`);
		toast.info("Copied to clipboard");
	}, [envClipboard, keyCreatedSecret]);

	const openCreateKeyDialog = useCallback(() => setIsOpen(true), [setIsOpen]);

	const handleCreateKeyClose = useCallback(() => {
		setIsOpen(null);
		setTimeout(() => {
			setKeyName("my-new-api-key");
			setTestMode("test");
			setKeyCreatedSecret("false");
		}, 200);
	}, [setIsOpen, setKeyName, setTestMode]);

	const changeKeyName = useCallback(
		(e: any) => setKeyName(e.target.value),
		[setKeyName],
	);

	const changeTestMode = useCallback(
		(e: any) => setTestMode(e.target.value),
		[setTestMode],
	);

	const handleCreateKey = useCallback(async () => {
		if (keyCreatedSecret === "false") {
			if (!org_id) {
				toast.error("No organisation selected.");
				return;
			}

			const { data: keyData, error: keyError } = await createApiKey({
				name: keyName,
				testMode: testMode === "test",
				orgId: org_id,
			});

			if (keyError) {
				toast.error(keyError);
				return;
			}

			if (keyData?.keys) {
				setKeyCreatedSecret(keyData.keys.key);
				router.refresh();
			} else {
				toast.error("We couldn’t create your key. Please try again.");
			}

			return;
		}
		handleCreateKeyClose();
	}, [
		keyCreatedSecret,
		org_id,
		router,
		testMode,
		keyName,
		handleCreateKeyClose,
	]);

	return (
		<>
			<Button type="button" onClick={openCreateKeyDialog}>
				Create API Key
			</Button>
			<Dialog open={isOpen} onClose={handleCreateKeyClose} size="2xl">
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
						<CreateKeyForm
							keyName={keyName}
							testMode={testMode}
							changeKeyName={changeKeyName}
							changeTestMode={changeTestMode}
						/>
					) : (
						<FieldGroup>
							<Field>
								<Label htmlFor="secret_key">Secret Key</Label>
								<Description>
									This is your secret key. Store it securely.
								</Description>
								<div className="relative flex items-center gap-2 mt-2">
									<Input
										name="secret_key"
										value={isKeyRevealed ? keyCreatedSecret : hiddenKey}
										disabled
										id="secret_key"
									/>
									<Button
										outline
										onClick={toggleKeyVisibility}
										className="h-11 sm:h-9"
									>
										{isKeyRevealed ? "Hide" : "Reveal"}
									</Button>
									<Button
										outline
										onClick={copyToClipboard}
										className="h-11 sm:h-9"
									>
										<CopyIcon
											className={clsx(
												"size-5 sm:size-4",
												clipboard.copied &&
													"text-green-500 dark:text-green-300",
											)}
										/>
									</Button>
								</div>
							</Field>
							<Field>
								<Label htmlFor="env_key">Paste this into your .env file</Label>
								<Description>
									You should never store this key in your code.
								</Description>
								<div className="relative flex items-center gap-2 mt-2">
									<Input
										name="env_key"
										value={`KAYLE_API_KEY=${isKeyRevealed ? keyCreatedSecret : hiddenKey}`}
										disabled
										id="env_key"
									/>
									<Button
										outline
										onClick={copyEnvToClipboard}
										className="h-11 sm:h-9"
									>
										<CopyIcon
											className={clsx(
												"size-5 sm:size-4",
												envClipboard.copied &&
													"text-green-500 dark:text-green-300",
											)}
										/>
									</Button>
								</div>
							</Field>
						</FieldGroup>
					)}
				</DialogBody>
				<DialogActions>
					{keyCreatedSecret === "false" && (
						<Button plain onClick={handleCreateKeyClose}>
							Cancel
						</Button>
					)}
					<Button onClick={handleCreateKey}>
						{keyCreatedSecret === "false"
							? "Create Key"
							: "I’ve saved my secret key!"}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
