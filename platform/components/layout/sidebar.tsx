"use client";

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
	ArrowRightStartOnRectangleIcon,
	ChevronDownIcon,
	ChevronUpIcon,
	Cog8ToothIcon,
	EnvelopeIcon,
	LightBulbIcon,
	MoonIcon,
	PlusIcon,
} from "@heroicons/react/16/solid";
import {
	CodeBracketSquareIcon,
	HomeIcon,
	InboxIcon,
	MagnifyingGlassIcon,
	QuestionMarkCircleIcon,
	SparklesIcon,
} from "@heroicons/react/20/solid";
import { useTheme } from "next-themes";
import { signout } from "utils/auth/signout";
import { toggleSearch } from "../Search";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "utils/auth/AuthProvider";
import { useOrg } from "utils/auth/OrgProvider";

export default function ConsoleSidebar(): JSX.Element {
	const { setTheme, resolvedTheme } = useTheme();
	const pathname = usePathname();
	const router = useRouter();
	const user = useAuth();
	const orgs = useOrg();

	const toggleTheme = () => {
		if (resolvedTheme) {
			setTheme(resolvedTheme === "dark" ? "light" : "dark");
		}
	};

	const handleSignout = async () => {
		await signout();

		router.push("/sign-out");
	};

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
							<ChevronDownIcon />
						</DropdownButton>
					) : (
						<DropdownButton as={SidebarItem} className="mb-2.5">
							<Avatar src="/favicon.ico" />
							<SidebarLabel>Select organisation</SidebarLabel>
							<ChevronDownIcon />
						</DropdownButton>
					)}
					<DropdownMenu className="min-w-64" anchor="bottom start">
						{orgs?.activeOrg ? (
							<DropdownItem href={`/org/${orgs?.activeOrg?.slug}/settings`}>
								<Cog8ToothIcon />
								<DropdownLabel>Organisation Settings</DropdownLabel>
							</DropdownItem>
						) : (
							<DropdownItem href="/settings">
								<Cog8ToothIcon />
								<DropdownLabel>Settings</DropdownLabel>
							</DropdownItem>
						)}
						<DropdownDivider />
						{orgs?.memberOrgs?.map((org) => (
							<DropdownItem key={org.id} onClick={() => orgs.switchOrg(org.id)}>
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
							<PlusIcon />
							<DropdownLabel>Create new organisation</DropdownLabel>
						</DropdownItem>
					</DropdownMenu>
				</Dropdown>
				<SidebarSection>
					<SidebarItem onClick={toggleSearch}>
						<MagnifyingGlassIcon />
						<SidebarLabel>Search</SidebarLabel>
					</SidebarItem>
					<SidebarItem href="/inbox">
						<InboxIcon />
						<SidebarLabel>Inbox</SidebarLabel>
					</SidebarItem>
				</SidebarSection>
			</SidebarHeader>
			<SidebarBody>
				<SidebarSection>
					<SidebarItem
						href={user?.authStatus === "authenticated" ? "/" : "/dashboard"}
						current={pathname === "/" || pathname === "/dashboard"}
					>
						<HomeIcon />
						<SidebarLabel>Dashboard</SidebarLabel>
					</SidebarItem>
					{["Owner", "Admin", "Developer"].includes(orgs?.activeOrg?.role ?? "") && (
						<SidebarItem
							href="/developers"
							current={pathname === "/developers"}
						>
							<CodeBracketSquareIcon />
							<SidebarLabel>Developers</SidebarLabel>
						</SidebarItem>
					)}
				</SidebarSection>
				<SidebarSpacer />
				<SidebarSection>
					<SidebarItem href="/support">
						<QuestionMarkCircleIcon />
						<SidebarLabel>Support</SidebarLabel>
					</SidebarItem>
					<SidebarItem href="/changelog">
						<SparklesIcon />
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
						<ChevronUpIcon />
					</DropdownButton>
					<DropdownMenu className="min-w-64" anchor="top start">
						<DropdownItem
							href={user?.authStatus === "authenticated" ? "/home" : "/"}
						>
							<HomeIcon />
							<DropdownLabel>Visit homepage</DropdownLabel>
						</DropdownItem>
						<DropdownItem href="/settings">
							<Cog8ToothIcon />
							<DropdownLabel>Account Settings</DropdownLabel>
						</DropdownItem>
						<DropdownDivider />
						<DropdownItem href="/feedback">
							<EnvelopeIcon />
							<DropdownLabel>Send feedback</DropdownLabel>
						</DropdownItem>
						<DropdownItem onClick={toggleTheme}>
							{resolvedTheme === "dark" ? <LightBulbIcon /> : <MoonIcon />}
							<DropdownLabel>Toggle Theme</DropdownLabel>
						</DropdownItem>
						<DropdownDivider />
						<DropdownItem onClick={handleSignout}>
							<ArrowRightStartOnRectangleIcon />
							<DropdownLabel>Sign out</DropdownLabel>
						</DropdownItem>
					</DropdownMenu>
				</Dropdown>
			</SidebarFooter>
		</Sidebar>
	);
}
