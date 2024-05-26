"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
/**import { createClient } from "@/utils/supabase/client";*/

type Org = {
  id: string;
  name: string;
  logo: string | null;
  slug: string;
};

interface OrgContext {
  activeOrg: Org | null;
  memberOrgs: Org[] | null;
}

export const OrgContext = createContext<OrgContext | null>(null);

export function useOrg() {
  return useContext(OrgContext);
}

export function switchOrg(orgId: Org['id']) {
  // TODO: Implement org switching
  console.log('Switching org to', orgId);
}

async function getOrg(): Promise<OrgContext> {


  return {
    activeOrg: {
      id: 'a809fcbd-738f-43e1-9d4a-44afa491d648',
      name: 'Kayle LTD',
      logo: 'https://kayle.ai/favicon.ico',
      slug: 'kayle'
    },
    memberOrgs: [
      {
        id: 'a809fcbd-738f-43e1-9d4a-44afa491d648',
        name: 'Kayle LTD',
        logo: 'https://kayle.ai/favicon.ico',
        slug: 'kayle'
      }
    ],
  }
}

export default function OrgProvider({
  children
}: {
  readonly children: React.ReactNode;
}): JSX.Element {
  const [activeOrg, setActiveOrg] = useState<Org | null>(null);
  const [memberOrgs, setMemberOrgs] = useState<Org[] | null>([]);

  useEffect(() => {
    async function getSetOrg() {
      const { activeOrg, memberOrgs } = await getOrg();

      setActiveOrg(activeOrg);
      setMemberOrgs(memberOrgs);
    }

    getSetOrg();
  }, [
    setActiveOrg,
  ]);

  const value = useMemo(() => ({
    activeOrg,
    memberOrgs,
  }), [
    activeOrg,
    memberOrgs,
  ]);

  return (
    <OrgContext.Provider value={value}>
      {children}
    </OrgContext.Provider>
  );
}