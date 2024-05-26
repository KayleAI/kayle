"use client";

import { createContext, useContext, useEffect, useState } from "react";
/**import { createClient } from "@/utils/supabase/client";*/

type Org = {
  id: string;
  name: string;
  logo: string;
};

export const OrgContext = createContext<Org | null>(null);

export function useOrg() {
  return useContext(OrgContext);
}

async function getOrg() {  
  return {
    id: '1',
    name: 'Kayle LTD',
    logo: 'https://kayle.ai/favicon.ico',
  };
}

export default function OrgProvider({
  children
}: {
  readonly children: React.ReactNode;
}): JSX.Element {
  const [org, setOrg] = useState<Org | null>(null);

  useEffect(() => {
    async function getSetOrg() {
      const orgData = await getOrg();

      setOrg(orgData);
    }

    getSetOrg();
  }, [
    setOrg,
  ]);

  return (
    <OrgContext.Provider value={org}>
      {children}
    </OrgContext.Provider>
  );
}