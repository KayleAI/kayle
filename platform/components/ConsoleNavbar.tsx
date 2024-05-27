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
import { Navbar, NavbarItem, NavbarLabel, NavbarSection, NavbarSpacer } from '@repo/ui/navbar'
import {
  ArrowRightStartOnRectangleIcon,
  ChevronDownIcon,
  Cog8ToothIcon,
  EnvelopeIcon,
  HomeIcon,
  LightBulbIcon,
  MoonIcon,
  PlusIcon
} from '@heroicons/react/16/solid'
import { InboxIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { useTheme } from 'next-themes';
import { signout } from '@/utils/auth/signout';
import { toggleSearch } from './Search';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/utils/auth/AuthProvider';
import { switchOrg, useOrg } from '@/utils/auth/OrgProvider';

export default function ConsoleNavbar(): JSX.Element {
  const { setTheme, resolvedTheme } = useTheme();
  const router = useRouter();
  const user = useAuth();
  const org = useOrg();

  const toggleTheme = () => {
    if (resolvedTheme) {
      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    }
  }

  const handleSignout = async () => {
    await signout();

    router.push("/portal");
  }

  return (
    <Navbar>
      <Dropdown>
        {org?.activeOrg
          ? (
            <DropdownButton as={NavbarItem}>
              <Avatar
                src={org?.activeOrg?.logo}
                initials={!org?.activeOrg?.logo ? (org?.activeOrg?.name[0] || 'K') : undefined}
                className="text-emerald-500 bg-zinc-100 dark:bg-zinc-900"
              />
              <NavbarLabel>
                {org?.activeOrg?.name}
              </NavbarLabel>
              <ChevronDownIcon />
            </DropdownButton>
          ) : (
            <DropdownButton as={NavbarItem}>
              <Avatar src="/favicon.ico" />
              <NavbarLabel>
                Select organisation
              </NavbarLabel>
              <ChevronDownIcon />
            </DropdownButton>
          )
        }
        <DropdownMenu className="min-w-64" anchor="bottom start">
          {org?.activeOrg
            ? (
              <DropdownItem href={`/org/${org?.activeOrg?.slug}/settings`}>
                <Cog8ToothIcon />
                <DropdownLabel>
                  Organisation Settings
                </DropdownLabel>
              </DropdownItem>
            ) : (
              <DropdownItem href="/settings">
                <Cog8ToothIcon />
                <DropdownLabel>Settings</DropdownLabel>
              </DropdownItem>
            )
          }
          <DropdownDivider />
          {org?.memberOrgs?.map((org) => (
            <DropdownItem
              key={org.id}
              onClick={() => switchOrg(org.id)}
            >
              <Avatar
                slot="icon"
                src={org.logo}
                initials={!org.logo ? (org.name[0] || 'K') : undefined}
                className="text-emerald-500 bg-zinc-100 dark:bg-zinc-900"
              />
              <DropdownLabel>{org.name}</DropdownLabel>
            </DropdownItem>
          ))}
          <DropdownDivider />
          <DropdownItem href="/org/create">
            <PlusIcon />
            <DropdownLabel>
              Create new organisation
            </DropdownLabel>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <NavbarSpacer />
      <NavbarSection>
        <NavbarItem aria-label="Search" onClick={toggleSearch}>
          <MagnifyingGlassIcon />
        </NavbarItem>
        <NavbarItem href="/inbox" aria-label="Inbox">
          <InboxIcon />
        </NavbarItem>
        <Dropdown>
          <DropdownButton as={NavbarItem}>
            <Avatar
              src="/"
              initials={
                user?.data?.name
                  ? user.data.name.split(' ').map((name) => name[0]).join('')
                  : 'ME'
              }
              square
              alt=""
            />
          </DropdownButton>
          <DropdownMenu className="min-w-64" anchor="bottom end">
            <DropdownItem
              href={user?.authStatus === 'authenticated' ? '/home' : '/'}
            >
              <HomeIcon />
              <DropdownLabel>Visit Homepage</DropdownLabel>
            </DropdownItem>
            <DropdownItem href="/settings">
              <Cog8ToothIcon />
              <DropdownLabel>Account Settings</DropdownLabel>
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem href="/feedback">
              <EnvelopeIcon />
              <DropdownLabel>
                Send Feedback
              </DropdownLabel>
            </DropdownItem>
            <DropdownItem onClick={toggleTheme}>
              {resolvedTheme === 'dark' ? <LightBulbIcon /> : <MoonIcon />}
              <DropdownLabel>
                Toggle Theme
              </DropdownLabel>
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem onClick={handleSignout}>
              <ArrowRightStartOnRectangleIcon />
              <DropdownLabel>Sign out</DropdownLabel>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarSection>
    </Navbar>
  );
}