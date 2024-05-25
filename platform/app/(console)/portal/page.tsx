export const runtime = 'edge';

import { createClient } from '@/utils/supabase/server';
import PortalClientPage from './portal';

import { redirect } from 'next/navigation';

export default async function PortalPage() {
  const supabase = createClient();

  const { data: { session }, error } = await supabase.auth.getSession();

  if (!error && session) {
    redirect("/");
  }

  return (
    <PortalClientPage />
  )
}