// app/components/SessionActions.tsx
'use server';

import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import SessionButtons from "./SessionButtons";

export default async function SessionActions() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  return <SessionButtons session={user} />;
}
