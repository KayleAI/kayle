"use client";

// UI
import { Avatar } from "@repo/ui/avatar";
import {
	Dropdown,
	DropdownButton,
	DropdownItem,
	DropdownLabel,
	DropdownMenu,
	DropdownDivider,
} from "@repo/ui/dropdown";
import {
	Navbar,
	NavbarItem,
	NavbarSection,
	NavbarSpacer,
} from "@repo/ui/navbar";
import {
	InboxIcon,
	EnvelopeIcon,
	HouseGrinIcon,
	LeaveIcon,
	MagnifierIcon,
	SettingsIcon,
	SunIcon,
	MoonIcon,
	ChevronDownIcon,
	PlusIcon,
} from "@repo/icons/ui/index";

// Auth
import { signout } from "@/utils/auth/signout";
import { useAuth } from "@/utils/auth/AuthProvider";
import { useOrg } from "@/utils/auth/OrgProvider";

// Functions
import { useTheme } from "next-themes";
import { toggleSearch } from "../Search";
import { useRouter } from "next/navigation";
import React from "react";

export default function ConsoleNavbar(): JSX.Element {
	const { setTheme, resolvedTheme } = useTheme();
	const router = useRouter();
	const user = useAuth();
	const orgs = useOrg();

	const toggleTheme = React.useCallback(() => {
		if (resolvedTheme) {
			setTheme(resolvedTheme === "dark" ? "light" : "dark");
		}
	}, [resolvedTheme, setTheme]);

	const handleSignout = React.useCallback(async () => {
		await signout();

		router.push("/sign-out");
	},[router]);

	const handleOrgSwitch = React.useCallback((orgId: string) => {
		orgs?.switchOrg(orgId);
	}, [orgs]);

	return (
		<Navbar>
			<Dropdown>
				{orgs?.activeOrg ? (
					<DropdownButton as={NavbarItem}>
						<Avatar
							src={orgs?.activeOrg?.logo}
							initials={
								!orgs?.activeOrg?.logo
									? orgs?.activeOrg?.name[0] || "K"
									: undefined
							}
							className="text-emerald-500 bg-zinc-100 dark:bg-zinc-900"
						/>
						<ChevronDownIcon data-slot="icon" />
					</DropdownButton>
				) : (
					<DropdownButton as={NavbarItem}>
						<Avatar src="/favicon.ico" />
						<ChevronDownIcon data-slot="icon" />
					</DropdownButton>
				)}
				<DropdownMenu className="min-w-64" anchor="bottom start">
					{orgs?.activeOrg ? (
						<DropdownItem href={`/org/${orgs?.activeOrg?.slug}/settings`}>
							<SettingsIcon data-slot="icon" />
							<DropdownLabel>Organisation Settings</DropdownLabel>
						</DropdownItem>
					) : (
						<DropdownItem href="/settings">
							<SettingsIcon data-slot="icon" />
							<DropdownLabel>Settings</DropdownLabel>
						</DropdownItem>
					)}
					<DropdownDivider />
					{orgs?.memberOrgs?.map((org) => (
						<DropdownItem key={org.id} onClick={() => handleOrgSwitch(org.id)}>
							<Avatar
								slot="icon"
								src={org.logo}
								initials={!org.logo ? org.name[0] || "K" : undefined}
								className="text-emerald-500 bg-zinc-100 dark:bg-zinc-900"
							/>
							<DropdownLabel>{org.name}</DropdownLabel>
						</DropdownItem>
					))}
					{orgs?.memberOrgs?.length !== 0 && <DropdownDivider />}
					<DropdownItem href="/org/create">
						<PlusIcon data-slot="icon" />
						<DropdownLabel>Create new organisation</DropdownLabel>
					</DropdownItem>
				</DropdownMenu>
			</Dropdown>
			<NavbarSpacer />
			<NavbarSection>
				<NavbarItem aria-label="Search" onClick={toggleSearch}>
					<MagnifierIcon data-slot="icon" />
				</NavbarItem>
				<NavbarItem href="/inbox" aria-label="Inbox">
					<InboxIcon data-slot="icon" />
				</NavbarItem>
				<Dropdown>
					<DropdownButton as={NavbarItem}>
						<Avatar
							src={user?.data?.avatar || undefined}
							initials={
								(!user?.data?.avatar &&
									(user?.data?.name
										? user.data.name
												.split(" ")
												.map((name) => name[0])
												.join("")
										: "ME")) ||
								undefined
							}
							square
							alt=""
						/>
					</DropdownButton>
					<DropdownMenu className="min-w-64" anchor="bottom end">
						<DropdownItem
							href={user?.authStatus === "authenticated" ? "/home" : "/"}
						>
							<HouseGrinIcon data-slot="icon" />
							<DropdownLabel>Visit Homepage</DropdownLabel>
						</DropdownItem>
						<DropdownItem href="/settings">
							<SettingsIcon data-slot="icon" />
							<DropdownLabel>Account Settings</DropdownLabel>
						</DropdownItem>
						<DropdownDivider />
						<DropdownItem href="/feedback">
							<EnvelopeIcon data-slot="icon" />
							<DropdownLabel>Send Feedback</DropdownLabel>
						</DropdownItem>
						<DropdownItem onClick={toggleTheme}>
							{" "}
							{resolvedTheme === "dark" ? (
								<SunIcon data-slot="icon" />
							) : (
								<MoonIcon data-slot="icon" />
							)}
							<DropdownLabel>Toggle Theme</DropdownLabel>
						</DropdownItem>
						<DropdownDivider />
						<DropdownItem onClick={handleSignout}>
							{" "}
							<LeaveIcon data-slot="icon" />
							<DropdownLabel>Sign out</DropdownLabel>
						</DropdownItem>
					</DropdownMenu>
				</Dropdown>
			</NavbarSection>
		</Navbar>
	);
}
