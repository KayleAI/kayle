"use client";

import { Avatar } from '@repo/ui/avatar'
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
  DropdownDivider,
} from '@repo/ui/dropdown'
import {
  Sidebar,
  SidebarItem,
  SidebarLabel,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarSection,
  SidebarSpacer,
} from '@repo/ui/sidebar'
import {
  ArrowRightStartOnRectangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Cog8ToothIcon,
  EnvelopeIcon,
  LightBulbIcon,
  MoonIcon,
  PlusIcon
} from '@heroicons/react/16/solid'
import {
  Cog6ToothIcon,
  HomeIcon,
  InboxIcon,
  MagnifyingGlassIcon,
  MegaphoneIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
  Square2StackIcon,
  TicketIcon,
} from '@heroicons/react/20/solid'
import { useTheme } from 'next-themes';
import { signout } from '@/utils/auth/auth';
import { toggleSearch } from './Search';
import { usePathname } from 'next/navigation';

export default function ConsoleSidebar(): JSX.Element {
  const { setTheme, resolvedTheme } = useTheme();
  const pathname = usePathname();

  const toggleTheme = () => {
    if (resolvedTheme) {
      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    }
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <Dropdown>
          <DropdownButton as={SidebarItem} className="mb-2.5">
            <Avatar initials="KA" className="bg-green-500 text-white" />
            <SidebarLabel>Kayle LTD</SidebarLabel>
            <ChevronDownIcon />
          </DropdownButton>
          <DropdownMenu className="min-w-64" anchor="bottom start">
            <DropdownItem href="/teams/1/settings">
              <Cog8ToothIcon />
              <DropdownLabel>Settings</DropdownLabel>
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem href="/teams/1">
              <Avatar slot="icon" initials="KA" className="bg-green-500 text-white" />
              <DropdownLabel>Kayle LTD</DropdownLabel>
            </DropdownItem>
            <DropdownItem href="/">
              <Avatar slot="icon" initials="ME" className="bg-blue-500 text-white" />
              <DropdownLabel>
                Personal
              </DropdownLabel>
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem href="/org/create">
              <PlusIcon />
              <DropdownLabel>
                Create new organisation
              </DropdownLabel>
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
          <SidebarItem href="/" current={pathname === '/'}>
            <HomeIcon />
            <SidebarLabel>
              Dashboard
            </SidebarLabel>
          </SidebarItem>
          <SidebarItem href="/review" current={pathname === '/review'}>
            <Square2StackIcon />
            <SidebarLabel>
              Review
            </SidebarLabel>
          </SidebarItem>
          <SidebarItem href="/settings" current={pathname === '/settings'}>
            <Cog6ToothIcon />
            <SidebarLabel>Settings</SidebarLabel>
          </SidebarItem>
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
              <Avatar src="https://arsenstorm.com/avatar.jpg" className="size-10" square alt="" />
              <span className="min-w-0">
                <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">
                  Arsen
                </span>
                <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
                  arsen@kayle.ai
                </span>
              </span>
            </span>
            <ChevronUpIcon />
          </DropdownButton>
          <DropdownMenu className="min-w-64" anchor="top start">
            <DropdownItem href="/home">
              <HomeIcon />
              <DropdownLabel>
                Visit homepage
              </DropdownLabel>
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
            <DropdownItem
              onClick={toggleTheme}
            >
              {resolvedTheme === 'dark' ? <LightBulbIcon /> : <MoonIcon />}
              <DropdownLabel>
                Toggle Theme
              </DropdownLabel>
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem onClick={signout}>
              <ArrowRightStartOnRectangleIcon />
              <DropdownLabel>Sign out</DropdownLabel>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </SidebarFooter>
    </Sidebar>
  );
}