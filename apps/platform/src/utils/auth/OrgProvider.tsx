"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createClient } from "@repo/db/client";

type Org = {
  id: string;
  name: string;
  logo: string | null;
  slug: string;
  role?: string;
  user_id?: string;
};

interface OrgContext {
  activeOrg: Org | null;
  memberOrgs: Org[] | null;
  switchOrg: (orgId: Org['id']) => void;
  orgStatus: 'loading' | 'loaded' | 'error';
}

export const OrgContext = createContext<OrgContext | null>(null);

export function useOrg() {
  return useContext(OrgContext);
}

async function getOrg(): Promise<Org[]> {
  const supabase = createClient();

  const { data: orgs, error } = await supabase
    .from("organisations")
    .select("id, org_name, org_avatar, org_slug, org_members(user_id, role)");

  if (error) {
    return [];
  }

  return orgs.map((org: any) => ({
    id: org.id,
    name: org.org_name,
    logo: org.org_avatar,
    slug: org.org_slug,
    role: org.org_members[0].role,
    user_id: org.org_members[0].user_id,
  }));
}

export default function OrgProvider({
  children
}: {
  readonly children: React.ReactNode;
}): JSX.Element {
  const [activeOrg, setActiveOrg] = useState<Org | null>(null);
  const [memberOrgs, setMemberOrgs] = useState<Org[] | null>([]);
  const [orgStatus, setOrgStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  useEffect(() => {
    async function getSetOrg() {
      const memberOrgs = await getOrg();
      setMemberOrgs(memberOrgs);

      const storedOrgId = localStorage.getItem('activeOrgId');
      if (storedOrgId && memberOrgs.length > 0) {
        const storedOrg = memberOrgs.find(org => org.id === storedOrgId);
        setActiveOrg(storedOrg || memberOrgs[0] || null);
        setOrgStatus('loaded');
      } else if (memberOrgs[0] !== undefined) {
        setActiveOrg(memberOrgs[0]);
        setOrgStatus('loaded');
      }
    }

    getSetOrg();
  }, []);

  const switchOrg = (orgId: string) => {
    const selectedOrg = memberOrgs?.find(org => org.id === orgId) || null;
    setActiveOrg(selectedOrg);
    if (selectedOrg) {
      localStorage.setItem('activeOrgId', selectedOrg.id);
    }
  };

  const value = useMemo(() => ({
    activeOrg,
    memberOrgs,
    switchOrg,
    orgStatus,
  }), [
    activeOrg,
    memberOrgs,
    orgStatus,
  ]);

  return (
    <OrgContext.Provider value={value}>
      {children}
    </OrgContext.Provider>
  );
}
