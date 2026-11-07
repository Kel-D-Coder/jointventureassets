"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** From the Supabase dashboard → Project Settings → API. Both are safe to have in the browser. */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseConfigured = Boolean(url && anonKey);

let client: SupabaseClient | undefined;

/** Only used for Google sign-in; the JVA server issues the real session. */
function supabase(): SupabaseClient {
  if (!url || !anonKey) throw new Error("Google sign-in isn't set up yet. Please use your email and password for now.");
  client ??= createClient(url, anonKey, {
    auth: { flowType: "pkce", detectSessionInUrl: false, persistSession: true, autoRefreshToken: false },
  });
  return client;
}

/**
 * Sends the person to Google. They come back to /auth/callback with the sign-up role and
 * category (if any) and where to go afterwards, kept in the callback address.
 */
export async function startGoogleSignIn(after: { role?: string; category?: string; next?: string }): Promise<void> {
  const callback = new URL("/auth/callback", window.location.origin);
  if (after.role) callback.searchParams.set("role", after.role);
  if (after.category) callback.searchParams.set("category", after.category);
  if (after.next) callback.searchParams.set("next", after.next);
  const { error } = await supabase().auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: callback.toString(), queryParams: { prompt: "select_account" } },
  });
  if (error) throw new Error("Couldn't open Google sign-in. Please try again.");
}

/**
 * On /auth/callback: swaps Google's one-time code for a Supabase access token, for the JVA
 * server to check. The Supabase session is then dropped; the server's own token is used instead.
 */
export async function finishGoogleSignIn(code: string): Promise<string> {
  const auth = supabase().auth;
  const { data, error } = await auth.exchangeCodeForSession(code);
  if (error || !data.session) throw new Error("Google sign-in didn't finish. Please try again.");
  const token = data.session.access_token;
  await auth.signOut({ scope: "local" });
  return token;
}
