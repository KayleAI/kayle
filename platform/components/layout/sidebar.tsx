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
	Sidebar,
	SidebarItem,
	SidebarLabel,
	SidebarBody,
	SidebarFooter,
	SidebarHeader,
	SidebarSection,
	SidebarSpacer,
} from "@repo/ui/sidebar";
import {
	InboxIcon,
	ArchiveIcon,
	CodeIcon,
	EnvelopeIcon,
	HandShieldIcon,
	HouseGrinIcon,
	LeaveIcon,
	MagnifierIcon,
	ScaleIcon,
	SettingsIcon,
	SunIcon,
	MoonIcon,
	ChevronDownIcon,
	ChevronUpIcon,
	QuestionMarkCircleIcon,
	PlusIcon,
	SparklesIcon,
} from "@repo/icons/ui/index";

// Auth
import { signout } from "@/utils/auth/signout";
import { useAuth } from "@/utils/auth/AuthProvider";
import { useOrg } from "@/utils/auth/OrgProvider";

// Functions
import { useTheme } from "next-themes";
import { toggleSearch } from "../Search";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

export default function ConsoleSidebar(): JSX.Element {
	const { setTheme, resolvedTheme } = useTheme();
	const pathname = usePathname();
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
	}, [router]);

	const handleOrgSwitch = React.useCallback((orgId: string) => {
		orgs?.switchOrg(orgId);
	}, [orgs]);

	return (
		<Sidebar>
			<SidebarHeader>
				<Dropdown>
					{orgs?.activeOrg ? (
						<DropdownButton as={SidebarItem} className="mb-2.5">
							<Avatar
								src={orgs?.activeOrg?.logo}
								initials={
									!orgs?.activeOrg?.logo
										? orgs?.activeOrg?.name[0] || "K"
										: undefined
								}
								className="text-emerald-500 bg-zinc-100 dark:bg-zinc-900"
							/>
							<SidebarLabel>{orgs?.activeOrg?.name}</SidebarLabel>
							<ChevronDownIcon data-slot="icon" />
						</DropdownButton>
					) : (
						<DropdownButton as={SidebarItem} className="mb-2.5">
							<Avatar src="/favicon.ico" />
							<SidebarLabel>Select organisation</SidebarLabel>
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
							<DropdownItem
								key={org.id}
								onClick={() => handleOrgSwitch(org.id)}
							>
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
				<SidebarSection>
					<SidebarItem onClick={toggleSearch}>
						<MagnifierIcon data-slot="icon" />
						<SidebarLabel>Search</SidebarLabel>
					</SidebarItem>
					<SidebarItem href="/inbox">
						<InboxIcon data-slot="icon" />
						<SidebarLabel>Inbox</SidebarLabel>
					</SidebarItem>
				</SidebarSection>
			</SidebarHeader>
			<SidebarBody>
				<SidebarSection>
					<SidebarItem
						href={"/"}
						current={pathname === "/" || pathname === "/dashboard"}
					>
						<HouseGrinIcon data-slot="icon" />
						<SidebarLabel>Dashboard</SidebarLabel>
					</SidebarItem>
					<SidebarItem href={"/"} current={pathname === "/chat"}>
						<ScaleIcon data-slot="icon" />
						<SidebarLabel>Policies</SidebarLabel>
					</SidebarItem>
					<SidebarItem href={"/"} current={pathname === "/chat"}>
						<HandShieldIcon data-slot="icon" />
						<SidebarLabel>Moderation</SidebarLabel>
					</SidebarItem>
					<SidebarItem href={"/"} current={pathname === "/chat"}>
						<ArchiveIcon data-slot="icon" />
						<SidebarLabel>Archive</SidebarLabel>
					</SidebarItem>
					{["Owner", "Admin", "Developer"].includes(
						orgs?.activeOrg?.role ?? "",
					) && (
						<SidebarItem
							href="/developers"
							current={pathname === "/developers"}
						>
							<CodeIcon data-slot="icon" />
							<SidebarLabel>Developers</SidebarLabel>
						</SidebarItem>
					)}
				</SidebarSection>
				<SidebarSpacer />
				<SidebarSection>
					<SidebarItem href="/support">
						<QuestionMarkCircleIcon data-slot="icon" />
						<SidebarLabel>Support</SidebarLabel>
					</SidebarItem>
					<SidebarItem href="/changelog">
						<SparklesIcon data-slot="icon" />
						<SidebarLabel>Changelog</SidebarLabel>
					</SidebarItem>
				</SidebarSection>
			</SidebarBody>
			<SidebarFooter>
				<Dropdown>
					<DropdownButton as={SidebarItem}>
						<span className="flex min-w-0 items-center gap-3">
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
								className="size-10"
								square
								alt=""
							/>
							<span className="min-w-0">
								<span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">
									{user?.data?.name || "Someone"}
								</span>
								<span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
									{user?.data?.email || "guest@kayle.ai"}
								</span>
							</span>
						</span>
						<ChevronUpIcon data-slot="icon" />
					</DropdownButton>
					<DropdownMenu className="min-w-64" anchor="top start">
						<DropdownItem
							href={user?.authStatus === "authenticated" ? "/home" : "/"}
						>
							<HouseGrinIcon data-slot="icon" />
							<DropdownLabel>Visit homepage</DropdownLabel>
						</DropdownItem>
						<DropdownItem href="/settings">
							<SettingsIcon data-slot="icon" />
							<DropdownLabel>Account Settings</DropdownLabel>
						</DropdownItem>
						<DropdownDivider />
						<DropdownItem href="/feedback">
							<EnvelopeIcon data-slot="icon" />
							<DropdownLabel>Send feedback</DropdownLabel>
						</DropdownItem>
						<DropdownItem onClick={toggleTheme}>
							{" "}
							{/* skipcq: JS-0417 - don't see any issue */}
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
							{/* skipcq: JS-0417 - don't see any issue */}
							<LeaveIcon data-slot="icon" />
							<DropdownLabel>Sign out</DropdownLabel>
						</DropdownItem>
					</DropdownMenu>
				</Dropdown>
			</SidebarFooter>
		</Sidebar>
	);
}
